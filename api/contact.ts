import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'

export const config = {
  runtime: 'edge',
}

// 1. Zod Validation Schema
export const ContactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be 100 characters or fewer'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .max(150, 'Email must be 150 characters or fewer'),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject cannot be empty')
    .max(150, 'Subject must be 150 characters or fewer'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be 2000 characters or fewer'),
  botField: z.string().optional(),
})

// 2. Constants for Security
const MAX_PAYLOAD_BYTES = 10 * 1024 // 10 KB limit
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 3 // Max 3 messages per minute per IP

// 3. Sliding Window In-Memory Rate Limiter
const ipRequestHistory = new Map<string, number[]>()

export function isRateLimited(clientIp: string): boolean {
  const now = Date.now()
  const history = ipRequestHistory.get(clientIp) || []
  const recentRequests = history.filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  recentRequests.push(now)
  ipRequestHistory.set(clientIp, recentRequests)

  // Periodic cleanup if map grows large
  if (ipRequestHistory.size > 2000) {
    for (const [ip, timestamps] of ipRequestHistory.entries()) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestHistory.delete(ip)
      }
    }
  }

  return false
}

// 4. Hono App Configuration
const app = new Hono()

// Handler for contact submission
const handleContact = async (c: any) => {
  // A. Check Content-Length for Payload Size Limit
  const contentLength = c.req.header('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return c.json(
      { success: false, error: 'Payload too large. Maximum allowed size is 10KB.' },
      413
    )
  }

  // B. Client IP Identification & Rate Limiting
  const clientIp =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    c.req.header('cf-connecting-ip') ||
    '127.0.0.1'

  if (isRateLimited(clientIp)) {
    return c.json(
      {
        success: false,
        error: 'Too many requests. Please wait a moment before sending another message.',
      },
      429
    )
  }

  // C. Read & Validate Raw Body Size
  let rawBodyText = ''
  try {
    rawBodyText = await c.req.text()
  } catch {
    return c.json({ success: false, error: 'Failed to read request body.' }, 400)
  }

  if (rawBodyText.length > MAX_PAYLOAD_BYTES) {
    return c.json(
      { success: false, error: 'Payload too large. Maximum allowed size is 10KB.' },
      413
    )
  }

  // D. Parse JSON Body
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(rawBodyText || '{}')
  } catch {
    return c.json({ success: false, error: 'Malformed JSON payload.' }, 400)
  }

  // E. Strict Zod Schema Validation
  const validationResult = ContactSchema.safeParse(parsedJson)
  if (!validationResult.success) {
    const errorDetails = (validationResult.error.issues || []).map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return c.json(
      {
        success: false,
        error: 'Validation failed.',
        details: errorDetails,
      },
      400
    )
  }

  const { name, email, subject, message, botField } = validationResult.data

  // F. Honeypot Bot Detection
  if (botField && botField.trim().length > 0) {
    console.warn(`[Security Alert] Bot submission trapped by honeypot from IP: ${clientIp}`)
    // Silently return success so the bot is unaware it was dropped
    return c.json({
      success: true,
      message: 'Message received safely.',
    })
  }

  // G. Successful Processing Log
  console.log('[Contact Submission Processed Safely]:', {
    name,
    email,
    subject,
    messageLength: message.length,
    senderIp: clientIp,
    timestamp: new Date().toISOString(),
  })

  return c.json({
    success: true,
    message: 'Message received safely.',
  })
}

// Support POST on all routing variations Vercel might pass
app.post('/', handleContact)
app.post('/api/contact', handleContact)
app.post('/contact', handleContact)

export default handle(app)
