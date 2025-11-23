import { ChevronRight, Clock10Icon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { remainingDay } from "@/utils/campaign";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const CampaignCard = ({
	image,
	title,
	brands,
	id,
	endDate,
	end_date,
	slug,
}) => {
	const [remaining, setRemaining] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [imgSrc, setImgSrc] = useState(image);
	const [imgError, setImgError] = useState(false);

	useEffect(() => {
		setMounted(true);
		setRemaining(remainingDay(end_date || endDate));
	}, [end_date, endDate]);

	const handleImageError = (e) => {
		const currentSrc = e.target.src;

		// Try alternative CDN paths
		if (currentSrc.includes("/campains/uploads/")) {
			// Try without uploads folder
			const withoutUploads = currentSrc.replace(
				"/campains/uploads/",
				"/campains/",
			);
			setImgSrc(withoutUploads);
		} else if (
			currentSrc.includes("/campains/") &&
			!currentSrc.includes("/uploads/")
		) {
			// Try with correct spelling (campaigns)
			const correctedUrl = currentSrc.replace("/campains/", "/campaigns/");
			setImgSrc(correctedUrl);
		} else if (
			currentSrc.includes("/campaigns/") &&
			!currentSrc.includes("/uploads/")
		) {
			// Try campaigns with uploads folder
			const withUploads = currentSrc.replace(
				"/campaigns/",
				"/campaigns/uploads/",
			);
			setImgSrc(withUploads);
		} else {
			// All attempts failed
			setImgError(true);
		}
	};

	if (!mounted) {
		return (
			<Card
				key={id}
				className="md:max-w-md max-w-sm shadow-md hadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1"
			>
				<div className="relative group:">
					{imgSrc && !imgError ? (
						<img
							alt={title || "Kampanya"}
							title={title || "Kampanya"}
							className="w-full hover:bg-black h-48 object-cover rounded-t-lg"
							src={imgSrc}
							onError={handleImageError}
						/>
					) : (
						<div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
							<span className="text-gray-400">Görsel yüklenemedi</span>
						</div>
					)}
					<div className="absolute top-2 right-4 bg-primary shadow-md text-gray-50 px-2 py-1 rounded-md text-xs font-medium">
						<Clock10Icon className="mr-1 inline-block h-4 w-4" />
						<span>...</span>
					</div>
					{brands && brands[0] && (
						<Link href={`/marka/${brands[0].slug}`}>
							<div className="absolute top-2 left-4 bg-white rounded-full p-2 shadow-md">
								{brands[0].logo && (
									<img
										className="object-contain group-hover w-20 h-[20px]"
										src={brands[0].logo}
										title={brands[0].name || "Marka"}
										alt={brands[0].name || "Marka"}
									/>
								)}
							</div>
						</Link>
					)}
					<Button
						className=" bottom-5 right-5 absolute bg-black/30 hover:bg-orange-500 rounded-full p-1 shadow-md"
						size="icon"
						variant="ghost"
					>
						<HeartIcon className="h-4 w-4 text-white" />
						<span className="sr-only">Add to Favorites</span>
					</Button>
				</div>
				<div className="px-2 py-2">
					<Link title={title} href={`/kampanya/${slug}`}>
						<h3 className="text-sm text-blue-950 mt-2 h-[75px]">{title}</h3>
					</Link>
					<Button asChild variant="outline" className="w-full rounded-b-lg">
						<Link title={title} href={`/kampanya/${slug}`}>
							{" "}
							Bilgi Al <ChevronRight size={18}></ChevronRight>
						</Link>
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card
			key={id}
			className="md:max-w-md max-w-sm shadow-md hadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1"
		>
			<div className="relative group:">
				{imgSrc && !imgError ? (
					<img
						alt={title || "Kampanya"}
						title={title || "Kampanya"}
						className="w-full hover:bg-black h-48 object-cover rounded-t-lg"
						src={imgSrc}
						onError={handleImageError}
					/>
				) : (
					<div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
						<span className="text-gray-400">Görsel yüklenemedi</span>
					</div>
				)}
				<div
					className={`absolute top-2 right-4 ${remaining < 5 ? "bg-red-500" : "bg-primary"} shadow-md text-gray-50 px-2 py-1 rounded-md text-xs font-medium`}
				>
					<Clock10Icon className="mr-1 inline-block h-4 w-4" />
					<span>
						{remaining < 0 ? "Süresi Doldu" : `${remaining} gün kaldı`}
					</span>
				</div>
				{brands && brands[0] && (
					<Link href={`/marka/${brands[0].slug}`}>
						<div className="absolute top-2 left-4 bg-white rounded-full p-2 shadow-md">
							<img
								className="object-contain group-hover w-20 h-[20px]"
								src={brands[0].logo}
								title={brands[0].name}
								alt={brands[0].name}
							/>
						</div>
					</Link>
				)}
				<Button
					className=" bottom-5 right-5 absolute bg-black/30 hover:bg-orange-500 rounded-full p-1 shadow-md"
					size="icon"
					variant="ghost"
				>
					<HeartIcon className="h-4 w-4 text-white" />
					<span className="sr-only">Add to Favorites</span>
				</Button>
			</div>

			<div className="px-2 py-2">
				<Link title={title} href={`/kampanya/${slug}`}>
					<h3 className="text-sm text-blue-950 mt-2 h-[75px]">{title}</h3>
				</Link>
				<Button asChild variant="outline" className="w-full rounded-b-lg">
					<Link title={title} href={`/kampanya/${slug}`}>
						{" "}
						Bilgi Al <ChevronRight size={18}></ChevronRight>
					</Link>
				</Button>
			</div>
		</Card>
	);
};

export default CampaignCard;
