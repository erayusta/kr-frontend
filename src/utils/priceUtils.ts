/**
 * Format a price value to Turkish Lira format
 * @param price - The price value to format
 * @param options - Formatting options
 * @returns Formatted price string or fallback
 */
export function formatPrice(
	price: number | null | undefined,
	options: {
		fallback?: string;
		currency?: string;
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
	} = {},
): string {
	const {
		fallback = "Fiyat bilgisi yok",
		currency = "₺",
		minimumFractionDigits = 2,
		maximumFractionDigits = 2,
	} = options;

	// Return fallback if price is null, undefined, or not a valid number
	if (price === null || price === undefined || isNaN(price)) {
		return fallback;
	}

	// Format the number
	const formattedNumber = new Intl.NumberFormat("tr-TR", {
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(price);

	// Return with currency symbol
	return `${formattedNumber} ${currency}`;
}

/**
 * Parse a price string to number
 * @param priceString - The price string to parse
 * @returns Parsed number or null
 */
export function parsePrice(priceString: string | null | undefined): number | null {
	if (!priceString) return null;

	// Remove currency symbols and spaces
	const cleaned = priceString.replace(/[₺$€\s]/g, "").replace(/\./g, "").replace(",", ".");

	const parsed = parseFloat(cleaned);
	return isNaN(parsed) ? null : parsed;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage or null
 */
export function calculateDiscountPercentage(
	originalPrice: number,
	discountedPrice: number,
): number | null {
	if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
		return null;
	}

	const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
	return Math.round(discount);
}

/**
 * Format a price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(
	minPrice: number | null | undefined,
	maxPrice: number | null | undefined,
): string {
	if (!minPrice && !maxPrice) {
		return "Fiyat bilgisi yok";
	}

	if (minPrice && !maxPrice) {
		return `${formatPrice(minPrice)}+`;
	}

	if (!minPrice && maxPrice) {
		return `${formatPrice(maxPrice)}'ye kadar`;
	}

	if (minPrice === maxPrice) {
		return formatPrice(minPrice);
	}

	return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}
