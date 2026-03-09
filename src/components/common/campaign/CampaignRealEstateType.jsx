import {
	Bath,
	Bed,
	Building,
	Building2,
	Calendar,
	Car,
	CheckCircle,
	Droplets,
	ExternalLink,
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
	ImageOff,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IMAGE_BASE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";


export default function CampaignRealEstateType({ campaign, htmlContent }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
	const contentRef = useRef(null);

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
		if (!image) return null;
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/real-estates/${image}`;
	};

	// Google Maps URL'inden embed URL'i olustur
	const mapEmbedUrl = useMemo(() => {
		const url = realEstateData.maps_url;
		if (!url) return null;

		// Zaten embed URL ise direkt kullan
		if (url.includes("/embed")) return url;

		// @lat,lng veya !3d...!4d... koordinatlarini yakala
		const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
		if (atMatch) {
			return `https://www.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=15&output=embed`;
		}
		const dMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
		if (dMatch) {
			return `https://www.google.com/maps?q=${dMatch[1]},${dMatch[2]}&z=15&output=embed`;
		}

		// q= parametresini yakala
		const qMatch = url.match(/[?&]q=([^&]+)/);
		if (qMatch) {
			return `https://www.google.com/maps?q=${qMatch[1]}&z=15&output=embed`;
		}

		// Fallback: konum bilgisiyle embed
		const locationQuery = [realEstateData.district, realEstateData.city, realEstateData.country]
			.filter(Boolean)
			.join(", ");
		if (locationQuery) {
			return `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=15&output=embed`;
		}

		return null;
	}, [realEstateData.maps_url, realEstateData.district, realEstateData.city, realEstateData.country]);

	const images = realEstateData.images || [];

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

	// Hizli ozellikler listesi olustur (galeri altinda gosterilecek)
	const getQuickStats = () => {
		const stats = [];

		if (realEstateData.number_of_units) {
			stats.push({ name: "Toplam Unite", value: realEstateData.number_of_units });
		}
		if (realEstateData.floor_count) {
			stats.push({ name: "Kat Sayisi", value: realEstateData.floor_count });
		}
		if (realEstateData.delivery_date) {
			stats.push({ name: "Teslim", value: formatDate(realEstateData.delivery_date) });
		}
		if (realEstateData.heating) {
			stats.push({ name: "Isitma", value: getHeatingLabel(realEstateData.heating) });
		}
		if (realEstateData.elevator !== undefined) {
			stats.push({ name: "Asansor", value: realEstateData.elevator ? "Mevcut" : "Yok" });
		}
		if (realEstateData.parking !== undefined) {
			stats.push({ name: "Otopark", value: realEstateData.parking ? "Mevcut" : "Yok" });
		}
		if (realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined) {
			stats.push({ name: "Satis", value: `%${realEstateData.sold_percentage}` });
		}
		if (realEstateData.unit_delivery) {
			stats.push({ name: "Teslim Durumu", value: getDeliveryLabel(realEstateData.unit_delivery) });
		}

		// Arsa icin
		if (typeData.land_area) {
			stats.push({ name: "Arsa Alani", value: `${typeData.land_area} m²` });
		}
		if (typeData.zoning_status) {
			stats.push({ name: "Imar", value: getZoningLabel(typeData.zoning_status) });
		}

		// Dukkan/Ofis icin
		if (typeData.shop_area) {
			stats.push({ name: "Dukkan Alani", value: `${typeData.shop_area} m²` });
		}
		if (typeData.office_area) {
			stats.push({ name: "Ofis Alani", value: `${typeData.office_area} m²` });
		}

		return stats.slice(0, 8);
	};

	const quickStats = getQuickStats();

	// Fix images in HTML content
	useEffect(() => {
		if (contentRef.current) {
			const imgs = contentRef.current.querySelectorAll("img");
			imgs.forEach((img) => {
				img.onerror = function () {
					this.style.display = "none";
				};
			});
		}
	}, [htmlContent]);

	return (
		<div className="flex flex-col w-full gap-6">

			{/* ===== ANA KART: Float Layout — araç kampanya tipi referans ===== */}
			<Card className="overflow-hidden border border-gray-200 bg-[#fffaf4]">
				<CardContent className="p-5 lg:p-6">

					{/* SAĞ PANEL: Galeri + Hızlı Özellikler — float ile sağa yaslanır */}
					<div className="lg:float-right lg:w-5/12 lg:ml-6 mb-5 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 border border-gray-200">
						{/* Ana Gorsel */}
						<div className="relative aspect-[4/3] overflow-hidden">
							{images.length > 0 && getImageUrl(images[activeImageIndex]) ? (
								<>
									{/* biome-ignore lint/a11y/useAltText: dynamic real estate image */}
									<img
										src={getImageUrl(images[activeImageIndex])}
										alt={`${realEstateData.name} - ${activeImageIndex + 1}`}
										className="w-full h-full object-cover"
										loading="lazy"
										onError={(e) => {
											e.target.onerror = null;
											e.target.style.display = "none";
										}}
									/>
									{images.length > 1 && (
										<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
											{activeImageIndex + 1} / {images.length}
										</div>
									)}
								</>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									<ImageOff className="w-12 h-12" />
								</div>
							)}
						</div>

						{/* Thumbnail Galerisi */}
						{images.length > 1 && (
							<div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto border-t border-gray-200/60">
								{images.map((image, index) => (
									<button
										key={`img-${index}`}
										onClick={() => setActiveImageIndex(index)}
										className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
											activeImageIndex === index
												? "border-orange-500 shadow-md"
												: "border-gray-200 hover:border-orange-300"
										}`}
									>
										{/* biome-ignore lint/a11y/useAltText: thumbnail */}
										<img
											src={getImageUrl(image)}
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
							</div>
						)}

						{/* Hizli Ozellikler — galeri altinda, ayni blokta (araç teknik özellikler gibi) */}
						{quickStats.length > 0 && (
							<div className="px-3 pb-3 pt-1 border-t border-gray-200/60">
								<h3 className="font-semibold text-[#1C2B4A] mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
									<Building className="w-3.5 h-3.5 text-orange-500" />
									Proje Bilgileri
								</h3>
								<div className="grid grid-cols-2 gap-1.5">
									{quickStats.map((stat, index) => (
										<div
											key={index}
											className="flex items-center justify-between gap-1 px-2.5 py-1.5 bg-white/80 rounded-md text-[11px]"
										>
											<span className="text-gray-500 truncate">{stat.name}</span>
											<span className="font-bold text-orange-700 whitespace-nowrap bg-orange-50 px-1.5 py-0.5 rounded">
												{stat.value}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Konum — galeri panelinin en altı */}
						{realEstateData.maps_url && (
							<div className="px-3 pb-3 pt-1 border-t border-gray-200/60">
								<a
									href={realEstateData.maps_url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium w-full justify-center"
								>
									<MapPin className="w-3.5 h-3.5" />
									Haritada Görüntüle
									<ExternalLink className="w-3 h-3 ml-auto opacity-70" />
								</a>
								{(realEstateData.district || realEstateData.city) && (
									<p className="text-[11px] text-gray-500 text-center mt-1.5">
										{[realEstateData.district, realEstateData.city].filter(Boolean).join(", ")}
									</p>
								)}
							</div>
						)}
					</div>

					{/* İÇERİK: Başlık + Konum + Fiyat + HTML — float'ın yanında başlar, uzunsa altına sarar */}
					<div>
						<div className="flex items-center gap-2 mb-2">
							<Badge className="bg-orange-500 text-white px-3 py-0.5 text-xs">
								{getPropertyTypeLabel(propertyType)}
							</Badge>
							{realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined && realEstateData.sold_percentage >= 80 && (
								<Badge className="bg-red-500 text-white px-3 py-0.5 text-xs">
									Son Uniteler
								</Badge>
							)}
						</div>

						<h2 className="text-2xl font-bold text-[#1C2B4A] mb-1">
							{realEstateData.name}
						</h2>

						{/* Konum */}
						<div className="flex items-center gap-3 text-gray-500 text-sm mb-3">
							<div className="flex items-center gap-1">
								<MapPin className="h-3.5 w-3.5 text-orange-500" />
								<span>
									{realEstateData.city && realEstateData.district
										? `${realEstateData.district}, ${realEstateData.city}`
										: realEstateData.city || "Konum bilgisi yok"}
								</span>
							</div>
							{realEstateData.country && realEstateData.country !== "Turkiye" && (
								<div className="flex items-center gap-1">
									<Globe className="h-3.5 w-3.5" />
									<span>{realEstateData.country}</span>
								</div>
							)}
						</div>

						{/* Fiyat Badge */}
						{priceRange && (
							<div className="mt-2 mb-4 inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
								{priceRange.same
									? formatPrice(priceRange.min)
									: `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
								}
							</div>
						)}

						{/* Fiyat Bilgisi - Arsa/Dukkan/Ofis icin */}
						{!priceRange && typeData.price && (
							<div className="mt-2 mb-4 inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
								{formatPrice(typeData.price, typeData.price_currency)}
							</div>
						)}

						{/* Ek fiyat bilgileri */}
						{typeData.price_per_sqm && (
							<p className="text-sm text-gray-600 mb-3">
								m² Fiyati: <span className="font-semibold text-orange-700">{formatPrice(typeData.price_per_sqm, typeData.price_currency)}</span>
							</p>
						)}

						{/* Badges */}
						{(typeData.is_negotiable || typeData.credit_eligible) && (
							<div className="flex gap-2 mb-4">
								{typeData.is_negotiable && (
									<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
										Pazarlik Payi Var
									</Badge>
								)}
								{typeData.credit_eligible && (
									<Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
										Krediye Uygun
									</Badge>
								)}
							</div>
						)}

						{/* Proje Gelistiricileri — icerik akisi icinde */}
						{realEstateData.owners && realEstateData.owners.length > 0 && (
							<div className="flex flex-wrap items-center gap-2 mb-4">
								<Users className="h-4 w-4 text-gray-400" />
								{realEstateData.owners.map((owner, index) => (
									<Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
										{owner}
									</Badge>
								))}
							</div>
						)}

						{htmlContent && (
							<div
								ref={contentRef}
								className="prose prose-sm prose-gray max-w-none campaign-content"
								dangerouslySetInnerHTML={{ __html: htmlContent }}
							/>
						)}
					</div>

					{/* Float clear */}
					<div className="clear-both" />
				</CardContent>
			</Card>

			{/* ===== DAİRE TİPLERİ VE FİYATLAR (Konut tipleri icin) ===== */}
			{isResidential && realEstateData.price_plans && realEstateData.price_plans.length > 0 && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-gray-800 flex items-center gap-2">
								<Home className="w-5 h-5 text-orange-500" />
								Daire Tipleri ve Fiyatlar
							</h3>
							{priceRange && (
								<Badge variant="secondary" className="bg-orange-50 text-orange-700">
									{priceRange.same
										? formatPrice(priceRange.min)
										: `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
									}
								</Badge>
							)}
						</div>

						<div className="space-y-3">
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
									<div className="flex items-center justify-between mb-2">
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

									{plan.price && (
										<div className="text-xl font-bold text-orange-600 mb-2">
											{formatPrice(plan.price)}
										</div>
									)}

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

									<div className="flex gap-4 mt-2 pt-2 border-t border-gray-100">
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

									{plan.description && (
										<p className="text-xs text-gray-500 mt-2 line-clamp-2">{plan.description}</p>
									)}
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* ===== TİP BAZLI DETAYLI ÖZELLİKLER ===== */}
			{isResidential && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
							<Building className="w-5 h-5 text-orange-500" />
							Proje Ozellikleri
						</h3>

						{/* Ana Ozellikler Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
							{realEstateData.number_of_units && (
								<div className="bg-orange-50 rounded-xl p-3 text-center">
									<Building className="h-5 w-5 text-orange-500 mx-auto mb-1" />
									<p className="text-lg font-bold text-orange-700">{realEstateData.number_of_units}</p>
									<p className="text-[11px] text-orange-600">Toplam Unite</p>
								</div>
							)}
							{realEstateData.floor_count && (
								<div className="bg-orange-50 rounded-xl p-3 text-center">
									<Layers className="h-5 w-5 text-orange-500 mx-auto mb-1" />
									<p className="text-lg font-bold text-orange-700">{realEstateData.floor_count}</p>
									<p className="text-[11px] text-orange-600">Kat Sayisi</p>
								</div>
							)}
							{realEstateData.delivery_date && (
								<div className="bg-orange-50 rounded-xl p-3 text-center">
									<Calendar className="h-5 w-5 text-orange-500 mx-auto mb-1" />
									<p className="text-sm font-bold text-orange-700">{formatDate(realEstateData.delivery_date)}</p>
									<p className="text-[11px] text-orange-600">Teslim Tarihi</p>
								</div>
							)}
							{realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined && (
								<div className="bg-orange-50 rounded-xl p-3 text-center">
									<Percent className="h-5 w-5 text-orange-500 mx-auto mb-1" />
									<p className="text-lg font-bold text-orange-700">%{realEstateData.sold_percentage}</p>
									<p className="text-[11px] text-orange-600">Satildi</p>
								</div>
							)}
						</div>

						{/* Detayli Ozellikler */}
						<div className="grid grid-cols-2 gap-3 mb-4">
							{realEstateData.unit_delivery && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Clock className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Teslim Durumu</p>
										<p className="text-sm font-semibold text-gray-800">{getDeliveryLabel(realEstateData.unit_delivery)}</p>
									</div>
								</div>
							)}
							{realEstateData.heating && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Thermometer className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Isitma Sistemi</p>
										<p className="text-sm font-semibold text-gray-800">{getHeatingLabel(realEstateData.heating)}</p>
									</div>
								</div>
							)}
							{realEstateData.country && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Globe className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Ulke</p>
										<p className="text-sm font-semibold text-gray-800">{realEstateData.country}</p>
									</div>
								</div>
							)}
							<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
								<MapPin className="h-4 w-4 text-orange-500" />
								<div>
									<p className="text-[11px] text-gray-500">Konum</p>
									<p className="text-sm font-semibold text-gray-800">
										{realEstateData.district}, {realEstateData.city}
									</p>
								</div>
							</div>
						</div>

						{/* Asansor ve Otopark */}
						<div className="flex gap-3">
							<div className={cn(
								"flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
								realEstateData.elevator
									? "bg-green-50 border-green-200"
									: "bg-gray-50 border-gray-200"
							)}>
								<Building2 className={cn("h-5 w-5", realEstateData.elevator ? "text-green-600" : "text-gray-400")} />
								<span className="font-medium text-sm">{realEstateData.elevator ? "Asansor Mevcut" : "Asansor Yok"}</span>
								{realEstateData.elevator && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
							</div>
							<div className={cn(
								"flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
								realEstateData.parking
									? "bg-green-50 border-green-200"
									: "bg-gray-50 border-gray-200"
							)}>
								<Car className={cn("h-5 w-5", realEstateData.parking ? "text-green-600" : "text-gray-400")} />
								<span className="font-medium text-sm">{realEstateData.parking ? "Otopark Mevcut" : "Otopark Yok"}</span>
								{realEstateData.parking && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
							</div>
						</div>

						{/* Satis Durumu Progress */}
						{realEstateData.sold_percentage !== null && realEstateData.sold_percentage !== undefined && (
							<div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mt-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<TrendingUp className="h-4 w-4 text-orange-600" />
										Satis Durumu
									</span>
									<span className="text-lg font-bold text-orange-600">%{realEstateData.sold_percentage}</span>
								</div>
								<Progress value={realEstateData.sold_percentage} className="h-3" />
								<p className="text-xs text-gray-500 mt-2">
									Projenin %{realEstateData.sold_percentage}&apos;i satilmistir.
									{realEstateData.sold_percentage >= 80 && " Son uniteler kaldi!"}
									{realEstateData.sold_percentage >= 50 && realEstateData.sold_percentage < 80 && " Hizla tukeniyor!"}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Arsa Ozellikleri */}
			{isLand && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
							<TreeDeciduous className="w-5 h-5 text-orange-500" />
							Arsa Ozellikleri
						</h3>
						<div className="grid grid-cols-2 gap-3">
							{typeData.land_area && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Ruler className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Arsa Alani</p>
										<p className="text-sm font-semibold">{typeData.land_area} m²</p>
									</div>
								</div>
							)}
							{typeData.zoning_status && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<FileText className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Imar Durumu</p>
										<p className="text-sm font-semibold">{getZoningLabel(typeData.zoning_status)}</p>
									</div>
								</div>
							)}
							{typeData.parcel_no && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<MapPin className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Ada/Parsel</p>
										<p className="text-sm font-semibold">{typeData.parcel_no}</p>
									</div>
								</div>
							)}
							{typeData.gabari && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Building className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Gabari</p>
										<p className="text-sm font-semibold">{typeData.gabari}</p>
									</div>
								</div>
							)}
							{typeData.taks && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Layers className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">TAKS</p>
										<p className="text-sm font-semibold">{typeData.taks}</p>
									</div>
								</div>
							)}
							{typeData.kaks && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Layers className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">KAKS</p>
										<p className="text-sm font-semibold">{typeData.kaks}</p>
									</div>
								</div>
							)}
							{typeData.road_frontage && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Ruler className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Yola Cephe</p>
										<p className="text-sm font-semibold">{typeData.road_frontage} m</p>
									</div>
								</div>
							)}
							{typeData.deed_status && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<FileText className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Tapu Durumu</p>
										<p className="text-sm font-semibold">{getDeedLabel(typeData.deed_status)}</p>
									</div>
								</div>
							)}
						</div>

						{/* Altyapi Durumu */}
						<div className="mt-4 pt-4 border-t">
							<h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide mb-3">Altyapi Durumu</h4>
							<div className="grid grid-cols-4 gap-2">
								{[
									{ key: "has_electricity", label: "Elektrik", icon: Lightbulb },
									{ key: "has_water", label: "Su", icon: Droplets },
									{ key: "has_natural_gas", label: "Dogalgaz", icon: Flame },
									{ key: "has_sewage", label: "Kanalizasyon", icon: Droplets },
								].map((item) => (
									<div key={item.key} className={cn("flex flex-col items-center p-2.5 rounded-lg", typeData[item.key] ? "bg-green-50" : "bg-gray-50")}>
										<item.icon className={cn("h-4 w-4 mb-1", typeData[item.key] ? "text-green-600" : "text-gray-400")} />
										<span className="text-[11px]">{item.label}</span>
										<span className={cn("text-[11px] font-medium", typeData[item.key] ? "text-green-600" : "text-gray-400")}>
											{typeData[item.key] ? "Var" : "Yok"}
										</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Dukkan Ozellikleri */}
			{isShop && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
							<ShoppingBag className="w-5 h-5 text-orange-500" />
							Dukkan Ozellikleri
						</h3>
						<div className="grid grid-cols-2 gap-3">
							{typeData.shop_area && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Ruler className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Dukkan Alani</p>
										<p className="text-sm font-semibold">{typeData.shop_area} m²</p>
									</div>
								</div>
							)}
							{typeData.frontage_width && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Ruler className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Cephe Genisligi</p>
										<p className="text-sm font-semibold">{typeData.frontage_width} m</p>
									</div>
								</div>
							)}
							{typeData.floor_location && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Layers className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Bulundugu Kat</p>
										<p className="text-sm font-semibold">{getFloorLabel(typeData.floor_location)}</p>
									</div>
								</div>
							)}
							{typeData.monthly_dues && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<CreditCard className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Aylik Aidat</p>
										<p className="text-sm font-semibold">{formatPrice(typeData.monthly_dues)}</p>
									</div>
								</div>
							)}
							{typeData.building_age && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Building className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Bina Yasi</p>
										<p className="text-sm font-semibold">{typeData.building_age} yil</p>
									</div>
								</div>
							)}
							{typeData.usage_status && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Users className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Kullanim Durumu</p>
										<p className="text-sm font-semibold">{getUsageLabel(typeData.usage_status)}</p>
									</div>
								</div>
							)}
							{realEstateData.heating && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Thermometer className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Isitma</p>
										<p className="text-sm font-semibold">{realEstateData.heating}</p>
									</div>
								</div>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide mb-3">Ozellikler</h4>
							<div className="grid grid-cols-5 gap-2">
								{[
									{ key: "has_shopwindow", label: "Vitrin", icon: DoorOpen, data: typeData },
									{ key: "has_storage", label: "Depo", icon: Warehouse, data: typeData },
									{ key: "has_wc", label: "WC", icon: Bath, data: typeData },
									{ key: "elevator", label: "Asansor", icon: Building2, data: realEstateData },
									{ key: "parking", label: "Otopark", icon: Car, data: realEstateData },
								].map((item) => (
									<div key={item.key} className={cn("flex flex-col items-center p-2.5 rounded-lg", item.data[item.key] ? "bg-orange-50" : "bg-gray-50")}>
										<item.icon className={cn("h-4 w-4 mb-1", item.data[item.key] ? "text-orange-600" : "text-gray-400")} />
										<span className="text-[11px] text-center">{item.label}</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Ofis Ozellikleri */}
			{isOffice && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
							<Briefcase className="w-5 h-5 text-orange-500" />
							Ofis Ozellikleri
						</h3>
						<div className="grid grid-cols-2 gap-3">
							{typeData.office_area && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Ruler className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Ofis Alani</p>
										<p className="text-sm font-semibold">{typeData.office_area} m²</p>
									</div>
								</div>
							)}
							{typeData.room_count && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<DoorOpen className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Oda Sayisi</p>
										<p className="text-sm font-semibold">{typeData.room_count} oda</p>
									</div>
								</div>
							)}
							{typeData.floor_location && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Layers className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Bulundugu Kat</p>
										<p className="text-sm font-semibold">{getFloorLabel(typeData.floor_location)}</p>
									</div>
								</div>
							)}
							{realEstateData.floor_count && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Building className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Bina Kat Sayisi</p>
										<p className="text-sm font-semibold">{realEstateData.floor_count} kat</p>
									</div>
								</div>
							)}
							{typeData.monthly_dues && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<CreditCard className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Aylik Aidat</p>
										<p className="text-sm font-semibold">{formatPrice(typeData.monthly_dues)}</p>
									</div>
								</div>
							)}
							{typeData.building_age && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Calendar className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Bina Yasi</p>
										<p className="text-sm font-semibold">{typeData.building_age} yil</p>
									</div>
								</div>
							)}
							{typeData.wc_count && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Bath className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">WC Sayisi</p>
										<p className="text-sm font-semibold">{typeData.wc_count} adet</p>
									</div>
								</div>
							)}
							{realEstateData.heating && (
								<div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
									<Thermometer className="h-4 w-4 text-orange-500" />
									<div>
										<p className="text-[11px] text-gray-500">Isitma</p>
										<p className="text-sm font-semibold">{realEstateData.heating}</p>
									</div>
								</div>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide mb-3">Ozellikler</h4>
							<div className="grid grid-cols-5 gap-2">
								{[
									{ key: "is_furnished", label: "Mobilyali", icon: Armchair, data: typeData },
									{ key: "has_meeting_room", label: "Toplanti", icon: Users, data: typeData },
									{ key: "has_kitchen", label: "Mutfak", icon: Coffee, data: typeData },
									{ key: "has_reception", label: "Resepsiyon", icon: DoorOpen, data: typeData },
									{ key: "has_security", label: "Guvenlik", icon: Shield, data: typeData },
								].map((item) => (
									<div key={item.key} className={cn("flex flex-col items-center p-2.5 rounded-lg", item.data[item.key] ? "bg-orange-50" : "bg-gray-50")}>
										<item.icon className={cn("h-4 w-4 mb-1", item.data[item.key] ? "text-orange-600" : "text-gray-400")} />
										<span className="text-[11px] text-center">{item.label}</span>
									</div>
								))}
							</div>
							<div className="grid grid-cols-2 gap-2 mt-2">
								<div className={cn("flex items-center justify-center gap-2 p-2.5 rounded-lg", realEstateData.elevator ? "bg-green-50" : "bg-gray-50")}>
									<Building2 className={cn("h-4 w-4", realEstateData.elevator ? "text-green-600" : "text-gray-400")} />
									<span className="text-sm">Asansor</span>
								</div>
								<div className={cn("flex items-center justify-center gap-2 p-2.5 rounded-lg", realEstateData.parking ? "bg-green-50" : "bg-gray-50")}>
									<Car className={cn("h-4 w-4", realEstateData.parking ? "text-green-600" : "text-gray-400")} />
									<span className="text-sm">Otopark</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* ===== SOSYAL OLANAKLAR (Euro NCAP benzeri kart) ===== */}
			{isResidential && realEstateData.features && realEstateData.features.length > 0 && (
				<Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-orange-500 rounded-lg">
								<Star className="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">Sosyal Olanaklar</h3>
								<p className="text-xs text-gray-500">{realEstateData.features.length} ozellik mevcut</p>
							</div>
						</div>

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
										className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur rounded-xl"
									>
										<div className="p-1.5 rounded-lg bg-white shadow-sm">
											<IconComponent className={cn("h-4 w-4", config.color)} />
										</div>
										<span className="text-sm font-medium text-gray-700">{config.label}</span>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* ===== PROJE KONUMU — Embed Harita ===== */}
			{realEstateData.maps_url && (
				<Card className="overflow-hidden border border-gray-200">
					<CardContent className="p-0">
						{/* Baslik */}
						<div className="flex items-center justify-between px-5 py-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-500 rounded-lg">
									<MapPin className="h-5 w-5 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-800">Proje Konumu</h3>
									<p className="text-xs text-gray-500">
										{[realEstateData.district, realEstateData.city].filter(Boolean).join(", ")}
										{realEstateData.country && realEstateData.country !== "Turkiye" && `, ${realEstateData.country}`}
									</p>
								</div>
							</div>
							<Button asChild variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
								<a href={realEstateData.maps_url} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="h-3.5 w-3.5 mr-1.5" />
									Google Maps
								</a>
							</Button>
						</div>

						{/* Embed Harita */}
						{mapEmbedUrl ? (
							<div className="relative w-full h-[300px] md:h-[400px] border-t border-gray-100">
								<iframe
									src={mapEmbedUrl}
									title="Proje Konumu"
									className="absolute inset-0 w-full h-full"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-[200px] bg-gray-50 border-t border-gray-100 text-gray-400">
								<MapPin className="h-8 w-8 mb-2" />
								<p className="text-sm">Harita yüklenemedi</p>
								<Button asChild variant="link" size="sm" className="mt-1 text-orange-500">
									<a href={realEstateData.maps_url} target="_blank" rel="noopener noreferrer">
										Google Maps&apos;te Aç
									</a>
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
