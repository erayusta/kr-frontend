import { ChevronRight, Clock10Icon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { remainingDay } from "@/utils/campaign";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useFavorite } from "@/hooks/useFavorite";
import Image from "next/image";

const CampaignCard = ({ image, title, brands, id, endDate, end_date, slug }) => {
	const [remaining, setRemaining] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [imgSrc, setImgSrc] = useState(image);
	const [imgError, setImgError] = useState(false);
	const { isFavorite, toggle, canToggle } = useFavorite("campaign", id ?? slug);

	useEffect(() => {
		setMounted(true);
		setRemaining(remainingDay(end_date || endDate));
	}, [end_date, endDate]);

	const handleImageError = (e) => {
		const currentSrc = e.target.src;

		if (currentSrc.includes("/campains/uploads/")) {
			const withoutUploads = currentSrc.replace("/campains/uploads/", "/campains/");
			setImgSrc(withoutUploads);
		} else if (currentSrc.includes("/campains/") && !currentSrc.includes("/uploads/")) {
			const correctedUrl = currentSrc.replace("/campains/", "/campaigns/");
			setImgSrc(correctedUrl);
		} else if (currentSrc.includes("/campaigns/") && !currentSrc.includes("/uploads/")) {
			const withUploads = currentSrc.replace("/campaigns/", "/campaigns/uploads/");
			setImgSrc(withUploads);
		} else {
			setImgError(true);
		}
	};

	const brand = brands?.[0] || null;
	const brandHref = brand?.slug ? `/marka/${brand.slug}` : null;

	const RemainingBadge = ({ children, className = "" }) => (
		<div
			className={`ml-auto shadow-md text-gray-50 px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0 whitespace-nowrap ${className}`}
		>
			<Clock10Icon className="mr-1 inline-block h-3.5 w-3.5" />
			<span>{children}</span>
		</div>
	);

	const BrandBadge = () =>
		brandHref ? (
			<Link href={brandHref}>
				<div className="bg-white rounded-full p-1.5 shadow-md shrink-0">
					{brand?.logo && (
						<img
							className="object-contain group-hover w-16 h-[18px]"
							src={brand.logo}
							title={brand.name || "Marka"}
							alt={brand.name || "Marka"}
						/>
					)}
				</div>
			</Link>
		) : null;

	const TopBadges = ({ children }) => (
		<div className="absolute top-2 left-4 right-4 flex flex-wrap sm:flex-nowrap items-start gap-2">
			<BrandBadge />
			{children}
		</div>
	);

	const FavoriteButton = () => {
		if (!canToggle) return null;
		return (
			<Button
				aria-pressed={isFavorite}
				onClick={toggle}
				className={`bottom-5 right-5 absolute rounded-full p-1 shadow-md ${
					isFavorite ? "bg-orange-500" : "bg-black/30 hover:bg-orange-500"
				}`}
				size="icon"
				variant="ghost"
			>
				<HeartIcon className="h-4 w-4 text-white" fill={isFavorite ? "currentColor" : "none"} />
				<span className="sr-only">Add to Favorites</span>
			</Button>
		);
	};

    const CardImage = () => (
        <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-white">
            {imgSrc && !imgError ? (
                <Image
                    alt={title || "Kampanya"}
                    title={title || "Kampanya"}
                    src={imgSrc}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={handleImageError}
                    priority={false}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400">Görsel yüklenemedi</span>
                </div>
            )}
        </div>
    );

    const Detail = () => (
        <div className="px-3 sm:px-4 py-3">
            <Link title={title} href={`/kampanya/${slug}`}>
                <h3 className="text-sm font-medium text-blue-950 mt-2 h-[75px] leading-tight break-words line-clamp-3">{title}</h3>
            </Link>
            <Button asChild variant="outline" className="w-full rounded-b-lg mt-2 text-xs sm:text-sm">
                <Link title={title} href={`/kampanya/${slug}`}>
                    Bilgi Al <ChevronRight size={18} />
                </Link>
            </Button>
        </div>
    );

	if (!mounted) {
		return (
            <Card
                key={id}
                className="md:max-w-md max-w-sm shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1"
            >
                <div className="relative group">
                    <CardImage />
                    <TopBadges>
                        <RemainingBadge className="bg-primary">...</RemainingBadge>
                    </TopBadges>
                    <FavoriteButton />
                </div>
                <Detail />
            </Card>
        );
    }

    return (
        <Card
            key={id}
            className="md:max-w-md max-w-sm shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1"
        >
            <div className="relative group">
                <CardImage />
                <TopBadges>
                    <RemainingBadge className={remaining < 5 ? "bg-red-500" : "bg-primary"}>
                        {remaining < 0 ? "Süresi Doldu" : `${remaining} gün kaldı`}
                    </RemainingBadge>
                </TopBadges>
                <FavoriteButton />
            </div>

            <Detail />
        </Card>
    );
};

export default CampaignCard;
