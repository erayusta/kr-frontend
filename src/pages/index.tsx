import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import BrandCarousel from "@/components/common/home/BrandCarousel";
import CategoryCampaginCarousel from "@/components/common/home/CategoryCampaignCarousel";
import HeroCarousel from "@/components/common/home/HeroCarousel";
import HeroLp from "@/components/common/home/HeroLp";
import InfoBox from "@/components/common/home/InfoBox";
import LatestPost from "@/components/common/home/LatestPost";
import { Layout } from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";
import type { Ad } from "@/types/ad";

const Ads = dynamic(
	() =>
		import("@/components/common/ads/Ad").then((mod) => ({ default: mod.Ads })),
	{ ssr: false },
);

interface HomeProps {
	categories: any[];
	carousels: any[];
	brands: any[];
	ads: Ad[];
	posts: any[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ res }) => {
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=60, stale-while-revalidate=300",
	);

	try {
		const data = await serverApiRequest("/", "get");

		return {
			props: {
				categories: data?.categories || [],
				carousels: data?.sliders || [],
				brands: data?.brands || [],
				ads: data?.ads || [],
				posts: data?.posts || [],
			},
		};
	} catch (error) {
		console.error("[HomePage SSR Error]", (error as Error).message);

		return {
			props: {
				categories: [],
				carousels: [],
				brands: [],
				ads: [],
				posts: [],
			},
		};
	}
};

export default function Home({
	categories,
	carousels,
	brands,
	posts,
	ads,
}: HomeProps) {
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/`;

	return (
		<Layout>
			<NextSeo
				title="Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar"
				description="Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir."
				canonical={canonical}
				openGraph={{
					url: process.env.NEXT_PUBLIC_BASE_URL,
					title:
						"Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar",
					description:
						"Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir.",
					images: [
						{
							url: "https://kampanyaradar.s3.us-east-1.amazonaws.com/kampanyaradar/general/Mlk7WBxx36Op0Ej.png",
							width: 800,
							height: 600,
							alt: "KampanyaRadar",
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

			{/* Sidebar reklamları */}
			<Ads ads={ads} positions={["home_left", "home_right"]} />

			<section className="mx-auto px-4 xl:mx-auto xl:px-36 min-h-screen antialiased mr pt-6">
				{/* Header banner */}
				<Ads ads={ads} positions={["home_header"]} />

				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
						<HeroCarousel data={carousels} />
						<HeroLp />
					</div>
					<BrandCarousel data={brands} />
				</div>

				{/* Content middle */}
				<Ads ads={ads} positions={["content_middle"]} />

				<div className="container mx-auto px-4">
					<CategoryCampaginCarousel data={categories} />
					<InfoBox />
					<LatestPost posts={posts} />
				</div>

				{/* Footer */}
				<Ads ads={ads} positions={["footer"]} />
			</section>
		</Layout>
	);
}
