import { Bell, ChevronRight, Clock, Heart, Tag } from "lucide-react";

export default function CampaignProductHeader({ campaign }) {
	const getImageUrl = (image) => {
		if (!image) return "";
		if (image.startsWith("http")) return image;
		return image;
	};

	const calculateRemainingDays = (endDate) => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
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

	const productData = campaign?.product || campaign?.item || {};
	const stores = productData?.stores || [];
	const lowestPrice = stores
		.filter((s) => s.price && s.stock_availability === "in stock")
		.sort((a, b) => a.price - b.price)[0];

	const brandLogo = campaign?.brands?.[0]?.logo;
	const brandName = campaign?.brands?.[0]?.name;
	const categories = campaign?.categories || [];

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
				<div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
						{/* Product Image */}
						<div className="lg:col-span-4 flex items-center justify-center">
							<div className="relative w-full max-w-[300px] aspect-square rounded-xl p-4 flex items-center justify-center">
								<img
									src={getImageUrl(campaign.image)}
									alt={campaign.title}
									className="max-w-full max-h-full object-contain"
								/>
							</div>
						</div>

						{/* Product Info */}
						<div className="lg:col-span-8 flex flex-col justify-between">
							<div className="space-y-4">
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
												<div className="w-16 h-16 rounded-lg border border-gray-200 p-2 flex items-center justify-center bg-white">
													<img
														src={brandLogo}
														alt={brandName}
														className="max-w-full max-h-full object-contain"
													/>
												</div>
											)}
											<div>
												<p
													className="text-xs font-semibold uppercase tracking-wide"
													style={{ color: "#ea580c" }}
												>
													{stores.length > 0
														? `${stores.length} Fiyat Arasında En Ucuz`
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
													onMouseEnter={(e) =>
														(e.currentTarget.style.backgroundColor = "#ea580c")
													}
													onMouseLeave={(e) =>
														(e.currentTarget.style.backgroundColor = "#f97316")
													}
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
													onMouseEnter={(e) =>
														(e.currentTarget.style.backgroundColor = "#ea580c")
													}
													onMouseLeave={(e) =>
														(e.currentTarget.style.backgroundColor = "#f97316")
													}
												>
													Kampanyaya Git
													<ChevronRight className="h-4 w-4" />
												</a>
											)}
										</div>
									</div>
								</div>

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
											className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-200 hover:border-orange-300 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200"
											style={{ backgroundColor: "transparent" }}
										>
											<Heart className="h-4 w-4" />
											Favorilere Ekle
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
			</div>
		</section>
	);
}
