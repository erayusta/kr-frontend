import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { IMAGE_BASE_URL } from "@/constants/site";
import apiRequest from "@/lib/apiRequest";
import { normalizeTRMobilePhone } from "@/lib/phone";

export default function CampaignCarType({ campaign }) {
	console.log("car hocam", campaign);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

	const { toast } = useToast();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		consent: false,
	});
	const onSubmit = async (e) => {
		e.preventDefault();

		const normalizedPhone = normalizeTRMobilePhone(formData.phone);
		if (!normalizedPhone) {
			toast({
				title: "Hata!",
				description: "Lütfen geçerli bir cep telefonu numarası girin.",
				variant: "destructive",
			});
			return;
		}

		try {
			const payload = {
				campaign_id: campaign.id,
				name: formData.name || "İsimsiz",
				email: formData.email || "",
				phone: normalizedPhone.e164,
				form_data: { ...formData, phone: normalizedPhone.e164 },
			};

			await apiRequest("/leads", "post", payload);

			toast({
				title: "Başarılı!",
				description:
					"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
			});

			// Form'u temizle
			setFormData({
				name: "",
				email: "",
				phone: "",
				consent: false,
			});
		} catch (error) {
			console.error("Form gönderimi başarısız:", error.response);
			toast({
				title: "Hata!",
				description:
					error.response?.data?.error ??
					"Form gönderilemedi, lütfen tekrar deneyin.",
				variant: "destructive",
			});
		}
	};

	// car verisini kontrol et - item veya car olabilir
	const carData = campaign.car || campaign.item;
	if (!carData) return null;

	// Görsel URL'ini düzenle
	const getImageUrl = (image) => {
		if (!image)
			return "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800";
		return image.startsWith("http") ? image : `${IMAGE_BASE_URL}/cars/${image}`;
	};

	// Aktif görsel
	const activeImages =
		carData.colors &&
		selectedColorIndex !== null &&
		carData.colors[selectedColorIndex]?.image
			? [carData.colors[selectedColorIndex].image]
			: carData.images || [];

	const activeImage = activeImages[activeImageIndex] || activeImages[0];

	// Fiyat formatlama
	const formatPrice = (price) => {
		if (!price) return "Fiyat bilgisi yok";
		return new Intl.NumberFormat("tr-TR").format(price) + " TL";
	};

	// Görsel navigasyon
	const nextImage = () => {
		setActiveImageIndex((prev) => (prev + 1) % activeImages.length);
	};

	const prevImage = () => {
		setActiveImageIndex(
			(prev) => (prev - 1 + activeImages.length) % activeImages.length,
		);
	};

	// Tooltip özelleştirme
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 rounded-lg shadow-md border text-sm">
					<p className="font-medium">{label}</p>
					<p className="text-blue-600 font-semibold">
						{formatPrice(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="flex flex-col md:flex-row w-full gap-0">
			{/* SOL TARAF GÖRSEL GALERİ */}
			<div className="w-12/12  md:w-3/12">
				<div className="space-y-4">
					<Card className="relative rounded-lg overflow-hidden bg-transparent">
						<img
							src={getImageUrl(activeImage)}
							alt={`${carData.brand} ${carData.model}`}
							className="w-full h-[400px] object-contain"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src =
									"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800";
							}}
						/>

						{/* Görsel Navigasyon */}
						{activeImages.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
								>
									<ChevronLeft className="h-5 w-5" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
								>
									<ChevronRight className="h-5 w-5" />
								</button>
							</>
						)}

						{/* Görsel Sayacı */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
							{activeImageIndex + 1} / {activeImages.length}
						</div>
					</Card>

					{/* Küçük Görsel Galerisi */}
					<div className="flex gap-2 overflow-x-auto pb-2">
						{activeImages.map((image, index) => (
							<button
								key={index}
								onClick={() => setActiveImageIndex(index)}
								className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
									activeImageIndex === index
										? "border-blue-500"
										: "border-gray-200"
								}`}
							>
								<img
									src={getImageUrl(image)}
									alt={`Thumbnail ${index + 1}`}
									className="w-10 h-10 object-cover"
								/>
							</button>
						))}
					</div>

					{/* Renk Seçenekleri */}
					{carData.colors && carData.colors.length > 0 && (
						<Card className="bg-transparent p-4 rounded-lg">
							<p className="text-sm font-medium text-gray-700 mb-3">
								Renk Seçenekleri
							</p>
							<div className="flex gap-2 flex-wrap">
								{carData.colors.map((color, index) => (
									<button
										key={index}
										onClick={() => {
											setSelectedColorIndex(index);
											setActiveImageIndex(0);
										}}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
											selectedColorIndex === index
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 bg-white hover:border-gray-300"
										}`}
									>
										<div
											className="w-5 h-5 rounded-full border border-gray-300"
											style={{ backgroundColor: color.code }}
										/>
										<span className="text-sm">{color.name}</span>
									</button>
								))}
							</div>
						</Card>
					)}
				</div>
			</div>

			{/* ORTA KISIM BİLGİLER */}
			<div className="w-12/12  md:w-6/12 space-y-2 px-2 ">
				<div className="flex justify-between ">
					<h2 className="text-lg text-[#1C2B4A] font-bold">
						{carData.brand} {carData.model}
					</h2>
					<div className="bg-blue-500 text-white px-1 py-1 rounded-lg text-sm font-semibold">
						{formatPrice(
							carData.history_prices[carData.history_prices.length - 1]?.price,
						)}
					</div>
				</div>

				<Card className="grid grid-cols-2 gap-6 p-8 bg-transparent">
					{carData.attributes &&
						carData.attributes.slice(0, 10).map((attr, index) => (
							<div key={index} className="flex justify-between items-center">
								<span className="text-sm font-semibold text-[#1C2B4A]">
									{attr.name}
								</span>
								<Badge className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 w-[90px] flex justify-center">
									<span className="text-sm font-bold text-[#1C2B4A]">
										{attr.value}
									</span>
								</Badge>
							</div>
						))}
				</Card>

				{/* Euro NCAP */}
				{carData.euroncap && (
					<Card className="bg-transparent">
						<CardContent className="p-6">
							<div className="flex items-center gap-2 mb-4">
								<Shield className="h-5 w-5 text-yellow-600" />
								<h3 className="font-semibold">Euro NCAP Güvenlik Skorları</h3>
								<Badge variant="secondary" className="ml-auto">
									{carData.euroncap.testYear || new Date().getFullYear()}
								</Badge>
							</div>

							<div className="grid grid-cols-2 gap-3">
								{[
									{
										label: "Yetişkin Yolcu",
										value: carData.euroncap.activePassengerScore,
									},
									{
										label: "Çocuk Yolcu",
										value: carData.euroncap.childPassengerScore,
									},
									{
										label: "Yaya Güvenliği",
										value: carData.euroncap.pedestrianPassengerScore,
									},
									{
										label: "Güvenlik Donanımı",
										value: carData.euroncap.securityEquipmentScore,
									},
								].map((item, index) => (
									<div key={String(index)} className="rounded-lg p-3">
										<p className="text-xs text-gray-600 mb-1">{item.label}</p>
										<div className="flex items-center gap-2">
											<div className="text-2xl font-bold text-amber-500">
												{item.value || 0}%
											</div>
											<div className="flex-1">
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-amber-500 h-2 rounded-full transition-all"
														style={{ width: `${item.value || 0}%` }}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Fiyat Analizi */}
				{carData.history_prices && carData.history_prices.length > 0 && (
					<Card className="bg-transparent mt-6">
						<CardContent className="p-6">
							<div className="w-full h-48">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={carData.history_prices.map((item) => ({
											date: new Date(item.date).toLocaleDateString("tr-TR", {
												day: "numeric",
												month: "short",
												year: "numeric",
											}),
											price: item.price,
										}))}
									>
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis
											dataKey="date"
											tick={{ fontSize: 11 }}
											tickLine={{ stroke: "#9ca3af" }}
										/>
										<YAxis
											tickFormatter={(value) =>
												new Intl.NumberFormat("tr-TR").format(value)
											}
											tick={{ fontSize: 12 }}
											tickLine={{ stroke: "#9ca3af" }}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Area
											type="monotone"
											dataKey="price"
											stroke="#2563eb"
											fill="#2563eb"
											strokeWidth={2}
											fillOpacity={0.3}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* SAĞ TARAF FORM */}
			<Card className="w-12/12 md:w-3/12 p-5 space-y-4 bg-transparent">
				<div className="flex justify-center">
					<img
						src={campaign.brands[0].logo ?? ""}
						alt="görsel yüklenemedi"
						width={160}
						height={120}
						className="rounded-lg object-cover"
					/>
				</div>

				<h2 className="text-center font-bold text-lg text-gray-800">
					FORMU DOLDURUN SİZE ULAŞALIM
				</h2>

				<form className="space-y-3" onSubmit={onSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Ad Soyad
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="Adınızı ve soyadınızı girin"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							E-posta Adresi
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							placeholder="ornek@mail.com"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Telefon Numarası
						</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
							autoComplete="tel"
							inputMode="numeric"
							placeholder="05xx xxx xx xx"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="flex items-start gap-2">
						<input
							type="checkbox"
							checked={formData.consent}
							onChange={(e) =>
								setFormData({ ...formData, consent: e.target.checked })
							}
							className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label className="text-sm text-gray-600">
							Açık rıza metnini okudum ve kabul ediyorum.
						</label>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Teklif Al
					</button>
				</form>
			</Card>
		</div>
	);
}
