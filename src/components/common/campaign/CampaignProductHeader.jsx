import { Clock } from "lucide-react";

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

	const remainingDays = calculateRemainingDays(
		campaign.end_date || campaign.endDate,
	);

	return (
		<section className="xl:mx-auto xl:px-36  bg-[#fffaf4]">
			<div className="relative w-full bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-transparent overflow-hidden">
				<div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-orange-500/10 to-transparent"></div>

				<div className="relative container mx-auto px-8 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
						<div className="space-y-5 text-white z-10">
							<h1 className="text-4xl lg:text-5xl font-bold leading-tight">
								{campaign.title}
							</h1>

							<div className="flex items-center gap-2">
								{remainingDays && (
									<>
										<Clock className="h-4 w-4" />
										<span className="font-medium">
											{remainingDays < 0
												? "Kampanya Sona Erdi"
												: `Son ${remainingDays} Gün`}
										</span>
									</>
								)}
							</div>
						</div>

						<div className="relative z-10">
							<div className="relative ">
								<div className="relative">
									<img
										src={getImageUrl(campaign.image)}
										alt={campaign.title}
										className="w-full h-72 object-contain"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
