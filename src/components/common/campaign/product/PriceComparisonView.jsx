import {
	CheckCircle,
	ChevronRight,
	ExternalLink,
	Store,
	TrendingDown,
	TrendingUp,
	BarChart3,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import CampaignLeadForm from "@/components/common/campaign/CampaignLeadForm";
import ProductImageGallery from "./ProductImageGallery";
import PriceHistoryChart from "./PriceHistoryChart";

const TABS = {
	STORES: "stores",
	FEATURES: "features",
	CONTENT: "content",
};

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
	const [activeTab, setActiveTab] = useState(TABS.STORES);
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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

	const tabs = [
		{
			id: TABS.STORES,
			label: "Mağazalar",
			icon: <Store className="h-4 w-4" />,
			count: totalStoresCount,
		},
		{
			id: TABS.FEATURES,
			label: "Ürün Özellikleri",
			icon: null,
			count: null,
		},
		{
			id: TABS.CONTENT,
			label: "Kampanya İçeriği",
			icon: null,
			count: null,
		},
	];

	return (
		<div className="bg-[#fffaf4]">
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-5">
						{/* Header with store count */}
						{totalStoresCount > 0 && (
							<h2 className="text-xl font-bold text-gray-900">
								{totalStoresCount} Adet Fiyat Bulundu
							</h2>
						)}

						{/* Tabs */}
						<div className="flex flex-wrap items-center gap-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
										activeTab === tab.id
											? "bg-orange-500 text-white"
											: "border border-gray-200 text-gray-700 hover:border-orange-300"
									}`}
								>
									{tab.icon}
									{tab.label}
									{tab.count > 0 && (
										<span
											className={`px-1.5 py-0.5 rounded text-xs ${
												activeTab === tab.id
													? "bg-orange-600"
													: "bg-gray-100"
											}`}
										>
											{tab.count}
										</span>
									)}
								</button>
							))}
						</div>

						{/* Tab: Stores */}
						{activeTab === TABS.STORES && (
							<div className="space-y-4">
								{/* Price Statistics Cards */}
								{prices.length > 0 && (
									<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
										<div className="bg-white rounded-xl border border-green-100 p-4">
											<div className="flex items-center gap-2 mb-1">
												<TrendingDown className="h-4 w-4 text-green-600" />
												<span className="text-xs font-medium text-green-700">
													En Düşük
												</span>
											</div>
											<p className="text-xl font-bold text-gray-900">
												{formatPrice(minPrice)}{" "}
												<span className="text-sm font-normal text-gray-500">
													TL
												</span>
											</p>
										</div>
										<div className="bg-white rounded-xl border border-red-100 p-4">
											<div className="flex items-center gap-2 mb-1">
												<TrendingUp className="h-4 w-4 text-red-500" />
												<span className="text-xs font-medium text-red-600">
													En Yüksek
												</span>
											</div>
											<p className="text-xl font-bold text-gray-900">
												{formatPrice(maxPrice)}{" "}
												<span className="text-sm font-normal text-gray-500">
													TL
												</span>
											</p>
										</div>
										<div className="bg-white rounded-xl border border-blue-100 p-4">
											<div className="flex items-center gap-2 mb-1">
												<BarChart3 className="h-4 w-4 text-blue-500" />
												<span className="text-xs font-medium text-blue-600">
													Ortalama
												</span>
											</div>
											<p className="text-xl font-bold text-gray-900">
												{formatPrice(avgPrice)}{" "}
												<span className="text-sm font-normal text-gray-500">
													TL
												</span>
											</p>
										</div>
										<div className="bg-white rounded-xl border border-purple-100 p-4">
											<div className="flex items-center gap-2 mb-1">
												<Store className="h-4 w-4 text-purple-500" />
												<span className="text-xs font-medium text-purple-600">
													Mağaza Sayısı
												</span>
											</div>
											<p className="text-xl font-bold text-gray-900">
												{totalStoresCount}
											</p>
										</div>
									</div>
								)}

								{/* Loading / Error */}
								{apiLoading && shouldUseApi && (
									<Card className="rounded-xl bg-white p-4 border border-gray-100">
										<p className="text-sm text-gray-500">
											Fiyatlar yükleniyor...
										</p>
									</Card>
								)}
								{apiError && shouldUseApi && (
									<Card className="rounded-xl bg-white p-4 border border-gray-100">
										<p className="text-sm text-red-600">{apiError}</p>
									</Card>
								)}

								{/* Store List */}
								{displayStores.length > 0 ? (
									displayStores.map((store, idx) => {
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
												{/* Cheapest Badge */}
												{isCheapest && (
													<div className="bg-green-500 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-1">
														<CheckCircle className="h-3.5 w-3.5" />
														EN UCUZ FİYAT
													</div>
												)}

												<div className="p-4 flex items-center gap-4">
													{/* Store Logo */}
													<div className="flex-shrink-0 w-20 h-14 rounded-lg border border-gray-100 p-2 flex items-center justify-center bg-gray-50">
														{store.image_link ? (
															// biome-ignore lint/performance/noImgElement: Legacy store images
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
																store.stock_availability ===
																	"in stock") ? (
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
														className="flex-shrink-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors shadow-sm"
														aria-label="Mağazaya Git"
													>
														<ChevronRight className="h-5 w-5" />
													</a>
												</div>
											</div>
										);
									})
								) : (
									<Card className="rounded-xl overflow-hidden bg-white p-8 text-center">
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
									</Card>
								)}

								{/* Price History Chart */}
								<PriceHistoryChart
									apiPrices={apiPrices}
									formatPrice={formatPrice}
								/>
							</div>
						)}

						{/* Tab: Features */}
						{activeTab === TABS.FEATURES && (
							<div className="bg-white rounded-xl border border-gray-100 p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Product Image Gallery */}
									<ProductImageGallery
										images={productImages}
										colors={productColors}
										title={productData?.title || "Ürün görseli"}
										selectedColorIndex={selectedColorIndex}
										onColorSelect={setSelectedColorIndex}
									/>

									{/* Product Attributes */}
									<div>
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
															<span className="text-gray-500">
																{key}
															</span>
															<span className="text-gray-900 font-medium">
																{value}
															</span>
														</div>
													),
												)
											) : productData?.gtin ? (
												<div className="flex justify-between py-2.5 px-3 text-sm">
													<span className="text-gray-500">
														Ürün Kodu
													</span>
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

						{/* Tab: Campaign Content */}
						{activeTab === TABS.CONTENT && (
							<div className="bg-white rounded-xl border border-gray-100 p-6">
								{campaign?.content ? (
									<div
										className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-800"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: Campaign content is sanitized on the backend
										dangerouslySetInnerHTML={{
											__html: campaign.content,
										}}
									/>
								) : (
									<p className="text-gray-400 text-center py-8 text-sm">
										Kampanya şartları bilgisi bulunmamaktadır.
									</p>
								)}
							</div>
						)}
					</div>

					{/* Sidebar */}
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
