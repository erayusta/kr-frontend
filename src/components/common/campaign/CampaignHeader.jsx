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

export default function CampaignHeader({ campaign }) {
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

	// Check if campaign is actual type
	const isActual = campaign?.itemType === "actual" || campaign?.item_type === "actual";

	// Get actual files for download (PDF/images)
	const actualFiles = campaign?.actualsUrls || campaign?.actuals_urls || campaign?.actuals || [];
	const normalizeFileUrl = (url) => {
		if (!url) return null;
		if (url.startsWith("http")) return url;
		return `https://kampanyaradar-static.b-cdn.net/kampanyaradar/${url.replace(/^\//, '')}`;
	};
	const downloadableFiles = actualFiles.map(normalizeFileUrl).filter(Boolean);
	const hasDownloadableFiles = isActual && downloadableFiles.length > 0;

	// Check if dates exist
	const hasEndDate = campaign.end_date || campaign.endDate;
	const remainingDays = hasEndDate ? remainingDay(campaign.end_date || campaign.endDate) : null;
	const isExpired = remainingDays !== null && remainingDays < 0;

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
		<section className="bg-white border-b">
			{/* Breadcrumb */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center gap-2 py-4 text-sm">
					<Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">
						Anasayfa
					</Link>
					{campaign.categories?.[0] && (
						<>
							<ChevronRight className="h-4 w-4 text-gray-300" />
							<Link
								href={`/kategori/${campaign.categories[0].slug}`}
								className="text-gray-500 hover:text-orange-500 transition-colors"
							>
								{campaign.categories[0].name}
							</Link>
						</>
					)}
					{campaign.brands?.[0] && (
						<>
							<ChevronRight className="h-4 w-4 text-gray-300" />
							<Link
								href={`/marka/${campaign.brands[0].slug}`}
								className="text-gray-500 hover:text-orange-500 transition-colors"
							>
								{campaign.brands[0].name}
							</Link>
						</>
					)}
					<ChevronRight className="h-4 w-4 text-gray-300" />
					<span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
						{campaign.title}
					</span>
				</nav>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					{/* Sol Taraf - Bilgiler */}
					<div className="space-y-6">
						{/* Marka Logo */}
						{campaign.brands?.[0] && (
							<Link
								href={`/marka/${campaign.brands[0].slug}`}
								className="inline-block"
							>
								<div className="h-12 w-auto">
									<Image
										src={getBrandLogo(campaign.brands[0].logo)}
										alt={campaign.brands[0].name}
										width={120}
										height={48}
										className="h-full w-auto object-contain"
									/>
								</div>
							</Link>
						)}

						{/* Başlık */}
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
							{campaign.title}
						</h1>

						{/* Kısa Açıklama */}
						{campaign.description && (
							<p className="text-gray-600 text-base leading-relaxed">
								{campaign.description}
							</p>
						)}

						{/* Durum Badge'leri */}
						<div className="flex items-center gap-3 flex-wrap">
							{isActual ? (
								<Badge className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm font-medium">
									<Newspaper className="h-4 w-4 mr-1.5" />
									Aktüel Katalog
								</Badge>
							) : hasEndDate ? (
								!isExpired ? (
									<Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-sm font-medium">
										<Clock className="h-4 w-4 mr-1.5" />
										{remainingDays === 0 ? "Son Gün!" : `Son ${remainingDays} Gün`}
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
								<Badge variant="outline" className="px-3 py-1.5 text-sm">
									{campaign.categories[0].name}
								</Badge>
							)}
						</div>

						{/* Tarih Bilgisi */}
						{(campaign.start_date || campaign.end_date) && (
							<div className="flex items-center gap-2 text-gray-600">
								<Calendar className="h-5 w-5 text-gray-400" />
								<span>
									{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
								</span>
							</div>
						)}

						{/* Aksiyon Butonları */}
						<div className="flex items-center gap-3 pt-2 flex-wrap">
							{campaign.link && !isExpired && (
								<Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
									<a href={campaign.link} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="h-4 w-4 mr-2" />
										{isActual ? "Markete Git" : "Kampanyaya Git"}
									</a>
								</Button>
							)}

							{/* Katalog İndir Butonu - Sadece aktüel tipi için */}
							{hasDownloadableFiles && downloadableFiles.length === 1 && (
								<Button
									variant="outline"
									className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
									onClick={() => window.open(downloadableFiles[0], "_blank")}
								>
									<Download className="h-4 w-4 mr-2" />
									Katalog İndir
								</Button>
							)}

							{/* Birden fazla dosya varsa dropdown menü */}
							{hasDownloadableFiles && downloadableFiles.length > 1 && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
										>
											<Download className="h-4 w-4 mr-2" />
											Katalog İndir
											<span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
												{downloadableFiles.length}
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56">
										{downloadableFiles.map((url, index) => {
											const fileName = url.split("/").pop() || `Dosya ${index + 1}`;
											const isPdf = url.toLowerCase().endsWith(".pdf");
											return (
												<DropdownMenuItem
													key={index}
													onClick={() => window.open(url, "_blank")}
													className="cursor-pointer"
												>
													<FileText className={`h-4 w-4 mr-2 ${isPdf ? "text-red-500" : "text-blue-500"}`} />
													<span className="truncate">{fileName}</span>
												</DropdownMenuItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							<Button
								variant="outline"
								disabled={!canToggle}
								onClick={toggle}
								className={isFavorite ? "border-red-200 text-red-500 hover:bg-red-50" : ""}
							>
								<Heart
									className="h-4 w-4 mr-2"
									fill={isFavorite ? "currentColor" : "none"}
								/>
								{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
							</Button>
						</div>
					</div>

					{/* Sağ Taraf - Görsel */}
					<div className="relative">
						<div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
							<Image
								src={getImageUrl(campaign.image)}
								alt={campaign.title}
								fill
								className="object-contain p-4"
								sizes="(max-width: 1024px) 100vw, 50vw"
								priority
							/>

							{/* Marka Logo Overlay */}
							{campaign.brands?.[0] && (
								<div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
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
