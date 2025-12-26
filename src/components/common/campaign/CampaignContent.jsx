import { AlertCircle, Calendar, Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Ad, { getAdByPosition } from "../ads/Ad";
import CampaignCarType from "./CampaignCarType";
import CampaignCouponType from "./CampaignCouponType";
import CampaignProductType from "./CampaignProductType";
import CampaignRealEstateType from "./CampaignRealEstateType";

export default function CampaignContent({ campaign, ads }) {
	const contentRef = useRef(null);
	const nameId = useId();
	const emailId = useId();
	const phoneId = useId();

	// Fix images in HTML content

	useEffect(() => {
		if (contentRef.current) {
			const images = contentRef.current.querySelectorAll("img");
			images.forEach((img) => {
				img.onerror = function () {
					if (this.src.includes("/campains/uploads/")) {
						this.src = this.src.replace("/campains/uploads/", "/campains/");
					} else if (
						this.src.includes("/campains/") &&
						!this.src.includes("/uploads/")
					) {
						this.src = this.src.replace("/campains/", "/campaigns/");
					} else if (
						this.src.includes("/campaigns/") &&
						!this.src.includes("/uploads/")
					) {
						this.src = this.src.replace("/campaigns/", "/campaigns/uploads/");
					} else {
						// Show placeholder or hide
						this.style.display = "none";
						const placeholder = document.createElement("div");
						placeholder.className =
							"bg-gray-200 p-4 text-center text-gray-400 rounded";
						placeholder.textContent = "Görsel yüklenemedi";
						this.parentNode.replaceChild(placeholder, this);
					}
				};
			});
		}
	}, [campaign.content]);

	// Kampanya tipine göre özel içerik göster
	const renderSpecialContent = () => {
		if (campaign?.itemType === "coupon" || campaign?.item_type === "coupon") {
			return <CampaignCouponType campaign={campaign} />;
		}
		if (
			(campaign?.itemType === "car" || campaign?.item_type === "car") &&
			(campaign.car || campaign.item)
		) {
			return <CampaignCarType campaign={campaign} />;
		}
		if (
			(campaign?.itemType === "product" || campaign?.item_type === "product") &&
			campaign.product
		) {
			return <CampaignProductType campaign={campaign} />;
		}
		if (
			(campaign?.itemType == "real-estate" ||
				campaign?.item_type == "real-estate" ||
				campaign?.item_type == "real_estate") &&
			(campaign.real_estate || campaign.realEstate)
		) {
			return <CampaignRealEstateType campaign={campaign} />;
		}
		return null;
	};

	const specialContent = renderSpecialContent();

	return (
		<section className="bg-[#FFFAF4] py-8">
			<div className="xl:mx-auto xl:px-36">
				<div className="container px-4">
					{/* Özel İçerik (Ürün, Araba, Gayrimenkul) */}
					{specialContent && <div className="mb-8">{specialContent}</div>}

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Sol Taraf - İçerik */}
						<div
							className={`${campaign?.itemType === "car" || campaign?.item_type === "car" || campaign?.itemType === "product" || campaign?.item_type === "product" ? "lg:col-span-12" : "lg:col-span-8"}`}
						>
							{campaign.content &&
								campaign?.itemType !== "product" &&
								campaign?.item_type !== "product" &&
								campaign?.itemType !== "car" &&
								campaign?.item_type !== "car" && (
									<Card className="overflow-hidden border-2 border-gray-200">
										{/* Tab Content */}
										<CardContent className="p-6 lg:p-8 bg-[#fffaf4]">
											<div
												ref={contentRef}
												className="prose prose-gray max-w-none campaign-content"
												dangerouslySetInnerHTML={{ __html: campaign.content }}
											/>
										</CardContent>
									</Card>
								)}
						</div>

						{/* Sağ Taraf - Form - Car ve Product için gösterilmez, kendi formları var */}
						{!(
							campaign?.itemType === "car" ||
							campaign?.item_type === "car" ||
							campaign?.itemType === "product" ||
							campaign?.item_type === "product"
						) && (
							<div className="lg:col-span-4">
								<div className="sticky top-4 space-y-6">
									{/* Kampanya Haberdar Olma Formu */}
									<Card className="border-2 border-orange-200 overflow-hidden">
										<div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
											<h3 className="text-xl font-bold text-white mb-2">
												Kampanya Haberdar Olma Formu
											</h3>
											<p className="text-white/90 text-sm">
												Kampanya ile ilgili güncellemelerden haberdar olmak için
												bilgilerinizi paylaşın.
											</p>
										</div>
										<CardContent className="p-6 bg-white space-y-4">
											<div className="space-y-2">
												<Label
													htmlFor={nameId}
													className="text-gray-700 font-medium"
												>
													Ad ve Soyad
												</Label>
												<Input
													id={nameId}
													placeholder="Adınızı ve soyadınızı girin"
													className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
												/>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor={emailId}
													className="text-gray-700 font-medium"
												>
													E-Posta Adresi
												</Label>
												<Input
													id={emailId}
													type="email"
													placeholder="E-posta adresinizi girin"
													className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
												/>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor={phoneId}
													className="text-gray-700 font-medium"
												>
													Telefon
												</Label>
												<Input
													id={phoneId}
													type="tel"
													placeholder="Telefon numaranızı girin"
													className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
												/>
											</div>

											<Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6 text-base rounded-xl shadow-lg">
												Hemen Başvur
											</Button>

											<p className="text-xs text-gray-500 text-center mt-4">
												İletişiminizde Kampanya Türlerini Seçiniz
											</p>

											<div className="flex flex-wrap gap-2 justify-center">
												{campaign.categories?.map((category) => (
													<span
														key={category.id}
														className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
													>
														{category.name}
													</span>
												))}
											</div>
										</CardContent>
									</Card>

									{/* Reklam */}
									{getAdByPosition(ads, "sidebar", "campaign") && (
										<Ad
											variant="sidebar"
											ad={getAdByPosition(ads, "sidebar", "campaign")}
										/>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Custom Styles for Campaign Content */}
			<style jsx global>{`
				.campaign-content h1,
				.campaign-content h2,
				.campaign-content h3,
				.campaign-content h4,
				.campaign-content h5,
				.campaign-content h6 {
					color: #111827;
					font-weight: 600;
					margin-top: 1.5rem;
					margin-bottom: 0.75rem;
				}

				.campaign-content ul,
				.campaign-content ol {
					margin-left: 1.5rem;
					margin-top: 0.5rem;
					margin-bottom: 0.5rem;
				}

				.campaign-content li {
					margin-top: 0.25rem;
					margin-bottom: 0.25rem;
				}

				.campaign-content p {
					margin-top: 0.5rem;
					margin-bottom: 0.5rem;
					line-height: 1.7;
				}

				.campaign-content img {
					max-width: 100%;
					height: auto;
					border-radius: 0.5rem;
					margin: 1rem 0;
				}

				.campaign-content strong,
				.campaign-content em {
					font-weight: 600;
					color: #111827;
				}

				.campaign-content a {
					color: #f97316;
					text-decoration: underline;
				}

				.campaign-content a:hover {
					color: #ea580c;
				}

				.campaign-content table {
					width: 100%;
					border-collapse: collapse;
					margin: 1rem 0;
				}

				.campaign-content table th,
				.campaign-content table td {
					border: 1px solid #e5e7eb;
					padding: 0.5rem;
					text-align: left;
				}

				.campaign-content table th {
					background-color: #f9fafb;
					font-weight: 600;
				}
			`}</style>
		</section>
	);
}
