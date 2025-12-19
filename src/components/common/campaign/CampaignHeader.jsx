import {
	Calendar,
	ChevronRight,
	Clock,
	ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IMAGE_BASE_URL } from "@/constants/site";
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

	return (
		<section className="bg-[#FFFAF4]">
			{/* Breadcrumb */}
			<div className="xl:mx-auto xl:px-36">
				<div className="container px-4 py-4">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href="/"
									className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
								>
									Anasayfa
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator>
								<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
							</BreadcrumbSeparator>
							{campaign.categories?.[0] && (
								<>
									<BreadcrumbItem>
										<BreadcrumbLink
											href={`/kategori/${campaign.categories[0].slug}`}
											className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
										>
											{campaign.categories[0].name}
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator>
										<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
									</BreadcrumbSeparator>
								</>
							)}
							{campaign.brands?.[0] && (
								<>
									<BreadcrumbItem>
										<BreadcrumbLink
											href={`/marka/${campaign.brands[0].slug}`}
											className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
										>
											{campaign.brands[0].name}
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator>
										<ChevronRight className="h-3.5 w-3.5 text-gray-400" />
									</BreadcrumbSeparator>
								</>
							)}
							<BreadcrumbItem>
								<BreadcrumbPage className="text-gray-900 font-medium text-sm">
									{campaign.title.length > 50
										? `${campaign.title.substring(0, 50)}...`
										: campaign.title}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</div>

			{/* Hero Section */}
			<div className="xl:mx-auto xl:px-36 pb-8">
				<div className="container px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl">
						{/* Sol Taraf - Lacivert Alan */}
						<div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] p-8 lg:p-12 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
							{/* Dekoratif Pattern */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

							<div className="relative z-10 space-y-6">
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
							<div className="relative z-10 flex items-center gap-4">
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
						</div>

						{/* Sağ Taraf - Ürün Görseli */}
						<div className="relative bg-gradient-to-br from-gray-50 to-white min-h-[400px] flex items-center justify-center p-8">
							<div className="relative w-full h-full">
								<Image
									src={getImageUrl(campaign.image)}
									alt={campaign.title}
									fill
									className="object-contain"
									sizes="(max-width: 1024px) 100vw, 50vw"
									priority
									onError={(e) => {
										e.currentTarget.src =
											"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
