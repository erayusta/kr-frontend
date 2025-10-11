export default function handler(req, res) {
  res.status(200).json({
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    serverTime: new Date().toISOString()
  });
}