import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const TABS = {
	DESCRIPTION: "description",
	TERMS: "terms",
};

export default function CampaignContent({ campaign }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState(TABS.DESCRIPTION);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		consent: false,
	});

	const { toast } = useToast();

	// Computed values
	const productData = campaign?.product || campaign?.item || {};
	const stores = productData?.stores || [];
	const attributes = productData?.attributes || {};
	const brandLogo = campaign?.brands?.[0]?.logo;
	const brandName = campaign?.brands?.[0]?.name;

	const productImages =
		productData?.images?.length > 0
			? productData.images
			: [productData?.image || campaign?.image].filter(Boolean);

	const lowestPrice =
		stores.length > 0
			? Math.min(
					...stores.filter((s) => s.price).map((s) => parseFloat(s.price)),
				)
			: null;

	// Handlers
	const formatPrice = (price) => {
		if (!price) return "";
		return new Intl.NumberFormat("tr-TR", {
			style: "currency",
			currency: "TRY",
			minimumFractionDigits: 2,
		}).format(price);
	};

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
	};

	const prevImage = () => {
		setCurrentImageIndex(
			(prev) => (prev - 1 + productImages.length) % productImages.length,
		);
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.consent) {
			toast({
				title: "Uyarı",
				description: "Lütfen açık rıza metnini kabul edin.",
				variant: "destructive",
			});
			return;
		}

		try {
			const payload = {
				campaign_id: campaign.id,
				name: formData.name || "İsimsiz",
				email: formData.email,
				phone: formData.phone,
				form_data: formData,
			};

			// API call would go here
			// await apiRequest("/leads", "post", payload);

			toast({
				title: "Başarılı!",
				description:
					"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				phone: "",
				consent: false,
			});
		} catch (error) {
			console.error("Form gönderimi başarısız:", error);
			toast({
				title: "Hata!",
				description: "Form gönderilemedi, lütfen tekrar deneyin.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen bg-transparent">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Tabs */}
						<div className="flex gap-3">
							<Button
								onClick={() => setActiveTab(TABS.DESCRIPTION)}
								className={`flex-1 py-6 rounded-2xl text-base font-semibold transition-all duration-300 shadow-md ${
									activeTab === TABS.DESCRIPTION
										? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white scale-105"
										: "bg-transparent text-gray-700 hover:bg-orange-50 border-2 border-orange-200"
								}`}
							>
								Kampanya Açıklaması
							</Button>
							<Button
								onClick={() => setActiveTab(TABS.TERMS)}
								className={`flex-1 py-6 rounded-2xl text-base font-semibold transition-all duration-300 shadow-md ${
									activeTab === TABS.TERMS
										? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white scale-105"
										: "bg-transparent text-gray-700 hover:bg-orange-50 border-2 border-orange-200"
								}`}
							>
								Kampanya Şartları
							</Button>
						</div>

						{/* Tab Content */}
						{activeTab === TABS.DESCRIPTION ? (
							<Card className="overflow-hidden shadow-xl rounded-3xl border-0 bg-transparent backdrop-blur-sm">
								<CardContent className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{/* Product Image */}
										<div className="relative">
											<div className="bg-gradient rounded-2xl p-6 shadow-inner">
												{productImages.length > 0 ? (
													<>
														<img
															src={productImages[currentImageIndex]}
															alt={productData?.title || "Ürün görseli"}
															className="w-full aspect-square object-contain rounded-xl"
														/>
														{productImages.length > 1 && (
															<>
																<button
																	onClick={prevImage}
																	className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-orange-500 hover:text-white text-gray-700 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
																	aria-label="Önceki görsel"
																>
																	<ChevronLeft className="h-6 w-6" />
																</button>
																<button
																	onClick={nextImage}
																	className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-orange-500 hover:text-white text-gray-700 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
																	aria-label="Sonraki görsel"
																>
																	<ChevronRight className="h-6 w-6" />
																</button>
																<div className="flex justify-center gap-2 mt-4">
																	{productImages.map((_, idx) => (
																		<button
																			key={idx}
																			onClick={() => setCurrentImageIndex(idx)}
																			className={`w-2 h-2 rounded-full transition-all duration-300 ${
																				idx === currentImageIndex
																					? "bg-orange-500 w-8"
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
													<div className="w-full aspect-square flex items-center justify-center bg-transparent rounded-xl">
														<p className="text-gray-400">Görsel yok</p>
													</div>
												)}
											</div>
										</div>

										{/* Product Attributes */}
										<div className="space-y-1">
											<h3 className="text-xl font-bold text-gray-800 mb-4">
												Ürün Özellikleri
											</h3>
											{Object.entries(attributes).length > 0 ? (
												Object.entries(attributes).map(
													([key, value], index) => (
														<div
															key={index}
															className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 hover:bg-orange-50 transition-colors rounded-lg px-2"
														>
															<div className="text-gray-600 font-medium text-sm">
																{key}
															</div>
															<div className="text-gray-900 font-semibold text-sm">
																{value}
															</div>
														</div>
													),
												)
											) : productData?.gtin ? (
												<div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
													<div className="text-gray-600 font-medium text-sm">
														Ürün Kodu
													</div>
													<div className="text-gray-900 font-semibold text-sm">
														{productData.gtin}
													</div>
												</div>
											) : (
												<p className="text-gray-400 text-center py-8 text-sm">
													Ürün özellikleri bulunmamaktadır.
												</p>
											)}
										</div>
									</div>
									{/* Price Comparison */}
									{stores.length > 0 && (
										<CardContent className="p-6">
											<h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
												<ShoppingCart className="h-6 w-6 text-orange-500" />
												Fiyat Karşılaştır
											</h3>
											<div className="space-y-3">
												{stores
													.filter((s) => s.price)
													.slice(0, 4)
													.map((store, index) => (
														<div
															key={index}
															className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200 hover:shadow-md"
														>
															<div className="flex items-center gap-4 flex-1">
																<div className="bg-white rounded-xl p-3 w-16 h-16 flex items-center justify-center shadow-sm">
																	{store.image_link ? (
																		<img
																			src={store.image_link}
																			alt={store.storeBrand || "Mağaza"}
																			className="max-h-12 max-w-12 object-contain"
																			onError={(e) =>
																				(e.target.style.display = "none")
																			}
																		/>
																	) : (
																		<ShoppingCart className="h-8 w-8 text-gray-400" />
																	)}
																</div>
																<div>
																	<p className="font-semibold text-gray-900 text-sm line-clamp-2">
																		{productData?.title || "Ürün"}
																	</p>
																	<p className="text-xs text-gray-600 capitalize mt-1">
																		{store.storeBrand || "Mağaza"}
																	</p>
																</div>
															</div>
															<div className="text-right flex items-center gap-4">
																<div>
																	<p
																		className={`text-xs font-medium mb-1 ${
																			store.stock_availability === "in stock"
																				? "text-green-600"
																				: "text-red-600"
																		}`}
																	>
																		{store.stock_availability === "in stock"
																			? "✓ Stokta"
																			: "✕ Tükendi"}
																	</p>
																	<p className="text-xl font-bold text-orange-600">
																		{formatPrice(store.price)}
																	</p>
																</div>
																<Button
																	size="sm"
																	className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-4 shadow-md hover:shadow-lg transition-all duration-300"
																	asChild
																>
																	<a
																		href={store.link}
																		target="_blank"
																		rel="noopener noreferrer"
																		aria-label="Mağazaya git"
																	>
																		→
																	</a>
																</Button>
															</div>
														</div>
													))}
											</div>
										</CardContent>
									)}
								</CardContent>
							</Card>
						) : (
							<Card className="shadow-xl rounded-3xl border-0 bg-transparent">
								<CardContent className="p-8">
									{campaign?.content ? (
										<div
											className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
											dangerouslySetInnerHTML={{ __html: campaign.content }}
										/>
									) : (
										<p className="text-gray-400 text-center py-12">
											Kampanya şartları bilgisi bulunmamaktadır.
										</p>
									)}
								</CardContent>
							</Card>
						)}
					</div>

					{/* Contact Form */}
					<div className="space-y-6">
						<Card className="shadow-xl rounded-3xl border-0 bg-transparent sticky top-8">
							<CardContent className="p-6">
								{brandLogo && (
									<div className="flex justify-center mb-6">
										<div className="bg-transparent p-4 rounded-2xl shadow-inner">
											<img
												src={brandLogo}
												alt={brandName || "Marka"}
												className="h-20 object-contain"
											/>
										</div>
									</div>
								)}

								<h2 className="text-center font-bold text-xl text-gray-800 mb-6">
									Formu Doldurun,{" "}
									<span className="text-orange-500">Size Ulaşalım</span>
								</h2>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Ad Soyad *
										</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) =>
												handleInputChange("name", e.target.value)
											}
											placeholder="Adınızı ve soyadınızı girin"
											className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											E-posta Adresi *
										</label>
										<input
											type="email"
											value={formData.email}
											onChange={(e) =>
												handleInputChange("email", e.target.value)
											}
											placeholder="ornek@mail.com"
											className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Telefon Numarası *
										</label>
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) =>
												handleInputChange("phone", e.target.value)
											}
											placeholder="05xx xxx xx xx"
											className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
											required
										/>
									</div>

									<div className="flex items-start gap-3 pt-2">
										<input
											type="checkbox"
											id="consent"
											checked={formData.consent}
											onChange={(e) =>
												handleInputChange("consent", e.target.checked)
											}
											className="mt-1 h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
											required
										/>
										<label
											htmlFor="consent"
											className="text-sm text-gray-600 cursor-pointer"
										>
											Açık rıza metnini okudum ve kabul ediyorum. *
										</label>
									</div>

									<button
										onClick={handleSubmit}
										className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
									>
										Teklif Al
									</button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
