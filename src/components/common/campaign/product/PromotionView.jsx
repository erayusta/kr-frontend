import { ChevronRight, Clock, ExternalLink, Store, Zap } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CampaignLeadForm from "@/components/common/campaign/CampaignLeadForm";
import ProductImageGallery from "./ProductImageGallery";
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
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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
		<div className="bg-[#fffaf4]">
			<div className="container mx-auto px-4 py-6 space-y-6">
				{/* Promotion Banner */}
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 p-6 md:p-8 text-white shadow-lg">
					{/* Background decoration */}
					<div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
					<div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

					<div className="relative z-10">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
							<Zap className="h-4 w-4" />
							ÖZEL KAMPANYA
						</div>

						<h2 className="text-2xl md:text-3xl font-bold mb-2">
							{productData?.title || campaign?.title}
						</h2>

						{productData?.description && (
							<p className="text-white/90 text-base mb-4 max-w-2xl">
								{productData.description}
							</p>
						)}

						{/* Countdown */}
						{remainingDays !== null && remainingDays >= 0 && (
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium">
								<Clock className="h-4 w-4" />
								Son{" "}
								<span className="font-bold text-lg">
									{remainingDays}
								</span>{" "}
								gün kaldı!
							</div>
						)}
						{remainingDays !== null && remainingDays < 0 && (
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 backdrop-blur-sm rounded-xl text-sm font-medium">
								<Clock className="h-4 w-4" />
								Kampanya Sona Erdi
							</div>
						)}
					</div>
				</div>

				{/* Content Grid: Product Gallery + Store Promotions */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left: Product Gallery + Attributes */}
					<div className="space-y-5">
						<div className="bg-white rounded-xl border border-gray-100 p-6">
							<ProductImageGallery
								images={productImages}
								colors={productColors}
								title={productData?.title || "Ürün görseli"}
								selectedColorIndex={selectedColorIndex}
								onColorSelect={setSelectedColorIndex}
							/>
						</div>

						{/* Attributes */}
						<div className="bg-white rounded-xl border border-gray-100 p-6">
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
													index !== 0
														? "border-t border-gray-200"
														: ""
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
									<div className="flex justify-between py-2.5 px-3 text-sm">
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

					{/* Right: Store Promotions */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-1">
							<div className="w-1 h-5 bg-orange-500 rounded-full" />
							<h3 className="text-base font-semibold text-gray-900">
								Mağaza Promosyonları
							</h3>
						</div>

						{displayStores.length > 0 ? (
							displayStores.map((store) => (
								<a
									key={`promo-${store.storeId || store.storeBrand}`}
									href={store.link || campaign?.link || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group"
								>
									<div className="flex items-center gap-4">
										{store.image_link ? (
											<div className="w-14 h-14 rounded-lg border border-gray-100 p-2 flex items-center justify-center bg-gray-50">
												{/* biome-ignore lint/performance/noImgElement: Store logos are remote */}
												<img
													src={store.image_link}
													alt={store.storeBrand}
													className="max-w-full max-h-full object-contain"
												/>
											</div>
										) : (
											<div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
												<Store className="h-6 w-6 text-orange-400" />
											</div>
										)}
										<div>
											<span className="font-semibold text-gray-900 block">
												{capitalizeFirst(store.storeBrand)}
											</span>
											{store.price > 0 && (
												<span className="text-sm text-orange-600 font-medium">
													{formatPrice(store.price)} TL
												</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2 text-orange-500 group-hover:text-orange-600">
										<span className="text-sm font-medium hidden sm:inline">
											Kampanyaya Git
										</span>
										<ChevronRight className="h-5 w-5" />
									</div>
								</a>
							))
						) : campaign?.link ? (
							<a
								href={campaign.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group"
							>
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
										<ExternalLink className="h-5 w-5 text-orange-500" />
									</div>
									<span className="font-semibold text-gray-900">
										Kampanyaya Git
									</span>
								</div>
								<ChevronRight className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
							</a>
						) : (
							<Card className="rounded-xl border border-gray-100 p-6 text-center bg-white">
								<Store className="h-10 w-10 text-gray-300 mx-auto mb-3" />
								<p className="text-gray-500 text-sm">
									Bu kampanya için mağaza bağlantısı bulunmamaktadır.
								</p>
							</Card>
						)}

						{/* Lead Form in sidebar */}
						<CampaignLeadForm
							campaign={campaign}
							brandLogo={brandLogo}
							brandName={brandName}
							variant="product"
						/>
					</div>
				</div>

				{/* Campaign Details (HTML content) */}
				{campaign?.content && (
					<div className="bg-white rounded-xl border border-gray-100 p-6">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-1 h-5 bg-orange-500 rounded-full" />
							<h3 className="text-base font-semibold text-gray-900">
								Kampanya Detayları
							</h3>
						</div>
						<div
							className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-800"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Campaign content is sanitized on the backend
							dangerouslySetInnerHTML={{
								__html: campaign.content,
							}}
						/>
					</div>
				)}

				{/* Price History Chart (optional for promotion) */}
				{apiPrices?.length > 0 && (
					<PriceHistoryChart
						apiPrices={apiPrices}
						formatPrice={formatPrice}
					/>
				)}
			</div>
		</div>
	);
}
