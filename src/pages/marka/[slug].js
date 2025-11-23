import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Ad from "@/components/common/ads/Ad";
import BrandContent from "@/components/common/brand/BrandContent";
import BrandHeader from "@/components/common/brand/BrandHeader";
import Layout from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";

export async function getServerSideProps(context) {
	try {
		let query = new URLSearchParams(context.query).toString();
		const url = `/brands/${context.params.slug}?${query}`;
		const data = await serverApiRequest(url, "get");

		return {
			props: {
				brand: data.data || null,
				items: data?.campaigns || [],
				ads: data?.ads || [],
				url: url,
			},
		};
	} catch (error) {
		console.log("hata!", error);
		return {
			notFound: true,
		};
	}
}

export default function Category({ brand, ads, url, items }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

	// Handle missing brand data
	if (!brand) {
		return (
			<Layout>
				<div className="container py-10">
					<h1>Marka bulunamadı</h1>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<NextSeo
				title={`${brand?.name || "Marka"} Kampanyaları | Kampanya Radar`}
				description={`${brand?.name || "Marka"} güncel kampanyaları kampanyaradar`}
				canonical={canonical}
				openGraph={{
					url: canonical,
					title: `${brand?.name || "Marka"} Kampanyaları | Kampanya Radar`,
					description: brand?.name || "Marka",
					siteName: "KampanyaRadar",
				}}
				twitter={{
					handle: "@handle",
					site: "@site",
					cardType: "summary_large_image",
				}}
			/>
			<BrandHeader brand={brand} />
			<Ad
				position="center"
				ad={ads?.find((item) => item.position == "brand_header")}
			></Ad>
			<section className="container">
				<BrandContent items={items} url={url} brand={brand} />
			</section>
		</Layout>
	);
}
