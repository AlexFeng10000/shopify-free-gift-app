// Debug endpoint to see what's happening with routing
export default function handler(req, res) {
  console.log('🔍 Debug endpoint called');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  console.log('Headers:', req.headers);
  
  return res.status(200).json({
    url: req.url,
    method: req.method,
    query: req.query,
    timestamp: new Date().toISOString()
  });
}