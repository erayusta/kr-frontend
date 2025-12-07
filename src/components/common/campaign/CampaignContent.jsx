import { Calendar, ChevronRight, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Ad from "../ads/Ad";
import CampaignCarType from "./CampaignCarType";
import CampaignCouponType from "./CampaignCouponType";
import CampaignProductType from "./CampaignProductType";
import CampaignRealEstateType from "./CampaignRealEstateType";

export default function CampaignContent({ campaign, ads }) {
	const contentRef = useRef(null);
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
		if (campaign?.itemType == "coupon" || campaign?.item_type == "coupon") {
			return <CampaignCouponType campaign={campaign} />;
		}
		if (
			(campaign?.itemType == "car" || campaign?.item_type == "car") &&
			(campaign.car || campaign.item)
		) {
			return <CampaignCarType campaign={campaign} />;
		}
		if (
			(campaign?.itemType == "product" || campaign?.item_type == "product") &&
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
		<section className="mx-auto px-4 xl:mx-auto xl:px-36 antialiased py-4 bg-[#fffaf4]">
			<div className="container px-4">
				<div className="">
					{/* Özel İçerik (Ürün, Araba, Gayrimenkul) */}
					{specialContent && <div className="mb-8">{specialContent}</div>}
					{/* Kampanya Detayları */}
					{campaign.content &&
						campaign?.itemType !==
							"product" && (
								<Card className="mb-8">
									<CardHeader className="border-b bg-blue-50">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="p-2 bg-blue-100 rounded-lg">
													<Info className="h-5 w-5 text-blue-600" />
												</div>
												<h2 className="text-xl font-semibold text-gray-900">
													Kampanya Detayları
												</h2>
											</div>

											{(campaign.start_date || campaign.end_date) && (
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Calendar className="h-4 w-4" />
													<span>
														{campaign.start_date &&
															new Date(campaign.start_date).toLocaleDateString(
																"tr-TR",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
														{" - "}
														{campaign.end_date &&
															new Date(campaign.end_date).toLocaleDateString(
																"tr-TR",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
													</span>
												</div>
											)}
										</div>
									</CardHeader>

									<CardContent className="p-6">
										<div
											ref={contentRef}
											className="prose prose-gray max-w-none campaign-content"
											dangerouslySetInnerHTML={{ __html: campaign.content }}
										/>
									</CardContent>

									{/* Kampanya Linki */}
									{campaign.link && (
										<div className="px-6 pb-6">
											<Button
												asChild
												size="lg"
												className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
											>
												<Link
													href={campaign.link}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-4 w-4 mr-2" />
													Kampanyaya Git
													<ChevronRight className="h-4 w-4 ml-1" />
												</Link>
											</Button>
										</div>
									)}
								</Card>,
							)}
					<Ad
						position="center"
						ad={ads.find((item) => item.position == "campaign_content_one")}
					/>

					<Ad
						position="left"
						ad={ads.find((item) => item.position === "campaign_left")}
					/>
					<Ad
						position="right"
						ad={ads.find((item) => item.position === "campaign_right")}
					/>

					{/* Reklamlar - Grid Düzeninde */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{ads?.find((item) => item.position == "campaign_content_one") && (
							<Ad
								position="center"
								ad={ads.find((item) => item.position == "campaign_content_one")}
							/>
						)}
						{ads?.find((item) => item.position == "campaign_content_two") && (
							<Ad
								position="center"
								ad={ads.find((item) => item.position == "campaign_content_two")}
							/>
						)}
						{ads?.find((item) => item.position == "campaign_right") && (
							<Ad
								position="right"
								ad={ads.find((item) => item.position == "campaign_right")}
							/>
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
        
        .campaign-content strong {
          font-weight: 600;
          color: #111827;
        }
        
        .campaign-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .campaign-content a:hover {
          color: #1d4ed8;
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
