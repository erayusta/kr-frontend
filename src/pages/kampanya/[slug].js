import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import UnifiedCampaignHeader from "@/components/common/campaign/UnifiedCampaignHeader";
import CampaignContent from "@/components/common/campaign/CampaignContent";
import CampaignFormWidget from "@/components/common/campaign/CampaignFormWidget";
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
	const slug = context.params.slug;
	console.log(`[Campaign SSR] START slug=${slug}`);

	try {
		const response = await serverApiRequest(
			`/campaigns/${slug}`,
			"get",
		);
		console.log(`[Campaign SSR] API response received, has data: ${!!response?.data}`);

		if (!response || !response.data) {
			console.error(`[Campaign SSR] No data for slug=${slug}, response keys:`, Object.keys(response || {}));
			return {
				notFound: true,
			};
		}

		return {
			props: {
				campaign: response.data || null,
				sections: response.sections || [],
				categories: response.related
				? [{
					campaigns: response.related,
					slug: response.data?.categories?.[0]?.slug || null,
				}]
				: [],
				ads: response.ads || [],
			},
		};
	} catch (error) {
		console.error(`[Campaign SSR] ERROR slug=${slug}:`, error.message);
		if (error.response) {
			console.error(`[Campaign SSR] Status: ${error.response.status}, Data:`, JSON.stringify(error.response.data).slice(0, 500));
		}
		if (error.code) {
			console.error(`[Campaign SSR] Error code: ${error.code}`);
		}
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

			<UnifiedCampaignHeader campaign={campaign} />

			{/* Content middle */}
			<Ads ads={ads} positions={["content_middle"]} itemType="campaign" />

			<CampaignContent campaign={campaign} sections={sections} />

			{/* Footer */}
			<Ads ads={ads} positions={["footer"]} itemType="campaign" />

			<section className="md:container">
				<LatestCampaigns data={categories} />
			</section>

			<CampaignFormWidget campaign={campaign} />
		</Layout>
	);
}
