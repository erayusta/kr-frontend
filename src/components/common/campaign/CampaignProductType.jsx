import {
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Store,
	XCircle,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import CampaignLeadForm from "@/components/common/campaign/CampaignLeadForm";

const TABS = {
	PRICES: "prices",
	DESCRIPTION: "description",
	TERMS: "terms",
};

function PriceHistoryTooltip({ active, payload, label, formatPrice }) {
	if (!active || !payload || payload.length === 0) return null;

	const point = payload[0];
	const value = point?.value;
	const numericValue =
		typeof value === "number" ? value : value ? Number(value) : null;

	return (
		<div className="bg-white p-3 rounded-lg shadow-md border text-sm">
			<p className="font-medium">{label}</p>
			<p className="text-orange-600 font-semibold">
				{formatPrice(numericValue)} TL
			</p>
			<p className="text-xs text-gray-500 mt-1">Günün en düşük fiyatı</p>
		</div>
	);
}

export default function CampaignContent({ campaign }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState(TABS.PRICES);
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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

	// Get images - if color is selected and has image, use that
	const baseProductImages =
		productData?.images?.length > 0
			? productData.images
			: [productData?.image || campaign?.image].filter(Boolean);

	const productImages =
		productColors.length > 0 &&
		selectedColorIndex !== null &&
		productColors[selectedColorIndex]?.image
			? [productColors[selectedColorIndex].image, ...baseProductImages]
			: baseProductImages;

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

	// -------------------- NEW: API PRICE FETCH --------------------
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
	// -------------------------------------------------------------

	// Handlers
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

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
	};

	const prevImage = () => {
		setCurrentImageIndex(
			(prev) => (prev - 1 + productImages.length) % productImages.length,
		);
	};



	// -------------------- NEW: derive store list from API --------------------
	const apiStoresLatest = useMemo(() => {
		// apiPrices: [{date:'2025-12-25', store:'migros', price:154}, ...]
		// Her mağazanın en güncel (tarihi en yeni) fiyatını al
		const byStore = new Map();

		for (const p of apiPrices) {
			if (!p?.store || !p?.date) continue;
			const priceNum = Number(p.price);
			// price 0 ise "yok" kabul edelim (istersen kaldırabilirsin)
			if (!Number.isFinite(priceNum) || priceNum <= 0) continue;

			const prev = byStore.get(p.store);
			if (!prev) {
				byStore.set(p.store, p);
				continue;
			}
			// string date: YYYY-MM-DD => lexicographic compare çalışır
			if (p.date > prev.date) byStore.set(p.store, p);
		}

		const arr = Array.from(byStore.values()).map((p) => ({
			// mevcut UI ile uyum için alanları benzetiyoruz
			storeId: p.store,
			storeBrand: p.store,
			price: Number(p.price),
			link: campaign?.link || "#",
			image_link: null,
			stock_availability: Number(p.price) > 0 ? "in stock" : "out of stock",
			_date: p.date,
		}));

		// fiyat sıralama
		return arr.sort((a, b) => a.price - b.price);
	}, [apiPrices, campaign?.link]);

	// Önce backend stores doluysa onu göster, boşsa API'den geleni göster
	const hasLatestStores = latestStores.length > 0;
	const hasBackendStores = sortedStores.length > 0;
	const shouldUseApi = !hasLatestStores && !hasBackendStores;

	const displayStores = hasLatestStores
		? latestStores
		: hasBackendStores
			? sortedStores
			: apiStoresLatest;
	const totalStoresCount = displayStores.length;
	// ------------------------------------------------------------------------

	// -------------------- NEW: chart data from API (min price per day) --------------------
	const priceHistoryData = useMemo(() => {
		// car gibi tek seri: her günün EN DÜŞÜK (price>0) fiyatı
		const minByDate = new Map();

		for (const p of apiPrices) {
			if (!p?.date) continue;
			const priceNum = Number(p.price);
			if (!Number.isFinite(priceNum) || priceNum <= 0) continue;

			const cur = minByDate.get(p.date);
			if (cur === undefined || priceNum < cur) minByDate.set(p.date, priceNum);
		}

		const sortedDates = Array.from(minByDate.keys()).sort(); // YYYY-MM-DD => doğru sıralanır

		return sortedDates.map((d) => ({
			date: new Date(`${d}T00:00:00`).toLocaleDateString("tr-TR", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			price: minByDate.get(d),
			ts: new Date(`${d}T00:00:00`).getTime(),
		}));
	}, [apiPrices]);

	// ------------------------------------------------------------------------

	return (
		<div className="bg-[#fffaf4]">
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-5">
						{/* Price Count Header */}
						{totalStoresCount > 0 && (
							<h2 className="text-xl font-bold text-gray-900">
								{totalStoresCount} Adet Fiyat Bulundu
							</h2>
						)}

						{/* Tabs */}
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() => setActiveTab(TABS.PRICES)}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									activeTab === TABS.PRICES
										? "bg-orange-500 text-white"
										: " border border-gray-200 text-gray-700 hover:border-orange-300"
								}`}
							>
								<Store className="h-4 w-4" />
								Mağazalar
								{totalStoresCount > 0 && (
									<span
										className={`px-1.5 py-0.5 rounded text-xs ${
											activeTab === TABS.PRICES
												? "bg-orange-600"
												: "bg-gray-100"
										}`}
									>
										{totalStoresCount}
									</span>
								)}
							</button>

							<button
								type="button"
								onClick={() => setActiveTab(TABS.DESCRIPTION)}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									activeTab === TABS.DESCRIPTION
										? "bg-orange-500 text-white"
										: " border border-gray-200 text-gray-700 hover:border-orange-300"
								}`}
							>
								Ürün Özellikleri
							</button>

							<button
								type="button"
								onClick={() => setActiveTab(TABS.TERMS)}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									activeTab === TABS.TERMS
										? "bg-orange-500 text-white"
										: " border border-gray-200 text-gray-700 hover:border-orange-300"
								}`}
							>
								Kampanya İçeriği
							</button>
						</div>

						{/* Tab Content */}
						{activeTab === TABS.PRICES && displayMode === "price_comparison" && (
							<div className="space-y-3">
								{/* NEW: Loading / Error states */}
								{apiLoading && shouldUseApi && (
									<Card className="rounded-lg bg-transparent p-4 border border-gray-100">
										<p className="text-sm text-gray-500">
											Fiyatlar yükleniyor...
										</p>
									</Card>
								)}
								{apiError && shouldUseApi && (
									<Card className="rounded-lg bg-transparent p-4 border border-gray-100">
										<p className="text-sm text-red-600">{apiError}</p>
									</Card>
								)}

								{displayStores.length > 0 ? (
									displayStores.map((store) => (
										<div
											key={`${store.storeId || store.storeBrand}-${store.storeBrand}-${store.price}`}
											className=" rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
										>
											<div className="p-4 flex items-center gap-4">
												{/* Store Logo */}
												<div className="flex-shrink-0 w-20 h-14 rounded-lg border border-gray-100 p-2 flex items-center justify-center ">
													{store.image_link ? (
														// biome-ignore lint/performance/noImgElement: Legacy store images are remote and handled with onError fallback.
														<img
															src={store.image_link}
															alt={store.storeBrand || "Mağaza"}
															className="max-w-full max-h-full object-contain"
															onError={(e) => {
																e.target.style.display = "none";
																e.target.nextSibling?.classList.remove(
																	"hidden",
																);
															}}
														/>
													) : null}
													<span
														className={`text-xs font-bold text-gray-500 uppercase ${
															store.image_link ? "hidden" : ""
														}`}
													>
														{store.storeBrand || "Mağaza"}
													</span>
												</div>

												{/* Product Info */}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 line-clamp-1">
														{productData?.title || campaign?.title}
													</p>
													<p className="text-xs text-gray-500 mt-0.5">
														{capitalizeFirst(store.storeBrand)}
													</p>
												</div>

												{/* Price & Status */}
												<div className="text-right flex-shrink-0">
													<div className="flex items-center justify-end gap-1 mb-1">
														{(store.in_stock ??
														store.stock_availability === "in stock") ? (
															<>
																<CheckCircle className="h-3 w-3 text-green-500" />
																<span className="text-xs text-green-600">
																	Stokta
																</span>
															</>
														) : (
															<>
																<XCircle className="h-3 w-3 text-red-500" />
																<span className="text-xs text-red-600">
																	Tükendi
																</span>
															</>
														)}
													</div>

													<p className="text-xl font-bold text-gray-900">
														{formatPrice(store.price)}{" "}
														<span className="text-sm font-medium text-gray-500">
															TL
														</span>
													</p>

													<p className="text-xs text-gray-400">
														Ücretsiz Kargo
													</p>
												</div>

												<a
													href={store.link}
													target="_blank"
													rel="noopener noreferrer"
													className="flex-shrink-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
													aria-label="Mağazaya Git"
												>
													<ChevronRight className="h-5 w-5" />
												</a>
											</div>
										</div>
									))
								) : (
									<Card className=" rounded-lg overflow-hidden bg-transparent p-4">
										<Store className="h-10 w-10 text-gray-300 mx-auto mb-3" />
										<p className="text-gray-500 text-sm">
											Bu kampanya için mağaza fiyatı bulunmamaktadır.
										</p>
										{campaign?.link && (
											<a
												href={campaign.link}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors text-sm"
											>
												Kampanya Sayfasına Git
												<ExternalLink className="h-4 w-4" />
											</a>
										)}
									</Card>
								)}

								{/* NEW: Price History Chart from API */}
								{Array.isArray(apiPrices) && apiPrices.length > 0 && (
									<Card className="bg-transparent rounded-xl border border-gray-100">
										<CardContent className="p-4">
											<h3 className="text-sm font-semibold text-gray-900 mb-3">
												Fiyat Geçmişi
											</h3>

											{priceHistoryData.length > 0 ? (
												<div className="w-full h-48">
													<ResponsiveContainer width="100%" height="100%">
														<AreaChart data={priceHistoryData}>
															<CartesianGrid
																strokeDasharray="3 3"
																stroke="#e5e7eb"
															/>
															<XAxis
																dataKey="date"
																tick={{ fontSize: 11 }}
																tickLine={{ stroke: "#9ca3af" }}
															/>
															<YAxis
																tickFormatter={(value) =>
																	new Intl.NumberFormat("tr-TR").format(value)
																}
																tick={{ fontSize: 12 }}
																tickLine={{ stroke: "#9ca3af" }}
															/>
															<Tooltip
																content={
																	<PriceHistoryTooltip
																		formatPrice={formatPrice}
																	/>
																}
															/>
															<Area
																type="monotone"
																dataKey="price"
																stroke="#f97316"
																fill="#f97316"
																strokeWidth={2}
																fillOpacity={0.25}
															/>
														</AreaChart>
													</ResponsiveContainer>
												</div>
											) : (
												<p className="text-gray-500 text-sm">
													Grafik için geçerli fiyat bulunamadı.
												</p>
											)}
										</CardContent>
									</Card>
								)}
							</div>
						)}

						{/* Announcement Mode - Simple CTA */}
						{activeTab === TABS.PRICES && displayMode === "announcement" && (
							<Card className="rounded-xl border border-gray-100 p-8 text-center">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									{productData?.title || campaign?.title}
								</h3>
								{productData?.description && (
									<p className="text-gray-600 mb-6">{productData.description}</p>
								)}
								{campaign?.link && (
									<a
										href={campaign.link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
									>
										Detayları Gör
										<ExternalLink className="h-4 w-4" />
									</a>
								)}
							</Card>
						)}

						{/* Promotion Mode - Store links without prices */}
						{activeTab === TABS.PRICES && displayMode === "promotion" && (
							<div className="space-y-3">
								{displayStores.length > 0 ? (
									displayStores.map((store) => (
										<a
											key={`promo-${store.storeId || store.storeBrand}`}
											href={store.link || campaign?.link || "#"}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-sm hover:border-orange-200 transition-all"
										>
											<div className="flex items-center gap-3">
												{store.image_link ? (
													// biome-ignore lint/performance/noImgElement: Store logos are remote
													<img
														src={store.image_link}
														alt={store.storeBrand}
														className="w-10 h-10 object-contain"
													/>
												) : (
													<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
														<Store className="h-5 w-5 text-gray-400" />
													</div>
												)}
												<span className="font-medium text-gray-900">
													{capitalizeFirst(store.storeBrand)}
												</span>
											</div>
											<ChevronRight className="h-5 w-5 text-orange-500" />
										</a>
									))
								) : campaign?.link ? (
									<a
										href={campaign.link}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-sm hover:border-orange-200 transition-all"
									>
										<span className="font-medium text-gray-900">
											Kampanyaya Git
										</span>
										<ChevronRight className="h-5 w-5 text-orange-500" />
									</a>
								) : (
									<Card className="rounded-xl border border-gray-100 p-6 text-center">
										<p className="text-gray-500">
											Bu kampanya için mağaza bağlantısı bulunmamaktadır.
										</p>
									</Card>
								)}
							</div>
						)}

						{activeTab === TABS.DESCRIPTION && (
							<div className=" rounded-xl border border-gray-100 p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Product Image Gallery */}
									<div className="relative">
										<div className="rounded-xl overflow-hidden bg-gray-50">
											{productImages.length > 0 ? (
												<>
													{/* biome-ignore lint/performance/noImgElement: Gallery uses arbitrary remote URLs and simple sizing. */}
													<img
														src={productImages[currentImageIndex]}
														alt={productData?.title || "Ürün görseli"}
														className="w-full aspect-square object-contain"
													/>
													{productImages.length > 1 && (
														<>
															<button
																type="button"
																onClick={prevImage}
																className="absolute left-2 top-1/2 -translate-y-1/2  hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-1.5 shadow transition-colors"
																aria-label="Önceki görsel"
															>
																<ChevronLeft className="h-4 w-4" />
															</button>
															<button
																type="button"
																onClick={nextImage}
																className="absolute right-2 top-1/2 -translate-y-1/2  hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-1.5 shadow transition-colors"
																aria-label="Sonraki görsel"
															>
																<ChevronRight className="h-4 w-4" />
															</button>
															<div className="flex justify-center gap-1.5 mt-3">
																{productImages.map((image, idx) => (
																	<button
																		type="button"
																		key={`dot-${image.slice(-15)}`}
																		onClick={() => setCurrentImageIndex(idx)}
																		className={`w-2 h-2 rounded-full transition-all ${
																			idx === currentImageIndex
																				? "bg-orange-500 w-5"
																				: "bg-gray-300 hover:bg-gray-400"
																		}`}
																		aria-label={`Görsel ${idx + 1}`}
																	/>
																))}
															</div>
														</>
													)}
												</>
											) : (
												<div className="w-full aspect-square flex items-center justify-center">
													<p className="text-gray-400 text-sm">Görsel yok</p>
												</div>
											)}
										</div>
									</div>

									{/* Product Attributes */}
									<div>
										{/* Color Selector */}
										{productColors.length > 0 && (
											<div className="mb-6">
												<h3 className="text-base font-semibold text-gray-900 mb-3">
													Renk Seçenekleri
												</h3>
												<div className="flex gap-2 flex-wrap">
													{productColors.map((color, index) => (
														<button
															type="button"
															key={`color-${color.name}-${index}`}
															onClick={() => {
																setSelectedColorIndex(index);
																setCurrentImageIndex(0);
															}}
															className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
																selectedColorIndex === index
																	? "border-orange-500 bg-orange-50"
																	: "border-gray-200 bg-white hover:border-gray-300"
															}`}
														>
															<div
																className="w-5 h-5 rounded-full border border-gray-300"
																style={{
																	backgroundColor: color.code
																		? `#${color.code}`
																		: "#999",
																}}
															/>
															<span className="text-sm">{color.name}</span>
														</button>
													))}
												</div>
											</div>
										)}

										<h3 className="text-base font-semibold text-gray-900 mb-3">
											Ürün Özellikleri
										</h3>
										<div className="bg-gray-50 rounded-lg">
											{Object.entries(attributes).length > 0 ? (
												Object.entries(attributes).map(
													([key, value], index) => (
														<div
															key={`attr-${key}`}
															className={`flex justify-between py-2.5 px-3 text-sm ${
																index !== 0 ? "border-t border-gray-200" : ""
															}`}
														>
															<span className="text-gray-500">{key}</span>
															<span className="text-gray-900 font-medium">
																{value}
															</span>
														</div>
													),
												)
											) : productData?.gtin ? (
												<div className="flex justify-between py-2.5 px-3 text-sm bg-[#fffaf4]">
													<span className="text-gray-500">Ürün Kodu</span>
													<span className="text-gray-900 font-medium">
														{productData.gtin}
													</span>
												</div>
											) : (
												<p className="text-gray-400 text-center py-6 text-sm">
													Ürün özellikleri bulunmamaktadır.
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						{activeTab === TABS.TERMS && (
							<div className=" rounded-xl border border-gray-100 p-6">
								{campaign?.content ? (
									<div
										className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-800"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: Campaign content is sanitized on the backend
										dangerouslySetInnerHTML={{ __html: campaign.content }}
									/>
								) : (
									<p className="text-gray-400 text-center py-8 text-sm">
										Kampanya şartları bilgisi bulunmamaktadır.
									</p>
								)}
							</div>
						)}
					</div>

					{/* Sidebar - Contact Form */}
					<div>
						<CampaignLeadForm
							campaign={campaign}
							brandLogo={brandLogo}
							brandName={brandName}
							variant="product"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
