import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
	Download,
	FileText,
	ImageIcon,
	Package,
	Tag,
	Store,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	X,
	ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGE_BASE_URL } from "@/constants/site";

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onPrev();
			if (e.key === "ArrowRight") onNext();
		};
		document.addEventListener("keydown", handleKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKey);
			document.body.style.overflow = "";
		};
	}, [onClose, onPrev, onNext]);

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
			onClick={onClose}
		>
			{/* Close */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				aria-label="Kapat"
			>
				<X className="h-6 w-6" />
			</button>

			{/* Counter */}
			<div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
				{currentIndex + 1} / {images.length}
			</div>

			{/* Prev */}
			{images.length > 1 && (
				<button
					onClick={(e) => { e.stopPropagation(); onPrev(); }}
					className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-orange-500 text-white transition-colors"
					aria-label="Önceki görsel"
				>
					<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
				</button>
			)}

			{/* Image */}
			<div
				className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4 flex items-center justify-center"
				onClick={(e) => e.stopPropagation()}
			>
				{/* biome-ignore lint/a11y/useAltText: lightbox image */}
				{/* biome-ignore lint/performance/noImgElement: CDN URL */}
				<img
					src={images[currentIndex]}
					alt={`Aktüel görseli ${currentIndex + 1}`}
					className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
					draggable={false}
				/>
			</div>

			{/* Next */}
			{images.length > 1 && (
				<button
					onClick={(e) => { e.stopPropagation(); onNext(); }}
					className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-orange-500 text-white transition-colors"
					aria-label="Sonraki görsel"
				>
					<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
				</button>
			)}
		</div>,
		document.body,
	);
}

