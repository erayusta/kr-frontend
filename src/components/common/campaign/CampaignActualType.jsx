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
	ShoppingBasket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGE_BASE_URL } from "@/constants/site";

/* ================================================================
   Lightbox — Tam ekran görsel görüntüleyici
   ================================================================ */
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
			<button
				onClick={onClose}
				className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				aria-label="Kapat"
			>
				<X className="h-6 w-6" />
			</button>

			<div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
				{currentIndex + 1} / {images.length}
			</div>

			{images.length > 1 && (
				<button
					onClick={(e) => { e.stopPropagation(); onPrev(); }}
					className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-orange-500 text-white transition-colors"
					aria-label="Önceki görsel"
				>
					<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
				</button>
			)}

			<div
				className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4 flex items-center justify-center"
				onClick={(e) => e.stopPropagation()}
			>
				{/* biome-ignore lint/performance/noImgElement: CDN URL */}
				<img
					src={images[currentIndex]}
					alt={`Aktüel görseli ${currentIndex + 1}`}
					className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
					draggable={false}
				/>
			</div>

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

/* ================================================================
   ZoomableImage — Mouse hover ile büyüteç efekti
   ================================================================ */
function ZoomableImage({ src, alt }) {
	const containerRef = useRef(null);
	const [showZoom, setShowZoom] = useState(false);
	const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

	const handleMouseMove = (e) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setZoomPos({ x, y });
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full overflow-hidden cursor-crosshair"
			onMouseEnter={() => setShowZoom(true)}
			onMouseLeave={() => setShowZoom(false)}
			onMouseMove={handleMouseMove}
		>
			{/* biome-ignore lint/performance/noImgElement: CDN URL */}
			<img
				src={src}
				alt={alt}
				className="w-full h-full object-contain p-2"
				draggable={false}
			/>
			{showZoom && (
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage: `url(${src})`,
						backgroundSize: "250%",
						backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
						backgroundRepeat: "no-repeat",
					}}
				/>
			)}
		</div>
	);
}

/* ================================================================
   CampaignActualType — Ana bileşen
   ================================================================ */
