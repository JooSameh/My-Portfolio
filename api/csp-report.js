export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let report = req.body;
    if (typeof report === 'string') {
      report = JSON.parse(report);
    }
    console.warn('CSP Violation:', JSON.stringify(report));
  } catch {
    console.warn('CSP Violation: [Invalid JSON payload]');
  }

  return res.status(204).end();
}
