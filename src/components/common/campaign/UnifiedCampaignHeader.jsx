import {
	Calendar,
	ChevronRight,
	Clock,
	Download,
	ExternalLink,
	FileText,
	Heart,
	Newspaper,
	Car,
	Package,
	Tag,
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

export default function UnifiedCampaignHeader({ campaign }) {
	// Kampanya tipi belirleme
	const isCar = !!campaign?.car;
	const isProduct = campaign?.itemType === "product" || campaign?.item_type === "product";
	const isActual = campaign?.itemType === "actual" || campaign?.item_type === "actual";

	// Gorsel URL'leri
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
	const { isFavorite, toggle, canToggle } = useFavorite("campaign", favoriteId);

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

	// Kampanya tipi ikonu
	const getCampaignTypeIcon = () => {
		if (isCar) return <Car className="h-4 w-4" />;
		if (isProduct) return <Package className="h-4 w-4" />;
		if (isActual) return <Newspaper className="h-4 w-4" />;
		return <Tag className="h-4 w-4" />;
	};

	// Kampanya tipi etiketi
	const getCampaignTypeLabel = () => {
		if (isCar) return "Arac Kampanyasi";
		if (isProduct) return "Urun Kampanyasi";
		if (isActual) return "Aktuel Katalog";
		return "Kampanya";
	};

	// Ana gorsel
	const mainImage = campaign.mainImage || campaign.image;

	return (
		<section className="relative bg-slate-800 overflow-hidden">
			{/* Arka Plan - Sag gorselin opacityli, uzatilmis hali */}
			<div className="absolute inset-0">
				{/* Ana gorsel - uzatilmis, opacityli */}
				<div className="absolute inset-0 flex items-center justify-center">
					<img
						src={getImageUrl(mainImage)}
						alt=""
						className="w-full h-full object-cover scale-110 opacity-25"
					/>
				</div>
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800/70" />
				<div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-slate-800/80" />
				{/* Border efekti - ust ve alt cizgi */}
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			</div>

			{/* Icerik */}
			<div className="relative">
				{/* Breadcrumb */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
					<nav className="flex items-center gap-2 text-sm flex-wrap">
						<Link href="/" className="text-slate-300 hover:text-white transition-colors">
							Anasayfa
						</Link>
						{campaign.categories?.[0] && (
							<>
								<ChevronRight className="h-3.5 w-3.5 text-slate-500" />
								<Link
									href={`/kategori/${campaign.categories[0].slug}`}
									className="text-slate-300 hover:text-white transition-colors"
								>
									{campaign.categories[0].name}
								</Link>
							</>
						)}
						{campaign.brands?.[0] && (
							<>
								<ChevronRight className="h-3.5 w-3.5 text-slate-500" />
								<Link
									href={`/marka/${campaign.brands[0].slug}`}
									className="text-slate-300 hover:text-white transition-colors"
								>
									{campaign.brands[0].name}
								</Link>
							</>
						)}
						<ChevronRight className="h-3.5 w-3.5 text-slate-500" />
						<span className="text-white font-medium truncate max-w-[200px]">
							{campaign.title}
						</span>
					</nav>
				</div>

				{/* Ana Icerik */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
						{/* Sol Taraf - Bilgiler */}
						<div className="space-y-4">
							{/* Ust kisim: Marka + Kampanya Tipi */}
							<div className="flex items-center gap-3 flex-wrap">
								{/* Marka Logo - Kucuk */}
								{campaign.brands?.[0]?.logo && (
									<Link href={`/marka/${campaign.brands[0].slug}`}>
										<div className="bg-white rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow">
											<Image
												src={getBrandLogo(campaign.brands[0].logo)}
												alt={campaign.brands[0].name}
												width={80}
												height={28}
												className="h-6 w-auto object-contain"
											/>
										</div>
									</Link>
								)}

								{/* Kampanya Tipi Badge */}
								<Badge className="bg-orange-500/90 text-white border-0 px-2.5 py-1 text-xs font-medium">
									{getCampaignTypeIcon()}
									<span className="ml-1">{getCampaignTypeLabel()}</span>
								</Badge>
							</div>

							{/* Baslik */}
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
								{campaign.title}
							</h1>

							{/* Aciklama */}
							{campaign.description && (
								<p className="text-slate-300 text-base leading-relaxed line-clamp-2">
									{campaign.description}
								</p>
							)}

							{/* Durum Badge'leri */}
							<div className="flex items-center gap-2 flex-wrap">
								{isActual ? (
									<Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium">
										<Newspaper className="h-3.5 w-3.5 mr-1" />
										Aktuel Katalog
									</Badge>
								) : hasEndDate ? (
									!isExpired ? (
										<Badge
											className={`px-3 py-1 text-xs font-medium text-white ${
												remainingDays <= 3
													? "bg-red-500"
													: remainingDays <= 7
														? "bg-orange-500"
														: "bg-emerald-500"
											}`}
										>
											<Clock className="h-3.5 w-3.5 mr-1" />
											{remainingDays === 0 ? "Son Gun!" : `Son ${remainingDays} Gun`}
										</Badge>
									) : (
										<Badge className="bg-red-500/80 text-white px-3 py-1 text-xs font-medium">
											<Clock className="h-3.5 w-3.5 mr-1" />
											Sona Erdi
										</Badge>
									)
								) : (
									<Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-medium">
										<Clock className="h-3.5 w-3.5 mr-1" />
										Devam Ediyor
									</Badge>
								)}

								{campaign.categories?.[0] && (
									<Badge variant="outline" className="text-slate-200 border-slate-500 px-3 py-1 text-xs">
										{campaign.categories[0].name}
									</Badge>
								)}
							</div>

							{/* Tarih Bilgisi */}
							{(campaign.start_date || campaign.end_date) && (
								<div className="flex items-center gap-2 text-slate-300 text-sm">
									<Calendar className="h-4 w-4 text-orange-400" />
									<span>
										{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
									</span>
								</div>
							)}

							{/* Aksiyon Butonlari */}
							<div className="flex items-center gap-3 pt-2 flex-wrap">
								{campaign.link && !isExpired && (
									<Button
										asChild
										className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
									>
										<a href={campaign.link} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-4 w-4 mr-1.5" />
											{isActual ? "Markete Git" : "Kampanyaya Git"}
										</a>
									</Button>
								)}

								{/* Katalog Indir - Aktuel icin */}
								{hasDownloadableFiles && downloadableFiles.length === 1 && (
									<Button
										variant="outline"
										className="border-slate-500 text-white hover:bg-slate-600/50"
										asChild
									>
										<a href={getDownloadUrl(downloadableFiles[0])}>
											<Download className="h-4 w-4 mr-1.5" />
											Katalog Indir
										</a>
									</Button>
								)}

								{hasDownloadableFiles && downloadableFiles.length > 1 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" className="border-slate-500 text-white hover:bg-slate-600/50">
												<Download className="h-4 w-4 mr-1.5" />
												Katalog Indir
												<span className="ml-1.5 text-xs bg-slate-600 px-1.5 py-0.5 rounded">
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
									variant="outline"
									onClick={canToggle ? toggle : undefined}
									className={`border-white/40 text-white hover:bg-white/10 cursor-pointer ${
										isFavorite ? "bg-red-500/20 border-red-400/50 text-red-300" : ""
									} ${!canToggle ? "opacity-90" : ""}`}
								>
									<Heart className="h-4 w-4 mr-1.5" fill={isFavorite ? "currentColor" : "none"} />
									{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
								</Button>
							</div>
						</div>

						{/* Sag Taraf - Gorsel */}
						<div className="relative flex justify-center lg:justify-end">
							<div className="relative w-full max-w-md">
								{/* Ana Gorsel */}
								<div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-xl">
									<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
										<Image
											src={getImageUrl(mainImage)}
											alt={campaign.title}
											fill
											className="object-contain p-2"
											sizes="(max-width: 1024px) 100vw, 400px"
											priority
										/>
									</div>

									{/* Marka Logo Overlay - Kucuk */}
									{campaign.brands?.[0]?.logo && (
										<div className="absolute bottom-5 right-5 bg-white rounded-md px-2 py-1 shadow-lg">
											<Image
												src={getBrandLogo(campaign.brands[0].logo)}
												alt={campaign.brands[0].name}
												width={60}
												height={24}
												className="h-5 w-auto object-contain"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
