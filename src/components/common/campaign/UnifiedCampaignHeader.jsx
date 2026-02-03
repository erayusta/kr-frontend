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
		if (isCar) return <Car className="h-5 w-5" />;
		if (isProduct) return <Package className="h-5 w-5" />;
		if (isActual) return <Newspaper className="h-5 w-5" />;
		return <Tag className="h-5 w-5" />;
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
		<section className="relative bg-slate-900">
			{/* Arka Plan Gorseli */}
			<div className="absolute inset-0">
				<img
					src={getImageUrl(mainImage)}
					alt={campaign.title}
					className="w-full h-full object-cover opacity-20"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70" />
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
			</div>

			{/* Icerik */}
			<div className="relative">
				{/* Breadcrumb */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
					<nav className="flex items-center gap-2 text-sm flex-wrap">
						<Link href="/" className="text-white/60 hover:text-white transition-colors">
							Anasayfa
						</Link>
						{campaign.categories?.[0] && (
							<>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<Link
									href={`/kategori/${campaign.categories[0].slug}`}
									className="text-white/60 hover:text-white transition-colors"
								>
									{campaign.categories[0].name}
								</Link>
							</>
						)}
						{campaign.brands?.[0] && (
							<>
								<ChevronRight className="h-4 w-4 text-white/40" />
								<Link
									href={`/marka/${campaign.brands[0].slug}`}
									className="text-white/60 hover:text-white transition-colors"
								>
									{campaign.brands[0].name}
								</Link>
							</>
						)}
						<ChevronRight className="h-4 w-4 text-white/40" />
						<span className="text-white font-medium truncate max-w-[250px]">
							{campaign.title}
						</span>
					</nav>
				</div>

				{/* Ana Icerik */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						{/* Sol Taraf - Bilgiler */}
						<div className="space-y-6">
							{/* Kampanya Tipi Badge */}
							<div className="flex items-center gap-3">
								<Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 backdrop-blur-sm px-3 py-1.5">
									{getCampaignTypeIcon()}
									<span className="ml-1.5">{getCampaignTypeLabel()}</span>
								</Badge>
							</div>

							{/* Marka Logo */}
							{campaign.brands?.[0]?.logo && (
								<Link href={`/marka/${campaign.brands[0].slug}`} className="inline-block">
									<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block border border-white/10">
										<Image
											src={getBrandLogo(campaign.brands[0].logo)}
											alt={campaign.brands[0].name}
											width={140}
											height={56}
											className="h-12 w-auto object-contain brightness-0 invert"
										/>
									</div>
								</Link>
							)}

							{/* Baslik */}
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
								{campaign.title}
							</h1>

							{/* Aciklama */}
							{campaign.description && (
								<p className="text-white/70 text-lg leading-relaxed max-w-xl">
									{campaign.description}
								</p>
							)}

							{/* Durum Badge'leri */}
							<div className="flex items-center gap-3 flex-wrap">
								{isActual ? (
									<Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium">
										<Newspaper className="h-4 w-4 mr-2" />
										Aktuel Katalog
									</Badge>
								) : hasEndDate ? (
									!isExpired ? (
										<Badge
											className={`px-4 py-2 text-sm font-medium ${
												remainingDays <= 3
													? "bg-red-500 hover:bg-red-600"
													: remainingDays <= 7
														? "bg-orange-500 hover:bg-orange-600"
														: "bg-green-500 hover:bg-green-600"
											} text-white`}
										>
											<Clock className="h-4 w-4 mr-2" />
											{remainingDays === 0 ? "Son Gun!" : `Son ${remainingDays} Gun`}
										</Badge>
									) : (
										<Badge className="bg-red-500/80 text-white px-4 py-2 text-sm font-medium">
											<Clock className="h-4 w-4 mr-2" />
											Kampanya Sona Erdi
										</Badge>
									)
								) : (
									<Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium">
										<Clock className="h-4 w-4 mr-2" />
										Devam Ediyor
									</Badge>
								)}

								{campaign.categories?.[0] && (
									<Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm">
										{campaign.categories[0].name}
									</Badge>
								)}
							</div>

							{/* Tarih Bilgisi */}
							{(campaign.start_date || campaign.end_date) && (
								<div className="flex items-center gap-3 text-white/70">
									<Calendar className="h-5 w-5 text-orange-400" />
									<span className="text-base">
										{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
									</span>
								</div>
							)}

							{/* Aksiyon Butonlari */}
							<div className="flex items-center gap-4 pt-4 flex-wrap">
								{campaign.link && !isExpired && (
									<Button
										asChild
										size="lg"
										className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
									>
										<a href={campaign.link} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-5 w-5 mr-2" />
											{isActual ? "Markete Git" : "Kampanyaya Git"}
										</a>
									</Button>
								)}

								{/* Katalog Indir - Aktuel icin */}
								{hasDownloadableFiles && downloadableFiles.length === 1 && (
									<Button
										variant="outline"
										size="lg"
										className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
										asChild
									>
										<a href={getDownloadUrl(downloadableFiles[0])}>
											<Download className="h-5 w-5 mr-2" />
											Katalog Indir
										</a>
									</Button>
								)}

								{hasDownloadableFiles && downloadableFiles.length > 1 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												size="lg"
												className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
											>
												<Download className="h-5 w-5 mr-2" />
												Katalog Indir
												<span className="ml-2 text-xs bg-blue-500/30 px-2 py-0.5 rounded-full">
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
															<FileText
																className={`h-4 w-4 mr-2 ${isPdf ? "text-red-500" : "text-blue-500"}`}
															/>
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
									size="lg"
									disabled={!canToggle}
									onClick={toggle}
									className={`border-white/30 text-white hover:bg-white/10 ${
										isFavorite ? "bg-red-500/20 border-red-400/50 text-red-300" : ""
									}`}
								>
									<Heart className="h-5 w-5 mr-2" fill={isFavorite ? "currentColor" : "none"} />
									{isFavorite ? "Favorilerde" : "Favorilere Ekle"}
								</Button>
							</div>
						</div>

						{/* Sag Taraf - Gorsel */}
						<div className="relative flex justify-center lg:justify-end">
							<div className="relative">
								{/* Ana Gorsel */}
								<div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl">
									<div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5">
										<Image
											src={getImageUrl(mainImage)}
											alt={campaign.title}
											fill
											className="object-contain p-4"
											sizes="(max-width: 1024px) 100vw, 500px"
											priority
										/>
									</div>

									{/* Marka Logo Overlay */}
									{campaign.brands?.[0]?.logo && (
										<div className="absolute bottom-6 right-6 bg-white rounded-lg px-4 py-2 shadow-xl">
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

								{/* Dekoratif Elementler */}
								<div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
								<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
