import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import CampaignContent from "@/components/common/campaign/CampaignContent";
import CampaignHeader from "@/components/common/campaign/CampaignHeader";
import LatestCampaigns from "@/components/common/campaign/LatestCampaigns";
import Layout from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";
import { stripHtmlTags } from "@/lib/utils";

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

		// Get ads data from home endpoint or another source
		// For now, we'll pass empty ads

		return {
			props: {
				campaign: response.data || null,
				categories: response.related ? [{ campaigns: response.related }] : [],
				ads: [],
			},
		};
	} catch (error) {
		console.error("[Campaign Page Error]", error.message);
		return {
			notFound: true,
		};
	}
}

export default function Campaign({ campaign, categories, ads, isGone }) {
	const [CampaignForm, setCampaignForm] = useState(null);
	const router = useRouter();
	const canonical = `http://localhost:3000/kampanya/${campaign?.slug || router.query.slug}`;

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

	// Handle missing campaign data
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
			{campaign?.lead_form && CampaignForm && !campaign.car && (
				<CampaignForm form={campaign.lead_form} campaignId={campaign.id} />
			)}
			<CampaignHeader campaign={campaign}></CampaignHeader>
			<CampaignContent ads={ads} campaign={campaign}></CampaignContent>
			<section className="md:container">
				<LatestCampaigns data={categories}></LatestCampaigns>
			</section>
		</Layout>
	);
}
