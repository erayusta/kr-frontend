import {
	CheckCircle,
	ChevronRight,
	ExternalLink,
	Store,
	TrendingDown,
	TrendingUp,
	BarChart3,
	XCircle,
	ImageOff,
	Settings,
	Check,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import PriceHistoryChart from "./PriceHistoryChart";

export default function PriceComparisonView({
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
}) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedColorIndex, setSelectedColorIndex] = useState(null);
	const [colorImageError, setColorImageError] = useState(false);

	const totalStoresCount = displayStores.length;

	// Price statistics
	const prices = displayStores
		.map((s) => Number(s.price))
		.filter((p) => Number.isFinite(p) && p > 0);
	const minPrice = prices.length > 0 ? Math.min(...prices) : null;
	const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
	const avgPrice =
		prices.length > 0
			? prices.reduce((a, b) => a + b, 0) / prices.length
			: null;

	// Color image handling
	const selectedColorImage = useMemo(() => {
		if (selectedColorIndex === null) return null;
		const color = productColors?.[selectedColorIndex];
		return color?.image || null;
	}, [selectedColorIndex, productColors]);

	// Reset color image error when color changes
	useMemo(() => {
		setColorImageError(false);
	}, [selectedColorIndex]);

	const activeImages = productImages || [];

	return (
		<div className="flex flex-col w-full gap-6">

			{/* ===== ANA KART: Float-Based Layout ===== */}
			<Card className="overflow-hidden border border-gray-200 bg-[#fffaf4]">
				<div className="p-5 lg:p-6">

					{/* SAG: Galeri Paneli (Float) */}
					<div className="lg:float-right lg:w-5/12 lg:ml-6 mb-6">
						<div className="bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 overflow-hidden">
							{/* Ana Gorsel */}
							<div className="relative aspect-square overflow-hidden">
								{selectedColorIndex !== null && selectedColorImage && !colorImageError ? (
									<>
										{/* biome-ignore lint/a11y/useAltText: dynamic product color image */}
										<img
											src={selectedColorImage}
											alt={`${productData?.title} - ${productColors[selectedColorIndex]?.name}`}
											className="w-full h-full object-contain p-4"
											loading="lazy"
											onError={() => setColorImageError(true)}
										/>
										<div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
											<div
												className="w-2.5 h-2.5 rounded-full border border-gray-300"
												style={{ backgroundColor: productColors[selectedColorIndex]?.code ? `#${productColors[selectedColorIndex].code}` : "#999" }}
											/>
											<span className="text-[11px] font-medium text-gray-700">
												{productColors[selectedColorIndex]?.name}
											</span>
										</div>
									</>
								) : activeImages.length > 0 ? (
									<>
										{/* biome-ignore lint/a11y/useAltText: dynamic product image */}
										<img
											src={activeImages[activeImageIndex]}
											alt={productData?.title || "Ürün görseli"}
											className="w-full h-full object-contain p-4"
											loading="lazy"
											onError={(e) => {
												e.target.onerror = null;
												e.target.style.display = "none";
											}}
										/>
										{activeImages.length > 1 && (
											<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
												{activeImageIndex + 1} / {activeImages.length}
											</div>
										)}
									</>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<ImageOff className="w-12 h-12" />
									</div>
								)}
							</div>

							{/* Thumbnail + Renk Secici */}
							<div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-t border-gray-200/60">
								{activeImages.length > 1 && activeImages.map((image, index) => (
									<button
										type="button"
										key={`img-${index}`}
										onClick={() => {
											setActiveImageIndex(index);
											setSelectedColorIndex(null);
										}}
										className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
											selectedColorIndex === null && activeImageIndex === index
												? "border-orange-500 shadow-md"
												: "border-gray-200 hover:border-orange-300"
										}`}
									>
										{/* biome-ignore lint/a11y/useAltText: thumbnail */}
										<img
											src={image}
											alt={`Thumbnail ${index + 1}`}
											className="w-11 h-11 object-cover bg-gray-100"
											loading="lazy"
											onError={(e) => {
												e.target.onerror = null;
												e.target.style.display = "none";
											}}
										/>
									</button>
								))}

								{activeImages.length > 1 && productColors && productColors.length > 0 && (
									<div className="flex-shrink-0 w-px h-8 bg-gray-300 mx-1" />
								)}

								{productColors && productColors.length > 0 && productColors.map((color, index) => (
									<button
										type="button"
										key={`color-${index}`}
										onClick={() => setSelectedColorIndex(selectedColorIndex === index ? null : index)}
										title={color.name}
										className={`group relative flex-shrink-0 rounded-full transition-all ${
											selectedColorIndex === index
												? "ring-2 ring-orange-500 ring-offset-2 scale-110"
												: "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
										}`}
									>
										<div
											className="w-8 h-8 rounded-full border-2 border-white shadow-md"
											style={{ backgroundColor: color.code ? `#${color.code}` : "#999" }}
										/>
										{selectedColorIndex === index && (
											<div className="absolute inset-0 flex items-center justify-center">
												<Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
											</div>
										)}
									</button>
								))}
							</div>

							{/* Urun Ozellikleri - galeri altinda */}
							{Object.entries(attributes).length > 0 && (
								<div className="px-4 pb-4 pt-1">
									<h3 className="font-semibold text-[#1C2B4A] mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wide">
										<Settings className="w-3.5 h-3.5 text-orange-500" />
										Ürün Özellikleri
									</h3>
									<div className="grid grid-cols-2 gap-1.5">
										{Object.entries(attributes).slice(0, 8).map(([key, value]) => (
											<div
												key={`attr-${key}`}
												className="flex items-center justify-between gap-1 px-2.5 py-1.5 bg-white/80 rounded-md text-[11px]"
											>
												<span className="text-gray-500 truncate">{key}</span>
												<span className="font-bold text-orange-700 whitespace-nowrap bg-orange-50 px-1.5 py-0.5 rounded">
													{value}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* SOL: Baslik + Fiyat + Magaza Listesi (Content flows around) */}
					<div>
						{/* Baslik ve Marka */}
						<div className="mb-4">
							{brandName && (
								<div className="flex items-center gap-2 mb-2">
									{brandLogo && (
										// biome-ignore lint/a11y/useAltText: brand logo
										<img
											src={brandLogo}
											alt={brandName}
											className="h-5 object-contain"
											onError={(e) => { e.target.style.display = "none"; }}
										/>
									)}
									<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{brandName}</span>
								</div>
							)}
							<h2 className="text-2xl font-bold text-[#1C2B4A]">
								{productData?.title || campaign?.title}
							</h2>
							{minPrice > 0 && (
								<div className="mt-3 inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
									{formatPrice(minPrice)} TL
									{totalStoresCount > 1 && (
										<span className="text-sm font-normal text-white/80 ml-2">
											&apos;den başlayan
										</span>
									)}
								</div>
							)}
						</div>

						{/* Magaza Sayisi */}
						{totalStoresCount > 0 && (
							<div className="mb-4">
								<Badge variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200">
									<Store className="h-3.5 w-3.5 mr-1" />
									{totalStoresCount} Mağazada Fiyat Bulundu
								</Badge>
							</div>
						)}

						{/* Fiyat Istatistikleri */}
						{prices.length > 1 && (
							<div className="grid grid-cols-3 gap-3 mb-5">
								<div className="bg-white/80 rounded-lg border border-green-100 p-3">
									<div className="flex items-center gap-1.5 mb-1">
										<TrendingDown className="h-3.5 w-3.5 text-green-600" />
										<span className="text-[11px] font-medium text-green-700">En Düşük</span>
									</div>
									<p className="text-base font-bold text-gray-900">
										{formatPrice(minPrice)} <span className="text-xs font-normal text-gray-500">TL</span>
									</p>
								</div>
								<div className="bg-white/80 rounded-lg border border-blue-100 p-3">
									<div className="flex items-center gap-1.5 mb-1">
										<BarChart3 className="h-3.5 w-3.5 text-blue-500" />
										<span className="text-[11px] font-medium text-blue-600">Ortalama</span>
									</div>
									<p className="text-base font-bold text-gray-900">
										{formatPrice(avgPrice)} <span className="text-xs font-normal text-gray-500">TL</span>
									</p>
								</div>
								<div className="bg-white/80 rounded-lg border border-red-100 p-3">
									<div className="flex items-center gap-1.5 mb-1">
										<TrendingUp className="h-3.5 w-3.5 text-red-500" />
										<span className="text-[11px] font-medium text-red-600">En Yüksek</span>
									</div>
									<p className="text-base font-bold text-gray-900">
										{formatPrice(maxPrice)} <span className="text-xs font-normal text-gray-500">TL</span>
									</p>
								</div>
							</div>
						)}

						{/* Loading / Error */}
						{apiLoading && shouldUseApi && (
							<div className="bg-white/80 rounded-lg p-4 mb-4 border border-gray-100">
								<p className="text-sm text-gray-500">Fiyatlar yükleniyor...</p>
							</div>
						)}
						{apiError && shouldUseApi && (
							<div className="bg-white/80 rounded-lg p-4 mb-4 border border-red-100">
								<p className="text-sm text-red-600">{apiError}</p>
							</div>
						)}

						{/* Magaza Listesi */}
						{displayStores.length > 0 ? (
							<div className="space-y-2.5 mb-4">
								{displayStores.map((store, idx) => {
									const isCheapest = idx === 0 && prices.length > 1;
									return (
										<div
											key={`${store.storeId || store.storeBrand}-${store.price}`}
											className={`bg-white rounded-xl overflow-hidden hover:shadow-md transition-all ${
												isCheapest
													? "border-2 border-green-400 ring-1 ring-green-100"
													: "border border-gray-100"
											}`}
										>
											{/* En Ucuz Badge */}
											{isCheapest && (
												<div className="bg-green-500 text-white text-xs font-semibold px-4 py-1 flex items-center gap-1">
													<CheckCircle className="h-3 w-3" />
													EN UCUZ FİYAT
												</div>
											)}

											<div className="p-3 flex items-center gap-3">
												{/* Magaza Logo */}
												<div className="flex-shrink-0 w-16 h-12 rounded-lg border border-gray-100 p-1.5 flex items-center justify-center bg-gray-50">
													{store.image_link ? (
														<>
															{/* biome-ignore lint/performance/noImgElement: Store logo */}
															<img
																src={store.image_link}
																alt={store.storeBrand || "Mağaza"}
																className="max-w-full max-h-full object-contain"
																onError={(e) => {
																	e.target.style.display = "none";
																	e.target.nextSibling?.classList.remove("hidden");
																}}
															/>
															<span className="text-[10px] font-bold text-gray-500 uppercase hidden">
																{store.storeBrand || "Mağaza"}
															</span>
														</>
													) : (
														<span className="text-[10px] font-bold text-gray-500 uppercase">
															{store.storeBrand || "Mağaza"}
														</span>
													)}
												</div>

												{/* Urun Bilgisi */}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 line-clamp-1">
														{capitalizeFirst(store.storeBrand)}
													</p>
													<div className="flex items-center gap-1 mt-0.5">
														{(store.in_stock ?? store.stock_availability === "in stock") ? (
															<>
																<CheckCircle className="h-3 w-3 text-green-500" />
																<span className="text-[11px] text-green-600">Stokta</span>
															</>
														) : (
															<>
																<XCircle className="h-3 w-3 text-red-500" />
																<span className="text-[11px] text-red-600">Tükendi</span>
															</>
														)}
													</div>
												</div>

												{/* Fiyat */}
												<div className="text-right flex-shrink-0">
													<p className="text-lg font-bold text-gray-900">
														{formatPrice(store.price)}{" "}
														<span className="text-xs font-medium text-gray-500">TL</span>
													</p>
												</div>

												{/* Magazaya Git */}
												<a
													href={store.link}
													target="_blank"
													rel="noopener noreferrer"
													className="flex-shrink-0 w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors shadow-sm"
													aria-label="Mağazaya Git"
												>
													<ChevronRight className="h-4 w-4" />
												</a>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="bg-white rounded-xl overflow-hidden p-8 text-center border border-gray-100 mb-4">
								<Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
								<p className="text-gray-500 text-sm mb-4">
									Bu kampanya için mağaza fiyatı bulunmamaktadır.
								</p>
								{campaign?.link && (
									<a
										href={campaign.link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors text-sm"
									>
										Kampanya Sayfasına Git
										<ExternalLink className="h-4 w-4" />
									</a>
								)}
							</div>
						)}

						{/* Kampanya Icerigi */}
						{campaign?.content && (
							<div className="mt-4">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1 h-5 bg-orange-500 rounded-full" />
									<h3 className="text-base font-semibold text-[#1C2B4A]">Kampanya İçeriği</h3>
								</div>
								<div
									className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-800"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Campaign content is sanitized on the backend
									dangerouslySetInnerHTML={{ __html: campaign.content }}
								/>
							</div>
						)}
					</div>

					{/* Clear float */}
					<div className="clear-both" />
				</div>
			</Card>

			{/* ===== FİYAT GEÇMİŞİ ===== */}
			<PriceHistoryChart
				apiPrices={apiPrices}
				formatPrice={formatPrice}
			/>
		</div>
	);
}
