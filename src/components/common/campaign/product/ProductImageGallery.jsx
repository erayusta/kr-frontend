import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductImageGallery({
	images = [],
	colors = [],
	title = "Ürün görseli",
	onColorSelect,
	selectedColorIndex = 0,
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	// Build image list: if a color is selected and has image, prepend it
	const baseImages = images.length > 0 ? images : [];
	const productImages =
		colors.length > 0 &&
		selectedColorIndex !== null &&
		colors[selectedColorIndex]?.image
			? [colors[selectedColorIndex].image, ...baseImages]
			: baseImages;

	const nextImage = () => {
		if (productImages.length <= 1) return;
		setCurrentIndex((prev) => (prev + 1) % productImages.length);
	};

	const prevImage = () => {
		if (productImages.length <= 1) return;
		setCurrentIndex(
			(prev) => (prev - 1 + productImages.length) % productImages.length,
		);
	};

	const handleColorSelect = (index) => {
		if (onColorSelect) onColorSelect(index);
		setCurrentIndex(0);
	};

	const imageCount = productImages.length;
	// Keyboard navigation for lightbox
	useEffect(() => {
		if (!lightboxOpen) return;
		const handleKey = (e) => {
			if (e.key === "Escape") setLightboxOpen(false);
			if (e.key === "ArrowLeft") setCurrentIndex((i) => (i - 1 + imageCount) % imageCount);
			if (e.key === "ArrowRight") setCurrentIndex((i) => (i + 1) % imageCount);
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [lightboxOpen, imageCount]);

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="relative rounded-xl overflow-hidden bg-gray-50">
				{productImages.length > 0 ? (
					<>
						{/* Zoom into lightbox button */}
						<button
							type="button"
							onClick={() => setLightboxOpen(true)}
							className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 rounded-full shadow-sm transition-colors"
							aria-label="Büyüt"
						>
							<ZoomIn className="h-4 w-4" />
						</button>
						{/* biome-ignore lint/performance/noImgElement: Gallery uses arbitrary remote URLs */}
						<img
							src={productImages[currentIndex]}
							alt={title}
							className="w-full aspect-square object-contain cursor-zoom-in"
							loading="lazy"
							onClick={() => setLightboxOpen(true)}
						/>
						{productImages.length > 1 && (
							<>
								<button
									type="button"
									onClick={prevImage}
									className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-2 shadow-md transition-colors"
									aria-label="Önceki görsel"
								>
									<ChevronLeft className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={nextImage}
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-2 shadow-md transition-colors"
									aria-label="Sonraki görsel"
								>
									<ChevronRight className="h-4 w-4" />
								</button>
							</>
						)}
					</>
				) : (
					<div className="w-full aspect-square flex items-center justify-center">
						<p className="text-gray-400 text-sm">Görsel yok</p>
					</div>
				)}
			</div>

			{/* Thumbnail Dots */}
			{productImages.length > 1 && (
				<div className="flex justify-center gap-1.5">
					{productImages.map((image, idx) => (
						<button
							type="button"
							key={`dot-${idx}-${image.slice(-15)}`}
							onClick={() => setCurrentIndex(idx)}
							className={`h-2 rounded-full transition-all ${
								idx === currentIndex
									? "bg-orange-500 w-5"
									: "bg-gray-300 hover:bg-gray-400 w-2"
							}`}
							aria-label={`Görsel ${idx + 1}`}
						/>
					))}
				</div>
			)}

			{/* Color Selector */}
			{colors.length > 0 && (
				<div>
					<h4 className="text-sm font-semibold text-gray-900 mb-2">
						Renk Seçenekleri
					</h4>
					<div className="flex gap-2 flex-wrap">
						{colors.map((color, index) => (
							<button
								type="button"
								key={`color-${color.name}-${index}`}
								onClick={() => handleColorSelect(index)}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
									selectedColorIndex === index
										? "border-orange-500 bg-orange-50"
										: "border-gray-200 bg-white hover:border-gray-300"
								}`}
							>
								<div
									className="w-4 h-4 rounded-full border border-gray-300"
									style={{
										backgroundColor: color.code
											? `#${color.code}`
											: "#999",
									}}
								/>
								<span>{color.name}</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Lightbox */}
			{lightboxOpen && productImages.length > 0 && (
				<div
					className="fixed inset-0 z-50 flex flex-col bg-black/90"
					onClick={() => setLightboxOpen(false)}
				>
					{/* Top bar */}
					<div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
						<span className="text-white/70 text-sm">{currentIndex + 1} / {productImages.length}</span>
						<button
							type="button"
							onClick={() => setLightboxOpen(false)}
							className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
							aria-label="Kapat"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Main image */}
					<div className="flex-1 flex items-center justify-center relative min-h-0 px-12" onClick={(e) => e.stopPropagation()}>
						{productImages.length > 1 && (
							<button
								type="button"
								onClick={() => setCurrentIndex((i) => (i - 1 + productImages.length) % productImages.length)}
								className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
								aria-label="Önceki"
							>
								<ChevronLeft className="h-6 w-6" />
							</button>
						)}
						{/* biome-ignore lint/performance/noImgElement: Lightbox uses arbitrary remote URLs */}
						<img
							src={productImages[currentIndex]}
							alt={`${title} - ${currentIndex + 1}`}
							className="max-h-full max-w-full object-contain select-none"
							draggable={false}
						/>
						{productImages.length > 1 && (
							<button
								type="button"
								onClick={() => setCurrentIndex((i) => (i + 1) % productImages.length)}
								className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
								aria-label="Sonraki"
							>
								<ChevronRight className="h-6 w-6" />
							</button>
						)}
					</div>

					{/* Thumbnail strip */}
					{productImages.length > 1 && (
						<div className="flex items-center justify-center gap-2 px-4 py-3 shrink-0 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
							{productImages.map((img, idx) => (
								<button
									type="button"
									key={`lb-thumb-${idx}-${img.slice(-10)}`}
									onClick={() => setCurrentIndex(idx)}
									className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
										idx === currentIndex ? "border-orange-400 opacity-100" : "border-white/20 opacity-50 hover:opacity-75"
									}`}
									aria-label={`Görsel ${idx + 1}`}
								>
									{/* biome-ignore lint/performance/noImgElement: Thumbnail strip uses arbitrary remote URLs */}
									<img src={img} alt={`${idx + 1}`} className="w-full h-full object-cover" />
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
