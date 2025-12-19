import { Calendar, CarFront, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getImageUrl } from "@/utils/imageUtils";

export default function CampaignCarHeader({ campaign }) {

	const remainingDays = campaign.remainingDays ?? 2;
	const isExpired = remainingDays < 0;

	return (
		<section className="xl:mx-auto xl:px-36  bg-[#fffaf4]">
			<div className="relative overflow-hidden rounded-md">
				{/* Background */}
				<img
					src={getImageUrl(campaign.image, "car")}
					alt={campaign.title}
					className="absolute inset-0 w-full h-full object-cover opacity-30"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent" />

				{/* Content */}
				<div className="relative container mx-auto px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
					{/* Left Section */}
					<div className="space-y-6">
						{/* Breadcrumb */}
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink
										href="/"
										className="text-white/80 hover:text-white font-medium text-sm tracking-wide transition-colors"
									>
										Anasayfa
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>
									<ChevronRight className="h-3.5 w-3.5 text-white/70" />
								</BreadcrumbSeparator>

								{campaign.categories?.[0] && (
									<>
										<BreadcrumbItem>
											<BreadcrumbLink
												href={`/kategori/${campaign.categories[0].slug}`}
												className="text-white/80 hover:text-white font-medium text-sm tracking-wide transition-colors"
											>
												{campaign.categories[0].name}
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator>
											<ChevronRight className="h-3.5 w-3.5 text-white/70" />
										</BreadcrumbSeparator>
									</>
								)}

								<BreadcrumbItem>
									<BreadcrumbPage className="text-white font-semibold text-sm">
										{campaign.title.length > 40
											? campaign.title.substring(0, 40) + "..."
											: campaign.title}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>

						{/* Category + Icon */}
						<div className="flex items-center gap-3">
							{campaign.categories?.[0] && (
								<Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm px-3 py-1 text-sm">
									{campaign.categories[0].name}
								</Badge>
							)}
						</div>

						{/* Title */}
						<div className="flex justify-center items-center gap-4">
							<div className="bg-orange-500 rounded-full p-3 shadow-md shadow-orange-500/30">
								<CarFront className="h-5 w-5 text-white" />
							</div>
							<h1 className=" flex-1 text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
								{campaign.title}
							</h1>
						</div>

						{/* Meta Info */}
						<div className="flex flex-wrap items-center gap-4 text-sm">
							{/* Time Remaining */}
							<div
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm transition-colors ${
									isExpired
										? "bg-red-500/20 text-red-100 border-red-400/30"
										: remainingDays <= 7
											? "bg-orange-500/20 text-orange-100 border-orange-400/30"
											: "bg-green-500/20 text-green-100 border-green-400/30"
								}`}
							>
								<Clock className="h-4 w-4" />
								<span className="font-medium">
									{isExpired
										? "Kampanya Sona Erdi"
										: remainingDays === 0
											? "Son Gün!"
											: `Son ${remainingDays} Gün`}
								</span>
							</div>

							{/* Date Range */}
							{campaign.dateRange && (
								<div className="inline-flex items-center gap-2 text-white/80">
									<Calendar className="h-4 w-4" />
									<span>{campaign.dateRange}</span>
								</div>
							)}

							{/* Brand */}
							{campaign.brand && (
								<div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
									<span className="text-white font-medium">
										{campaign.brand}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Right Section - Image */}
					<div className="relative flex justify-center lg:justify-end">
						<img
							src={getImageUrl(campaign.mainImage || campaign.image)}
							alt={campaign.title}
							className="max-w-lg h-auto object-contain drop-shadow-2xl rounded-xl"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src =
									"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
