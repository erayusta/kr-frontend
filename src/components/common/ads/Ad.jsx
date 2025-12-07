import Image from "next/image";
import { useEffect, useState } from "react";

const AdItem = ({ ad }) => {
	const [isAdLoaded, setIsAdLoaded] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const checkAdLoad = () => {
			const hasAds = window.pigeon?.ads?.length > 0;
			setIsAdLoaded(hasAds);
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

	if (ad?.type === "html") {
		return (
			<div id="ad-container" dangerouslySetInnerHTML={{ __html: ad?.code }} />
		);
	}

	if (ad?.image) {
		return (
			<a href={ad?.link} target="_blank" rel="noopener noreferrer">
				<div className="relative w-full aspect-video">
					<Image
						src={ad?.image}
						alt={ad?.title || "Reklam görseli"}
						fill
						className="object-contain"
					/>
				</div>
			</a>
		);
	}

	return null;
};

export default function Ad({ position, ad }) {
	if (!ad) return null;

	const positionClasses = {
		left: "hidden xl:block fixed left-2 top-52 z-40 w-28",
		right: "hidden xl:block fixed right-2 top-52 z-40 w-28",
		center: "max-w-4xl mx-auto my-4",
	};

	const className = positionClasses[position];
	if (!className) return null;

	const Wrapper = position === "center" ? "div" : "aside";

	return (
		<Wrapper className={className}>
			<AdItem ad={ad} />
		</Wrapper>
	);
}
