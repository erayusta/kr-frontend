import {
	Bell,
	Calendar,
	ChevronRight,
	Clock,
	Heart,
	ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IMAGE_BASE_URL } from "@/constants/site";
import { useFavorite } from "@/hooks/useFavorite";
import { remainingDay } from "@/utils/campaign";

export default function CampaignHeader({ campaign }) {
	// Görsel URL'ini düzenle
	const getImageUrl = (image) => {
		if (!image)
			return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/${image}`;
	};

	const remainingDays = remainingDay(campaign.end_date || campaign.endDate);
	const isExpired = remainingDays < 0;

	const favoriteId = campaign?.id ?? campaign?._id ?? campaign?.slug;
	const { isFavorite, toggle, canToggle } = useFavorite("campaign", favoriteId);

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<section className="bg-[#FFFAF4]">
			{/* Breadcrumb */}
			<div className="xl:mx-auto xl:px-36">
				<div className="container px-4 py-4">
					<div className="space-y-1">
						{/* Her kategori için tam bir breadcrumb satırı */}
						{campaign.categories && campaign.categories.length > 0 ? (
							campaign.categories.map((category, index) => {
								const subcategory = category.children?.[0];
								return (
									<div key={category.id || index} className="flex items-center flex-wrap gap-1.5 text-sm">
										<Link
											href="/"
											className="text-gray-600 hover:text-gray-900 transition-colors"
										>
											Anasayfa
										</Link>
										<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
										<Link
											href={`/kategori/${category.slug}`}
											className="text-gray-600 hover:text-gray-900 transition-colors"
										>
											{category.name}
										</Link>
										{subcategory && (
											<>
												<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
												<Link
													href={`/kategori/${subcategory.slug}`}
													className="text-gray-600 hover:text-gray-900 transition-colors"
												>
													{subcategory.name}
												</Link>
											</>
										)}
										<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
										<span className="text-gray-900 font-medium">
											{campaign.title.length > 40
												? `${campaign.title.substring(0, 40)}...`
												: campaign.title}
										</span>
									</div>
								);
							})
						) : (
							<div className="flex items-center flex-wrap gap-1.5 text-sm">
								<Link
									href="/"
									className="text-gray-600 hover:text-gray-900 transition-colors"
								>
									Anasayfa
								</Link>
								<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
								<span className="text-gray-900 font-medium">
									{campaign.title.length > 50
										? `${campaign.title.substring(0, 50)}...`
										: campaign.title}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Hero Section */}
			<div className="xl:mx-auto xl:px-36 pb-8">
				<div className="container px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl">
						{/* Sol Taraf - Lacivert Alan */}
						<div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] flex flex-col min-h-[400px] relative overflow-hidden lg:order-2">
							{/* Dekoratif Pattern */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

							<div className="flex-[4] p-8 lg:p-12 relative z-10 space-y-6">
								{/* Icon */}
								<div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
									<ShoppingBag className="h-8 w-8 text-white" />
								</div>

								{/* Başlık */}
								<div>
									<h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
										{campaign.title}
									</h1>
									{campaign.brands?.[0] && (
										<Link
											href={`/marka/${campaign.brands[0].slug}`}
											className="inline-block"
										>
											<div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
												<Image
													src={campaign.brands[0].logo}
													alt={campaign.brands[0].name}
													width={100}
													height={40}
													className="h-8 w-auto object-contain"
												/>
											</div>
										</Link>
									)}
								</div>
							</div>

							{/* Alt Kısım - Süre Bilgisi */}
							<div className="hidden">
								{!isExpired && (
									<div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
										<Clock className="h-5 w-5" />
										<span>
											{remainingDays === 0
												? "Son Gün!"
												: `Son ${remainingDays} Gün`}
										</span>
									</div>
								)}
								{isExpired && (
									<div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
										<Clock className="h-5 w-5" />
										<span>Kampanya Sona Erdi</span>
									</div>
								)}

								{(campaign.start_date || campaign.end_date) && (
									<div className="flex items-center gap-2 text-white/80 text-sm">
										<Calendar className="h-4 w-4" />
										<span>
											{campaign.end_date &&
												new Date(campaign.end_date).toLocaleDateString(
													"tr-TR",
													{
														day: "numeric",
														month: "long",
														year: "numeric",
													},
												)}
										</span>
									</div>
								)}
							</div>

							<Separator className="bg-white/20" />

							<div className="flex-[2] px-8 pb-8 pt-6 lg:px-12 lg:pb-12 relative z-10 space-y-4">
								<div className="flex items-center gap-3 flex-wrap">
									{!isExpired && (
										<div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
											<Clock className="h-4 w-4" />
											<span>
												{remainingDays === 0
													? "Son Gün!"
													: `Son ${remainingDays} Gün`}
											</span>
										</div>
									)}
									{isExpired && (
										<div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
											<Clock className="h-4 w-4" />
											<span>Kampanya Sona Erdi</span>
										</div>
									)}
								</div>

								<div className="flex items-center gap-3 flex-wrap">
									<button
										type="button"
										disabled={!canToggle}
										aria-pressed={isFavorite}
										onClick={toggle}
										className={`inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl text-sm font-medium transition-all duration-200 ${
											isFavorite
												? "bg-white/15 text-white"
												: "bg-transparent text-white hover:bg-white/10"
										}`}
									>
										<Heart
											className="h-4 w-4"
											fill={isFavorite ? "currentColor" : "none"}
										/>
										{isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
									</button>
									<button
										type="button"
										className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
									>
										<Bell className="h-4 w-4" />
										Fiyat Alarmı Kur
									</button>
								</div>

								{(campaign.start_date || campaign.end_date) && (
									<div className="flex items-center gap-2 text-white/80 text-sm">
										<Calendar className="h-4 w-4" />
										<span>
											Kampanya Tarihi:{" "}
											<span className="font-medium text-white">
												{formatDate(campaign.start_date)} -{" "}
												{formatDate(campaign.end_date)}
											</span>
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Sağ Taraf - Ürün Görseli */}
						<div className="relative bg-gradient-to-br from-gray-50 to-white min-h-[400px] flex items-center justify-center p-8 lg:order-1">
							<Card className="w-full max-w-[520px]">
								<div className="relative w-full aspect-[4/3] bg-white">
									<Image
										src={getImageUrl(campaign.image)}
										alt={campaign.title}
										fill
										className="object-contain p-6"
										sizes="(max-width: 1024px) 100vw, 50vw"
										priority
										onError={(e) => {
											e.currentTarget.src =
												"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
										}}
									/>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
