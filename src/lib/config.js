// Server-side API configuration
export function getServerApiUrl() {
  // In Docker, use the internal URL
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }
  // In local development, use localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
}

// Client-side API configuration  
export function getClientApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
}