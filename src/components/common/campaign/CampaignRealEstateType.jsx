import {
	Bath,
	Bed,
	Building,
	Building2,
	Calendar,
	Car,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Droplets,
	Home,
	Layers,
	Lightbulb,
	MapPin,
	Ruler,
	ShoppingBag,
	Briefcase,
	Flame,
	Thermometer,
	TreeDeciduous,
	Warehouse,
	FileText,
	CreditCard,
	Users,
	Shield,
	Coffee,
	DoorOpen,
	Armchair,
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

	const realEstateData = campaign.real_estate || campaign.realEstate || campaign.item;

	if (!realEstateData) return null;

	const propertyType = realEstateData.property_type;
	const typeData = realEstateData.type_specific_data || {};

	// Fiyat formatlama
	const formatPrice = (price, currency = "TRY") => {
		if (!price) return "Fiyat bilgisi yok";
		const currencySymbols = { TRY: "TL", USD: "$", EUR: "€", GBP: "£" };
		const symbol = currencySymbols[currency] || "TL";
		return new Intl.NumberFormat("tr-TR").format(price) + " " + symbol;
	};

	// Tarih formatlama
	const formatDate = (dateString) => {
		if (!dateString) return "Belirtilmemis";
		const date = new Date(dateString);
		return date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
	};

	// Property type cevirisi
	const getPropertyTypeLabel = (type) => {
		const types = {
			apartment: "Daire",
			villa: "Villa",
			office: "Ofis",
			shop: "Dukkan",
			land: "Arsa",
			residence: "Rezidans",
		};
		return types[type] || type;
	};

	// Property type badge rengi
	const getPropertyTypeBadgeColor = (type) => {
		const colors = {
			apartment: "bg-blue-500",
			villa: "bg-green-500",
			office: "bg-purple-500",
			shop: "bg-orange-500",
			land: "bg-amber-600",
			residence: "bg-indigo-500",
		};
		return colors[type] || "bg-gray-500";
	};

	// Imar durumu cevirisi
	const getZoningLabel = (zoning) => {
		const zonings = {
			konut: "Konut Imarli",
			ticari: "Ticari Imarli",
			sanayi: "Sanayi Imarli",
			tarim: "Tarim Arazisi",
			karisik: "Karma Kullanim",
			imarsiz: "Imarsiz",
		};
		return zonings[zoning] || zoning;
	};

	// Tapu durumu cevirisi
	const getDeedLabel = (deed) => {
		const deeds = {
			kat_mulkiyeti: "Kat Mulkiyeti",
			kat_irtifaki: "Kat Irtifaki",
			hisseli: "Hisseli Tapu",
			mustakil: "Mustakil Tapu",
		};
		return deeds[deed] || deed;
	};

	// Kat cevirisi
	const getFloorLabel = (floor) => {
		const floors = {
			bodrum: "Bodrum Kat",
			zemin: "Zemin Kat",
			asma: "Asma Kat",
			ust: "Ust Katlar (6+)",
			diger: "Diger",
		};
		return floors[floor] || `${floor}. Kat`;
	};

	// Kullanim durumu cevirisi
	const getUsageLabel = (usage) => {
		const usages = {
			bos: "Bos",
			kiracili: "Kiracili",
			sahibinden: "Sahibinden Kullaniliyor",
		};
		return usages[usage] || usage;
	};

	// Gorsel URL'ini duzenle
	const getImageUrl = (image) => {
		if (!image) return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/real-estates/${image}`;
	};

	// Gorsel navigasyon
	const nextImage = () => {
		if (realEstateData.images && realEstateData.images.length > 0) {
			setActiveImageIndex((prev) => (prev + 1) % realEstateData.images.length);
		}
	};

	const prevImage = () => {
		if (realEstateData.images && realEstateData.images.length > 0) {
			setActiveImageIndex((prev) => (prev - 1 + realEstateData.images.length) % realEstateData.images.length);
		}
	};

	const images = realEstateData.images || ["placeholder"];
	const selectedPlan = realEstateData.price_plans?.[selectedPlanIndex];

	// Konut tipi mi kontrol et
	const isResidential = ["apartment", "villa", "residence"].includes(propertyType);
	const isLand = propertyType === "land";
	const isShop = propertyType === "shop";
	const isOffice = propertyType === "office";

	// Arsa ozellikleri renderla
	const renderLandFeatures = () => (
		<Card>
			<CardContent className="p-6">
				<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
					<TreeDeciduous className="h-5 w-5 text-amber-600" />
					Arsa Ozellikleri
				</h3>
				<div className="grid grid-cols-2 gap-4">
					{typeData.land_area && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-amber-100 rounded-lg">
								<Ruler className="h-5 w-5 text-amber-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Arsa Alani</p>
								<p className="font-semibold">{typeData.land_area} m²</p>
							</div>
						</div>
					)}

					{typeData.zoning_status && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<FileText className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Imar Durumu</p>
								<p className="font-semibold">{getZoningLabel(typeData.zoning_status)}</p>
							</div>
						</div>
					)}

					{typeData.parcel_no && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<MapPin className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Ada/Parsel</p>
								<p className="font-semibold">{typeData.parcel_no}</p>
							</div>
						</div>
					)}

					{typeData.gabari && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Building className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Gabari</p>
								<p className="font-semibold">{typeData.gabari}</p>
							</div>
						</div>
					)}

					{typeData.taks && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-orange-100 rounded-lg">
								<Layers className="h-5 w-5 text-orange-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">TAKS</p>
								<p className="font-semibold">{typeData.taks}</p>
							</div>
						</div>
					)}

					{typeData.kaks && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<Layers className="h-5 w-5 text-indigo-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">KAKS</p>
								<p className="font-semibold">{typeData.kaks}</p>
							</div>
						</div>
					)}

					{typeData.road_frontage && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gray-100 rounded-lg">
								<Ruler className="h-5 w-5 text-gray-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Yola Cephe</p>
								<p className="font-semibold">{typeData.road_frontage} m</p>
							</div>
						</div>
					)}

					{typeData.deed_status && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-teal-100 rounded-lg">
								<FileText className="h-5 w-5 text-teal-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Tapu Durumu</p>
								<p className="font-semibold">{getDeedLabel(typeData.deed_status)}</p>
							</div>
						</div>
					)}
				</div>

				{/* Altyapi Durumu */}
				<div className="mt-6 pt-4 border-t">
					<h4 className="font-medium text-sm text-gray-600 mb-3">Altyapi Durumu</h4>
					<div className="grid grid-cols-4 gap-3">
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_electricity ? "bg-green-50" : "bg-gray-50")}>
							<Lightbulb className={cn("h-5 w-5 mb-1", typeData.has_electricity ? "text-green-600" : "text-gray-400")} />
							<span className="text-xs">Elektrik</span>
							<span className={cn("text-xs font-medium", typeData.has_electricity ? "text-green-600" : "text-gray-400")}>
								{typeData.has_electricity ? "Var" : "Yok"}
							</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_water ? "bg-blue-50" : "bg-gray-50")}>
							<Droplets className={cn("h-5 w-5 mb-1", typeData.has_water ? "text-blue-600" : "text-gray-400")} />
							<span className="text-xs">Su</span>
							<span className={cn("text-xs font-medium", typeData.has_water ? "text-blue-600" : "text-gray-400")}>
								{typeData.has_water ? "Var" : "Yok"}
							</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_natural_gas ? "bg-orange-50" : "bg-gray-50")}>
							<Flame className={cn("h-5 w-5 mb-1", typeData.has_natural_gas ? "text-orange-600" : "text-gray-400")} />
							<span className="text-xs">Dogalgaz</span>
							<span className={cn("text-xs font-medium", typeData.has_natural_gas ? "text-orange-600" : "text-gray-400")}>
								{typeData.has_natural_gas ? "Var" : "Yok"}
							</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_sewage ? "bg-teal-50" : "bg-gray-50")}>
							<Droplets className={cn("h-5 w-5 mb-1", typeData.has_sewage ? "text-teal-600" : "text-gray-400")} />
							<span className="text-xs">Kanalizasyon</span>
							<span className={cn("text-xs font-medium", typeData.has_sewage ? "text-teal-600" : "text-gray-400")}>
								{typeData.has_sewage ? "Var" : "Yok"}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Dukkan ozellikleri renderla
	const renderShopFeatures = () => (
		<Card>
			<CardContent className="p-6">
				<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
					<ShoppingBag className="h-5 w-5 text-orange-600" />
					Dukkan Ozellikleri
				</h3>
				<div className="grid grid-cols-2 gap-4">
					{typeData.shop_area && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-orange-100 rounded-lg">
								<Ruler className="h-5 w-5 text-orange-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Dukkan Alani</p>
								<p className="font-semibold">{typeData.shop_area} m²</p>
							</div>
						</div>
					)}

					{typeData.frontage_width && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Ruler className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Cephe Genisligi</p>
								<p className="font-semibold">{typeData.frontage_width} m</p>
							</div>
						</div>
					)}

					{typeData.floor_location && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Layers className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Bulundugu Kat</p>
								<p className="font-semibold">{getFloorLabel(typeData.floor_location)}</p>
							</div>
						</div>
					)}

					{typeData.monthly_dues && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<CreditCard className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Aylik Aidat</p>
								<p className="font-semibold">{formatPrice(typeData.monthly_dues)}</p>
							</div>
						</div>
					)}

					{typeData.building_age && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gray-100 rounded-lg">
								<Building className="h-5 w-5 text-gray-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Bina Yasi</p>
								<p className="font-semibold">{typeData.building_age} yil</p>
							</div>
						</div>
					)}

					{typeData.usage_status && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<Users className="h-5 w-5 text-indigo-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Kullanim Durumu</p>
								<p className="font-semibold">{getUsageLabel(typeData.usage_status)}</p>
							</div>
						</div>
					)}

					{realEstateData.heating && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-red-100 rounded-lg">
								<Thermometer className="h-5 w-5 text-red-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Isitma</p>
								<p className="font-semibold">{realEstateData.heating}</p>
							</div>
						</div>
					)}
				</div>

				{/* Dukkan Ozellikleri */}
				<div className="mt-6 pt-4 border-t">
					<h4 className="font-medium text-sm text-gray-600 mb-3">Ozellikler</h4>
					<div className="grid grid-cols-5 gap-3">
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_shopwindow ? "bg-orange-50" : "bg-gray-50")}>
							<DoorOpen className={cn("h-5 w-5 mb-1", typeData.has_shopwindow ? "text-orange-600" : "text-gray-400")} />
							<span className="text-xs text-center">Vitrin</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_storage ? "bg-amber-50" : "bg-gray-50")}>
							<Warehouse className={cn("h-5 w-5 mb-1", typeData.has_storage ? "text-amber-600" : "text-gray-400")} />
							<span className="text-xs text-center">Depo</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_wc ? "bg-blue-50" : "bg-gray-50")}>
							<Bath className={cn("h-5 w-5 mb-1", typeData.has_wc ? "text-blue-600" : "text-gray-400")} />
							<span className="text-xs text-center">WC</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", realEstateData.elevator ? "bg-purple-50" : "bg-gray-50")}>
							<Building2 className={cn("h-5 w-5 mb-1", realEstateData.elevator ? "text-purple-600" : "text-gray-400")} />
							<span className="text-xs text-center">Asansor</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", realEstateData.parking ? "bg-green-50" : "bg-gray-50")}>
							<Car className={cn("h-5 w-5 mb-1", realEstateData.parking ? "text-green-600" : "text-gray-400")} />
							<span className="text-xs text-center">Otopark</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Ofis ozellikleri renderla
	const renderOfficeFeatures = () => (
		<Card>
			<CardContent className="p-6">
				<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
					<Briefcase className="h-5 w-5 text-purple-600" />
					Ofis Ozellikleri
				</h3>
				<div className="grid grid-cols-2 gap-4">
					{typeData.office_area && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Ruler className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Ofis Alani</p>
								<p className="font-semibold">{typeData.office_area} m²</p>
							</div>
						</div>
					)}

					{typeData.room_count && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<DoorOpen className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Oda Sayisi</p>
								<p className="font-semibold">{typeData.room_count} oda</p>
							</div>
						</div>
					)}

					{typeData.floor_location && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<Layers className="h-5 w-5 text-indigo-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Bulundugu Kat</p>
								<p className="font-semibold">{getFloorLabel(typeData.floor_location)}</p>
							</div>
						</div>
					)}

					{realEstateData.floor_count && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gray-100 rounded-lg">
								<Building className="h-5 w-5 text-gray-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Bina Kat Sayisi</p>
								<p className="font-semibold">{realEstateData.floor_count} kat</p>
							</div>
						</div>
					)}

					{typeData.monthly_dues && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<CreditCard className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Aylik Aidat</p>
								<p className="font-semibold">{formatPrice(typeData.monthly_dues)}</p>
							</div>
						</div>
					)}

					{typeData.building_age && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-amber-100 rounded-lg">
								<Calendar className="h-5 w-5 text-amber-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Bina Yasi</p>
								<p className="font-semibold">{typeData.building_age} yil</p>
							</div>
						</div>
					)}

					{typeData.wc_count && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-teal-100 rounded-lg">
								<Bath className="h-5 w-5 text-teal-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">WC Sayisi</p>
								<p className="font-semibold">{typeData.wc_count} adet</p>
							</div>
						</div>
					)}

					{realEstateData.heating && (
						<div className="flex items-center gap-3">
							<div className="p-2 bg-red-100 rounded-lg">
								<Thermometer className="h-5 w-5 text-red-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Isitma</p>
								<p className="font-semibold">{realEstateData.heating}</p>
							</div>
						</div>
					)}
				</div>

				{/* Ofis Ozellikleri */}
				<div className="mt-6 pt-4 border-t">
					<h4 className="font-medium text-sm text-gray-600 mb-3">Ozellikler</h4>
					<div className="grid grid-cols-5 gap-3">
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.is_furnished ? "bg-purple-50" : "bg-gray-50")}>
							<Armchair className={cn("h-5 w-5 mb-1", typeData.is_furnished ? "text-purple-600" : "text-gray-400")} />
							<span className="text-xs text-center">Mobilyali</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_meeting_room ? "bg-blue-50" : "bg-gray-50")}>
							<Users className={cn("h-5 w-5 mb-1", typeData.has_meeting_room ? "text-blue-600" : "text-gray-400")} />
							<span className="text-xs text-center">Toplanti Odasi</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_kitchen ? "bg-orange-50" : "bg-gray-50")}>
							<Coffee className={cn("h-5 w-5 mb-1", typeData.has_kitchen ? "text-orange-600" : "text-gray-400")} />
							<span className="text-xs text-center">Mutfak</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_reception ? "bg-indigo-50" : "bg-gray-50")}>
							<DoorOpen className={cn("h-5 w-5 mb-1", typeData.has_reception ? "text-indigo-600" : "text-gray-400")} />
							<span className="text-xs text-center">Resepsiyon</span>
						</div>
						<div className={cn("flex flex-col items-center p-3 rounded-lg", typeData.has_security ? "bg-green-50" : "bg-gray-50")}>
							<Shield className={cn("h-5 w-5 mb-1", typeData.has_security ? "text-green-600" : "text-gray-400")} />
							<span className="text-xs text-center">7/24 Guvenlik</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 mt-3">
						<div className={cn("flex items-center justify-center gap-2 p-3 rounded-lg", realEstateData.elevator ? "bg-purple-50" : "bg-gray-50")}>
							<Building2 className={cn("h-5 w-5", realEstateData.elevator ? "text-purple-600" : "text-gray-400")} />
							<span className="text-sm">Asansor</span>
						</div>
						<div className={cn("flex items-center justify-center gap-2 p-3 rounded-lg", realEstateData.parking ? "bg-green-50" : "bg-gray-50")}>
							<Car className={cn("h-5 w-5", realEstateData.parking ? "text-green-600" : "text-gray-400")} />
							<span className="text-sm">Otopark</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Konut ozellikleri renderla (Daire, Villa, Rezidans)
	const renderResidentialFeatures = () => (
		<Card>
			<CardContent className="p-6">
				<h3 className="font-semibold text-lg mb-4">Proje Ozellikleri</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Building className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Toplam Unite</p>
							<p className="font-semibold">{realEstateData.number_of_units || "Belirtilmemis"}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-green-100 rounded-lg">
							<Layers className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Kat Sayisi</p>
							<p className="font-semibold">{realEstateData.floor_count || "Belirtilmemis"}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-orange-100 rounded-lg">
							<Thermometer className="h-5 w-5 text-orange-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Isitma</p>
							<p className="font-semibold">{realEstateData.heating || "Belirtilmemis"}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Car className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Otopark</p>
							<p className="font-semibold">{realEstateData.parking ? "Mevcut" : "Yok"}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Fiyat bilgisi kartini renderla (Arsa, Dukkan, Ofis icin)
	const renderPriceCard = () => {
		if (!typeData.price) return null;

		return (
			<Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
				<CardContent className="p-6">
					<h3 className="font-semibold text-lg mb-4">Fiyat Bilgisi</h3>
					<div className="text-3xl font-bold text-blue-600 mb-2">
						{formatPrice(typeData.price, typeData.price_currency)}
					</div>
					{typeData.price_per_sqm && (
						<p className="text-sm text-gray-600">
							m² Fiyati: {formatPrice(typeData.price_per_sqm, typeData.price_currency)}
						</p>
					)}
					<div className="flex gap-3 mt-4">
						{typeData.is_negotiable && (
							<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
								Pazarlik Payi Var
							</Badge>
						)}
						{typeData.credit_eligible && (
							<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
								Krediye Uygun
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="w-full space-y-6">
			{/* Baslik ve Konum */}
			<div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{realEstateData.name}</h1>
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
						<Badge className={cn("mb-2 text-white", getPropertyTypeBadgeColor(propertyType))}>
							{getPropertyTypeLabel(propertyType)}
						</Badge>
						{isResidential && realEstateData.delivery_date && (
							<div className="text-sm text-gray-500">Teslim: {formatDate(realEstateData.delivery_date)}</div>
						)}
					</div>
				</div>
			</div>

			{/* Ana Icerik Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sol: Gorsel Galerisi (2 kolon) */}
				<div className="lg:col-span-2 space-y-4">
					{/* Ana Gorsel */}
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="relative">
								<img
									src={getImageUrl(images[activeImageIndex])}
									alt={`${realEstateData.name} - ${activeImageIndex + 1}`}
									className="w-full h-[500px] object-cover"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";
									}}
								/>

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

								<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
									{activeImageIndex + 1} / {images.length}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Kucuk Gorsel Galerisi */}
					{images.length > 1 && (
						<div className="grid grid-cols-4 gap-2">
							{images.slice(0, 8).map((image, index) => (
								<button
									key={index}
									onClick={() => setActiveImageIndex(index)}
									className={cn(
										"relative rounded-lg overflow-hidden border-2 transition-all",
										activeImageIndex === index ? "border-blue-500" : "border-gray-200"
									)}
								>
									<img src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} className="w-full h-24 object-cover" />
								</button>
							))}
						</div>
					)}

					{/* Tip bazli ozellikler */}
					{isLand && renderLandFeatures()}
					{isShop && renderShopFeatures()}
					{isOffice && renderOfficeFeatures()}
					{isResidential && renderResidentialFeatures()}

					{/* Proje Aciklamasi */}
					{campaign.description && (
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg mb-4">Kampanya Detaylari</h3>
								<p className="text-gray-700 leading-relaxed">{campaign.description}</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sag: Fiyat ve Iletisim */}
				<div className="space-y-4">
					{/* Arsa, Dukkan, Ofis icin fiyat karti */}
					{(isLand || isShop || isOffice) && renderPriceCard()}

					{/* Konut tipleri icin Fiyat Planlari */}
					{isResidential && realEstateData.price_plans && realEstateData.price_plans.length > 0 && (
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
												selectedPlanIndex === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
											)}
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-semibold">{plan.type || `${plan.room_count || ""} Oda`}</span>
												{plan.area && <Badge variant="outline">{plan.area} m²</Badge>}
											</div>
											{plan.price && <div className="text-xl font-bold text-blue-600">{formatPrice(plan.price)}</div>}
											{plan.monthly_payment && (
												<p className="text-sm text-gray-500 mt-1">Aylik: {formatPrice(plan.monthly_payment)}</p>
											)}
										</button>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Secili Plan Detaylari */}
					{isResidential && selectedPlan && (
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="p-6">
								<h4 className="font-semibold mb-3">Secili Daire Ozellikleri</h4>
								<div className="space-y-3">
									{selectedPlan.room_count && (
										<div className="flex items-center gap-2">
											<Home className="h-4 w-4 text-blue-600" />
											<span className="text-sm">{selectedPlan.room_count} Oda</span>
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
											<span className="text-sm">{selectedPlan.bathroom_count} Banyo</span>
										</div>
									)}
									{selectedPlan.bedroom_count && (
										<div className="flex items-center gap-2">
											<Bed className="h-4 w-4 text-blue-600" />
											<span className="text-sm">{selectedPlan.bedroom_count} Yatak Odasi</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Konut tipleri icin ozellikler listesi */}
					{isResidential && realEstateData.features && realEstateData.features.length > 0 && (
						<Card>
							<CardContent className="p-6">
								<h4 className="font-semibold mb-3">Proje Avantajlari</h4>
								<div className="space-y-2">
									{realEstateData.features.map((feature, index) => {
										const featureLabels = {
											guvenlik: "7/24 Guvenlik",
											acik_otopark: "Acik Otopark",
											kapali_otopark: "Kapali Otopark",
											yuzme_havuzu: "Yuzme Havuzu",
											fitness: "Fitness Salonu",
											spa: "SPA",
											sauna: "Sauna",
											hamam: "Turk Hamami",
											cocuk_oyun_alani: "Cocuk Oyun Alani",
											kres: "Kres",
											toplanti_salonu: "Toplanti Salonu",
											sinema: "Sinema Salonu",
											parti_alani: "Parti Alani",
											market: "Market",
											kafe: "Kafe/Restaurant",
											yuruyus_alani: "Yuruyus Alani",
											basketbol: "Basketbol Sahasi",
											tenis: "Tenis Kortu",
											voleybol: "Voleybol Sahasi",
										};
										return (
											<div key={index} className="flex items-center gap-2">
												<CheckCircle className="h-4 w-4 text-green-600" />
												<span className="text-sm">{featureLabels[feature] || feature}</span>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					)}

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
									<a href={realEstateData.maps_url} target="_blank" rel="noopener noreferrer">
										<MapPin className="h-4 w-4 mr-2" />
										Haritada Goruntule
									</a>
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Satis Durumu - Sadece konut tipleri icin */}
			{isResidential && realEstateData.sold_percentage && (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-semibold">Satis Durumu</h3>
							<span className="text-2xl font-bold text-blue-600">{realEstateData.sold_percentage}%</span>
						</div>
						<Progress value={realEstateData.sold_percentage} className="h-3" />
						<p className="text-sm text-gray-500 mt-2">Projenin {realEstateData.sold_percentage}%'i satilmistir</p>
					</CardContent>
				</Card>
			)}

			{/* Gelistiriciler */}
			{realEstateData.owners && realEstateData.owners.length > 0 && (
				<div className="text-center py-4">
					<p className="text-sm text-gray-500 mb-3">Proje Gelistiricileri</p>
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
