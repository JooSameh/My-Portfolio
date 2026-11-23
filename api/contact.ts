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

// 3. Sanitizers (HTML Tag Stripping & CRLF Email Header Injection Prevention)
const stripCRLF = (val: string) => val.replace(/[\r\n]+/g, ' ').trim()
const stripHTML = (val: string) => val.replace(/<[^>]*>?/gm, '').trim()

// 4. Strict Origin / Referer Allowlist (blocks cross-origin & wildcard subdomain API abuse)
const ALLOWED_ORIGINS = new Set([
  'https://youssef-elgendy.vercel.app',
  'http://localhost:3000',
])

function isOriginAllowed(origin: string | undefined, referer: string | undefined): boolean {
  const isExactOriginAllowed = (rawUrl: string | undefined): boolean => {
    if (!rawUrl) return false
    try {
      const parsed = new URL(rawUrl)
      return ALLOWED_ORIGINS.has(parsed.origin)
    } catch {
      return false
    }
  }

  return isExactOriginAllowed(origin) || isExactOriginAllowed(referer)
}

// 5. Rate Limiter (Persistent Upstash Redis REST API when configured, with In-Memory Sliding Window fallback)
const ipRequestHistory = new Map<string, number[]>()

export async function isRateLimited(clientIp: string): Promise<boolean> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    try {
      const key = `rl:contact:${clientIp}`
      const incrRes = await fetch(`${upstashUrl}/incr/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstashToken}` },
      })
      if (incrRes.ok) {
        const { result: count } = (await incrRes.json()) as { result: number }
        if (count === 1) {
          await fetch(`${upstashUrl}/expire/${encodeURIComponent(key)}/60`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${upstashToken}` },
          })
        }
        return count > MAX_REQUESTS_PER_WINDOW
      }
    } catch {
      // Fallback safely to in-memory limiter if Upstash is temporarily unreachable
    }
  }

  const now = Date.now()
  const history = ipRequestHistory.get(clientIp) || []
  const recentRequests = history.filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  recentRequests.push(now)
  ipRequestHistory.set(clientIp, recentRequests)

  if (ipRequestHistory.size > 2000) {
    for (const [ip, timestamps] of ipRequestHistory.entries()) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestHistory.delete(ip)
      }
    }
  }

  return false
}

// 6. Hono App Configuration
const app = new Hono()

app.use('*', async (c: any, next: any) => {
  await next()
  c.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-XSS-Protection', '0')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), display-capture=()')
})

// Handler for contact submission
const handleContact = async (c: any) => {
  // A. Strict Origin / Referer Validation (blocks cross-origin API abuse)
  const origin = c.req.header('origin')
  const referer = c.req.header('referer')
  if (!isOriginAllowed(origin, referer)) {
    return c.json({ success: false, error: 'Forbidden origin.' }, 403)
  }

  // B. Strict Content-Type Enforcement (Anti-CSRF simple request protection)
  const contentType = c.req.header('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return c.json(
      { success: false, error: 'Unsupported Media Type. Expected application/json.' },
      415
    )
  }

  // C. Check Content-Length for Payload Size Limit
  const contentLength = c.req.header('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return c.json(
      { success: false, error: 'Payload too large. Maximum allowed size is 10KB.' },
      413
    )
  }

  // D. Trusted Edge Client IP Identification & Rate Limiting
  const clientIp =
    c.req.header('x-real-ip') ||
    c.req.header('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('cf-connecting-ip') ||
    '127.0.0.1'

  if (await isRateLimited(clientIp)) {
    return c.json(
      {
        success: false,
        error: 'Too many requests. Please wait a moment before sending another message.',
      },
      429
    )
  }

  // E. Read & Validate Raw Body Size
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

  // F. Parse JSON Body
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(rawBodyText || '{}')
  } catch {
    return c.json({ success: false, error: 'Malformed JSON payload.' }, 400)
  }

  // G. Strict Zod Schema Validation
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

  // H. Honeypot Bot Detection
  if (botField && botField.trim().length > 0) {
    console.warn(`[Security Alert] Bot submission trapped by honeypot from IP: ${clientIp}`)
    return c.json({
      success: true,
      message: 'Message received safely.',
    })
  }

  // I. HTML & CRLF Injection Sanitization
  const safeName = stripCRLF(stripHTML(name))
  const safeEmail = stripCRLF(email)
  const safeSubject = stripCRLF(stripHTML(subject))
  const safeMessage = stripHTML(message)

  // J. Server-Side Web3Forms Forwarding via Environment Variable (never hardcoded or exposed to client)
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY
  if (!web3FormsKey) {
    return c.json(
      {
        success: false,
        error: 'Mail service is not configured on the server. Please contact via LinkedIn or Gmail.',
      },
      503
    )
  }

  try {
    const upstreamRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: web3FormsKey,
        name: safeName,
        email: safeEmail,
        subject: safeSubject,
        message: safeMessage,
      }),
    })

    const upstreamData = (await upstreamRes.json()) as { success?: boolean; message?: string }
    if (!upstreamRes.ok || !upstreamData.success) {
      return c.json(
        { success: false, error: upstreamData.message || 'Upstream mail delivery failed.' },
        502
      )
    }

    return c.json({
      success: true,
      message: 'Message received safely.',
    })
  } catch {
    return c.json({ success: false, error: 'Failed to deliver message.' }, 502)
  }
}

// Support POST on all routing variations Vercel might pass
app.post('/', handleContact)
app.post('/api/contact', handleContact)
app.post('/contact', handleContact)

// Catch-all for invalid HTTP methods (Method Not Allowed)
app.all('*', (c: any) => {
  if (c.req.method !== 'POST') {
    c.header('Allow', 'POST')
    return c.json({ success: false, error: 'Method Not Allowed. Only POST requests are accepted.' }, 405)
  }
  return c.json({ success: false, error: 'Endpoint not found' }, 404)
})

export default handle(app)
