import {
	Bath,
	Bed,
	Building,
	Calendar,
	Car,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Home,
	Layers,
	Mail,
	MapPin,
	Phone,
	Ruler,
	Thermometer,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IMAGE_BASE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";
import CampaignLeadForm from "@/components/common/campaign/CampaignLeadForm";

export default function CampaignRealEstateType({ campaign }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

	// real_estate verisini kontrol et
	const realEstateData =
		campaign.real_estate || campaign.realEstate || campaign.item;

	if (!realEstateData) return null;

	// Fiyat formatlama
	const formatPrice = (price) => {
		if (!price) return "Fiyat bilgisi yok";
		return new Intl.NumberFormat("tr-TR").format(price) + " TL";
	};

	// Tarih formatlama
	const formatDate = (dateString) => {
		if (!dateString) return "Belirtilmemiş";
		const date = new Date(dateString);
		return date.toLocaleDateString("tr-TR", {
			month: "long",
			year: "numeric",
		});
	};

	// Property type çevirisi
	const getPropertyTypeLabel = (type) => {
		const types = {
			apartment: "Daire",
			villa: "Villa",
			office: "Ofis",
			shop: "Dükkan",
			land: "Arsa",
			residence: "Rezidans",
		};
		return types[type] || type;
	};

	// Görsel URL'ini düzenle
	const getImageUrl = (image) => {
		if (!image)
			return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/real-estates/${image}`;
	};

	// Görsel navigasyon
	const nextImage = () => {
		if (realEstateData.images && realEstateData.images.length > 0) {
			setActiveImageIndex((prev) => (prev + 1) % realEstateData.images.length);
		}
	};

	const prevImage = () => {
		if (realEstateData.images && realEstateData.images.length > 0) {
			setActiveImageIndex(
				(prev) =>
					(prev - 1 + realEstateData.images.length) %
					realEstateData.images.length,
			);
		}
	};

	const images = realEstateData.images || ["placeholder"];
	const selectedPlan = realEstateData.price_plans?.[selectedPlanIndex];

	return (
		<div className="w-full space-y-6">
			{/* Başlık ve Konum */}
			<div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{realEstateData.name}
						</h1>
						<div className="flex items-center gap-2 text-gray-600">
							<MapPin className="h-4 w-4" />
							<span>
								{realEstateData.city && realEstateData.district
									? `${realEstateData.district}, ${realEstateData.city}`
									: realEstateData.city || "Konum bilgisi yok"}
							</span>
						</div>
					</div>
					<div className="text-right">
						<Badge variant="secondary" className="mb-2">
							{getPropertyTypeLabel(realEstateData.property_type)}
						</Badge>
						<div className="text-sm text-gray-500">
							Teslim: {formatDate(realEstateData.delivery_date)}
						</div>
					</div>
				</div>
			</div>

			{/* Ana İçerik Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sol: Görsel Galerisi (2 kolon) */}
				<div className="lg:col-span-2 space-y-4">
					{/* Ana Görsel */}
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="relative">
								<img
									src={getImageUrl(images[activeImageIndex])}
									alt={`${realEstateData.name} - ${activeImageIndex + 1}`}
									className="w-full h-[500px] object-cover"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src =
											"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
									}}
								/>

								{/* Görsel Navigasyon */}
								{images.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
										>
											<ChevronLeft className="h-5 w-5" />
										</button>
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
										>
											<ChevronRight className="h-5 w-5" />
										</button>
									</>
								)}

								{/* Görsel Sayacı */}
								<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
									{activeImageIndex + 1} / {images.length}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Küçük Görsel Galerisi */}
					{images.length > 1 && (
						<div className="grid grid-cols-4 gap-2">
							{images.slice(0, 8).map((image, index) => (
								<button
									key={index}
									onClick={() => setActiveImageIndex(index)}
									className={cn(
										"relative rounded-lg overflow-hidden border-2 transition-all",
										activeImageIndex === index
											? "border-blue-500"
											: "border-gray-200",
									)}
								>
									<img
										src={getImageUrl(image)}
										alt={`Thumbnail ${index + 1}`}
										className="w-full h-24 object-cover"
									/>
								</button>
							))}
						</div>
					)}

					{/* Proje Özellikleri */}
					<Card>
						<CardContent className="p-6">
							<h3 className="font-semibold text-lg mb-4">Proje Özellikleri</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-100 rounded-lg">
										<Building className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Toplam Ünite</p>
										<p className="font-semibold">
											{realEstateData.number_of_units || "Belirtilmemiş"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-100 rounded-lg">
										<Layers className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Kat Sayısı</p>
										<p className="font-semibold">
											{realEstateData.floor_count || "Belirtilmemiş"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-orange-100 rounded-lg">
										<Thermometer className="h-5 w-5 text-orange-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Isıtma</p>
										<p className="font-semibold">
											{realEstateData.heating || "Belirtilmemiş"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-purple-100 rounded-lg">
										<Car className="h-5 w-5 text-purple-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Otopark</p>
										<p className="font-semibold">
											{realEstateData.parking ? "Mevcut" : "Yok"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Proje Açıklaması */}
					{campaign.description && (
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg mb-4">
									Kampansadasdya Detayları
								</h3>
								<p className="text-gray-700 leading-relaxed">
									{campaign.description}
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sağ: Fiyat ve İletişim */}
				<div className="space-y-4">
					{/* Fiyat Planları */}
					{realEstateData.price_plans &&
						realEstateData.price_plans.length > 0 && (
							<Card>
								<CardContent className="p-6">
									<h3 className="font-semibold text-lg mb-4">Daire Tipleri</h3>
									<div className="space-y-3">
										{realEstateData.price_plans.map((plan, index) => (
											<button
												key={index}
												onClick={() => setSelectedPlanIndex(index)}
												className={cn(
													"w-full p-4 rounded-lg border text-left transition-all",
													selectedPlanIndex === index
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-blue-300",
												)}
											>
												<div className="flex items-center justify-between mb-2">
													<span className="font-semibold">
														{plan.type || `${plan.room_count || ""} Oda`}
													</span>
													{plan.area && (
														<Badge variant="outline">{plan.area} m²</Badge>
													)}
												</div>
												{plan.price && (
													<div className="text-xl font-bold text-blue-600">
														{formatPrice(plan.price)}
													</div>
												)}
												{plan.monthly_payment && (
													<p className="text-sm text-gray-500 mt-1">
														Aylık: {formatPrice(plan.monthly_payment)}
													</p>
												)}
											</button>
										))}
									</div>
								</CardContent>
							</Card>
						)}

					{/* Seçili Plan Detayları */}
					{selectedPlan && (
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="p-6">
								<h4 className="font-semibold mb-3">Seçili Daire Özellikleri</h4>
								<div className="space-y-3">
									{selectedPlan.room_count && (
										<div className="flex items-center gap-2">
											<Home className="h-4 w-4 text-blue-600" />
											<span className="text-sm">
												{selectedPlan.room_count} Oda
											</span>
										</div>
									)}
									{selectedPlan.area && (
										<div className="flex items-center gap-2">
											<Ruler className="h-4 w-4 text-blue-600" />
											<span className="text-sm">{selectedPlan.area} m²</span>
										</div>
									)}
									{selectedPlan.bathroom_count && (
										<div className="flex items-center gap-2">
											<Bath className="h-4 w-4 text-blue-600" />
											<span className="text-sm">
												{selectedPlan.bathroom_count} Banyo
											</span>
										</div>
									)}
									{selectedPlan.bedroom_count && (
										<div className="flex items-center gap-2">
											<Bed className="h-4 w-4 text-blue-600" />
											<span className="text-sm">
												{selectedPlan.bedroom_count} Yatak Odası
											</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Özellikler Listesi */}
					<Card>
						<CardContent className="p-6">
							<h4 className="font-semibold mb-3">Proje Avantajları</h4>
							<div className="space-y-2">
								{[
									"7/24 Güvenlik",
									"Açık/Kapalı Otopark",
									"Sosyal Tesisler",
									"Spor Salonu",
									"Yüzme Havuzu",
									"Çocuk Oyun Alanı",
								].map((feature, index) => (
									<div key={index} className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<span className="text-sm">{feature}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Contact Form */}
					<CampaignLeadForm
						campaign={campaign}
						brandLogo={campaign.brands?.[0]?.logo}
						brandName={campaign.brands?.[0]?.name}
						variant="product"
					/>

					{/* Konum */}
					{realEstateData.maps_url && (
						<Card>
							<CardContent className="p-6">
								<Button asChild className="w-full" variant="outline">
									<a
										href={realEstateData.maps_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<MapPin className="h-4 w-4 mr-2" />
										Haritada Görüntüle
									</a>
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Satış Durumu */}
			{realEstateData.sold_percentage && (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-semibold">Satış Durumu</h3>
							<span className="text-2xl font-bold text-blue-600">
								{realEstateData.sold_percentage}%
							</span>
						</div>
						<Progress value={realEstateData.sold_percentage} className="h-3" />
						<p className="text-sm text-gray-500 mt-2">
							Projenin {realEstateData.sold_percentage}%'i satılmıştır
						</p>
					</CardContent>
				</Card>
			)}

			{/* Geliştiriciler */}
			{realEstateData.owners && realEstateData.owners.length > 0 && (
				<div className="text-center py-4">
					<p className="text-sm text-gray-500 mb-3">Proje Geliştiricileri</p>
					<div className="flex justify-center gap-3 flex-wrap">
						{realEstateData.owners.map((owner, index) => (
							<Badge key={index} variant="secondary" className="px-4 py-2">
								{owner}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
