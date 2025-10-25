import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Ad from "@/components/common/ads/Ad";
import BrandCarousel from "@/components/common/home/BrandCarousel";
import CategoryCampaginCarousel from "@/components/common/home/CategoryCampaignCarousel";
import HeroCarousel from "@/components/common/home/HeroCarousel";
import HeroLp from "@/components/common/home/HeroLp";
import InfoBox from "@/components/common/home/InfoBox";
import LatestPost from "@/components/common/home/LatestPost";
import Layout from "@/components/layouts/layout";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";

export async function getServerSideProps() {
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
		console.error("[HomePage SSR Error]", error.message);

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
}

export default function Home({ categories, carousels, brands, posts, ads }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/`;

	return (
		<Layout>
			<NextSeo
				title="Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar"
				description="Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir. A101 ve Bim gibi marketlerin güncel kampanyaları burada!"
				canonical={canonical}
				openGraph={{
					url: process.env.NEXT_PUBLIC_BASE_URL,
					title:
						"Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar",
					description:
						"Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir. A101 ve Bim gibi marketlerin güncel kampanyaları burada!",
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

			{/* Yan reklamlar */}
			<Ad
				position="left"
				ad={ads?.find((item) => item.position === "home_left")}
			/>
			<Ad
				position="right"
				ad={ads?.find((item) => item.position === "home_right")}
			/>

			<section className="mx-auto px-4 xl:mx-auto xl:px-36 min-h-screen antialiased">
				<Ad
					position="center"
					ad={ads?.find((item) => item.position === "home_header")}
				/>

				<div className="grid md:grid-cols-2 gap-5">
					<HeroCarousel data={carousels}>
						<BrandCarousel data={brands} />
					</HeroCarousel>
					<HeroLp />
				</div>

				<CategoryCampaginCarousel data={categories} />
				<InfoBox />
				<LatestPost posts={posts} />
			</section>
		</Layout>
	);
}
