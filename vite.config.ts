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
      server.middlewares.use((_req: any, res: any, next: any) => {
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        next();
      });

      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/contact' || req.url?.startsWith('/api/contact?')) {
          if (req.method !== 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Allow', 'POST');
            res.statusCode = 405;
            res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Only POST requests are accepted.' }));
            return;
          }

          const contentType = req.headers['content-type'] || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 415;
            res.end(JSON.stringify({ success: false, error: 'Unsupported Media Type. Expected application/json.' }));
            return;
          }

          const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1'

          if (!checkRateLimit(clientIp)) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 429
            res.end(JSON.stringify({ success: false, error: 'Too many requests. Please wait a moment before trying again.' }))
            return
          }

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
              req.destroy()
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

              if (result.data.botField && result.data.botField.trim() !== '') {
                console.warn('[Security Honeypot] Bot submission blocked silently.')
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, message: 'Message received safely.' }))
                return
              }

              const stripCRLF = (v: string) => v.replace(/[\r\n]+/g, ' ').trim()
              const stripHTML = (v: string) => v.replace(/<[^>]*>?/gm, '').trim()
              const safePayload = {
                name: stripCRLF(stripHTML(result.data.name)),
                email: stripCRLF(result.data.email),
                subject: stripCRLF(stripHTML(result.data.subject)),
                message: stripHTML(result.data.message),
              }

              const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY
              if (web3FormsKey) {
                fetch('https://api.web3forms.com/submit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify({ access_key: web3FormsKey, ...safePayload }),
                })
                  .then(async (upstream) => {
                    const json = await upstream.json()
                    res.setHeader('Content-Type', 'application/json')
                    res.statusCode = upstream.ok && json.success ? 200 : 502
                    res.end(JSON.stringify(
                      upstream.ok && json.success
                        ? { success: true, message: 'Message received safely.' }
                        : { success: false, error: json.message || 'Upstream mail delivery failed.' }
                    ))
                  })
                  .catch(() => {
                    res.setHeader('Content-Type', 'application/json')
                    res.statusCode = 502
                    res.end(JSON.stringify({ success: false, error: 'Failed to deliver message.' }))
                  })
                return
              }

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'Message received safely (dev preview mode).' }))
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

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post' as const,
    generateBundle(_: any, bundle: Record<string, any>) {
      const htmlFile = bundle['index.html']
      if (!htmlFile || typeof htmlFile.source !== 'string') return

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          const escapedName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const cssTagRegex = new RegExp(
            `<link[^>]+href=["'][^"']*${escapedName}["'][^>]*>`,
            'i'
          )
          htmlFile.source = htmlFile.source.replace(
            cssTagRegex,
            `<style>${asset.source}</style>`
          )
          delete bundle[fileName]
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    apiPlugin(),
    react(),
    tailwindcss(),
    inlineCssPlugin(),
  ],
  build: {
    sourcemap: false,
  },
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
