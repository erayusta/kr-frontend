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

export default function UnifiedCampaignHeader({ campaign }) {
	// Kampanya tipi belirleme
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

	// Ana gorsel
	const mainImage = campaign.mainImage || campaign.image;

	return (
		<section className="bg-[#fffaf4]">
			<div className="relative overflow-hidden rounded-lg mx-4 lg:mx-8 xl:mx-16">
				{/* Arka Plan - Kampanya gorseli watermark olarak */}
				<div className="absolute inset-0">
					<img
						src={getImageUrl(mainImage)}
						alt=""
						className="absolute right-0 top-0 h-full w-auto max-w-[60%] object-contain opacity-20"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/95 to-transparent" />
				</div>

				{/* Icerik */}
				<div className="relative px-6 lg:px-12 py-10 lg:py-14">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
						{/* Sol Taraf - Bilgiler */}
						<div className="space-y-5">
							{/* Breadcrumb */}
							<nav className="flex items-center gap-2 text-sm flex-wrap">
								<Link href="/" className="text-gray-300 hover:text-white transition-colors">
									Anasayfa
								</Link>
								{campaign.categories?.[0] && (
									<>
										<ChevronRight className="h-4 w-4 text-gray-500" />
										<Link
											href={`/kategori/${campaign.categories[0].slug}`}
											className="text-gray-300 hover:text-white transition-colors"
										>
											{campaign.categories[0].name}
										</Link>
									</>
								)}
								{campaign.brands?.[0] && (
									<>
										<ChevronRight className="h-4 w-4 text-gray-500" />
										<Link
											href={`/marka/${campaign.brands[0].slug}`}
											className="text-gray-300 hover:text-white transition-colors"
										>
											{campaign.brands[0].name}
										</Link>
									</>
								)}
								<ChevronRight className="h-4 w-4 text-gray-500" />
								<span className="text-white font-medium truncate max-w-[200px]">
									{campaign.title}
								</span>
							</nav>

							{/* Marka Logo */}
							{campaign.brands?.[0]?.logo && (
								<Link href={`/marka/${campaign.brands[0].slug}`}>
									<div className="inline-flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm">
										<Image
											src={getBrandLogo(campaign.brands[0].logo)}
											alt={campaign.brands[0].name}
											width={40}
											height={40}
											className="h-10 w-10 object-contain"
										/>
										<span className="text-sm font-medium text-gray-700">
											{campaign.brands[0].name}
										</span>
									</div>
								</Link>
							)}

							{/* Baslik */}
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
								{campaign.title}
							</h1>

							{/* Aciklama */}
							{campaign.description && (
								<p className="text-gray-300 text-base leading-relaxed">
									{campaign.description}
								</p>
							)}

							{/* Durum Badge'leri */}
							<div className="flex items-center gap-3 flex-wrap">
								{isActual ? (
									<Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm font-medium rounded-full">
										<Newspaper className="h-4 w-4 mr-1.5" />
										Aktuel Katalog
									</Badge>
								) : hasEndDate ? (
									!isExpired ? (
										<Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-sm font-medium rounded-full">
											<Clock className="h-4 w-4 mr-1.5" />
											Son {remainingDays} Gun
										</Badge>
									) : (
										<Badge className="bg-red-500 text-white px-4 py-1.5 text-sm font-medium rounded-full">
											<Clock className="h-4 w-4 mr-1.5" />
											Kampanya Sona Erdi
										</Badge>
									)
								) : (
									<Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-sm font-medium rounded-full">
										<Clock className="h-4 w-4 mr-1.5" />
										Devam Ediyor
									</Badge>
								)}

								{campaign.categories?.[0] && (
									<Badge variant="outline" className="text-white border-gray-500 px-4 py-1.5 text-sm rounded-full">
										{campaign.categories[0].name}
									</Badge>
								)}
							</div>

							{/* Tarih Bilgisi */}
							{(campaign.start_date || campaign.end_date) && (
								<div className="flex items-center gap-2 text-gray-300 text-sm">
									<Calendar className="h-4 w-4" />
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
										className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6"
									>
										<a href={campaign.link} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-4 w-4 mr-2" />
											{isActual ? "Markete Git" : "Kampanyaya Git"}
										</a>
									</Button>
								)}

								{/* Katalog Indir - Aktuel icin */}
								{hasDownloadableFiles && downloadableFiles.length === 1 && (
									<Button
										asChild
										className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
									>
										<a href={getDownloadUrl(downloadableFiles[0])}>
											<Download className="h-4 w-4 mr-2" />
											Katalog Indir
										</a>
									</Button>
								)}

								{hasDownloadableFiles && downloadableFiles.length > 1 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
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
									onClick={canToggle ? toggle : undefined}
									variant="outline"
									className={`rounded-full px-6 ${
										isFavorite
											? "bg-gray-100 border-gray-300 text-gray-700"
											: "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
									}`}
								>
									<Heart
										className={`h-4 w-4 mr-2 ${isFavorite ? "text-red-500" : ""}`}
										fill={isFavorite ? "currentColor" : "none"}
									/>
									{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
								</Button>
							</div>
						</div>

						{/* Sag Taraf - Gorsel */}
						<div className="relative flex justify-center lg:justify-end">
							<div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
								{/* Gorsel Cercevesi */}
								<div className="relative bg-white rounded-2xl p-2 shadow-2xl">
									<div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl">
										<Image
											src={getImageUrl(mainImage)}
											alt={campaign.title}
											fill
											className="object-contain"
											sizes="(max-width: 1024px) 100vw, 450px"
											priority
										/>
									</div>

									{/* Marka Logo Overlay */}
									{campaign.brands?.[0]?.logo && (
										<div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
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

								{/* Dekoratif arka plan efekti */}
								<div className="absolute -inset-4 bg-gradient-to-br from-orange-200/30 to-purple-200/30 rounded-3xl -z-10 blur-xl" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
