import { Bell, ExternalLink } from "lucide-react";
import { useState } from "react";

import ProductImageGallery from "./ProductImageGallery";

export default function AnnouncementView({
	campaign,
	productData,
	productImages,
	productColors,
	attributes,
	brandLogo,
	brandName,
}) {
	const [selectedColorIndex, setSelectedColorIndex] = useState(0);

	return (
		<div className="bg-[#fffaf4]">
			<div className="container mx-auto px-4 py-6 space-y-6">
				{/* Announcement Hero Card */}
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 md:p-8 text-white shadow-lg">
					{/* Background decoration */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

					<div className="relative z-10">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-5">
							<Bell className="h-4 w-4" />
							ÜRÜN DUYURUSU
						</div>

						<div className="flex flex-col md:flex-row gap-6 items-center">
							{/* Product Image */}
							{productImages.length > 0 && (
								<div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 bg-white rounded-xl p-3 shadow-md">
									{/* biome-ignore lint/performance/noImgElement: Remote image */}
									<img
										src={productImages[0]}
										alt={productData?.title || "Ürün"}
										className="w-full h-full object-contain"
									/>
								</div>
							)}

							{/* Text Content */}
							<div className="flex-1 text-center md:text-left">
								<h2 className="text-2xl md:text-3xl font-bold mb-3">
									{productData?.title || campaign?.title}
								</h2>

								{productData?.description && (
									<p className="text-white/90 text-base mb-2 line-clamp-3">
										{productData.description}
									</p>
								)}

								{brandName && (
									<p className="text-white/70 text-sm mb-5">
										Marka: <span className="font-semibold text-white/90">{brandName}</span>
									</p>
								)}

								{campaign?.link && (
									<a
										href={campaign.link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
									>
										Detayları Gör
										<ExternalLink className="h-4 w-4" />
									</a>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Content Grid: Product Info + Campaign Content */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Product Info (Left) */}
					<div className="lg:col-span-5">
						<div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
							{/* Image Gallery */}
							<ProductImageGallery
								images={productImages}
								colors={productColors}
								title={productData?.title || "Ürün görseli"}
								selectedColorIndex={selectedColorIndex}
								onColorSelect={setSelectedColorIndex}
							/>

							{/* Attributes Table */}
							<div>
								<h3 className="text-base font-semibold text-gray-900 mb-3">
									Ürün Özellikleri
								</h3>
								<div className="bg-gray-50 rounded-lg">
									{Object.entries(attributes).length > 0 ? (
										Object.entries(attributes).map(
											([key, value], index) => (
												<div
													key={`attr-${key}`}
													className={`flex justify-between py-2.5 px-3 text-sm ${
														index !== 0
															? "border-t border-gray-200"
															: ""
													}`}
												>
													<span className="text-gray-500">{key}</span>
													<span className="text-gray-900 font-medium">
														{value}
													</span>
												</div>
											),
										)
									) : productData?.gtin ? (
										<div className="flex justify-between py-2.5 px-3 text-sm">
											<span className="text-gray-500">Ürün Kodu</span>
											<span className="text-gray-900 font-medium">
												{productData.gtin}
											</span>
										</div>
									) : (
										<p className="text-gray-400 text-center py-6 text-sm">
											Ürün özellikleri bulunmamaktadır.
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Campaign Content (Right) */}
					<div className="lg:col-span-7 space-y-6">
						{campaign?.content && (
							<div className="bg-white rounded-xl border border-gray-100 p-6">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-1 h-5 bg-blue-500 rounded-full" />
									<h3 className="text-base font-semibold text-gray-900">
										Kampanya İçeriği
									</h3>
								</div>
								<div
									className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-800"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Campaign content is sanitized on the backend
									dangerouslySetInnerHTML={{
										__html: campaign.content,
									}}
								/>
							</div>
						)}

					</div>
				</div>
			</div>
		</div>
	);
}
