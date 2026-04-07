import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import JSZip from "jszip";
import {
	Download,
	FileText,
	Package,
	Tag,
	Store,
	ChevronLeft,
	ChevronRight,
	X,
	ShoppingBasket,
	Loader2,
	ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { IMAGE_BASE_URL } from "@/constants/site";
import ActualImageViewer from "./actual/ActualImageViewer";
import HotspotOverlay from "./actual/HotspotOverlay";

/* ================================================================
   Lightbox — Tam ekran görsel görüntüleyici (hotspot destekli)
   ================================================================ */
function Lightbox({ images, currentIndex, onClose, onPrev, onNext, hotspots = [] }) {
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

	const currentHotspots = hotspots.filter((h) => h.image_index === currentIndex);

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
				{currentHotspots.length > 0 && (
					<HotspotOverlay hotspots={currentHotspots} />
				)}
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
   Mağaza renk/etiket haritası
   ================================================================ */
const STORE_COLORS = {
	migros:    { bg: "bg-green-100",  text: "text-green-800",  label: "Migros"    },
	sok:       { bg: "bg-purple-100", text: "text-purple-800", label: "Şok"       },
	a101:      { bg: "bg-red-100",    text: "text-red-800",    label: "A101"      },
	carrefour: { bg: "bg-blue-100",   text: "text-blue-800",   label: "Carrefour" },
};

/* ================================================================
   ProductCard — Tekil ürün kartı
   ================================================================ */
function ProductCard({ item, formatPrice, getProductImage }) {
	const imgSrc = getProductImage(item.image_url || item.product?.image);
	const title = item.title || item.product?.title || "Ürün";
	const storeColor = STORE_COLORS[item.store_brand?.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700", label: item.store_brand };

	return (
		<div
			className={`bg-white rounded-xl border-2 ${
				item.highlight ? "border-orange-300 shadow-md" : "border-gray-100"
			} p-3 flex flex-col h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
		>
			{/* Görsel */}
			<div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
				{/* biome-ignore lint/performance/noImgElement: CDN image */}
				<img
					src={imgSrc}
					alt={title}
					className="w-full h-full object-contain p-2"
					loading="lazy"
					onError={(e) => { e.currentTarget.src = "/images/placeholder-product.jpg"; }}
				/>
				{item.highlight && (
					<span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
						Öne Çıkan
					</span>
				)}
			</div>

			{/* İçerik */}
			<div className="flex flex-col flex-1 gap-1.5">
				<h4 className="font-medium text-gray-900 text-xs leading-snug line-clamp-2">
					{title}
				</h4>

				{item.unit_or_size && (
					<p className="text-xs text-gray-400">{item.unit_or_size}</p>
				)}

				{item.store_brand && (
					<span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full w-fit ${storeColor.bg} ${storeColor.text}`}>
						<Store className="h-3 w-3" />
						{storeColor.label}
					</span>
				)}

				{item.snapshot_price && (
					<p className="text-base font-bold text-orange-600 mt-auto pt-1">
						{formatPrice(item.snapshot_price, item.currency)}
					</p>
				)}

				{item.note && (
					<p className="text-xs text-gray-500 italic line-clamp-2">{item.note}</p>
				)}

				{item.store_link && (
					<a
						href={item.store_link}
						target="_blank"
						rel="nofollow noopener noreferrer"
						className="mt-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg py-1.5 px-3 transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						<ExternalLink className="h-3 w-3" />
						Satın Al
					</a>
				)}
			</div>
		</div>
	);
}

/* ================================================================
   CampaignActualType — Ana bileşen
   ================================================================ */
export default function CampaignActualType({ campaign, sections, imageHotspots = [] }) {
	const contentRef = useRef(null);
	const [lightboxIndex, setLightboxIndex] = useState(-1);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

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

	const downloadAllFiles = useCallback(async (files, suffix = "") => {
		if (isDownloading || files.length === 0) return;

		setIsDownloading(true);
		setDownloadProgress({ current: 0, total: files.length });

		try {
			const zip = new JSZip();
			const folder = zip.folder(campaign?.title || "aktuel");

			for (let i = 0; i < files.length; i++) {
				const url = files[i];
				const fileName = getFileName(url) || `dosya-${i + 1}`;

				try {
					const response = await fetch(getDownloadUrl(url));
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					const blob = await response.blob();
					folder.file(fileName, blob);
				} catch {
					// Skip failed files
				}
				setDownloadProgress({ current: i + 1, total: files.length });
			}

			const zipBlob = await zip.generateAsync({ type: "blob" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(zipBlob);
			link.download = `${campaign?.slug || "aktuel"}${suffix}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		} catch {
			// Silent fail
		} finally {
			setIsDownloading(false);
			setDownloadProgress({ current: 0, total: 0 });
		}
	}, [isDownloading, campaign?.title, campaign?.slug]);

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
					hotspots={imageHotspots}
				/>
			)}

			{/* ===== KATALOG KARTI — Galeri + Açıklama + PDF bütünleşik ===== */}
			{(hasImages || hasContent) && (
				<Card className="overflow-hidden border border-gray-200 bg-white shadow-sm">
					{/* Galeri */}
					{hasImages && (
						<div className="bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100/80">
							<ActualImageViewer
								imageFiles={imageFiles}
								hotspots={imageHotspots}
								activeIndex={activeImageIndex}
								onActiveIndexChange={setActiveImageIndex}
								onOpenLightbox={(idx) => setLightboxIndex(idx)}
							/>
						</div>
					)}

					{/* İndirme + Açıklama alt bölüm */}
					{(hasImages || pdfFiles.length > 0 || hasContent) && (
						<div className="border-t border-gray-200 bg-[#fffaf4]">
							{/* Görsel toplu indirme şeridi */}
							{hasImages && imageFiles.length > 1 && (
								<div className="px-5 lg:px-6 py-3 flex flex-wrap items-center gap-3 border-b border-gray-100">
									<button
										type="button"
										onClick={() => downloadAllFiles(imageFiles, "-gorseller")}
										disabled={isDownloading}
										className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-full border border-orange-500 hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
									>
										{isDownloading ? (
											<>
												<Loader2 className="h-3.5 w-3.5 animate-spin" />
												{downloadProgress.current}/{downloadProgress.total}
											</>
										) : (
											<>
												<Download className="w-3.5 h-3.5" />
												Tümünü İndir ({imageFiles.length} görsel)
											</>
										)}
									</button>
								</div>
							)}

							{/* Katalog (PDF) indirme şeridi */}
							{pdfFiles.length > 0 && (
								<div className="px-5 lg:px-6 py-3 flex flex-wrap items-center gap-3 border-b border-gray-100">
									<span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
										<FileText className="w-3.5 h-3.5 text-red-500" />
										Katalog
									</span>

									{pdfFiles.length > 1 && (
										<button
											type="button"
											onClick={() => downloadAllFiles(pdfFiles, "-katalog")}
											disabled={isDownloading}
											className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-full border border-red-500 hover:bg-red-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
										>
											{isDownloading ? (
												<>
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
													{downloadProgress.current}/{downloadProgress.total}
												</>
											) : (
												<>
													<Download className="w-3.5 h-3.5" />
													Tümünü İndir ({pdfFiles.length} dosya)
												</>
											)}
										</button>
									)}

									{pdfFiles.map((url, index) => (
										<a
											key={`pdf-${index}`}
											href={getDownloadUrl(url)}
											className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
										>
											<FileText className="h-3.5 w-3.5 text-red-500" />
											{getFileName(url)}
										</a>
									))}
								</div>
							)}

							{/* Açıklama */}
							{hasContent && (
								<div className="px-5 lg:px-6 py-5">
									<div
										ref={contentRef}
										className="prose prose-sm prose-gray max-w-none campaign-content"
										dangerouslySetInnerHTML={{ __html: actualContent }}
									/>
								</div>
							)}
						</div>
					)}
				</Card>
			)}

			{/* ===== AKTÜEL ÜRÜNLERİ — Bölüm başına carousel ===== */}
			{sections && sections.length > 0 && (
				<Card className="border border-gray-200 bg-white">
					<CardHeader className="pb-4 border-b">
						<CardTitle className="text-xl flex items-center gap-2">
							<ShoppingBasket className="h-5 w-5 text-orange-500" />
							Aktüel Ürünleri
						</CardTitle>
					</CardHeader>
					<CardContent className="py-4 space-y-8">
						{sections.map((section) => (
							<div key={section.id}>
								{/* Bölüm başlığı */}
								<div className="flex items-center gap-2 mb-3 px-2">
									<Tag className="h-4 w-4 text-orange-500 flex-shrink-0" />
									<span className="font-semibold text-gray-800 text-sm">
										{section.title || "Kategori"}
									</span>
									<Badge variant="secondary" className="ml-1 text-xs">
										{section.items?.length || 0} ürün
									</Badge>
								</div>

								{/* Carousel */}
								<Carousel
									opts={{ align: "start", dragFree: true }}
									className="w-full"
								>
									<CarouselContent className="-ml-3">
										{(section.items || []).map((item) => (
											<CarouselItem
												key={item.id}
												className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
											>
												<ProductCard item={item} formatPrice={formatPrice} getProductImage={getProductImage} />
											</CarouselItem>
										))}
									</CarouselContent>
									{(section.items?.length || 0) > 4 && (
										<>
											<CarouselPrevious className="left-0 -translate-x-1/2" />
											<CarouselNext className="right-0 translate-x-1/2" />
										</>
									)}
								</Carousel>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{/* Boş durum */}
			{!hasContent && !hasImages && (!sections || sections.length === 0) && (
				<Card className="border border-gray-200">
					<CardContent className="p-8 text-center">
						<Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">Bu aktüel için henüz içerik eklenmemiş.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
