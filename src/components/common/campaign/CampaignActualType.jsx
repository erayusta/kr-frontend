import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGE_BASE_URL } from "@/constants/site";

export default function CampaignActualType({ campaign, sections }) {
	const contentRef = useRef(null);

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

	const handleDownload = async (url, filename) => {
		// For CDN files, open in new tab (CORS might block direct download)
		window.open(url, "_blank");
	};

	const getFileName = (url) => {
		if (!url) return "dosya";
		return url.split("/").pop() || "dosya";
	};

	return (
		<div className="space-y-8">
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

			{/* Download Buttons Section */}
			{(pdfFiles.length > 0 || imageFiles.length > 0) && (
				<Card className="border-2 border-orange-200 bg-orange-50">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl flex items-center gap-2">
							<Download className="h-5 w-5 text-orange-500" />
							Katalog / Broşür İndir
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{/* PDF Files */}
							{pdfFiles.map((url, index) => (
								<Button
									key={`pdf-${index}`}
									variant="outline"
									className="h-auto py-4 px-4 flex items-center gap-3 justify-start bg-white hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
									onClick={() => handleDownload(url, getFileName(url))}
								>
									<FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
									<div className="text-left overflow-hidden">
										<p className="font-medium text-gray-900 truncate">
											{getFileName(url)}
										</p>
										<p className="text-xs text-gray-500">PDF Dosyası</p>
									</div>
								</Button>
							))}

							{/* Image Files */}
							{imageFiles.map((url, index) => (
								<Button
									key={`img-${index}`}
									variant="outline"
									className="h-auto py-4 px-4 flex items-center gap-3 justify-start bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors"
									onClick={() => handleDownload(url, getFileName(url))}
								>
									<ImageIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
									<div className="text-left overflow-hidden">
										<p className="font-medium text-gray-900 truncate">
											{getFileName(url)}
										</p>
										<p className="text-xs text-gray-500">Görsel Dosyası</p>
									</div>
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
