import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
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
				sections: response.sections || [],
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

export default function Campaign({ campaign, sections, categories, isGone, ads }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/kampanya/${campaign?.slug || router.query.slug}`;

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

			{/* Sidebar sol/sağ reklamlar */}
			<Ads ads={ads} positions={["campaign_left", "campaign_right"]} itemType="campaign" />

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

			<CampaignContent campaign={campaign} sections={sections} />

			{/* Footer */}
			<Ads ads={ads} positions={["footer"]} itemType="campaign" />

			<section className="md:container">
				<LatestCampaigns data={categories} />
			</section>
		</Layout>
	);
}
