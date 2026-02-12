import {
	Calendar,
	ChevronRight,
	Clock,
	Download,
	ExternalLink,
	FileText,
	Heart,
	Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMAGE_BASE_URL } from "@/constants/site";
import { useFavorite } from "@/hooks/useFavorite";
import { remainingDay } from "@/utils/campaign";
import { useState } from "react";
import AuthDialog from "@/components/common/auth/AuthDialog";

export default function UnifiedCampaignHeader({ campaign }) {
	// Kampanya tipi belirleme
	const isActual = campaign?.itemType === "actual" || campaign?.item_type === "actual";

	// Gorsel URL
	const getImageUrl = (image) => {
		if (!image) return "/images/placeholder-campaign.jpg";
		if (image.startsWith("http")) return image;
		return `${IMAGE_BASE_URL}/${image}`;
	};

	const getBrandLogo = (logo) => {
		if (!logo) return null;
		if (logo.startsWith("http")) return logo;
		return `${IMAGE_BASE_URL}/${logo}`;
	};

	// Aktuel dosyalari
	const actualFiles = campaign?.actualsUrls || campaign?.actuals_urls || campaign?.actuals || [];
	const normalizeFileUrl = (url) => {
		if (!url) return null;
		if (url.startsWith("http")) return url;
		return `https://kampanyaradar-static.b-cdn.net/kampanyaradar/${url.replace(/^\//, "")}`;
	};
	const downloadableFiles = actualFiles.map(normalizeFileUrl).filter(Boolean);
	const hasDownloadableFiles = isActual && downloadableFiles.length > 0;

	const getDownloadUrl = (url) => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
		return `${apiBase}/download?url=${encodeURIComponent(url)}`;
	};

	// Tarih hesaplamalari
	const hasEndDate = campaign.end_date || campaign.endDate;
	const remainingDays = hasEndDate ? remainingDay(campaign.end_date || campaign.endDate) : null;
	const isExpired = remainingDays !== null && remainingDays < 0;

	// Favoriler
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

	// Tarih formatlama
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	// Ana gorsel
	const mainImage = campaign.mainImage || campaign.image;

	// Status badge bileşeni (mobil ve desktop için ortak)
	const StatusBadge = ({ className = "" }) => {
		if (isActual) {
			return (
				<Badge className={`bg-blue-500 hover:bg-blue-600 text-white font-medium ${className}`}>
					<Newspaper className="h-3.5 w-3.5 mr-1" />
					Aktuel Katalog
				</Badge>
			);
		}
		if (hasEndDate) {
			if (!isExpired) {
				return (
					<Badge className={`bg-orange-500 hover:bg-orange-600 text-white font-medium ${className}`}>
						<Clock className="h-3.5 w-3.5 mr-1" />
						{remainingDays === 0 ? "Son Gun!" : `Son ${remainingDays} Gun`}
					</Badge>
				);
			}
			return (
				<Badge variant="destructive" className={`font-medium ${className}`}>
					<Clock className="h-3.5 w-3.5 mr-1" />
					Sona Erdi
				</Badge>
			);
		}
		return (
			<Badge className={`bg-green-500 hover:bg-green-600 text-white font-medium ${className}`}>
				<Clock className="h-3.5 w-3.5 mr-1" />
				Devam Ediyor
			</Badge>
		);
	};

	return (
		<section className="xl:mx-auto xl:px-36 bg-[#fffaf4]">

			{/* ===== MOBİL LAYOUT ===== */}
			<div className="lg:hidden">
				{/* Hero Görsel */}
				<div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
					{/* biome-ignore lint/a11y/useAltText: campaign image */}
					<img
						src={getImageUrl(mainImage)}
						alt={campaign.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

					{/* Durum Badge - Sol Üst */}
					<div className="absolute top-3 left-3">
						<StatusBadge className="px-2.5 py-1 text-xs shadow-lg" />
					</div>

					{/* Marka Logo - Sağ Üst */}
					{campaign.brands?.[0]?.logo && (
						<Link href={`/marka/${campaign.brands[0].slug}`} className="absolute top-3 right-3">
							<div className="bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-md">
								<Image
									src={getBrandLogo(campaign.brands[0].logo)}
									alt={campaign.brands[0].name}
									width={64}
									height={24}
									className="h-5 w-auto object-contain"
								/>
							</div>
						</Link>
					)}

					{/* Favori Butonu - Sağ Alt */}
					<button
						type="button"
						onClick={handleFavoriteClick}
						className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-colors ${
							isFavorite
								? "bg-red-500 text-white"
								: "bg-white/90 backdrop-blur-sm text-gray-600"
						}`}
					>
						<Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
					</button>

					{/* Kampanya Başlığı - Sol Alt (Görsel Üzerinde) */}
					<div className="absolute bottom-3 left-3 right-14">
						<h1 className="text-lg font-bold text-white leading-snug drop-shadow-lg line-clamp-2">
							{campaign.title}
						</h1>
					</div>
				</div>

				{/* İçerik Bölümü */}
				<div className="px-4 py-4 space-y-3">
					{/* Breadcrumb */}
					<nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
						<Link href="/" className="hover:text-orange-500 shrink-0">Anasayfa</Link>
						{campaign.categories?.[0] && (
							<>
								<ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
								<Link
									href={`/kategori/${campaign.categories[0].slug}`}
									className="hover:text-orange-500 shrink-0"
								>
									{campaign.categories[0].name}
								</Link>
							</>
						)}
						{campaign.brands?.[0] && (
							<>
								<ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
								<Link
									href={`/marka/${campaign.brands[0].slug}`}
									className="hover:text-orange-500 shrink-0"
								>
									{campaign.brands[0].name}
								</Link>
							</>
						)}
					</nav>

					{/* Açıklama */}
					{campaign.description && (
						<p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
							{campaign.description}
						</p>
					)}

					{/* Kategori + Tarih */}
					<div className="flex items-center justify-between text-xs">
						{campaign.categories?.[0] && (
							<Badge variant="outline" className="px-2 py-0.5 text-xs font-normal text-gray-600">
								{campaign.categories[0].name}
							</Badge>
						)}
						{(campaign.start_date || campaign.end_date) && (
							<div className="flex items-center gap-1 text-gray-400">
								<Calendar className="h-3.5 w-3.5" />
								<span>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
							</div>
						)}
					</div>

					{/* CTA Butonları */}
					<div className="flex flex-col gap-2 pt-1">
						{campaign.link && !isExpired && (
							<Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 text-sm font-semibold">
								<a href={campaign.link} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="h-4 w-4 mr-2" />
									{isActual ? "Markete Git" : "Kampanyaya Git"}
								</a>
							</Button>
						)}

						{hasDownloadableFiles && downloadableFiles.length === 1 && (
							<Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11 text-sm font-semibold">
								<a href={getDownloadUrl(downloadableFiles[0])}>
									<Download className="h-4 w-4 mr-2" />
									Katalog Indir
								</a>
							</Button>
						)}

						{hasDownloadableFiles && downloadableFiles.length > 1 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11 text-sm font-semibold">
										<Download className="h-4 w-4 mr-2" />
										Katalog Indir
										<span className="ml-2 text-xs bg-blue-400 px-2 py-0.5 rounded-full">
											{downloadableFiles.length}
										</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="center" className="w-56">
									{downloadableFiles.map((url, index) => {
										const fileName = url.split("/").pop() || `Dosya ${index + 1}`;
										const isPdf = url.toLowerCase().endsWith(".pdf");
										return (
											<DropdownMenuItem key={index} asChild className="cursor-pointer">
												<a href={getDownloadUrl(url)}>
													<FileText className={`h-4 w-4 mr-2 ${isPdf ? "text-red-500" : "text-blue-500"}`} />
													<span className="truncate">{fileName}</span>
												</a>
											</DropdownMenuItem>
										);
									})}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>

			{/* ===== DESKTOP LAYOUT ===== */}
			<div className="hidden lg:block">
				<div className="relative overflow-hidden rounded-md">
					{/* Arka Plan */}
					{/* biome-ignore lint/a11y/useAltText: background image */}
					<img
						src={getImageUrl(mainImage)}
						alt=""
						className="absolute inset-0 w-full h-full object-cover opacity-30"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent" />

					{/* Content */}
					<div className="relative container mx-auto px-4 py-16 grid grid-cols-2 gap-8 items-center">
						{/* Sol Taraf - Bilgiler */}
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
									<Image
										src={getBrandLogo(campaign.brands[0].logo)}
										alt={campaign.brands[0].name}
										width={80}
										height={32}
										className="h-8 w-auto object-contain drop-shadow-md"
									/>
								</Link>
							)}

							{/* Baslik */}
							<h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md">
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
								<StatusBadge className="px-3 py-1.5 text-sm" />

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
											{isActual ? "Markete Git" : "Kampanyaya Git"}
										</a>
									</Button>
								)}

								{hasDownloadableFiles && downloadableFiles.length === 1 && (
									<Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
										<a href={getDownloadUrl(downloadableFiles[0])}>
											<Download className="h-4 w-4 mr-2" />
											Katalog Indir
										</a>
									</Button>
								)}

								{hasDownloadableFiles && downloadableFiles.length > 1 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button className="bg-blue-500 hover:bg-blue-600 text-white">
												<Download className="h-4 w-4 mr-2" />
												Katalog Indir
												<span className="ml-2 text-xs bg-blue-400 px-2 py-0.5 rounded-full">
													{downloadableFiles.length}
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="w-56">
											{downloadableFiles.map((url, index) => {
												const fileName = url.split("/").pop() || `Dosya ${index + 1}`;
												const isPdf = url.toLowerCase().endsWith(".pdf");
												return (
													<DropdownMenuItem key={index} asChild className="cursor-pointer">
														<a href={getDownloadUrl(url)}>
															<FileText className={`h-4 w-4 mr-2 ${isPdf ? "text-red-500" : "text-blue-500"}`} />
															<span className="truncate">{fileName}</span>
														</a>
													</DropdownMenuItem>
												);
											})}
										</DropdownMenuContent>
									</DropdownMenu>
								)}

								<Button
									variant="ghost"
									onClick={handleFavoriteClick}
									className={`border border-white/30 text-white hover:bg-transparent hover:text-white/80 ${
										isFavorite ? "text-red-400 border-red-400/50" : ""
									}`}
								>
									<Heart
										className="h-4 w-4 mr-2"
										fill={isFavorite ? "currentColor" : "none"}
									/>
									{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
								</Button>
							</div>
						</div>

						{/* Sag Taraf - Gorsel */}
						<div className="relative flex justify-end">
							<div className="relative">
								{/* biome-ignore lint/a11y/useAltText: campaign image */}
								<img
									src={getImageUrl(mainImage)}
									alt={campaign.title}
									className="max-w-lg h-auto object-contain drop-shadow-2xl rounded-xl"
									loading="lazy"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "/images/placeholder-campaign.jpg";
									}}
								/>
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
			</div>

			<AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
		</section>
	);
}
