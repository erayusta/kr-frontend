import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ProductImageGallery({
	images = [],
	colors = [],
	title = "Ürün görseli",
	onColorSelect,
	selectedColorIndex = 0,
}) {
	const [currentIndex, setCurrentIndex] = useState(0);

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

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="relative rounded-xl overflow-hidden bg-gray-50">
				{productImages.length > 0 ? (
					<>
						{/* biome-ignore lint/performance/noImgElement: Gallery uses arbitrary remote URLs */}
						<img
							src={productImages[currentIndex]}
							alt={title}
							className="w-full aspect-square object-contain"
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
		</div>
	);
}
