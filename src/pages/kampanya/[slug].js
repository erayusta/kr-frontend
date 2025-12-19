import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import CampaignCarHeader from "@/components/common/campaign/CampaignCarHeader";
import CampaignContent from "@/components/common/campaign/CampaignContent";
import CampaignHeader from "@/components/common/campaign/CampaignHeader";
import CampaignProductHeader from "@/components/common/campaign/CampaignProductHeader";
import LatestCampaigns from "@/components/common/campaign/LatestCampaigns";
import { Layout } from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";
import { stripHtmlTags } from "@/lib/utils";

const Ads = dynamic(
	() =>
		import("@/components/common/ads/Ad").then((mod) => ({ default: mod.Ads })),
	{ ssr: false },
);

export async function getServerSideProps(context) {
	try {
		const response = await serverApiRequest(
			`/campaigns/${context.params.slug}`,
			"get",
		);
		if (!response || !response.data) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				campaign: response.data || null,
				categories: response.related ? [{ campaigns: response.related }] : [],
				ads: response.ads || [],
			},
		};
	} catch (error) {
		console.error("[Campaign Page Error]", error.message);
		return {
			notFound: true,
		};
	}
}

export default function Campaign({ campaign, categories, isGone, ads }) {
	console.log("hocam", ads);
	const [CampaignForm, setCampaignForm] = useState(null);
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/kampanya/${campaign?.slug || router.query.slug}`;

	useEffect(() => {
		if (typeof window !== "undefined" && campaign?.lead_form) {
			import("@/components/common/campaign/CampaignForm")
				.then((module) => {
					setCampaignForm(() => module.default);
				})
				.catch((error) => {
					console.error("Failed to load CampaignForm:", error);
				});
		}
	}, [campaign]);

	if (isGone) {
		return (
			<div>
				<h1>410 - Page Gone</h1>
				<p>The page you are looking for has been removed.</p>
			</div>
		);
	}

	if (!campaign) {
		return (
			<Layout>
				<div className="container py-10">
					<h1>Kampanya bulunamadı</h1>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<NextSeo
				title={`${campaign?.title || "Kampanya"} | Kampanya Radar`}
				description={stripHtmlTags(campaign?.content || "")}
				canonical={canonical}
				openGraph={{
					url: canonical,
					title: `${campaign?.title || "Kampanya"} | Kampanya Radar`,
					description: stripHtmlTags(campaign?.content || ""),
					images: [
						{
							url: campaign?.image || "",
							width: 800,
							height: 600,
							alt: campaign?.title || "Kampanya",
							type: "image/jpeg",
						},
					],
					siteName: "KampanyaRadar",
				}}
				twitter={{
					handle: "@handle",
					site: "@site",
					cardType: "summary_large_image",
				}}
			/>

			{/* Sidebar */}
			<Ads ads={ads} positions={["sidebar"]} itemType="campaign" />

			{campaign?.lead_form &&
				CampaignForm &&
				!campaign.car &&
				campaign?.itemType !== "product" && (
					<CampaignForm form={campaign.lead_form} campaignId={campaign.id} />
				)}

			{/* Header banner - Header'ın üstünde gösterilir */}
			<Ads ads={ads} positions={["campaign_header"]} itemType="campaign" />

			{campaign?.car ? (
				<CampaignCarHeader campaign={campaign} />
			) : campaign?.itemType === "product" ? (
				<CampaignProductHeader campaign={campaign} />
			) : (
				<CampaignHeader campaign={campaign} />
			)}

			{/* Content middle */}
			<Ads ads={ads} positions={["content_middle"]} itemType="campaign" />

			<CampaignContent ads={ads} campaign={campaign} />

			{/* Footer */}
			<Ads ads={ads} positions={["footer"]} itemType="campaign" />

			<section className="md:container">
				<LatestCampaigns data={categories} />
			</section>
		</Layout>
	);
}
