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
import { useState, useMemo } from "react";
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
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import { IMAGE_BASE_URL, STORAGE_URL } from "@/constants/site";


// Renk gorseli komponenti
function ColorImageDisplay({ selectedColorIndex, selectedColorImage, carData, getImageUrl }) {
	const [imageError, setImageError] = useState(false);
	const [imageKey, setImageKey] = useState(0);

	// selectedColorIndex degistiginde hatayi sifirla
	useMemo(() => {
		setImageError(false);
		setImageKey((prev) => prev + 1);
	}, [selectedColorIndex]);

	const imageUrl = getImageUrl(selectedColorImage);

	// Debug log
	console.log("Color image debug:", {
		selectedColorIndex,
		selectedColorImage,
		imageUrl,
		color: carData.colors?.[selectedColorIndex],
	});

	if (selectedColorIndex === null) {
		return (
			<div className="h-full min-h-[250px] bg-gradient-to-br from-white to-gray-50 rounded-xl flex items-center justify-center">
				<div className="text-center text-gray-400">
					<div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
						<Settings className="w-8 h-8" />
					</div>
					<p className="text-sm">Renk gorselini gormek icin<br />bir renk secin</p>
				</div>
			</div>
		);
	}

	if (!selectedColorImage || !imageUrl || imageError) {
		return (
			<div className="h-full min-h-[250px] bg-gradient-to-br from-white to-gray-50 rounded-xl flex items-center justify-center">
				<div className="text-center text-gray-400">
					<div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
						<ImageOff className="w-8 h-8" />
					</div>
					<p className="text-sm">Bu renk icin gorsel yuklenmmis</p>
					<p className="text-xs mt-1 text-gray-300">{selectedColorImage || "Gorsel yok"}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full min-h-[250px] bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-inner">
			<img
				key={imageKey}
				src={imageUrl}
				alt={`${carData.brand} ${carData.model} - ${carData.colors[selectedColorIndex]?.name}`}
				className="w-full h-full object-contain p-4"
			loading="lazy"
				onError={() => setImageError(true)}
			/>
			<div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
				<div
					className="w-4 h-4 rounded-full border border-gray-300"
					style={{ backgroundColor: carData.colors[selectedColorIndex]?.code || "#999" }}
				/>
				<span className="text-sm font-medium text-gray-700">
					{carData.colors[selectedColorIndex]?.name}
				</span>
			</div>
		</div>
	);
}

export default function CampaignCarType({ campaign }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedColorIndex, setSelectedColorIndex] = useState(null);

	const carData = campaign.car || campaign.item;
	if (!carData) return null;

	// Debug: Renk verilerini konsola yazdir
	console.log("Car colors data:", carData.colors);

	const getImageUrl = (image, useStorage = false) => {
		if (!image) return null;
		if (image.startsWith("http")) return image;

		// Storage URL kullan (local uploads - cars/colors)
		if (useStorage || image.startsWith("cars/colors/")) {
			return `${STORAGE_URL}/${image}`;
		}

		// CDN URL kullan (genel gorseller)
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
		console.log("Selected color:", color);
		return color?.car_image || color?.image || null;
	}, [selectedColorIndex, carData.colors]);

	// Fiyat formatlama
	const formatPrice = (price) => {
		if (!price) return "Fiyat bilgisi yok";
		return new Intl.NumberFormat("tr-TR").format(price) + " TL";
	};

	// Fiyat istatistikleri
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

	// Grafik verisi
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

	// Tooltip özelleştirme
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
					<p className="font-medium text-gray-600">{label}</p>
					<p className="text-blue-600 font-bold text-lg">
						{formatPrice(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="flex flex-col w-full gap-6">
			{/* ANA GÖRSEL SLİDER - Tam Genişlik */}
			<div className="w-full">
				<Carousel
					className="w-full"
					index={activeImageIndex}
					onChange={setActiveImageIndex}
				>
					<CarouselContent>
						{activeImages.map((image, index) => (
							<CarouselItem key={index}>
								<div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
									{getImageUrl(image) ? (
										<img
											src={getImageUrl(image)}
											alt={`${carData.brand} ${carData.model}`}
											className="w-full h-full object-contain"
											loading="lazy"
											onError={(e) => {
												e.target.onerror = null;
												e.target.style.display = "none";
											}}
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									)}
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-4" />
					<CarouselNext className="right-4" />
				</Carousel>

				{/* Dot Navigation */}
				{activeImages.length > 1 && (
					<div className="flex justify-center gap-2 mt-4">
						{activeImages.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setActiveImageIndex(idx)}
								className={`h-2.5 rounded-full transition-all ${
									idx === activeImageIndex
										? "bg-orange-500 w-6"
										: "bg-gray-300 hover:bg-gray-400 w-2.5"
								}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* KÜÇÜK GÖRSEL GALERİSİ (Thumbnail strip) */}
			{activeImages.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2 px-1">
					{activeImages.map((image, index) => (
						<button
							key={index}
							onClick={() => setActiveImageIndex(index)}
							className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
								activeImageIndex === index
									? "border-orange-500 shadow-md"
									: "border-gray-200 hover:border-orange-300"
							}`}
						>
							<img
								src={getImageUrl(image)}
								alt={`Thumbnail ${index + 1}`}
								className="w-16 h-12 object-cover bg-gray-200"
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

			{/* RENK SEÇENEKLERİ */}
			{carData.colors && carData.colors.length > 0 && (
				<div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 shadow-sm border">
					<div className="flex flex-col lg:flex-row gap-6">
						{/* Sol taraf - Renk seçim butonları */}
						<div className="lg:w-1/3">
							<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
								<div className="w-1 h-6 bg-orange-500 rounded-full"></div>
								Renk Seçenekleri
							</h3>
							<div className="flex flex-col gap-2">
								{carData.colors.map((color, index) => (
									<button
										key={index}
										onClick={() => setSelectedColorIndex(index)}
										className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
											selectedColorIndex === index
												? "border-orange-500 bg-white shadow-lg scale-[1.02]"
												: "border-transparent bg-white/60 hover:bg-white hover:shadow-md"
										}`}
									>
										{/* Renk dairesi */}
										<div
											className={`w-8 h-8 rounded-full border-2 shadow-inner ${
												selectedColorIndex === index
													? "border-orange-500 ring-2 ring-orange-200"
													: "border-gray-300"
											}`}
											style={{ backgroundColor: color.code || "#999" }}
										/>
										<span
											className={`text-sm font-medium flex-1 text-left ${
												selectedColorIndex === index
													? "text-gray-900"
													: "text-gray-600"
											}`}
										>
											{color.name}
										</span>
										{/* Seçili işareti */}
										{selectedColorIndex === index && (
											<div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
												<Check className="w-4 h-4 text-white" />
											</div>
										)}
									</button>
								))}
							</div>
						</div>

						{/* Sag taraf - Secili renk gorseli */}
						<div className="lg:w-2/3">
							<ColorImageDisplay
								selectedColorIndex={selectedColorIndex}
								selectedColorImage={selectedColorImage}
								carData={carData}
								getImageUrl={getImageUrl}
							/>
						</div>
					</div>
				</div>
			)}

			{/* ANA İÇERİK ALANI */}
			<div className="flex flex-col gap-6">
				<div className="w-full space-y-6">
					{/* Başlık ve Fiyat */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<h2 className="text-2xl text-[#1C2B4A] font-bold">
							{carData.brand} {carData.model}
						</h2>
						{priceStats.current > 0 && (
							<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
								{formatPrice(priceStats.current)}
							</div>
						)}
					</div>

					{/* TEKNİK ÖZELLİKLER */}
					{carData.attributes && carData.attributes.length > 0 && (
						<Card className="bg-white shadow-sm border">
							<CardContent className="p-6">
								<h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<Settings className="w-5 h-5 text-gray-500" />
									Teknik Özellikler
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{carData.attributes.slice(0, 10).map((attr, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
										>
											<span className="text-sm text-gray-600">{attr.name}</span>
											<span className="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">
												{attr.value}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* FİYAT GEÇMİŞİ GRAFİĞİ */}
					{carData.history_prices && carData.history_prices.length > 0 && (
						<Card className="bg-white shadow-sm border">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="font-semibold text-gray-800 flex items-center gap-2">
										<TrendingUp className="w-5 h-5 text-blue-500" />
										Fiyat Geçmişi
									</h3>
									<Badge variant="secondary" className="bg-blue-50 text-blue-700">
										Son {carData.history_prices.length} kayıt
									</Badge>
								</div>

								<div className="w-full h-64">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={chartData}>
											<defs>
												<linearGradient
													id="priceGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#3b82f6"
														stopOpacity={0.3}
													/>
													<stop
														offset="95%"
														stopColor="#3b82f6"
														stopOpacity={0}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e5e7eb"
												vertical={false}
											/>
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
												stroke="#3b82f6"
												strokeWidth={2}
												fill="url(#priceGradient)"
												dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
												activeDot={{ fill: "#2563eb", strokeWidth: 0, r: 6 }}
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>

								{/* Fiyat özeti */}
								<div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
									<div className="text-center">
										<p className="text-xs text-gray-500">En Düşük</p>
										<p className="font-bold text-green-600">
											{formatPrice(priceStats.min)}
										</p>
									</div>
									<div className="text-center">
										<p className="text-xs text-gray-500">Güncel</p>
										<p className="font-bold text-blue-600">
											{formatPrice(priceStats.current)}
										</p>
									</div>
									<div className="text-center">
										<p className="text-xs text-gray-500">En Yüksek</p>
										<p className="font-bold text-red-600">
											{formatPrice(priceStats.max)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* EURO NCAP BİLGİLERİ */}
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
											<p className="text-xs text-gray-500">
												Güvenlik Değerlendirmesi
											</p>
										</div>
									</div>
									<Badge className="bg-amber-500 text-white">
										{carData.euroncap.testYear || new Date().getFullYear()}
									</Badge>
								</div>

								<div className="grid grid-cols-2 gap-4">
									{[
										{
											label: "Yetişkin Yolcu",
											value: carData.euroncap.activePassengerScore,
											icon: User,
										},
										{
											label: "Çocuk Yolcu",
											value: carData.euroncap.childPassengerScore,
											icon: Baby,
										},
										{
											label: "Yaya Güvenliği",
											value: carData.euroncap.pedestrianPassengerScore,
											icon: PersonStanding,
										},
										{
											label: "Güvenlik Donanımı",
											value: carData.euroncap.securityEquipmentScore,
											icon: ShieldCheck,
										},
									].map((item, index) => (
										<div
											key={index}
											className="bg-white/80 backdrop-blur rounded-xl p-4"
										>
											<div className="flex items-center gap-2 mb-2">
												<item.icon className="w-4 h-4 text-amber-600" />
												<span className="text-xs font-medium text-gray-600">
													{item.label}
												</span>
											</div>
											<div className="flex items-end gap-2">
												<span className="text-3xl font-bold text-amber-600">
													{item.value || 0}
												</span>
												<span className="text-sm text-gray-500 mb-1">%</span>
											</div>
											{/* Progress bar */}
											<div className="mt-2 w-full bg-amber-100 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all"
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

			</div>
		</div>
	);
}
