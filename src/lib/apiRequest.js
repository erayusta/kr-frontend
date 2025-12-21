import axios from "axios";

// Use internal URL for server-side requests (Docker network)
// Use public URL for client-side requests (browser)
const getApiUrl = () => {
	if (typeof window === "undefined") {
		// Server-side
		return (
			process.env.INTERNAL_API_URL ||
			process.env.NEXT_PUBLIC_API_URL ||
			"http://localhost:8000/api/v1"
		);
	}
	// Client-side
	return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};

const apiClient = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
});

const apiRequest = async (url, method, data = {}, isAuth = false) => {
	const headers = {};

	if (isAuth) {
		const token =
			typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
	}

	try {
		const fullUrl = getApiUrl() + url;
		console.log(`[API Request] ${method.toUpperCase()} ${fullUrl}`);

		const response = await apiClient({
			method,
			url,
			baseURL: getApiUrl(),
			data,
			headers,
		});

		console.log(`[API Success] ${method.toUpperCase()} ${fullUrl}`);
		return response.data;
	} catch (error) {

		if (error.response) {
			// Log the exact URL that failed with 500
			if (error.response.status === 500) {
				console.error("[500 ERROR URL]:", getApiUrl() + url);
			}
		}
		throw error;
	}
};

export const fetchMenuItems = async () => {
	const categories = await apiRequest("/categories", "get");
	return categories;
};

export const fetchSettings = async () => {
	try {
		const response = await apiRequest("/settings", "get");
		return response.data || {};
	} catch (error) {
		console.error("[Settings Fetch Error]", error);
		return {};
	}
};

export default apiRequest;
