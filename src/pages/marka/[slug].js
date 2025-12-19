import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import BrandContent from "@/components/common/brand/BrandContent";
import BrandHeader from "@/components/common/brand/BrandHeader";
import { Layout } from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";

const Ads = dynamic(
	() =>
		import("@/components/common/ads/Ad").then((mod) => ({ default: mod.Ads })),
	{ ssr: false },
);

export async function getServerSideProps(context) {
	try {
		const query = new URLSearchParams(context.query).toString();
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

export default function Brand({ brand, ads, url, items }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

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

			{/* Sidebar */}
			<Ads ads={ads} positions={["sidebar"]} itemType="brand" />

			<BrandHeader brand={brand} />

			{/* Header banner */}
			<Ads ads={ads} positions={["brand_header"]} itemType="brand" />

			<section className="container">
				{/* Content middle */}
				<Ads ads={ads} positions={["content_middle"]} itemType="brand" />

				<BrandContent items={items} url={url} brand={brand} />

				{/* Footer */}
				<Ads ads={ads} positions={["footer"]} itemType="brand" />
			</section>
		</Layout>
	);
}
