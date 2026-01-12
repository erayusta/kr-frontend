import { Bell, ChevronRight, Clock, Heart, Tag } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFavorite } from "@/hooks/useFavorite";

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
	};
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
	const { isFavorite, toggle, canToggle } = useFavorite("campaign", favoriteId);

	const formatPrice = (price) => {
		if (!price) return "";
		return new Intl.NumberFormat("tr-TR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	// Button styles as objects for inline styling (fallback for Tailwind issues)
	const primaryButtonStyle = {
		backgroundColor: "#f97316",
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
									alt={campaign.title || "Kampanya gÃ¶rseli"}
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

								{/* Category Badge */}
								{categories.length > 0 && (
									<div className="flex flex-wrap gap-2">
										<span
											className="inline-flex items-center gap-1 px-3 py-1 text-white text-xs font-semibold rounded-full"
											style={{ backgroundColor: "#14b8a6" }}
										>
											<Tag className="h-3 w-3" />
											{categories[0]?.name?.toUpperCase()}: KAMPANYA
										</span>
									</div>
								)}
							</div>

							{/* Price Section */}
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
										</div>
									</div>

									<div className="flex flex-col gap-2">
										{lowestPrice?.link && (
											<a
												href={lowestPrice.link}
												target="_blank"
												rel="noopener noreferrer"
												style={primaryButtonStyle}
												onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ea580c"; }}
												onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f97316"; }}
											>
												Mağazaya Git
												<ChevronRight className="h-4 w-4" />
											</a>
										)}

										{campaign.link && (
											<a
												href={campaign.link}
												target="_blank"
												rel="noopener noreferrer"
												style={primaryButtonStyle}
												onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ea580c"; }}
												onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f97316"; }}
											>
												Kampanyaya Git
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
										disabled={!canToggle}
										aria-pressed={isFavorite}
										onClick={toggle}
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
									<button
										type="button"
										className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-200 hover:border-orange-300 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200"
										style={{ backgroundColor: "transparent" }}
									>
										<Bell className="h-4 w-4" />
										Fiyat Alarmı Kur
									</button>
								</div>
							</div>

							{/* Campaign Date Range */}
							{(campaign.start_date || campaign.end_date) && (
								<p className="text-sm text-gray-500">
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



