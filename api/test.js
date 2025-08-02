// Simple test endpoint
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    message: 'Test endpoint working!',
    method: req.method,
    query: req.query,
    timestamp: new Date().toISOString(),
    success: true
  });
}