import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { IMAGE_BASE_URL } from "@/constants/site";

// Window interface'ini extend et
declare global {
	interface Window {
		pigeon?: {
			ads?: unknown[];
		};
	}
}

interface AdData {
	type?: "html" | "image";
	code?: string;
	image?: string;
	link?: string;
	title?: string;
}

interface AdItemProps {
	ad: AdData;
}

const AdItem = ({ ad }: AdItemProps) => {
	const [isAdLoaded, setIsAdLoaded] = useState(false);
	const [mounted, setMounted] = useState(false);
	const uniqueId = useId();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const checkAdLoad = () => {
			if (window.pigeon?.ads && window.pigeon.ads.length > 0) {
				setIsAdLoaded(true);
			} else {
				setIsAdLoaded(false);
			}
		};

		const handleAdLoaded = () => setIsAdLoaded(true);

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
	}, [mounted]);

	if (!mounted) return null;

	if (ad?.type === "html" && ad?.code) {
		return (
			<div
				id={`ad-container-${uniqueId}`}
				className={isAdLoaded ? "block" : "hidden"}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Ad content from trusted API
				dangerouslySetInnerHTML={{ __html: ad.code }}
			/>
		);
	}

	if (ad?.image) {
		return (
			<a
				href={ad.link}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				<Image
					className="w-full h-auto"
					src={`${IMAGE_BASE_URL}/ads/${ad.image}`}
					alt={ad.title || "Reklam görseli"}
					width={300}
					height={250}
					unoptimized
				/>
			</a>
		);
	}

	return null;
};

interface AdProps {
	position: "left" | "right" | "center";
	ad?: AdData;
}

export default function Ad({ position, ad }: AdProps) {
	if (!ad) return null;

	switch (position) {
		case "left":
			return (
				<aside className="hidden xl:block fixed left-2 top-52 z-40 w-28">
					<AdItem ad={ad} />
				</aside>
			);

		case "right":
			return (
				<aside className="hidden xl:block fixed right-2 top-52 z-40 w-28">
					<AdItem ad={ad} />
				</aside>
			);

		case "center":
			return (
				<div className="max-w-4xl mx-auto my-4">
					<AdItem ad={ad} />
				</div>
			);

		default:
			return null;
	}
}
