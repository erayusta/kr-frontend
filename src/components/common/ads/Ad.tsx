import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type { AdPosition, Ad as AdType } from "@/types/ad";

declare global {
	interface Window {
		pigeon?: {
			ads?: unknown[];
		};
	}
}

const parseDimensions = (
	dimensions: string | null,
): { width: number; height: number } => {
	if (!dimensions) return { width: 300, height: 250 };
	const [w, h] = dimensions.split("x").map(Number);
	return { width: w || 300, height: h || 250 };
};

interface AdItemProps {
	ad: AdType;
	maxWidth?: number;
}

const AdItem = ({ ad, maxWidth }: AdItemProps) => {
	const [isGptAdLoaded, setIsGptAdLoaded] = useState(false);
	const [mounted, setMounted] = useState(false);
	const uniqueId = useId();

	useEffect(() => {
		setMounted(true);
	}, []);

	const isGptAd = ad.type === "html" && ad.code?.includes("googletag");

	useEffect(() => {
		if (!mounted || !isGptAd) return;

		const checkAdLoad = () => {
			setIsGptAdLoaded(!!window.pigeon?.ads?.length);
		};

		const handleAdLoaded = () => setIsGptAdLoaded(true);

		if (window.pigeon) {
			checkAdLoad();
		} else {
			window.addEventListener("pigeonLoaded", checkAdLoad);
		}

		document.addEventListener("pigeonAdLoaded", handleAdLoaded);
		const timeout = setTimeout(checkAdLoad, 3000);

		return () => {
			window.removeEventListener("pigeonLoaded", checkAdLoad);
			document.removeEventListener("pigeonAdLoaded", handleAdLoaded);
			clearTimeout(timeout);
		};
	}, [mounted, isGptAd]);

	if (!mounted) return null;

	if (ad.type === "html" && ad.code) {
		if (isGptAd) {
			return (
				<div
					id={`ad-container-${uniqueId}`}
					className={isGptAdLoaded ? "block" : "hidden"}
					dangerouslySetInnerHTML={{ __html: ad.code }}
				/>
			);
		}

		return (
			<div
				id={`ad-container-${uniqueId}`}
				dangerouslySetInnerHTML={{ __html: ad.code }}
			/>
		);
	}

	if (ad.type === "image" && ad.image) {
		const { width, height } = parseDimensions(ad.dimensions);
		const finalWidth = maxWidth ? Math.min(width, maxWidth) : width;
		const aspectRatio = width / height;
		const finalHeight = Math.round(finalWidth / aspectRatio);

		return (
			<a
				href={ad.link || "#"}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				<Image
					src={ad.image}
					alt={ad.name}
					width={finalWidth}
					height={finalHeight}
					style={{ width: finalWidth, height: "auto" }}
					unoptimized
				/>
			</a>
		);
	}

	return null;
};

export type AdVariant =
	| "sidebar-left"
	| "sidebar-right"
	| "sidebar"
	| "banner"
	| "inline"
	| "footer"
	| "content-middle";

interface AdProps {
	ad?: AdType;
	variant?: AdVariant;
	className?: string;
}

const SIDEBAR_MAX_WIDTH = 120;

const variantStyles: Record<AdVariant, string> = {
	"sidebar-left":
		"hidden xl:block fixed left-2 top-52 z-40 p-2 border border-gray-200/50 rounded-lg bg-white/50",
	"sidebar-right":
		"hidden xl:block fixed right-2 top-52 z-40 p-2 border border-gray-200/50 rounded-lg bg-white/50",
	sidebar:
		"hidden xl:block fixed right-2 top-52 z-40 p-2 border border-gray-200/50 rounded-lg bg-white/50",
	banner: "flex justify-center my-4 p-3 ",
	inline: "p-2 border border-gray-100/50 rounded",
	footer:
		"flex justify-center my-6 py-4 px-3 border border-gray-100 rounded-lg",
	"content-middle":
		"flex justify-center my-8 p-4 border border-gray-100 rounded-lg",
};
export default function Ad({
	ad,
	variant = "inline",
	className = "",
}: AdProps) {
	if (!ad) return null;

	const isFixedSidebar =
		variant === "sidebar-left" ||
		variant === "sidebar-right" ||
		variant === "sidebar";

	const { width } = parseDimensions(ad.dimensions);
	const sidebarWidth = isFixedSidebar
		? Math.min(width, SIDEBAR_MAX_WIDTH)
		: undefined;

	const baseStyle = variantStyles[variant];

	if (isFixedSidebar) {
		return (
			<aside
				className={`${baseStyle} ${className}`.trim()}
				style={{ width: sidebarWidth }}
			>
				<AdItem ad={ad} maxWidth={sidebarWidth} />
			</aside>
		);
	}

	return (
		<div className={`${baseStyle} ${className}`.trim()}>
			<AdItem ad={ad} />
		</div>
	);
}

// Position'dan variant'a otomatik mapping
const positionToVariant: Record<AdPosition, AdVariant> = {
	home_header: "banner",
	home_left: "sidebar-left",
	home_right: "sidebar-right",
	category_header: "banner",
	brand_header: "banner",
	campaign_header: "banner",
	content_middle: "content-middle",
	footer: "footer",
	sidebar: "sidebar",
};

interface AdsProps {
	ads: AdType[];
	positions?: AdPosition[];
	className?: string;
}

// Otomatik position-based rendering
export function Ads({ ads, positions, className }: AdsProps) {
	if (!ads?.length) return null;

	const filteredAds = positions
		? ads.filter((ad) => positions.includes(ad.position as AdPosition))
		: ads;

	return (
		<>
			{filteredAds.map((ad) => {
				const variant = positionToVariant[ad.position as AdPosition];
				if (!variant) return null;

				return (
					<Ad key={ad.id} ad={ad} variant={variant} className={className} />
				);
			})}
		</>
	);
}

// Helper: Belirli position'daki reklamı bul
export function getAdByPosition(
	ads: AdType[],
	position: AdPosition,
): AdType | undefined {
	return ads?.find((ad) => ad.position === position);
}
