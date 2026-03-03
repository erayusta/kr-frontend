import { useState, useCallback, useEffect, useRef } from "react";
import { ZoomIn, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import HotspotOverlay from "./HotspotOverlay";

const AUTOPLAY_DELAY = 3500;

/* ================================================================
   ActualImageViewer — Embla Carousel ile yan yana 2 sayfa görünümü
   Ping-pong autoplay: ileri git → sona gel → geri gel → başa dön
   ================================================================ */
export default function ActualImageViewer({
	imageFiles = [],
	hotspots = [],
	activeIndex,
	onActiveIndexChange,
	onOpenLightbox,
}) {
	const [api, setApi] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isHovered, setIsHovered] = useState(false);
	const directionRef = useRef(1); // 1 = ileri, -1 = geri
	const timerRef = useRef(null);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 1024);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const slidesPerView = isMobile ? 1 : 2;

	const getHotspotsForImage = useCallback(
		(index) => hotspots.filter((h) => h.image_index === index),
		[hotspots],
	);

	const hasHotspot = useCallback(
		(index) => hotspots.some((h) => h.image_index === index),
		[hotspots],
	);

	// Sync carousel snap → activeIndex
	useEffect(() => {
		if (!api) return;
		const onSelect = () => {
			const snapIndex = api.selectedScrollSnap();
			onActiveIndexChange(snapIndex * slidesPerView);
		};
		api.on("select", onSelect);
		return () => { api.off("select", onSelect); };
	}, [api, slidesPerView, onActiveIndexChange]);

	// Sync external activeIndex → carousel
	useEffect(() => {
		if (!api) return;
		const targetSnap = Math.floor(activeIndex / slidesPerView);
		if (api.selectedScrollSnap() !== targetSnap) {
			api.scrollTo(targetSnap);
		}
	}, [api, activeIndex, slidesPerView]);

	// Ping-pong autoplay
	useEffect(() => {
		if (!api || !isPlaying || isHovered) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			return;
		}

		timerRef.current = setInterval(() => {
			if (!api.canScrollNext() && directionRef.current === 1) {
				directionRef.current = -1;
			} else if (!api.canScrollPrev() && directionRef.current === -1) {
				directionRef.current = 1;
			}

			if (directionRef.current === 1) {
				api.scrollNext();
			} else {
				api.scrollPrev();
			}
		}, AUTOPLAY_DELAY);

		return () => clearInterval(timerRef.current);
	}, [api, isPlaying, isHovered]);

	if (!imageFiles || imageFiles.length === 0) return null;

	// Single image — no carousel
	if (imageFiles.length === 1) {
		return (
			<div className="relative">
				<div
					className="relative min-h-[500px] sm:min-h-[650px] lg:min-h-[800px] flex items-center justify-center bg-gray-50 cursor-pointer"
					onClick={() => onOpenLightbox(0)}
				>
					{/* biome-ignore lint/performance/noImgElement: CDN URL */}
					<img
						src={imageFiles[0]}
						alt="Aktüel görseli"
						className="w-full h-full object-contain max-h-[900px]"
						draggable={false}
					/>
					<HotspotOverlay hotspots={getHotspotsForImage(0)} />
				</div>
				<button
					type="button"
					onClick={() => onOpenLightbox(0)}
					className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-gray-600 shadow-lg transition-colors z-10"
					aria-label="Tam ekran görüntüle"
				>
					<ZoomIn className="h-5 w-5" />
				</button>
			</div>
		);
	}

	const totalImages = imageFiles.length;
	const currentSnap = Math.floor(activeIndex / slidesPerView);
	const totalSnaps = Math.ceil(totalImages / slidesPerView);

	const counterStart = currentSnap * slidesPerView + 1;
	const counterEnd = Math.min(counterStart + slidesPerView - 1, totalImages);
	const counterText =
		slidesPerView === 2 && counterStart !== counterEnd
			? `${counterStart}-${counterEnd} / ${totalImages}`
			: `${counterStart} / ${totalImages}`;

	const canGoPrev = currentSnap > 0;
	const canGoNext = currentSnap < totalSnaps - 1;

	return (
		<div
			className="flex flex-col"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Ana carousel alanı */}
			<div className="relative group">
				<Carousel
					setApi={setApi}
					opts={{
						align: "start",
						loop: false,
						slidesToScroll: slidesPerView,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-0">
						{imageFiles.map((url, index) => (
							<CarouselItem
								key={`slide-${index}`}
								className={cn(
									"pl-0 relative",
									isMobile ? "basis-full" : "basis-1/2",
								)}
							>
								<div
									className={cn(
										"relative flex items-center justify-center cursor-pointer bg-gray-50",
										"min-h-[500px] sm:min-h-[650px] lg:min-h-[850px]",
										!isMobile && index % 2 === 0 && "border-r border-gray-200/60",
									)}
									onClick={() => onOpenLightbox(index)}
								>
									{/* biome-ignore lint/performance/noImgElement: CDN URL */}
									<img
										src={url}
										alt={`Aktüel sayfa ${index + 1}`}
										className="w-full h-full object-contain max-h-[900px]"
										draggable={false}
									/>
									<HotspotOverlay hotspots={getHotspotsForImage(index)} />

									{/* Sayfa numarası */}
									<span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400 bg-white/70 px-2 py-0.5 rounded-full">
										{index + 1}
									</span>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				{/* Navigation arrows — büyük ve belirgin */}
				{canGoPrev && (
					<button
						type="button"
						onClick={() => api?.scrollPrev()}
						className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-gray-600 shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
						aria-label="Önceki sayfa"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
				)}
				{canGoNext && (
					<button
						type="button"
						onClick={() => api?.scrollNext()}
						className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-gray-600 shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
						aria-label="Sonraki sayfa"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				)}

				{/* Fullscreen button */}
				<button
					type="button"
					onClick={() => onOpenLightbox(activeIndex)}
					className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-orange-500 hover:text-white text-gray-600 shadow-lg transition-colors z-10"
					aria-label="Tam ekran görüntüle"
				>
					<ZoomIn className="h-5 w-5" />
				</button>

				{/* Page counter + play/pause */}
				<div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => setIsPlaying((p) => !p)}
						className="flex items-center justify-center w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
						aria-label={isPlaying ? "Duraklat" : "Oynat"}
					>
						{isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
					</button>
					<div className="bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
						{counterText}
					</div>
				</div>
			</div>

			{/* Thumbnail şeridi */}
			<div className="flex items-center gap-2 px-4 py-3 overflow-x-auto bg-white/60 border-t border-gray-200/60">
				{imageFiles.map((url, index) => {
					const isInActiveRange =
						index >= currentSnap * slidesPerView &&
						index < (currentSnap + 1) * slidesPerView;

					return (
						<button
							key={`thumb-${index}`}
							type="button"
							onClick={() => onActiveIndexChange(index)}
							className={cn(
								"relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
								isInActiveRange
									? "border-orange-500 shadow-md ring-1 ring-orange-200"
									: "border-transparent hover:border-orange-300 opacity-70 hover:opacity-100",
							)}
						>
							{/* biome-ignore lint/performance/noImgElement: CDN thumbnail */}
							<img
								src={url}
								alt={`Sayfa ${index + 1}`}
								className="w-14 h-[72px] object-cover bg-gray-100"
								loading="lazy"
							/>
							{hasHotspot(index) && (
								<span className="absolute top-0.5 right-0.5 w-2 h-2 bg-orange-500 rounded-full ring-1 ring-white" />
							)}
							<span className="absolute bottom-0 inset-x-0 text-[9px] text-center font-medium text-gray-500 bg-white/80 leading-relaxed">
								{index + 1}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