export default function CampaignActualType({ campaign, sections }) {
	const contentRef = useRef(null);
	const [lightboxIndex, setLightboxIndex] = useState(-1);

	// Auto-expand first section on load
	const [expandedSections, setExpandedSections] = useState(() => {
		if (sections && sections.length > 0) {
			return { [sections[0].id]: true };
		}
		return {};
	});

	// Get actual content (description)
	const actualContent = campaign?.actual_content || campaign?.content;

	// Get actual files (PDF/PNG) for download - check both actuals array and actuals_urls
	const actualFiles = campaign?.actualsUrls || campaign?.actuals_urls || campaign?.actuals || [];

	// Normalize file URLs - ensure they have full CDN path
	const normalizeFileUrl = (url) => {
		if (!url) return null;
		if (url.startsWith("http")) return url;
		// Add CDN base if not present
		return `https://kampanyaradar-static.b-cdn.net/kampanyaradar/${url.replace(/^\//, '')}`;
	};

	// Get normalized file URLs
	const normalizedFiles = actualFiles.map(normalizeFileUrl).filter(Boolean);

	// Filter files by type
	const pdfFiles = normalizedFiles.filter((url) => url?.toLowerCase()?.endsWith(".pdf"));
	const imageFiles = normalizedFiles.filter((url) =>
		url?.toLowerCase()?.endsWith(".png") ||
		url?.toLowerCase()?.endsWith(".jpg") ||
		url?.toLowerCase()?.endsWith(".jpeg") ||
		url?.toLowerCase()?.endsWith(".webp")
	);

	// Lightbox handlers
	const openLightbox = (index) => setLightboxIndex(index);
	const closeLightbox = useCallback(() => setLightboxIndex(-1), []);
	const prevImage = useCallback(() => {
		setLightboxIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length);
	}, [imageFiles.length]);
	const nextImage = useCallback(() => {
		setLightboxIndex((prev) => (prev + 1) % imageFiles.length);
	}, [imageFiles.length]);

	// Fix images in HTML content
	useEffect(() => {
		if (contentRef.current) {
			const images = contentRef.current.querySelectorAll("img");
			images.forEach((img) => {
				img.onerror = function () {
					this.style.display = "none";
				};
			});
		}
	}, [actualContent]);

	const toggleSection = (sectionId) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
	};

	const getProductImage = (imageUrl) => {
		if (!imageUrl) return "/images/placeholder-product.jpg";
		if (imageUrl.startsWith("http")) return imageUrl;
		return `${IMAGE_BASE_URL}/${imageUrl}`;
	};

	const formatPrice = (price, currency = "TRY") => {
		if (!price) return "-";
		return new Intl.NumberFormat("tr-TR", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(price);
	};

	// Backend proxy ile indirme URL'i oluştur
	const getDownloadUrl = (url) => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
		return `${apiBase}/download?url=${encodeURIComponent(url)}`;
	};

	const getFileName = (url) => {
		if (!url) return "dosya";
		return url.split("/").pop() || "dosya";
	};

	return (
		<div className="space-y-8">
			{/* Lightbox */}
			{lightboxIndex >= 0 && (
				<Lightbox
					images={imageFiles}
					currentIndex={lightboxIndex}
					onClose={closeLightbox}
					onPrev={prevImage}
					onNext={nextImage}
				/>
			)}

			{/* Actual Description/Content */}
			{actualContent && (
				<Card className="border-2 border-gray-200">
					<CardContent className="p-6 lg:p-8">
						<div
							ref={contentRef}
							className="prose prose-gray max-w-none campaign-content"
							dangerouslySetInnerHTML={{ __html: actualContent }}
						/>
					</CardContent>
				</Card>
			)}

			{/* Aktüel Görselleri - Thumbnail Grid */}
			{imageFiles.length > 0 && (
				<Card className="border-2 border-orange-200 bg-orange-50/50">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl flex items-center gap-2">
							<ImageIcon className="h-5 w-5 text-orange-500" />
							Aktüel Görselleri
							<Badge variant="secondary" className="ml-1">
								{imageFiles.length} Görsel
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
							{imageFiles.map((url, index) => (
								<button
									key={`thumb-${index}`}
									type="button"
									onClick={() => openLightbox(index)}
									className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-white border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
								>
									{/* biome-ignore lint/performance/noImgElement: CDN URL */}
									<img
										src={url}
										alt={`Aktüel görseli ${index + 1}`}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
										<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 rounded-full bg-white/90 shadow-md">
											<ZoomIn className="h-5 w-5 text-orange-500" />
										</div>
									</div>
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* PDF Downloads */}
			{pdfFiles.length > 0 && (
				<Card className="border-2 border-orange-200 bg-orange-50/50">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl flex items-center gap-2">
							<Download className="h-5 w-5 text-orange-500" />
							Katalog / Broşür İndir
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{pdfFiles.map((url, index) => (
								<Button
									key={`pdf-${index}`}
									variant="outline"
									className="h-auto py-4 px-4 flex items-center gap-3 justify-start bg-white hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
									asChild
								>
									<a href={getDownloadUrl(url)}>
										<FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
										<div className="text-left overflow-hidden">
											<p className="font-medium text-gray-900 truncate">
												{getFileName(url)}
											</p>
											<p className="text-xs text-gray-500">PDF Dosyası</p>
										</div>
									</a>
								</Button>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Actual Products Section */}
			{sections && sections.length > 0 && (
				<Card className="border-2 border-gray-200">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-xl flex items-center gap-2">
							<Package className="h-5 w-5 text-orange-500" />
							Aktüel Ürünleri
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{sections.map((section) => (
							<div key={section.id} className="border-b last:border-b-0">
								{/* Section Header */}
								<button
									onClick={() => toggleSection(section.id)}
									className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Tag className="h-5 w-5 text-orange-500" />
										<span className="font-semibold text-gray-900">
											{section.title || "Kategori"}
										</span>
										<Badge variant="secondary" className="ml-2">
											{section.items?.length || 0} Ürün
										</Badge>
									</div>
									{expandedSections[section.id] ? (
										<ChevronUp className="h-5 w-5 text-gray-500" />
									) : (
										<ChevronDown className="h-5 w-5 text-gray-500" />
									)}
								</button>

								{/* Section Items */}
								{expandedSections[section.id] && section.items && (
									<div className="px-6 pb-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
											{section.items.map((item) => (
												<div
													key={item.id}
													className={`bg-white rounded-lg border-2 ${
														item.highlight
															? "border-orange-300 shadow-md"
															: "border-gray-100"
													} p-4 hover:shadow-lg transition-shadow`}
												>
													{/* Product Image */}
													<div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
														<Image
															src={getProductImage(item.image_url || item.product?.image)}
															alt={item.title || item.product?.title || "Ürün"}
															fill
															className="object-contain p-2"
															sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
														/>
														{item.highlight && (
															<Badge className="absolute top-2 right-2 bg-orange-500">
																Öne Çıkan
															</Badge>
														)}
													</div>

													{/* Product Info */}
													<div className="space-y-2">
														{/* Title */}
														<h4 className="font-medium text-gray-900 text-sm line-clamp-2">
															{item.title || item.product?.title || "Ürün"}
														</h4>

														{/* Brand */}
														{item.brand && (
															<p className="text-xs text-gray-500">
																Marka: <span className="font-medium">{item.brand}</span>
															</p>
														)}

														{/* Size/Unit */}
														{item.unit_or_size && (
															<p className="text-xs text-gray-500">
																{item.unit_or_size}
															</p>
														)}

														{/* Store */}
														{item.store_brand && (
															<div className="flex items-center gap-1 text-xs text-gray-500">
																<Store className="h-3 w-3" />
																<span>{item.store_brand}</span>
															</div>
														)}

														{/* Price */}
														{item.snapshot_price && (
															<div className="pt-2 border-t border-gray-100">
																<p className="text-lg font-bold text-orange-600">
																	{formatPrice(item.snapshot_price, item.currency)}
																</p>
																{item.snapshot_date && (
																	<p className="text-xs text-gray-400">
																		{item.snapshot_date} tarihli fiyat
																	</p>
																)}
															</div>
														)}

														{/* Note */}
														{item.note && (
															<p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
																{item.note}
															</p>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{/* No Products Message - only show if no content, no files, and no products */}
			{!actualContent && (!sections || sections.length === 0) && normalizedFiles.length === 0 && (
				<Card className="border-2 border-gray-200">
					<CardContent className="p-8 text-center">
						<Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">
							Bu aktüel için henüz ürün veya katalog eklenmemiş.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
