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

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    apply: 'build' as const,
    enforce: 'post' as const,
    transformIndexHtml: {
      order: 'post' as const,
      handler(html: string, ctx: any) {
        if (!ctx?.bundle) return html
        let result = html
        for (const [fileName, chunk] of Object.entries<any>(ctx.bundle)) {
          if (fileName.endsWith('.css') && chunk.type === 'asset') {
            const cssText =
              typeof chunk.source === 'string'
                ? chunk.source
                : new TextDecoder().decode(chunk.source)
            const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const linkRegex = new RegExp(
              `<link\\b[^>]*rel=["']stylesheet["'][^>]*href=["']\\/?${escaped}["'][^>]*>|<link\\b[^>]*href=["']\\/?${escaped}["'][^>]*rel=["']stylesheet["'][^>]*>`,
              'gi'
            )
            const safeCss = cssText.replace(/<\/style/gi, '<\\/style')
            const updated = result.replace(linkRegex, () => `<style>${safeCss}</style>`)
            if (updated !== result) {
              result = updated
              delete ctx.bundle[fileName]
            }
          }
        }
        return result
      },
    },
  }
}

function apiPlugin() {
  return {
    name: 'api-middleware',
    configureServer(server: any) {
      // 0. Global Security Headers (Anti-Clickjacking, MIME-Sniffing, XSS & Permissions)
      server.middlewares.use((_req: any, res: any, next: any) => {
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        next();
      });

      server.middlewares.use((req: any, res: any, next: any) => {
        // Explicit route match for /api/contact
        if (req.url === '/api/contact' || req.url?.startsWith('/api/contact?')) {
          // A. Method Enforcement (Broken Access Control & Method Spoofing)
          if (req.method !== 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Allow', 'POST');
            res.statusCode = 405;
            res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Only POST requests are accepted.' }));
            return;
          }

          // B. Content-Type Enforcement (Anti-CSRF & Simple Request Bypass Prevention)
          const contentType = req.headers['content-type'] || '';
          if (!contentType.toLowerCase().includes('application/json')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 415;
            res.end(JSON.stringify({ success: false, error: 'Unsupported Media Type. Expected application/json.' }));
            return;
          }

          const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1'

          // 1. Rate Limiting Check (Anti-DoS)
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
                  details: (result.error.issues || []).map(e => ({ field: e.path.join