export default function CampaignActualType({ campaign, sections }) {
	const contentRef = useRef(null);
	const [lightboxIndex, setLightboxIndex] = useState(-1);
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const [expandedSections, setExpandedSections] = useState(() => {
		if (sections && sections.length > 0) {
			return { [sections[0].id]: true };
		}
		return {};
	});

	const actualContent = campaign?.actual_content || campaign?.content;

	const actualFiles = campaign?.actualsUrls || campaign?.actuals_urls || campaign?.actuals || [];

	const normalizeFileUrl = (url) => {
		if (!url) return null;
		if (url.startsWith("http")) return url;
		return `https://kampanyaradar-static.b-cdn.net/kampanyaradar/${url.replace(/^\//, '')}`;
	};

	const normalizedFiles = actualFiles.map(normalizeFileUrl).filter(Boolean);

	const pdfFiles = normalizedFiles.filter((url) => url?.toLowerCase()?.endsWith(".pdf"));
	const imageFiles = normalizedFiles.filter((url) =>
		url?.toLowerCase()?.endsWith(".png") ||
		url?.toLowerCase()?.endsWith(".jpg") ||
		url?.toLowerCase()?.endsWith(".jpeg") ||
		url?.toLowerCase()?.endsWith(".webp")
	);

	// Lightbox handlers
	const closeLightbox = useCallback(() => setLightboxIndex(-1), []);
	const prevLightbox = useCallback(() => {
		setLightboxIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length);
	}, [imageFiles.length]);
	const nextLightbox = useCallback(() => {
		setLightboxIndex((prev) => (prev + 1) % imageFiles.length);
	}, [imageFiles.length]);

	useEffect(() => {
		if (contentRef.current) {
			const imgs = contentRef.current.querySelectorAll("img");
			imgs.forEach((img) => {
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

	const getDownloadUrl = (url) => {
		const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
		return `${apiBase}/download?url=${encodeURIComponent(url)}`;
	};

	const getFileName = (url) => {
		if (!url) return "dosya";
		return url.split("/").pop() || "dosya";
	};

	const hasImages = imageFiles.length > 0;
	const hasContent = !!actualContent;

	return (
		<div className="flex flex-col w-full gap-6">
			{/* Lightbox */}
			{lightboxIndex >= 0 && (
				<Lightbox
					images={imageFiles}
					currentIndex={lightboxIndex}
					onClose={closeLightbox}
					onPrev={prevLightbox}
					onNext={nextLightbox}
				/>
			)}

			{/* ===== ANA KART: Float Layout — Galeri + İçerik birlikte ===== */}
			{(hasImages || hasContent) && (
				<Card className="overflow-hidden border border-gray-200 bg-[#fffaf4]">
					<CardContent className="p-5 lg:p-6">

						{/* SAĞ PANEL: Galeri — float ile sağa yaslanır */}
						{hasImages && (
							<div className="lg:float-right lg:w-5/12 lg:ml-6 mb-5 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 border border-gray-200">
								{/* Ana Görsel — mouse hover zoom */}
								<div className="relative aspect-[3/4] overflow-hidden bg-white">
									<ZoomableImage
										src={imageFiles[activeImageIndex]}
										alt={`Aktüel görseli ${activeImageIndex + 1}`}
									/>

									{/* Lightbox aç butonu */}
									<button
										type="button"
										onClick={() => setLightboxIndex(activeImageIndex)}
										className="absolute top-3 right-3 p-2 rounded-lg bg-white/80 hover:bg-orange-500 hover:text-white text-gray-600 shadow-md transition-colors"
										aria-label="Tam ekran görüntüle"
									>
										<ZoomIn className="h-4 w-4" />
									</button>

									{/* Sayaç */}
									{imageFiles.length > 1 && (
										<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
											{activeImageIndex + 1} / {imageFiles.length}
										</div>
									)}

									{/* Prev / Next oklar */}
									{imageFiles.length > 1 && (
										<>
											<button
												type="button"
												onClick={() => setActiveImageIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length)}
												className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-orange-500 hover:text-white text-gray-600 shadow-md transition-colors"
												aria-label="Önceki"
											>
												<ChevronLeft className="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => setActiveImageIndex((prev) => (prev + 1) % imageFiles.length)}
												className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-orange-500 hover:text-white text-gray-600 shadow-md transition-colors"
												aria-label="Sonraki"
											>
												<ChevronRight className="h-4 w-4" />
											</button>
										</>
									)}
								</div>

								{/* Thumbnail şeridi */}
								{imageFiles.length > 1 && (
									<div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto border-t border-gray-200/60">
										{imageFiles.map((url, index) => (
											<button
												key={`thumb-${index}`}
												type="button"
												onClick={() => setActiveImageIndex(index)}
												className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
													activeImageIndex === index
														? "border-orange-500 shadow-md"
														: "border-gray-200 hover:border-orange-300"
												}`}
											>
												{/* biome-ignore lint/performance/noImgElement: CDN thumbnail */}
												<img
													src={url}
													alt={`Thumbnail ${index + 1}`}
													className="w-11 h-11 object-cover bg-gray-100"
													loading="lazy"
												/>
											</button>
										))}
									</div>
								)}

								{/* PDF İndirme — galeri altında, aynı blokta */}
								{pdfFiles.length > 0 && (
									<div className="px-3 pb-3 pt-1 border-t border-gray-200/60">
										<h3 className="font-semibold text-[#1C2B4A] mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
											<Download className="w-3.5 h-3.5 text-orange-500" />
											Katalog İndir
										</h3>
										<div className="space-y-1.5">
											{pdfFiles.map((url, index) => (
												<a
													key={`pdf-${index}`}
													href={getDownloadUrl(url)}
													className="flex items-center gap-2.5 px-2.5 py-2 bg-white/80 rounded-md hover:bg-red-50 transition-colors group"
												>
													<FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
													<span className="text-[11px] font-medium text-gray-700 group-hover:text-red-600 truncate">
														{getFileName(url)}
													</span>
												</a>
											))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* İÇERİK: Açıklama — float'ın yanında başlar, uzunsa altına sarar */}
						{hasContent && (
							<div>
								<div
									ref={contentRef}
									className="prose prose-sm prose-gray max-w-none campaign-content"
									dangerouslySetInnerHTML={{ __html: actualContent }}
								/>
							</div>
						)}

						<div className="clear-both" />
					</CardContent>
				</Card>
			)}

			{/* ===== AKTÜEL ÜRÜNLERİ KAROSEL — İleride API'den gelecek ürünler için ===== */}
			<Card className="border border-gray-200 bg-white">
				<CardHeader className="pb-4 border-b">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl flex items-center gap-2">
							<ShoppingBasket className="h-5 w-5 text-orange-500" />
							Aktüel Ürünleri
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="py-10">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="p-4 bg-orange-50 rounded-full mb-4">
							<Package className="h-8 w-8 text-orange-400" />
						</div>
						<p className="text-gray-500 text-sm font-medium">
							Bu aktüelin ürünleri yakında burada listelenecek.
						</p>
						<p className="text-gray-400 text-xs mt-1">
							Fiyat karşılaştırmaları ve detaylar için takipte kalın.
						</p>
					</div>
				</CardContent>
			</Card>

			{/* ===== AKTÜEL DETAY ÜRÜNLERİ — Mevcut sections verisi ===== */}
			{sections && sections.length > 0 && (
				<Card className="border border-gray-200">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-xl flex items-center gap-2">
							<Tag className="h-5 w-5 text-orange-500" />
							Ürün Detayları
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{sections.map((section) => (
							<div key={section.id} className="border-b last:border-b-0">
								<button
									onClick={() => toggleSection(section.id)}
									className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Tag className="h-4 w-4 text-orange-500" />
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

								{expandedSections[section.id] && section.items && (
									<div className="px-6 pb-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
											{section.items.map((item) => (
												<div
													key={item.id}
													className={`bg-white rounded-xl border-2 ${
														item.highlight
															? "border-orange-300 shadow-md"
															: "border-gray-100"
													} p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
												>
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

													<div className="space-y-2">
														<h4 className="font-medium text-gray-900 text-sm line-clamp-2">
															{item.title || item.product?.title || "Ürün"}
														</h4>

														{item.brand && (
															<p className="text-xs text-gray-500">
																Marka: <span className="font-medium">{item.brand}</span>
															</p>
														)}

														{item.unit_or_size && (
															<p className="text-xs text-gray-500">
																{item.unit_or_size}
															</p>
														)}

														{item.store_brand && (
															<div className="flex items-center gap-1 text-xs text-gray-500">
																<Store className="h-3 w-3" />
																<span>{item.store_brand}</span>
															</div>
														)}

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

			{/* Boş durum mesajı */}
			{!hasContent && !hasImages && (!sections || sections.length === 0) && (
				<Card className="border border-gray-200">
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
