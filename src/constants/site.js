export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://kampanyaradar-static.b-cdn.net/kampanyaradar"

// Backend storage URL (local uploads - cars/colors etc.)
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
export const STORAGE_URL = apiUrl.replace("/api/v1", "/storage")