// D. Trusted Edge Client IP Identification & Rate Limiting
  const clientIp =
    c.req.header('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
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

  // E. Read & Validate Raw UTF-8 Byte Size
  let rawBodyText = ''
  try {
    rawBodyText = await c.req.text()
  } catch {
    return c.json({ success: false, error: 'Failed to read request body.' }, 400)
  }

  const bodyByteSize = new TextEncoder().encode(rawBodyText).length
  if (bodyByteSize > MAX_PAYLOAD_BYTES) {
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

  // J. Server-Side Web3Forms Forwarding via Environment Variable
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
      console.error('[Contact API] Upstream failure:', upstreamData.message)
      return c.json(
        { success: false, error: 'Upstream mail delivery failed.' },
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
