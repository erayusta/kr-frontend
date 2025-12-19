import { IMAGE_BASE_URL } from "@/constants/site";

export type ImageType = "car" | "product" | "realEstate" | "default";

const FALLBACK_IMAGES: Record<ImageType, string> = {
	car: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
	realEstate:
		"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
	product: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
	default: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
};

const PATH_SEGMENTS: Record<ImageType, string> = {
	car: "/cars",
	realEstate: "/real-estates",
	product: "",
	default: "",
};

/**
 * Get the full image URL for a campaign image
 * @param image - The image path or URL
 * @param type - The type of campaign (car, product, realEstate, default)
 * @returns The full image URL with fallback
 */
export function getImageUrl(
	image: string | null | undefined,
	type: ImageType = "default",
): string {
	// Return fallback if no image
	if (!image) {
		return FALLBACK_IMAGES[type];
	}

	// Return image if it's already a full URL
	if (image.startsWith("http")) {
		return image;
	}

	// Build the image URL with base URL and path segment
	const pathSegment = PATH_SEGMENTS[type];
	return `${IMAGE_BASE_URL}${pathSegment}/${image}`;
}

/**
 * Get a fallback image URL for a specific campaign type
 * @param type - The type of campaign
 * @returns The fallback image URL
 */
export function getFallbackImage(type: ImageType = "default"): string {
	return FALLBACK_IMAGES[type];
}
