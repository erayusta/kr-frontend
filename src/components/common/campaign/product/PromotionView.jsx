import {
	ChevronRight,
	Clock,
	ExternalLink,
	Store,
	Zap,
	ImageOff,
	Settings,
	Check,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import PriceHistoryChart from "./PriceHistoryChart";

export default function PromotionView({
	campaign,
	productData,
	displayStores,
	apiPrices,
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

	// Calculate remaining days
	const endDate = campaign?.end_date || campaign?.endDate;
	const remainingDays = (() => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diff = Math.ceil(
			(end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);
		return diff;
	})();

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

					{/* SOL: Promosyon Icerigi (Content flows around) */}
					<div>
						{/* Promosyon Badge + Geri Sayim */}
						<div className="flex flex-wrap items-center gap-2 mb-3">
							<Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1 text-xs font-semibold">
								<Zap className="h-3 w-3 mr-1" />
								ÖZEL KAMPANYA
							</Badge>

							{remainingDays !== null && remainingDays >= 0 && (
								<Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
									<Clock className="h-3 w-3 mr-1" />
									Son {remainingDays} gün
								</Badge>
							)}
							{remainingDays !== null && remainingDays < 0 && (
								<Badge variant="secondary" className="bg-red-50 text-red-700 border border-red-200">
									<Clock className="h-3 w-3 mr-1" />
									Kampanya Sona Erdi
								</Badge>
							)}
						</div>

						{/* Marka */}
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

						{/* Baslik */}
						<h2 className="text-2xl font-bold text-[#1C2B4A] mb-2">
							{productData?.title || campaign?.title}
						</h2>

						{/* Urun Aciklamasi */}
						{productData?.description && (
							<p className="text-gray-600 text-base leading-relaxed mb-4">
								{productData.description}
							</p>
						)}

						{/* En dusuk fiyat */}
						{displayStores.length > 0 && displayStores[0]?.price > 0 && (
							<div className="mb-5 inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
								{formatPrice(displayStores[0].price)} TL
								{displayStores.length > 1 && (
									<span className="text-sm font-normal text-white/80 ml-2">
										&apos;den başlayan
									</span>
								)}
							</div>
						)}

						{/* Magaza Promosyonlari */}
						{displayStores.length > 0 && (
							<div className="mb-4">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1 h-5 bg-orange-500 rounded-full" />
									<h3 className="text-base font-semibold text-[#1C2B4A]">Mağaza Promosyonları</h3>
								</div>
								<div className="space-y-2">
									{displayStores.map((store) => (
										<a
											key={`promo-${store.storeId || store.storeBrand}`}
											href={store.link || campaign?.link || "#"}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group"
										>
											<div className="flex items-center gap-3">
												{store.image_link ? (
													<div className="w-12 h-12 rounded-lg border border-gray-100 p-1.5 flex items-center justify-center bg-gray-50">
														{/* biome-ignore lint/performance/noImgElement: Store logos are remote */}
														<img
															src={store.image_link}
															alt={store.storeBrand}
															className="max-w-full max-h-full object-contain"
														/>
													</div>
												) : (
													<div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
														<Store className="h-5 w-5 text-orange-400" />
													</div>
												)}
												<div>
													<span className="font-semibold text-gray-900 block text-sm">
														{capitalizeFirst(store.storeBrand)}
													</span>
													{store.price > 0 && (
														<span className="text-sm text-orange-600 font-medium">
															{formatPrice(store.price)} TL
														</span>
													)}
												</div>
											</div>
											<div className="flex items-center gap-1.5 text-orange-500 group-hover:text-orange-600">
												<span className="text-xs font-medium hidden sm:inline">
													Kampanyaya Git
												</span>
												<ChevronRight className="h-4 w-4" />
											</div>
										</a>
									))}
								</div>
							</div>
						)}

						{/* CTA - magaza yoksa */}
						{displayStores.length === 0 && campaign?.link && (
							<a
								href={campaign.link}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-md mb-5"
							>
								Kampanyaya Git
								<ExternalLink className="h-4 w-4" />
							</a>
						)}

						{/* Kampanya Icerigi */}
						{campaign?.content && (
							<div className="mt-4">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-1 h-5 bg-orange-500 rounded-full" />
									<h3 className="text-base font-semibold text-[#1C2B4A]">Kampanya Detayları</h3>
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
			{apiPrices?.length > 0 && (
				<PriceHistoryChart
					apiPrices={apiPrices}
					formatPrice={formatPrice}
				/>
			)}
		</div>
	);
}
