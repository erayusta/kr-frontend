import {
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Store,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const TABS = {
	PRICES: "prices",
	DESCRIPTION: "description",
	TERMS: "terms",
};

export default function CampaignContent({ campaign }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [activeTab, setActiveTab] = useState(TABS.PRICES);
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

	// Sort stores by price
	const sortedStores = [...stores]
		.filter((s) => s.price)
		.sort((a, b) => a.price - b.price);

	const totalStoresCount = sortedStores.length;

	// Handlers
	const formatPrice = (price) => {
		if (!price) return "";
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
			toast({
				title: "Başarılı!",
				description:
					"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
			});

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
								Kampanya Açıklaması
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
								Kampanya Şartları
							</button>
						</div>

						{/* Tab Content */}
						{activeTab === TABS.PRICES && (
							<div className="space-y-3">
								{sortedStores.length > 0 ? (
									sortedStores.map((store) => (
										<div
											key={`${store.storeId}-${store.storeBrand}-${store.price}`}
											className=" rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
										>
											<div className="p-4 flex items-center gap-4">
												{/* Store Logo */}
												<div className="flex-shrink-0 w-20 h-14 rounded-lg border border-gray-100 p-2 flex items-center justify-center ">
													{store.image_link ? (
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
													{/* Stock Status */}
													<div className="flex items-center justify-end gap-1 mb-1">
														{store.stock_availability === "in stock" ? (
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

													{/* Price */}
													<p className="text-xl font-bold text-gray-900">
														{formatPrice(store.price)}{" "}
														<span className="text-sm font-medium text-gray-500">
															TL
														</span>
													</p>

													{/* Shipping Info */}
													<p className="text-xs text-gray-400">
														Ücretsiz Kargo
													</p>
												</div>

												{/* Go to Store Button */}
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
									<Card className=" rounded-lg overflow-hidden bg-transparent">
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
						<div className=" rounded-xl border border-gray-100 p-5 sticky top-6">
							{brandLogo && (
								<div className="flex justify-center mb-5">
									<img
										src={brandLogo}
										alt={brandName || "Marka"}
										className="h-14 object-contain"
									/>
								</div>
							)}

							<h2 className="text-center font-semibold text-gray-900 mb-5">
								Formu Doldurun,{" "}
								<span className="text-orange-500">Size Ulaşalım</span>
							</h2>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="name-input"
										className="block text-sm text-gray-700 mb-1"
									>
										Ad Soyad <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										id="name-input"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										placeholder="Adınızı ve soyadınızı girin"
										className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="email-input"
										className="block text-sm text-gray-700 mb-1"
									>
										E-posta Adresi <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										id="email-input"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										placeholder="ornek@mail.com"
										className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="phone-input"
										className="block text-sm text-gray-700 mb-1"
									>
										Telefon Numarası <span className="text-red-500">*</span>
									</label>
									<input
										type="tel"
										id="phone-input"
										value={formData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										placeholder="05xx xxx xx xx"
										className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
										required
									/>
								</div>

								<div className="flex items-start gap-2 pt-1">
									<input
										type="checkbox"
										id="consent-input"
										checked={formData.consent}
										onChange={(e) =>
											handleInputChange("consent", e.target.checked)
										}
										className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
										required
									/>
									<label
										htmlFor="consent-input"
										className="text-xs text-gray-500 cursor-pointer leading-relaxed"
									>
										Açık rıza metnini okudum ve kabul ediyorum.{" "}
										<span className="text-red-500">*</span>
									</label>
								</div>

								<button
									type="submit"
									className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors text-sm"
								>
									Teklif Al
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
