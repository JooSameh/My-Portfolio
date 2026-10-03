import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name must be 100 characters or fewer'),
  email: z.string().trim().email('Invalid email address').max(150, 'Email must be 150 characters or fewer'),
  subject: z.string().trim().min(1, 'Subject cannot be empty').max(150, 'Subject must be 150 characters or fewer'),
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000, 'Message must be 2000 characters or fewer'),
  botField: z.string().optional()
})

const MAX_PAYLOAD_BYTES = 10 * 1024 // 10 KB limit
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3
const devRateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const history = devRateLimitMap.get(ip) || []
  const recent = history.filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }
  recent.push(now)
  devRateLimitMap.set(ip, recent)
  return true
}

function apiPlugin() {
  return {
    name: 'api-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/contact' && req.method === 'POST') {
          const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1'

          // 1. Rate Limiting Check
          if (!checkRateLimit(clientIp)) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 429
            res.end(JSON.stringify({ success: false, error: 'Too many requests. Please wait a moment before trying again.' }))
            return
          }

          // 2. Content-Length Header Check
          const contentLength = parseInt(req.headers['content-length'] || '0', 10)
          if (contentLength > MAX_PAYLOAD_BYTES) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 413
            res.end(JSON.stringify({ success: false, error: 'Payload too large. Maximum allowed size is 10KB.' }))
            return
          }

          let body = ''
          let isTooLarge = false

          req.on('data', (chunk: any) => {
            body += chunk
            if (body.length > MAX_PAYLOAD_BYTES) {
              isTooLarge = true
              req.destroy() // Stop reading to protect server resources
            }
          })

          req.on('end', () => {
            if (isTooLarge) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 413
              res.end(JSON.stringify({ success: false, error: 'Payload too large. Maximum allowed size is 10KB.' }))
              return
            }

            try {
              const data = JSON.parse(body || '{}')

              // 3. Strict Zod Schema Validation
              const result = ContactSchema.safeParse(data)
              if (!result.success) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 400
                res.end(JSON.stringify({
                  success: false,
                  error: 'Validation failed',
                  details: (result.error.issues || []).map(e => ({ field: e.path.join('.'), message: e.message }))
                }))
                return
              }

              // 4. Honeypot Bot Detection
              if (result.data.botField && result.data.botField.trim() !== '') {
                console.warn('[Security Honeypot] Bot submission blocked silently.')
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, message: 'Message received safely.' }))
                return
              }

              console.log('[Contact Message Received Safely]:', {
                name: result.data.name,
                email: result.data.email,
                subject: result.data.subject,
                messageLength: result.data.message.length
              })

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'Message received safely.' }))
            } catch {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON request' }))
            }
          })
          return
        }
        if (req.url === '/make-server-8807cd9f/health') {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({ status: 'ok' }))
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    apiPlugin(),
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
