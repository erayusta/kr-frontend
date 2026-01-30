import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ad, { getAdByPosition } from "../ads/Ad";
import CampaignActualType from "./CampaignActualType";
import CampaignCarType from "./CampaignCarType";
import CampaignCouponType from "./CampaignCouponType";
import CampaignCreditType from "./CampaignCreditType";
import CampaignProductType from "./CampaignProductType";
import CampaignRealEstateType from "./CampaignRealEstateType";
import CampaignLeadForm from "./CampaignLeadForm";

export default function CampaignContent({ campaign, sections, ads }) {
	const contentRef = useRef(null);
	const isActual = campaign?.itemType === "actual";
	const htmlContent = isActual ? campaign?.actual_content : campaign?.content;

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
	}, [htmlContent]);

	// Kampanya tipine göre özel içerik göster
	const renderSpecialContent = () => {
		if (campaign?.itemType === "actual" || campaign?.item_type === "actual") {
			return <CampaignActualType campaign={campaign} sections={sections} />;
		}
		if (campaign?.itemType === "coupon" || campaign?.item_type === "coupon") {
			return <CampaignCouponType campaign={campaign} />;
		}
		if (
			(campaign?.itemType === "credit" || campaign?.item_type === "credit") &&
			campaign.credit
		) {
			return <CampaignCreditType campaign={campaign} />;
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
			(campaign?.itemType === "real-estate" ||
				campaign?.item_type === "real-estate" ||
				campaign?.item_type === "real_estate") &&
			(campaign.real_estate || campaign.realEstate)
		) {
			return <CampaignRealEstateType campaign={campaign} />;
		}
		return null;
	};

	const specialContent = renderSpecialContent();

	return (
		<section className="bg-[#FFFAF4] py-8 mt-6">
			<div className="xl:mx-auto xl:px-36">
				<div className="container px-4">
					{/* Özel İçerik (Ürün, Araba, Gayrimenkul) */}
					{specialContent && <div className="mb-8">{specialContent}</div>}

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Sol Taraf - İçerik */}
						<div
							className={`${campaign?.itemType === "car" || campaign?.item_type === "car" || campaign?.itemType === "product" || campaign?.item_type === "product" || campaign?.itemType === "actual" || campaign?.item_type === "actual" ? "lg:col-span-12" : "lg:col-span-8"}`}
						>
							{htmlContent &&
								campaign?.itemType !== "product" &&
								campaign?.item_type !== "product" &&
								campaign?.itemType !== "car" &&
								campaign?.item_type !== "car" &&
								campaign?.itemType !== "actual" &&
								campaign?.item_type !== "actual" && (
									<Card className="overflow-hidden border-2 border-gray-200">
										{/* Tab Content */}
										<CardContent className="p-6 lg:p-8 bg-[#fffaf4]">
											<div
												ref={contentRef}
												className="prose prose-gray max-w-none campaign-content"
												dangerouslySetInnerHTML={{ __html: htmlContent }}
											/>
										</CardContent>
									</Card>
								)}
						</div>

						{/* Sağ Taraf - Form - Car, Product ve Actual için gösterilmez, kendi içerikleri var */}
						{!(
							campaign?.itemType === "car" ||
							campaign?.item_type === "car" ||
							campaign?.itemType === "product" ||
							campaign?.item_type === "product" ||
							campaign?.itemType === "actual" ||
							campaign?.item_type === "actual"
						) && (
							<div className="lg:col-span-4">
								<div className="sticky top-4 space-y-6">
									{/* Kampanya İletişim Formu */}
									<CampaignLeadForm variant="product" campaignId={campaign?.id} />

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
