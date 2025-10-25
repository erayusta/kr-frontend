import { useEffect, useState } from "react";
import { IMAGE_BASE_URL } from "@/constants/site";

const AdItem = ({ ad }) => {
	const [isAdLoaded, setIsAdLoaded] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const checkAdLoad = () => {
			if (window.pigeon?.ads?.length > 0) {
				setIsAdLoaded(true);
			} else {
				setIsAdLoaded(false);
			}
		};

		if (window.pigeon) {
			checkAdLoad();
		} else {
			window.addEventListener("pigeonLoaded", checkAdLoad);
		}

		document.addEventListener("pigeonAdLoaded", () => setIsAdLoaded(true));

		const timeout = setTimeout(checkAdLoad, 3000);

		return () => {
			window.removeEventListener("pigeonLoaded", checkAdLoad);
			document.removeEventListener("pigeonAdLoaded", () => setIsAdLoaded(true));
			clearTimeout(timeout);
		};
	}, [mounted]);

	if (!mounted) return null;

	if (ad?.type === "html") {
		return (
			<div
				id="ad-container"
				className={isAdLoaded ? "block" : "hidden"}
				dangerouslySetInnerHTML={{ __html: ad?.code }}
			/>
		);
	}

	if (ad?.image) {
		return (
			<a href={ad?.link} target="_blank" rel="noopener noreferrer">
				<img
					className="w-full h-auto"
					src={`${IMAGE_BASE_URL}/ads/${ad?.image}`}
					alt={ad?.title || "Reklam görseli"}
				/>
			</a>
		);
	}

	return null;
};

export default function Ad({ position, ad }) {
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
