import { Calendar, ChevronRight, Clock, ExternalLink, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/imageUtils";
import { IMAGE_BASE_URL } from "@/constants/site";
import { useFavorite } from "@/hooks/useFavorite";
import { remainingDay } from "@/utils/campaign";
import { useState } from "react";
import AuthDialog from "@/components/common/auth/AuthDialog";

export default function CampaignCarHeader({ campaign }) {
	const hasEndDate = campaign.end_date || campaign.endDate;
	const remainingDays = hasEndDate ? remainingDay(campaign.end_date || campaign.endDate) : null;
	const isExpired = remainingDays !== null && remainingDays < 0;

	const favoriteId = campaign?.id ?? campaign?._id ?? campaign?.slug;
	const { isFavorite, toggle, isLoggedIn } = useFavorite("campaign", favoriteId);
	const [authOpen, setAuthOpen] = useState(false);

	const handleFavoriteClick = (e) => {
		if (!isLoggedIn) {
			e?.preventDefault?.();
			e?.stopPropagation?.();
			setAuthOpen(true);
			return;
		}
		toggle(e);
	};

	const getBrandLogo = (logo) => {
		if (!logo) return null;
		if (logo.startsWith("http")) return logo;
		return `${IMAGE_BASE_URL}/${logo}`;
	};

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
		<section className="xl:mx-auto xl:px-36 bg-[#fffaf4]">
			<div className="relative overflow-hidden rounded-md">
				{/* Background - Dokunulmadi */}
				<img
					src={getImageUrl(campaign.image, "car")}
					alt={campaign.title}
					className="absolute inset-0 w-full h-full object-cover opacity-30"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent" />

				{/* Content */}
				<div className="relative container mx-auto px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					{/* Left Section - Genel Header gibi */}
					<div className="space-y-6">
						{/* Breadcrumb */}
						<nav className="flex items-center gap-2 text-sm flex-wrap">
							<Link href="/" className="text-white/70 hover:text-white transition-colors">
								Anasayfa
							</Link>
							{campaign.categories?.[0] && (
								<>
									<ChevronRight className="h-4 w-4 text-white/50" />
									<Link
										href={`/kategori/${campaign.categories[0].slug}`}
										className="text-white/70 hover:text-white transition-colors"
									>
										{campaign.categories[0].name}
									</Link>
								</>
							)}
							{campaign.brands?.[0] && (
								<>
									<ChevronRight className="h-4 w-4 text-white/50" />
									<Link
										href={`/marka/${campaign.brands[0].slug}`}
										className="text-white/70 hover:text-white transition-colors"
									>
										{campaign.brands[0].name}
									</Link>
								</>
							)}
							<ChevronRight className="h-4 w-4 text-white/50" />
							<span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
								{campaign.title}
							</span>
						</nav>

						{/* Marka Logo */}
						{campaign.brands?.[0]?.logo && (
							<Link href={`/marka/${campaign.brands[0].slug}`} className="inline-block">
								<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
									<Image
										src={getBrandLogo(campaign.brands[0].logo)}
										alt={campaign.brands[0].name}
										width={120}
										height={48}
										className="h-10 w-auto object-contain brightness-0 invert"
									/>
								</div>
							</Link>
						)}

						{/* Baslik */}
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md">
							{campaign.title}
						</h1>

						{/* Kisa Aciklama */}
						{campaign.description && (
							<p className="text-white/80 text-base leading-relaxed max-w-xl">
								{campaign.description}
							</p>
						)}

						{/* Durum Badge'leri */}
						<div className="flex items-center gap-3 flex-wrap">
							{hasEndDate ? (
								!isExpired ? (
									<Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-sm font-medium">
										<Clock className="h-4 w-4 mr-1.5" />
										{remainingDays === 0 ? "Son Gun!" : `Son ${remainingDays} Gun`}
									</Badge>
								) : (
									<Badge variant="destructive" className="px-3 py-1.5 text-sm font-medium">
										<Clock className="h-4 w-4 mr-1.5" />
										Kampanya Sona Erdi
									</Badge>
								)
							) : (
								<Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm font-medium">
									<Clock className="h-4 w-4 mr-1.5" />
									Devam Ediyor
								</Badge>
							)}

							{campaign.categories?.[0] && (
								<Badge className="bg-white/15 text-white border-white/30 backdrop-blur-sm px-3 py-1.5 text-sm">
									{campaign.categories[0].name}
								</Badge>
							)}
						</div>

						{/* Tarih Bilgisi */}
						{(campaign.start_date || campaign.end_date) && (
							<div className="flex items-center gap-2 text-white/80">
								<Calendar className="h-5 w-5 text-white/60" />
								<span>
									{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
								</span>
							</div>
						)}

						{/* Aksiyon Butonlari */}
						<div className="flex items-center gap-3 pt-2 flex-wrap">
							{campaign.link && !isExpired && (
								<Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
									<a href={campaign.link} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="h-4 w-4 mr-2" />
										Kampanyaya Git
									</a>
								</Button>
							)}

							<Button
								variant="outline"
								onClick={handleFavoriteClick}
								className={`border-white/30 text-white hover:bg-white/10 ${
									isFavorite ? "bg-red-500/20 border-red-400/50" : ""
								}`}
							>
								<Heart
									className="h-4 w-4 mr-2"
									fill={isFavorite ? "currentColor" : "none"}
								/>
								{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
							</Button>
							<AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
						</div>
					</div>

					{/* Right Section - Image - Dokunulmadi */}
					<div className="relative flex justify-center lg:justify-end">
						<div className="relative">
							<img
								src={getImageUrl(campaign.mainImage || campaign.image)}
								alt={campaign.title}
								className="max-w-lg h-auto object-contain drop-shadow-2xl rounded-xl"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
								}}
							/>
							{/* Marka Logo Overlay */}
							{campaign.brands?.[0]?.logo && (
								<div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
									<Image
										src={getBrandLogo(campaign.brands[0].logo)}
										alt={campaign.brands[0].name}
										width={80}
										height={32}
										className="h-6 w-auto object-contain"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
