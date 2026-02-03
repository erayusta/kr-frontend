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
	Percent,
	Clock,
	Globe,
	Dumbbell,
	Waves,
	Baby,
	Film,
	PartyPopper,
	ShoppingCart,
	Utensils,
	Footprints,
	CircleDot,
	Star,
	TrendingUp,
	BadgeCheck,
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

	// Isitma sistemi cevirisi
	const getHeatingLabel = (heating) => {
		const heatingTypes = {
			merkezi: "Merkezi Sistem",
			kombi: "Kombi",
			yerden: "Yerden Isitma",
			klima: "Klima",
			soba: "Soba",
			yok: "Yok",
		};
		return heatingTypes[heating] || heating;
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

	// Teslim durumu cevirisi
	const getDeliveryLabel = (delivery) => {
		const deliveryTypes = {
			daire_teslimati: "Daire Teslimatı",
			anahtar_teslimi: "Anahtar Teslimi",
			teslimata_hazir: "Teslimata Hazır",
			ciplak_daire: "Çıplak Daire",
			asamali_teslimat: "Aşamalı Teslimat",
			pesin_veya_kredili: "Peşin veya Kredili Ödeme",
		};
		return deliveryTypes[delivery] || delivery;
	};

	// Feature icon ve label mapping
	const featureConfig = {
		guvenlik: { icon: Shield, label: "7/24 Guvenlik", color: "text-blue-600", bg: "bg-blue-50" },
		acik_otopark: { icon: Car, label: "Acik Otopark", color: "text-green-600", bg: "bg-green-50" },
		kapali_otopark: { icon: Car, label: "Kapali Otopark", color: "text-green-600", bg: "bg-green-50" },
		yuzme_havuzu: { icon: Waves, label: "Yuzme Havuzu", color: "text-cyan-600", bg: "bg-cyan-50" },
		fitness: { icon: Dumbbell, label: "Fitness Salonu", color: "text-orange-600", bg: "bg-orange-50" },
		spa: { icon: Droplets, label: "SPA", color: "text-purple-600", bg: "bg-purple-50" },
		sauna: { icon: Thermometer, label: "Sauna", color: "text-red-600", bg: "bg-red-50" },
		hamam: { icon: Droplets, label: "Turk Hamami", color: "text-amber-600", bg: "bg-amber-50" },
		cocuk_oyun_alani: { icon: Baby, label: "Cocuk Oyun Alani", color: "text-pink-600", bg: "bg-pink-50" },
		kres: { icon: Baby, label: "Kres", color: "text-pink-600", bg: "bg-pink-50" },
		toplanti_salonu: { icon: Users, label: "Toplanti Salonu", color: "text-indigo-600", bg: "bg-indigo-50" },
		sinema: { icon: Film, label: "Sinema Salonu", color: "text-gray-600", bg: "bg-gray-50" },
		parti_alani: { icon: PartyPopper, label: "Parti Alani", color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
		market: { icon: ShoppingCart, label: "Market", color: "text-emerald-600", bg: "bg-emerald-50" },
		kafe: { icon: Utensils, label: "Kafe/Restaurant", color: "text-amber-600", bg: "bg-amber-50" },
		yuruyus_alani: { icon: Footprints, label: "Yuruyus Alani", color: "text-lime-600", bg: "bg-lime-50" },
		basketbol: { icon: CircleDot, label: "Basketbol Sahasi", color: "text-orange-600", bg: "bg-orange-50" },
		tenis: { icon: CircleDot, label: "Tenis Kortu", color: "text-green-600", bg: "bg-green-50" },
		voleybol: { icon: CircleDot, label: "Voleybol Sahasi", color: "text-yellow-600", bg: "bg-yellow-50" },
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

	// Fiyat araligi hesapla
	const getPriceRange = () => {
		if (!realEstateData.price_plans || realEstateData.price_plans.length === 0) return null;
		const prices = realEstateData.price_plans.map(p => p.price).filter(Boolean);
		if (prices.length === 0) return null;
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		return { min, max, same: min === max };
	};

	const priceRange = getPriceRange();

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

	// Konut ozellikleri renderla (Daire, Villa, Rezidans) - YENI TASARIM
	const renderResidentialFeatures = () => (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				{/* Baslik */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
					<h3 className="font-semibold text-lg text-white flex items-center gap-2">
						<Building className="h-5 w-5" />
						Proje Ozellikleri
					</h3>
				</div>

				<div className="p-6">
					{/* Ana Ozellikler Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						{/* Toplam Unite */}
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
							<div className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
								<Building className="h-6 w-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-blue-700">{realEstateData.number_of_units || "-"}</p>
							<p className="text-xs text-blue-600 font-medium">Toplam Unite</p>
						</div>

						{/* Kat Sayisi */}
						<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
							<div className="w-12 h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
								<Layers className="h-6 w-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-green-700">{realEstateData.floor_count || "-"}</p>
							<p className="text-xs text-green-600 font-medium">Kat Sayisi</p>
						</div>

						{/* Teslim Tarihi */}
						<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
							<div className="w-12 h-12 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center">
								<Calendar className="h-6 w-6 text-white" />
							</div>
							<p className="text-lg font-bold text-orange-700">{formatDate(realEstateData.delivery_date)}</p>
							<p className="text-xs text-orange-600 font-medium">Teslim Tarihi</p>
						</div>

						{/* Satis Yuzdesi */}
						{realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined && (
							<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
								<div className="w-12 h-12 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center">
									<Percent className="h-6 w-6 text-white" />
								</div>
								<p className="text-2xl font-bold text-purple-700">%{realEstateData.sold_percentage}</p>
								<p className="text-xs text-purple-600 font-medium">Satildi</p>
							</div>
						)}
					</div>

					{/* Detayli Ozellikler */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						{/* Teslim Durumu */}
						{realEstateData.unit_delivery && (
							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<div className="p-2 bg-indigo-100 rounded-lg">
									<Clock className="h-5 w-5 text-indigo-600" />
								</div>
								<div>
									<p className="text-xs text-gray-500">Teslim Durumu</p>
									<p className="font-semibold text-gray-800">{getDeliveryLabel(realEstateData.unit_delivery)}</p>
								</div>
							</div>
						)}

						{/* Isitma */}
						{realEstateData.heating && (
							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<div className="p-2 bg-red-100 rounded-lg">
									<Thermometer className="h-5 w-5 text-red-600" />
								</div>
								<div>
									<p className="text-xs text-gray-500">Isitma Sistemi</p>
									<p className="font-semibold text-gray-800">{getHeatingLabel(realEstateData.heating)}</p>
								</div>
							</div>
						)}

						{/* Ulke */}
						{realEstateData.country && (
							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<div className="p-2 bg-cyan-100 rounded-lg">
									<Globe className="h-5 w-5 text-cyan-600" />
								</div>
								<div>
									<p className="text-xs text-gray-500">Ulke</p>
									<p className="font-semibold text-gray-800">{realEstateData.country}</p>
								</div>
							</div>
						)}

						{/* Konum */}
						<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
							<div className="p-2 bg-emerald-100 rounded-lg">
								<MapPin className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Konum</p>
								<p className="font-semibold text-gray-800">
									{realEstateData.district}, {realEstateData.city}
								</p>
							</div>
						</div>
					</div>

					{/* Asansor ve Otopark */}
					<div className="flex gap-4 mb-6">
						<div className={cn(
							"flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all",
							realEstateData.elevator
								? "bg-green-50 border-green-200"
								: "bg-gray-50 border-gray-200"
						)}>
							<Building2 className={cn("h-6 w-6", realEstateData.elevator ? "text-green-600" : "text-gray-400")} />
							<div>
								<p className="font-semibold">{realEstateData.elevator ? "Asansor Mevcut" : "Asansor Yok"}</p>
								{realEstateData.elevator && <p className="text-xs text-green-600">Tum bloklarda</p>}
							</div>
							{realEstateData.elevator && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
						</div>

						<div className={cn(
							"flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all",
							realEstateData.parking
								? "bg-green-50 border-green-200"
								: "bg-gray-50 border-gray-200"
						)}>
							<Car className={cn("h-6 w-6", realEstateData.parking ? "text-green-600" : "text-gray-400")} />
							<div>
								<p className="font-semibold">{realEstateData.parking ? "Otopark Mevcut" : "Otopark Yok"}</p>
								{realEstateData.parking && <p className="text-xs text-green-600">Acik/Kapali</p>}
							</div>
							{realEstateData.parking && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
						</div>
					</div>

					{/* Satis Durumu Progress */}
					{realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined && (
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<TrendingUp className="h-4 w-4 text-blue-600" />
									Satis Durumu
								</span>
								<span className="text-lg font-bold text-blue-600">%{realEstateData.sold_percentage}</span>
							</div>
							<Progress value={realEstateData.sold_percentage} className="h-3" />
							<p className="text-xs text-gray-500 mt-2">
								Projenin %{realEstateData.sold_percentage}'i satilmistir.
								{realEstateData.sold_percentage >= 80 && " Son uniteler kaldi!"}
								{realEstateData.sold_percentage >= 50 && realEstateData.sold_percentage < 80 && " Hizla tukeniy!"}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);

	// Sosyal Olanaklar/Ozellikler renderla
	const renderFeaturesGrid = () => {
		if (!realEstateData.features || realEstateData.features.length === 0) return null;

		return (
			<Card className="overflow-hidden">
				<CardContent className="p-0">
					<div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
						<h3 className="font-semibold text-lg text-white flex items-center gap-2">
							<Star className="h-5 w-5" />
							Sosyal Olanaklar ve Ozellikler
						</h3>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{realEstateData.features.map((feature, index) => {
								const config = featureConfig[feature] || {
									icon: CheckCircle,
									label: feature,
									color: "text-gray-600",
									bg: "bg-gray-50"
								};
								const IconComponent = config.icon;

								return (
									<div
										key={index}
										className={cn(
											"flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md",
											config.bg,
											"border-transparent"
										)}
									>
										<div className={cn("p-2 rounded-lg bg-white shadow-sm")}>
											<IconComponent className={cn("h-5 w-5", config.color)} />
										</div>
										<span className="text-sm font-medium text-gray-700">{config.label}</span>
									</div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

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

	// Fiyat Planlari Karti (Konut tipleri icin) - YENI TASARIM
	const renderPricePlansCard = () => {
		if (!realEstateData.price_plans || realEstateData.price_plans.length === 0) return null;

		return (
			<Card className="overflow-hidden">
				<CardContent className="p-0">
					{/* Baslik ve Fiyat Araligi */}
					<div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
						<h3 className="font-semibold text-lg text-white flex items-center gap-2">
							<Home className="h-5 w-5" />
							Daire Tipleri ve Fiyatlar
						</h3>
						{priceRange && (
							<p className="text-orange-100 text-sm mt-1">
								{priceRange.same
									? `Baslangic: ${formatPrice(priceRange.min)}`
									: `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
								}
							</p>
						)}
					</div>

					<div className="p-4 space-y-3">
						{realEstateData.price_plans.map((plan, index) => (
							<button
								key={index}
								onClick={() => setSelectedPlanIndex(index)}
								className={cn(
									"w-full p-4 rounded-xl border-2 text-left transition-all",
									selectedPlanIndex === index
										? "border-orange-500 bg-orange-50 shadow-md"
										: "border-gray-200 bg-white hover:border-orange-300 hover:shadow"
								)}
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold text-gray-800">
											{plan.type || `${plan.room_count || ""}+1`}
										</span>
										{selectedPlanIndex === index && (
											<BadgeCheck className="h-5 w-5 text-orange-500" />
										)}
									</div>
									{plan.area && (
										<Badge variant="secondary" className="bg-gray-100">
											{plan.area} m²
										</Badge>
									)}
								</div>

								{/* Fiyat */}
								{plan.price && (
									<div className="text-2xl font-bold text-orange-600 mb-2">
										{formatPrice(plan.price)}
									</div>
								)}

								{/* Odeme Detaylari */}
								<div className="grid grid-cols-2 gap-2 text-sm">
									{plan.down_payment && (
										<div className="flex items-center gap-1 text-gray-600">
											<CreditCard className="h-3 w-3" />
											<span>Pesinat: {formatPrice(plan.down_payment)}</span>
										</div>
									)}
									{plan.monthly_payment && (
										<div className="flex items-center gap-1 text-gray-600">
											<Calendar className="h-3 w-3" />
											<span>Aylik: {formatPrice(plan.monthly_payment)}</span>
										</div>
									)}
								</div>

								{/* Oda Bilgileri */}
								<div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
									{plan.bedroom_count && (
										<div className="flex items-center gap-1 text-gray-600">
											<Bed className="h-4 w-4" />
											<span className="text-sm">{plan.bedroom_count} Yatak</span>
										</div>
									)}
									{plan.bathroom_count && (
										<div className="flex items-center gap-1 text-gray-600">
											<Bath className="h-4 w-4" />
											<span className="text-sm">{plan.bathroom_count} Banyo</span>
										</div>
									)}
									{plan.room_count && (
										<div className="flex items-center gap-1 text-gray-600">
											<DoorOpen className="h-4 w-4" />
											<span className="text-sm">{plan.room_count}</span>
										</div>
									)}
								</div>

								{/* Aciklama */}
								{plan.description && (
									<p className="text-xs text-gray-500 mt-2 line-clamp-2">{plan.description}</p>
								)}
							</button>
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	// Proje Gelistiricileri
	const renderOwners = () => {
		if (!realEstateData.owners || realEstateData.owners.length === 0) return null;

		return (
			<Card>
				<CardContent className="p-6">
					<h4 className="font-semibold mb-4 flex items-center gap-2">
						<Users className="h-5 w-5 text-gray-600" />
						Proje Gelistiricileri
					</h4>
					<div className="flex flex-wrap gap-2">
						{realEstateData.owners.map((owner, index) => (
							<Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
								{owner}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="w-full space-y-6">
			{/* Baslik ve Konum - YENI TASARIM */}
			<div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl">
				<div className="flex items-start justify-between">
					<div className="space-y-3">
						<Badge className={cn("text-white px-4 py-1", getPropertyTypeBadgeColor(propertyType))}>
							{getPropertyTypeLabel(propertyType)}
						</Badge>
						<h1 className="text-3xl md:text-4xl font-bold text-white">{realEstateData.name}</h1>
						<div className="flex items-center gap-4 text-slate-300">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<span>
									{realEstateData.city && realEstateData.district
										? `${realEstateData.district}, ${realEstateData.city}`
										: realEstateData.city || "Konum bilgisi yok"}
								</span>
							</div>
							{realEstateData.country && realEstateData.country !== "Turkiye" && (
								<div className="flex items-center gap-2">
									<Globe className="h-4 w-4" />
									<span>{realEstateData.country}</span>
								</div>
							)}
						</div>
					</div>
					<div className="text-right space-y-2">
						{isResidential && realEstateData.delivery_date && (
							<div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
								<p className="text-xs text-slate-400">Teslim Tarihi</p>
								<p className="text-white font-semibold">{formatDate(realEstateData.delivery_date)}</p>
							</div>
						)}
						{priceRange && (
							<div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg px-4 py-2">
								<p className="text-xs text-orange-100">Baslangic Fiyat</p>
								<p className="text-white font-bold text-lg">{formatPrice(priceRange.min)}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Ana Icerik Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sol: Gorsel Galerisi (2 kolon) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Ana Gorsel */}
					<Card className="overflow-hidden shadow-lg">
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
											className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
										>
											<ChevronLeft className="h-6 w-6" />
										</button>
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
										>
											<ChevronRight className="h-6 w-6" />
										</button>
									</>
								)}

								<div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
									{activeImageIndex + 1} / {images.length}
								</div>

								{/* Property Type Badge on Image */}
								<div className="absolute top-4 left-4">
									<Badge className={cn("text-white px-4 py-2 text-sm shadow-lg", getPropertyTypeBadgeColor(propertyType))}>
										{getPropertyTypeLabel(propertyType)}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Kucuk Gorsel Galerisi */}
					{images.length > 1 && (
						<div className="grid grid-cols-4 md:grid-cols-6 gap-2">
							{images.slice(0, 6).map((image, index) => (
								<button
									key={index}
									onClick={() => setActiveImageIndex(index)}
									className={cn(
										"relative rounded-lg overflow-hidden border-2 transition-all aspect-square",
										activeImageIndex === index ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300"
									)}
								>
									<img src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
									{index === 5 && images.length > 6 && (
										<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
											<span className="text-white font-bold">+{images.length - 6}</span>
										</div>
									)}
								</button>
							))}
						</div>
					)}

					{/* Tip bazli ozellikler */}
					{isLand && renderLandFeatures()}
					{isShop && renderShopFeatures()}
					{isOffice && renderOfficeFeatures()}
					{isResidential && renderResidentialFeatures()}

					{/* Sosyal Olanaklar - Sadece konut tipleri icin */}
					{isResidential && renderFeaturesGrid()}

					{/* Proje Aciklamasi */}
					{campaign.description && (
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
									<FileText className="h-5 w-5 text-gray-600" />
									Kampanya Detaylari
								</h3>
								<p className="text-gray-700 leading-relaxed">{campaign.description}</p>
							</CardContent>
						</Card>
					)}

					{/* Proje Gelistiricileri */}
					{renderOwners()}
				</div>

				{/* Sag: Fiyat ve Iletisim */}
				<div className="space-y-4">
					{/* Arsa, Dukkan, Ofis icin fiyat karti */}
					{(isLand || isShop || isOffice) && renderPriceCard()}

					{/* Konut tipleri icin Fiyat Planlari */}
					{isResidential && renderPricePlansCard()}

					{/* Contact Form */}
					<CampaignLeadForm
						campaign={campaign}
						brandLogo={campaign.brands?.[0]?.logo}
						brandName={campaign.brands?.[0]?.name}
						variant="product"
					/>

					{/* Konum */}
					{realEstateData.maps_url && (
						<Card className="overflow-hidden">
							<CardContent className="p-0">
								<div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
									<h4 className="font-semibold text-white flex items-center gap-2">
										<MapPin className="h-5 w-5" />
										Proje Konumu
									</h4>
								</div>
								<div className="p-4">
									<p className="text-sm text-gray-600 mb-3">
										{realEstateData.district}, {realEstateData.city}
										{realEstateData.country && realEstateData.country !== "Turkiye" && `, ${realEstateData.country}`}
									</p>
									<Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
										<a href={realEstateData.maps_url} target="_blank" rel="noopener noreferrer">
											<MapPin className="h-4 w-4 mr-2" />
											Haritada Goruntule
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
