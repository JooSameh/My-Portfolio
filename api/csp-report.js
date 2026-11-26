export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const contentType = req.headers['content-type'] || '';
  const isValidType =
    contentType.includes('application/csp-report') ||
    contentType.includes('application/reports+json') ||
    contentType.includes('application/json');

  if (!isValidType) {
    return res.status(415).end();
  }

  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    if (raw.length > 5120) {
      return res.status(413).end();
    }

    const report = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.warn('CSP Violation:', JSON.stringify(report));
  } catch {
    console.warn('CSP Violation: [Invalid JSON payload]');
  }

  return res.status(204).end();
}
