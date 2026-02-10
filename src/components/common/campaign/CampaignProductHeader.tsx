import { ChevronRight, Clock, Heart, Megaphone, Tag, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFavorite } from "@/hooks/useFavorite";
import AuthDialog from "@/components/common/auth/AuthDialog";

type CampaignBrand = { logo?: string; name?: string };
type CampaignCategory = { id?: string | number; name?: string };

type Campaign = {
	id?: string | number;
	_id?: string | number;
	slug?: string;
	title?: string;
	image?: string;
	link?: string | null;
	start_date?: string;
	end_date?: string;
	endDate?: string;
	brands?: CampaignBrand[];
	categories?: CampaignCategory[];
	product?: unknown;
	item?: unknown;
};

type Store = {
	storeBrand?: string;
	link?: string | null;
	stock_availability?: string;
	price?: number | string | null;
	[key: string]: unknown;
};

type PriceEntry = {
	store?: string;
	price?: number | string | null;
	[key: string]: unknown;
};

export default function CampaignProductHeader({ campaign }: { campaign: Campaign }) {
	const getImageUrl = (image?: string) => {
		if (!image)
			return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
		if (image.startsWith("http")) return image;
		return image;
	};

	const calculateRemainingDays = (endDate) => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diff = Math.ceil(
			(end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);
		return diff;
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

	const remainingDays = calculateRemainingDays(
		campaign.end_date || campaign.endDate,
	);

	const productData = (campaign?.product || campaign?.item || {}) as {
		stores?: unknown;
		latest_prices?: unknown;
		latestPrices?: unknown;
		display_mode?: string;
		description?: string;
		title?: string;
	};

	const displayMode = productData?.display_mode || "price_comparison";

	const stores: Store[] = Array.isArray(productData?.stores)
		? (productData.stores as Store[])
		: [];
	const latestPrices: PriceEntry[] = Array.isArray(productData?.latest_prices)
		? (productData.latest_prices as PriceEntry[])
		: Array.isArray(productData?.latestPrices)
			? (productData.latestPrices as PriceEntry[])
			: [];

	const storeByBrand = new Map<string, Store>(
		stores
			.filter((s) => typeof s?.storeBrand === "string" && s.storeBrand.length > 0)
			.map((s) => [s.storeBrand as string, s]),
	);

	const latestStores: Store[] =
		latestPrices.length > 0
			? latestPrices
					.filter((p) => typeof p?.store === "string" && p.store.length > 0)
					.map((p) => {
						const storeBrand = p.store as string;
						const matchedStore = storeByBrand.get(storeBrand);
						const priceNum = Number(p.price);

						return {
							...(matchedStore || {}),
							storeBrand,
							price: Number.isFinite(priceNum) ? priceNum : null,
							link: matchedStore?.link || campaign?.link || null,
							stock_availability:
								matchedStore?.stock_availability ||
								(priceNum > 0 ? "in stock" : "out of stock"),
						};
					})
			: stores;

	const lowestPrice = latestStores
		.filter((s) => {
			const priceNum = Number(s?.price);
			const isInStock =
				typeof s?.stock_availability === "string"
					? s.stock_availability === "in stock"
					: true;
			return Number.isFinite(priceNum) && priceNum > 0 && isInStock;
		})
		.sort((a, b) => Number(a.price) - Number(b.price))[0];

	const brandLogo = campaign?.brands?.[0]?.logo;
	const brandName = campaign?.brands?.[0]?.name;
	const categories = campaign?.categories || [];
	const priceSourceCount =
		latestPrices.length > 0 ? latestPrices.length : stores.length;

	const favoriteId = campaign?.id ?? campaign?._id ?? campaign?.slug;
	const { isFavorite, toggle, isLoggedIn } = useFavorite("campaign", favoriteId);
	const [authOpen, setAuthOpen] = useState(false);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		if (!isLoggedIn) {
			e.preventDefault();
			e.stopPropagation();
			setAuthOpen(true);
			return;
		}
		toggle(e);
	};

	const formatPrice = (price) => {
		if (!price) return "";
		return new Intl.NumberFormat("tr-TR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	// Display mode configs
	const modeConfig = {
		price_comparison: {
			badgeLabel: priceSourceCount > 0 ? `${priceSourceCount} mağazada karşılaştırıldı` : "Fiyat Karşılaştırma",
			badgeColor: "#14b8a6",
			badgeIcon: <Tag className="h-3 w-3" />,
			ctaLabel: lowestPrice?.link ? "Mağazaya Git" : "Kampanyaya Git",
			ctaLink: lowestPrice?.link || campaign?.link,
		},
		announcement: {
			badgeLabel: "Duyuru",
			badgeColor: "#3b82f6",
			badgeIcon: <Megaphone className="h-3 w-3" />,
			ctaLabel: "Kampanyaya Git",
			ctaLink: campaign?.link,
		},
		promotion: {
			badgeLabel: "Promosyon",
			badgeColor: "#8b5cf6",
			badgeIcon: <Zap className="h-3 w-3" />,
			ctaLabel: "Kampanyaya Git",
			ctaLink: campaign?.link,
		},
	};

	const config = modeConfig[displayMode] || modeConfig.price_comparison;

	// Button styles
	const primaryButtonStyle = {
		backgroundColor: displayMode === "announcement" ? "#3b82f6" : displayMode === "promotion" ? "#8b5cf6" : "#f97316",
		color: "white",
		padding: "12px 24px",
		borderRadius: "12px",
		fontWeight: 600,
		display: "inline-flex",
		alignItems: "center",
		gap: "8px",
		textDecoration: "none",
		transition: "background-color 0.2s",
	};

	const hoverColor = displayMode === "announcement" ? "#2563eb" : displayMode === "promotion" ? "#7c3aed" : "#ea580c";
	const normalColor = primaryButtonStyle.backgroundColor;

	return (
		<section className="border-b border-gray-200">
			{/* Breadcrumb */}
			<div className="container mx-auto py-2">
				<nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
					<span className="hover:text-orange-500 transition-colors cursor-pointer">
						Ana Sayfa
					</span>
					{categories.map((category) => (
						<span key={category.id} className="flex items-center gap-2">
							<ChevronRight className="h-3 w-3" />
							<span className="hover:text-orange-500 transition-colors cursor-pointer">
								{category.name}
							</span>
						</span>
					))}
					{brandName && (
						<>
							<ChevronRight className="h-3 w-3" />
							<span className="text-gray-700 font-medium">{brandName}</span>
						</>
					)}
				</nav>
			</div>

			{/* Main Header Content */}
			<div className="container mx-auto px-4 py-2">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
					{/* Product Image */}
					<div className="lg:col-span-4 flex items-center justify-center">
						<Card className="w-full max-w-[240px]">
							<div className="relative w-full aspect-square p-3">
								<Image
									src={getImageUrl(campaign.image)}
									alt={campaign.title || "Kampanya görseli"}
									fill
									className="object-contain"
									sizes="240px"
									priority
								/>
							</div>
						</Card>
					</div>

					{/* Product Info */}
					<div className="lg:col-span-8 flex flex-col">
						<div className="flex-[4] space-y-4">
							{/* Title & Badge */}
							<div className="space-y-2">
								<h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
									{campaign.title}
								</h1>

								{/* Display Mode Badge */}
								<div className="flex flex-wrap gap-2">
									<span
										className="inline-flex items-center gap-1 px-3 py-1 text-white text-xs font-semibold rounded-full"
										style={{ backgroundColor: config.badgeColor }}
									>
										{config.badgeIcon}
										{displayMode === "price_comparison" && categories.length > 0
											? `${categories[0]?.name?.toUpperCase()}: KAMPANYA`
											: config.badgeLabel.toUpperCase()}
									</span>
								</div>
							</div>

							{/* Price / Info Section */}
							<div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl">
								<div className="flex items-center justify-between gap-4 w-full">
									<div className="flex gap-4">
										{brandLogo && (
											<div className="relative w-16 h-16 rounded-lg border border-gray-200 p-2 bg-white">
												<Image
													src={brandLogo}
													alt={brandName || "Marka"}
													fill
													className="object-contain"
													sizes="64px"
												/>
											</div>
										)}
										<div>
											{/* Price Comparison Mode: show price info */}
											{displayMode === "price_comparison" && (
												<>
													<p
														className="text-xs font-semibold uppercase tracking-wide"
														style={{ color: "#ea580c" }}
													>
														{priceSourceCount > 0
															? `${priceSourceCount} Fiyat Arasında En Ucuz`
															: "Kampanya Fiyatı"}
													</p>
													<p className="text-xs text-gray-500">{brandName}</p>
													{lowestPrice ? (
														<p className="text-3xl font-bold text-gray-900 mt-1">
															{formatPrice(lowestPrice.price)}{" "}
															<span className="text-lg font-semibold">TL</span>
														</p>
													) : (
														<p
															className="text-lg font-semibold mt-1"
															style={{ color: "#ea580c" }}
														>
															Fiyat için siteyi ziyaret edin
														</p>
													)}
												</>
											)}

											{/* Announcement Mode: show description */}
											{displayMode === "announcement" && (
												<>
													<p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
														Ürün Duyurusu
													</p>
													<p className="text-xs text-gray-500">{brandName}</p>
													{productData?.description ? (
														<p className="text-sm text-gray-700 mt-1 line-clamp-2">
															{productData.description}
														</p>
													) : (
														<p className="text-sm text-gray-500 mt-1">
															Detaylar için kampanya sayfasını ziyaret edin
														</p>
													)}
												</>
											)}

											{/* Promotion Mode: show promo highlight */}
											{displayMode === "promotion" && (
												<>
													<p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
														Özel Promosyon
													</p>
													<p className="text-xs text-gray-500">{brandName}</p>
													{lowestPrice ? (
														<p className="text-3xl font-bold text-gray-900 mt-1">
															{formatPrice(lowestPrice.price)}{" "}
															<span className="text-lg font-semibold">TL</span>
														</p>
													) : (
														<p className="text-sm text-gray-700 mt-1">
															Fırsatı kaçırmayın!
														</p>
													)}
												</>
											)}
										</div>
									</div>

									<div className="flex flex-col gap-2">
										{/* Price comparison: show store link if available */}
										{displayMode === "price_comparison" && lowestPrice?.link && (
											<a
												href={lowestPrice.link as string}
												target="_blank"
												rel="noopener noreferrer"
												style={primaryButtonStyle}
												onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverColor; }}
												onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = normalColor; }}
											>
												Mağazaya Git
												<ChevronRight className="h-4 w-4" />
											</a>
										)}

										{/* Show campaign link for non-price_comparison modes, or for price_comparison only when campaign.link exists and differs from store link */}
										{config.ctaLink && !(displayMode === "price_comparison" && lowestPrice?.link && config.ctaLink === lowestPrice.link) && (
											<a
												href={config.ctaLink as string}
												target="_blank"
												rel="noopener noreferrer"
												style={primaryButtonStyle}
												onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverColor; }}
												onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = normalColor; }}
											>
												{config.ctaLabel}
												<ChevronRight className="h-4 w-4" />
											</a>
										)}
									</div>
								</div>
							</div>
						</div>

						<Separator className="my-4" />

						<div className="mt-4">
							{/* Campaign Period & Actions */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								{/* Remaining Days Badge */}
								{remainingDays !== null && (
									<div
										className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
										style={{
											backgroundColor:
												remainingDays < 0
													? "#fee2e2"
													: remainingDays <= 7
														? "#ffedd5"
														: "#dcfce7",
											color:
												remainingDays < 0
													? "#b91c1c"
													: remainingDays <= 7
														? "#c2410c"
														: "#15803d",
										}}
									>
										<Clock className="h-4 w-4" />
										{remainingDays < 0 ? (
											<span>Kampanya Sona Erdi</span>
										) : (
											<span>
												Son{" "}
												<strong className="font-bold">{remainingDays}</strong>{" "}
												gün
											</span>
										)}
									</div>
								)}

								{/* Action Buttons */}
								<div className="flex items-center gap-3">
									<button
										type="button"
										aria-pressed={isFavorite}
										onClick={handleFavoriteClick}
										className={`inline-flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
											isFavorite
												? "border-orange-400 text-orange-700 bg-orange-50"
												: "border-gray-200 hover:border-orange-300 text-gray-700"
										}`}
										style={{ backgroundColor: "transparent" }}
									>
										<Heart
											className="h-4 w-4"
											fill={isFavorite ? "currentColor" : "none"}
										/>
										{isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
									</button>
									<AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
								</div>
							</div>

							{/* Campaign Date Range */}
							{(campaign.start_date || campaign.end_date) && (
								<p className="text-sm text-gray-500 mt-2">
									Kampanya Tarihi:{" "}
									<span className="font-medium text-gray-700">
										{formatDate(campaign.start_date)} -{" "}
										{formatDate(campaign.end_date)}
									</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
