import {
	Check,
	Settings,
	Shield,
	TrendingUp,
	User,
	Baby,
	PersonStanding,
	ShieldCheck,
	ImageOff,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_BASE_URL, STORAGE_URL } from "@/constants/site";


// Renk gorseli yardımcıları
function useColorImage(selectedColorIndex) {
	const [imageError, setImageError] = useState(false);

	useMemo(() => {
		setImageError(false);
	}, [selectedColorIndex]);

	return { imageError, setImageError };
}

export default function CampaignCarType({ campaign, htmlContent }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedColorIndex, setSelectedColorIndex] = useState(null);
	const { imageError: colorImageError, setImageError: setColorImageError } = useColorImage(selectedColorIndex);
	const contentRef = useRef(null);

	const carData = campaign.car || campaign.item;
	if (!carData) return null;

	const getImageUrl = (image, useStorage = false) => {
		if (!image) return null;
		if (image.startsWith("http")) return image;
		if (useStorage || image.startsWith("cars/colors/")) {
			return `${STORAGE_URL}/${image}`;
		}
		if (image.startsWith("cars/")) {
			return `${IMAGE_BASE_URL}/${image}`;
		}
		return `${IMAGE_BASE_URL}/cars/${image}`;
	};

	const activeImages = useMemo(() => {
		return carData.images || [];
	}, [carData.images]);

	const selectedColorImage = useMemo(() => {
		if (selectedColorIndex === null) return null;
		const color = carData.colors?.[selectedColorIndex];
		return color?.car_image || color?.image || null;
	}, [selectedColorIndex, carData.colors]);

	const formatPrice = (price) => {
		if (!price) return "Fiyat bilgisi yok";
		return new Intl.NumberFormat("tr-TR").format(price) + " TL";
	};

	const priceStats = useMemo(() => {
		if (!carData.history_prices || carData.history_prices.length === 0) {
			return { min: 0, max: 0, current: 0 };
		}
		const prices = carData.history_prices.map((p) => p.price);
		return {
			min: Math.min(...prices),
			max: Math.max(...prices),
			current: carData.history_prices[carData.history_prices.length - 1]?.price,
		};
	}, [carData.history_prices]);

	const chartData = useMemo(() => {
		if (!carData.history_prices) return [];
		return carData.history_prices.map((item) => ({
			date: new Date(item.date).toLocaleDateString("tr-TR", {
				day: "numeric",
				month: "short",
			}),
			price: item.price,
		}));
	}, [carData.history_prices]);

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
					<p className="font-medium text-gray-600">{label}</p>
					<p className="text-orange-600 font-bold text-lg">
						{formatPrice(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	// Fix images in HTML content
	useEffect(() => {
		if (contentRef.current) {
			const images = contentRef.current.querySelectorAll("img");
			images.forEach((img) => {
				img.onerror = function () {
					this.style.display = "none";
				};
			});
		}
	}, [htmlContent]);

	return (
		<div className="flex flex-col w-full gap-6">

			{/* ===== ÜST BÖLÜM: GALERİ (SOL) + BİLGİ (SAĞ) ===== */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

				{/* SOL: Galeri + Renk Seçici */}
				<div className="lg:col-span-5">
					{/* Ana Görsel */}
					<div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 border">
						{/* Renk seçiliyse renk görseli, değilse galeri görseli */}
						{selectedColorIndex !== null && selectedColorImage && getImageUrl(selectedColorImage) && !colorImageError ? (
							<>
								{/* biome-ignore lint/a11y/useAltText: dynamic car color image */}
								<img
									src={getImageUrl(selectedColorImage)}
									alt={`${carData.brand} ${carData.model} - ${carData.colors[selectedColorIndex]?.name}`}
									className="w-full h-full object-contain p-4"
									loading="lazy"
									onError={() => setColorImageError(true)}
								/>
								{/* Renk adı overlay */}
								<div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
									<div
										className="w-2.5 h-2.5 rounded-full border border-gray-300"
										style={{ backgroundColor: carData.colors[selectedColorIndex]?.code || "#999" }}
									/>
									<span className="text-[11px] font-medium text-gray-700">
										{carData.colors[selectedColorIndex]?.name}
									</span>
								</div>
							</>
						) : activeImages.length > 0 && getImageUrl(activeImages[activeImageIndex]) ? (
							<>
								{/* biome-ignore lint/a11y/useAltText: dynamic car image */}
								<img
									src={getImageUrl(activeImages[activeImageIndex])}
									alt={`${carData.brand} ${carData.model}`}
									className="w-full h-full object-contain p-4"
									loading="lazy"
									onError={(e) => {
										e.target.onerror = null;
										e.target.style.display = "none";
									}}
								/>
								{/* Sayaç */}
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

					{/* Thumbnail Strip + Renk Seçici — birleşik alt bar */}
					<div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
						{/* Galeri Thumbnails */}
						{activeImages.length > 1 && activeImages.map((image, index) => (
							<button
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

						{/* Ayırıcı — thumbnail ve renkler arasında */}
						{activeImages.length > 1 && carData.colors && carData.colors.length > 0 && (
							<div className="flex-shrink-0 w-px h-8 bg-gray-300 mx-1" />
						)}

						{/* Renk Seçici Daireleri */}
						{carData.colors && carData.colors.length > 0 && carData.colors.map((color, index) => (
							<button
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
									style={{ backgroundColor: color.code || "#999" }}
								/>
								{selectedColorIndex === index && (
									<div className="absolute inset-0 flex items-center justify-center">
										<Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
									</div>
								)}
							</button>
						))}
					</div>
				</div>

				{/* SAĞ: Araç Bilgi + Kampanya İçerik */}
				<div className="lg:col-span-7 flex flex-col gap-5">
					{/* Başlık ve Fiyat */}
					<div>
						<h2 className="text-2xl font-bold text-[#1C2B4A]">
							{carData.brand} {carData.model}
						</h2>
						{priceStats.current > 0 && (
							<div className="mt-3 inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
								{formatPrice(priceStats.current)}
							</div>
						)}
					</div>

					{/* Teknik Özellikler */}
					{carData.attributes && carData.attributes.length > 0 && (
						<div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 rounded-xl p-4 border border-orange-100">
							<h3 className="font-semibold text-[#1C2B4A] mb-3 flex items-center gap-2 text-sm">
								<div className="p-1.5 bg-orange-500 rounded-lg">
									<Settings className="w-3.5 h-3.5 text-white" />
								</div>
								Teknik Özellikler
							</h3>
							<div className="grid grid-cols-2 gap-2">
								{carData.attributes.slice(0, 8).map((attr, index) => (
									<div
										key={index}
										className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-lg border border-orange-50"
									>
										<span className="text-gray-500 text-xs truncate">{attr.name}</span>
										<span className="font-bold text-orange-700 text-xs whitespace-nowrap bg-orange-50 px-2 py-0.5 rounded-md">
											{attr.value}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Kampanya İçeriği (HTML) */}
					{htmlContent && (
						<Card className="overflow-hidden border border-gray-200">
							<CardContent className="p-5 bg-[#fffaf4]">
								<div
									ref={contentRef}
									className="prose prose-sm prose-gray max-w-none campaign-content"
									dangerouslySetInnerHTML={{ __html: htmlContent }}
								/>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* ===== FİYAT GEÇMİŞİ ===== */}
			{carData.history_prices && carData.history_prices.length > 0 && (
				<Card className="bg-white shadow-sm border">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-gray-800 flex items-center gap-2">
								<TrendingUp className="w-5 h-5 text-orange-500" />
								Fiyat Geçmişi
							</h3>
							<Badge variant="secondary" className="bg-orange-50 text-orange-700">
								Son {carData.history_prices.length} kayıt
							</Badge>
						</div>

						<div className="w-full h-56">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={chartData}>
									<defs>
										<linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#f97316" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
									<XAxis
										dataKey="date"
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={{ stroke: "#e5e7eb" }}
										tickLine={false}
									/>
									<YAxis
										tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={false}
										tickLine={false}
										width={50}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="price"
										stroke="#f97316"
										strokeWidth={2}
										fill="url(#priceGradient)"
										dot={{ fill: "#f97316", strokeWidth: 2, r: 3 }}
										activeDot={{ fill: "#ea580c", strokeWidth: 0, r: 5 }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>

						<div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
							<div className="text-center">
								<p className="text-xs text-gray-500">En Düşük</p>
								<p className="font-bold text-green-600 text-sm">{formatPrice(priceStats.min)}</p>
							</div>
							<div className="text-center">
								<p className="text-xs text-gray-500">Güncel</p>
								<p className="font-bold text-orange-600 text-sm">{formatPrice(priceStats.current)}</p>
							</div>
							<div className="text-center">
								<p className="text-xs text-gray-500">En Yüksek</p>
								<p className="font-bold text-red-600 text-sm">{formatPrice(priceStats.max)}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* ===== EURO NCAP ===== */}
			{carData.euroncap && (
				<Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-amber-500 rounded-lg">
									<Shield className="h-5 w-5 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-800">Euro NCAP</h3>
									<p className="text-xs text-gray-500">Güvenlik Değerlendirmesi</p>
								</div>
							</div>
							<Badge className="bg-amber-500 text-white">
								{carData.euroncap.testYear || new Date().getFullYear()}
							</Badge>
						</div>

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							{[
								{ label: "Yetişkin Yolcu", value: carData.euroncap.activePassengerScore, icon: User },
								{ label: "Çocuk Yolcu", value: carData.euroncap.childPassengerScore, icon: Baby },
								{ label: "Yaya Güvenliği", value: carData.euroncap.pedestrianPassengerScore, icon: PersonStanding },
								{ label: "Güvenlik Donanımı", value: carData.euroncap.securityEquipmentScore, icon: ShieldCheck },
							].map((item, index) => (
								<div key={index} className="bg-white/80 backdrop-blur rounded-xl p-4">
									<div className="flex items-center gap-2 mb-2">
										<item.icon className="w-4 h-4 text-amber-600" />
										<span className="text-xs font-medium text-gray-600">{item.label}</span>
									</div>
									<div className="flex items-end gap-1">
										<span className="text-2xl font-bold text-amber-600">{item.value || 0}</span>
										<span className="text-xs text-gray-500 mb-1">%</span>
									</div>
									<div className="mt-2 w-full bg-amber-100 rounded-full h-1.5">
										<div
											className="bg-gradient-to-r from-amber-400 to-amber-500 h-1.5 rounded-full transition-all"
											style={{ width: `${item.value || 0}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
