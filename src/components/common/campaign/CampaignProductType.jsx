import { useEffect, useMemo, useState } from "react";
import PriceComparisonView from "./product/PriceComparisonView";
import AnnouncementView from "./product/AnnouncementView";
import PromotionView from "./product/PromotionView";

export default function CampaignContent({ campaign }) {
	// Computed values
	const productData = campaign?.product || campaign?.item || {};
	const displayMode = productData?.display_mode || "price_comparison";
	const productColors = productData?.colors || [];
	const stores = productData?.stores || [];
	const latestPrices = Array.isArray(productData?.latest_prices)
		? productData.latest_prices
		: Array.isArray(productData?.latestPrices)
			? productData.latestPrices
			: [];
	const attributes = productData?.attributes || {};
	const brandLogo = campaign?.brands?.[0]?.logo;
	const brandName = campaign?.brands?.[0]?.name;

	// Get images
	const productImages =
		productData?.images?.length > 0
			? productData.images
			: [productData?.image || campaign?.image].filter(Boolean);

	// Sort stores by price (backend stores)
	const sortedStores = [...stores]
		.filter((s) => s.price)
		.sort((a, b) => a.price - b.price);

	const latestStores = useMemo(() => {
		if (!Array.isArray(latestPrices) || latestPrices.length === 0) return [];

		const storeByBrand = new Map(
			(stores || []).filter((s) => s?.storeBrand).map((s) => [s.storeBrand, s]),
		);

		const arr = latestPrices
			.filter((p) => p?.store)
			.map((p) => {
				const matchedStore = storeByBrand.get(p.store);
				const priceNum = Number(p.price);

				return {
					...(matchedStore || {}),
					storeId: matchedStore?.storeId || p.store,
					storeBrand: p.store,
					price: Number.isFinite(priceNum) ? priceNum : null,
					link: matchedStore?.link || campaign?.link || "#",
					image_link: matchedStore?.image_link || null,
					stock_availability:
						matchedStore?.stock_availability ||
						(priceNum > 0 ? "in stock" : "out of stock"),
					in_stock:
						typeof matchedStore?.in_stock === "boolean"
							? matchedStore.in_stock
							: priceNum > 0,
				};
			})
			.filter((s) => Number(s.price) > 0)
			.sort((a, b) => a.price - b.price);

		return arr;
	}, [latestPrices, stores, campaign?.link]);

	// API PRICE FETCH
	const gtin = productData?.gtin;

	const [apiPrices, setApiPrices] = useState([]);
	const [apiLoading, setApiLoading] = useState(false);
	const [apiError, setApiError] = useState("");

	useEffect(() => {
		if (!gtin) {
			setApiPrices([]);
			setApiError("");
			return;
		}

		const controller = new AbortController();

		(async () => {
			try {
				setApiLoading(true);
				setApiError("");

				const res = await fetch(
					`https://kr.erusoft.com/api/v1/products/${gtin}/prices`,
					{
						method: "GET",
						signal: controller.signal,
						headers: { Accept: "application/json" },
					},
				);

				if (!res.ok) {
					throw new Error(`Prices API error: ${res.status}`);
				}

				const data = await res.json();
				setApiPrices(Array.isArray(data?.prices) ? data.prices : []);
			} catch (err) {
				if (err?.name === "AbortError") return;
				console.error("Prices API fetch failed:", err);
				setApiError("Fiyat verisi çekilemedi.");
				setApiPrices([]);
			} finally {
				setApiLoading(false);
			}
		})();

		return () => controller.abort();
	}, [gtin]);

	// Helpers
	const formatPrice = (price) => {
		if (price === null || price === undefined) return "";
		return new Intl.NumberFormat("tr-TR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const capitalizeFirst = (str) => {
		if (!str) return "";
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	// Derive store list from API
	const apiStoresLatest = useMemo(() => {
		const byStore = new Map();

		for (const p of apiPrices) {
			if (!p?.store || !p?.date) continue;
			const priceNum = Number(p.price);
			if (!Number.isFinite(priceNum) || priceNum <= 0) continue;

			const prev = byStore.get(p.store);
			if (!prev) {
				byStore.set(p.store, p);
				continue;
			}
			if (p.date > prev.date) byStore.set(p.store, p);
		}

		const arr = Array.from(byStore.values()).map((p) => ({
			storeId: p.store,
			storeBrand: p.store,
			price: Number(p.price),
			link: campaign?.link || "#",
			image_link: null,
			stock_availability: Number(p.price) > 0 ? "in stock" : "out of stock",
			_date: p.date,
		}));

		return arr.sort((a, b) => a.price - b.price);
	}, [apiPrices, campaign?.link]);

	// Store priority: backend latestStores > sortedStores > API stores
	const hasLatestStores = latestStores.length > 0;
	const hasBackendStores = sortedStores.length > 0;
	const shouldUseApi = !hasLatestStores && !hasBackendStores;

	const displayStores = hasLatestStores
		? latestStores
		: hasBackendStores
			? sortedStores
			: apiStoresLatest;

	// Shared props for all views
	const sharedProps = {
		campaign,
		productData,
		displayStores,
		apiPrices,
		apiLoading,
		apiError,
		shouldUseApi,
		productImages,
		productColors,
		attributes,
		formatPrice,
		capitalizeFirst,
		brandLogo,
		brandName,
	};

	// Dispatch to the appropriate view based on display_mode
	switch (displayMode) {
		case "announcement":
			return <AnnouncementView {...sharedProps} />;
		case "promotion":
			return <PromotionView {...sharedProps} />;
		case "price_comparison":
		default:
			return <PriceComparisonView {...sharedProps} />;
	}
}
