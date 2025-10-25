import {
	CheckCircle,
	Package,
	Shield,
	ShoppingCart,
	Star,
	Truck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { IMAGE_BASE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";

export default function CampaignProductType({ campaign }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedStore, setSelectedStore] = useState(null);

	// product verisini kontrol et - item veya product olabilir
	const productData = campaign.product || campaign.item;

	if (!productData) return null;

	const stores = productData.stores || [];

	// En düşük fiyatı bul
	const lowestPrice =
		stores.length > 0
			? Math.min(
					...stores.filter((s) => s.price).map((s) => parseFloat(s.price)),
				)
			: productData.price;

	// Fiyat formatlama
	const formatPrice = (price) => {
		if (!price) return "Fiyat bilgisi yok";
		return new Intl.NumberFormat("tr-TR", {
			style: "currency",
			currency: "TRY",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	// Görsel URL'ini düzenle
	const getImageUrl = (image) => {
		if (!image)
			return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/products/${image}`;
	};

	// Ürün görselleri - eğer yoksa placeholder kullan
	const productImages =
		productData.images?.length > 0
			? productData.images
			: [productData.image || "placeholder"];

	return (
		<div className="w-full space-y-6">
			{/* Ana Ürün Kartı */}
			<Card className="overflow-hidden">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 lg:grid-cols-2">
						{/* Sol: Görsel Galerisi */}
						<div className="bg-gray-50 p-6">
							<div className="space-y-4">
								{/* Ana Görsel */}
								<div className="relative bg-white rounded-lg overflow-hidden">
									<Carousel className="w-full">
										<CarouselContent>
											{productImages.map((image, index) => (
												<CarouselItem key={index}>
													<div className="relative aspect-square">
														<img
															src={getImageUrl(image)}
															alt={`${productData.title || productData.name} - ${index + 1}`}
															className="w-full h-full object-contain p-4"
															onError={(e) => {
																e.target.onerror = null;
																e.target.src =
																	"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
															}}
														/>
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										{productImages.length > 1 && (
											<>
												<CarouselPrevious className="left-2" />
												<CarouselNext className="right-2" />
											</>
										)}
									</Carousel>
								</div>

								{/* Küçük Görsel Galerisi */}
								{productImages.length > 1 && (
									<div className="flex gap-2 overflow-x-auto pb-2">
										{productImages.map((image, index) => (
											<button
												key={index}
												onClick={() => setActiveImageIndex(index)}
												className={cn(
													"flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 bg-white transition-all",
													activeImageIndex === index
														? "border-orange-500"
														: "border-gray-200",
												)}
											>
												<img
													src={getImageUrl(image)}
													alt={`Thumbnail ${index + 1}`}
													className="w-full h-full object-contain p-1"
												/>
											</button>
										))}
									</div>
								)}

								{/* Kampanya Bilgileri */}
								<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
									<h3 className="font-semibold text-orange-900 mb-2">
										📢 Kampanya Detayları
									</h3>
									<p className="text-sm text-gray-700">
										{campaign.description ||
											"Bu ürün özel kampanya fiyatıyla sizlerle!"}
									</p>
								</div>
							</div>
						</div>

						{/* Sağ: Ürün Bilgileri */}
						<div className="p-6 space-y-6">
							{/* Başlık ve Marka */}
							<div>
								{productData.brand && (
									<Badge variant="secondary" className="mb-2">
										{typeof productData.brand === "string"
											? productData.brand
											: productData.brand.name}
									</Badge>
								)}
								<h1 className="text-2xl font-bold text-gray-900 mb-2">
									{productData.title || productData.name}
								</h1>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<span className="text-sm text-gray-500">
										4.5 (127 değerlendirme)
									</span>
								</div>
							</div>

							{/* Fiyat Bilgisi */}
							<div className="border-t border-b py-4">
								<div className="flex items-end gap-3">
									<span className="text-3xl font-bold text-orange-600">
										{formatPrice(lowestPrice)}
									</span>
									{productData.original_price &&
										productData.original_price > lowestPrice && (
											<span className="text-lg text-gray-400 line-through">
												{formatPrice(productData.original_price)}
											</span>
										)}
								</div>
								<p className="text-sm text-gray-500 mt-1">KDV Dahil</p>
							</div>

							{/* Ürün Özellikleri */}
							{productData.attributes &&
								Object.keys(productData.attributes).length > 0 && (
									<div>
										<h3 className="font-semibold text-gray-900 mb-3">
											Özellikler
										</h3>
										<div className="space-y-2">
											{Object.entries(productData.attributes)
												.slice(0, 6)
												.map(([key, value]) => (
													<div
														key={key}
														className="flex justify-between py-2 border-b border-gray-100"
													>
														<span className="text-sm text-gray-600">{key}</span>
														<span className="text-sm font-medium text-gray-900">
															{value}
														</span>
													</div>
												))}
										</div>
									</div>
								)}

							{/* Avantajlar */}
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm">
									<Truck className="h-4 w-4 text-green-600" />
									<span>Ücretsiz Kargo</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Shield className="h-4 w-4 text-green-600" />
									<span>2 Yıl Garanti</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<CheckCircle className="h-4 w-4 text-green-600" />
									<span>%100 Orijinal Ürün</span>
								</div>
							</div>

							{/* Hemen Al Butonu */}
							<div className="space-y-3">
								<Button
									className="w-full bg-orange-600 hover:bg-orange-700 text-white"
									size="lg"
								>
									<ShoppingCart className="h-5 w-5 mr-2" />
									Kampanyaya Katıl
								</Button>
								<p className="text-xs text-center text-gray-500">
									Stok durumu mağazaya göre değişiklik gösterebilir
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Fiyat Karşılaştırma Tablosu */}
			{stores.length > 0 && (
				<Card>
					<CardContent className="p-6">
						<h3 className="font-semibold text-lg mb-4">
							Fiyat Karşılaştırması
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
											Mağaza
										</th>
										<th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
											Stok
										</th>
										<th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
											Fiyat
										</th>
										<th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
									</tr>
								</thead>
								<tbody>
									{stores.map((store, index) => {
										const isLowest =
											store.price && parseFloat(store.price) === lowestPrice;
										return (
											<tr
												key={index}
												className="border-b hover:bg-gray-50 transition-colors"
											>
												<td className="py-3 px-4">
													<div className="flex items-center gap-2">
														{store.logo && (
															<img
																src={store.logo}
																alt={store.name}
																className="h-8 w-auto"
																onError={(e) =>
																	(e.target.style.display = "none")
																}
															/>
														)}
														<span className="font-medium">{store.name}</span>
													</div>
												</td>
												<td className="text-center py-3 px-4">
													{store.in_stock !== undefined ? (
														<Badge
															variant={store.in_stock ? "default" : "secondary"}
															className={cn(
																"text-xs",
																store.in_stock
																	? "bg-green-100 text-green-800"
																	: "bg-gray-100 text-gray-600",
															)}
														>
															{store.in_stock ? "Stokta" : "Tükendi"}
														</Badge>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</td>
												<td className="text-right py-3 px-4">
													<div>
														<span
															className={cn(
																"font-bold",
																isLowest
																	? "text-green-600 text-lg"
																	: "text-gray-900",
															)}
														>
															{formatPrice(store.price)}
														</span>
														{isLowest && (
															<div className="text-xs text-green-600 mt-1">
																En düşük fiyat
															</div>
														)}
													</div>
												</td>
												<td className="text-center py-3 px-4">
													{store.url && (
														<Button
															asChild
															size="sm"
															variant={isLowest ? "default" : "outline"}
															className={
																isLowest
																	? "bg-orange-600 hover:bg-orange-700"
																	: ""
															}
														>
															<a
																href={store.url}
																target="_blank"
																rel="noopener noreferrer"
															>
																Mağazaya Git
															</a>
														</Button>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Ürün Hakkında Detaylı Bilgi */}
			{(productData.description || productData.details) && (
				<Card>
					<CardContent className="p-6">
						<h3 className="font-semibold text-lg mb-4">Ürün Hakkında</h3>
						<div className="prose prose-gray max-w-none">
							<p className="text-gray-700 leading-relaxed">
								{productData.description || productData.details}
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
