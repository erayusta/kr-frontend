import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import CategoryContent from "@/components/common/category/CategoryContent";
import CategoryHeader from "@/components/common/category/CategoryHeader";
import { Layout } from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";

const Ad = dynamic(() => import("@/components/common/ads/Ad"), { ssr: false });

export async function getServerSideProps(context) {
	try {
		let query = new URLSearchParams(context.query).toString();
		const url = `/categories/${context.params.slug}?${query}`;
		console.log("Fetching category data from URL:", url);
		const data = await serverApiRequest(url, "get");

		return {
			props: {
				category: data.data || null,
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

export default function Category({ category, items, ads, url }) {
	console.log("hocam", ads);
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

	// Handle missing category data
	if (!category) {
		return (
			<Layout>
				<div className="container py-10">
					<h1>Kategori bulunamadı</h1>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<NextSeo
				title={`${category?.name || "Kategori"} Kampanyaları | Kampanya Radar`}
				description={`${category?.name || "Kategori"} güncel kampanyaları kampanyaradar`}
				canonical={canonical}
				openGraph={{
					url: canonical,
					title: `${category?.name || "Kategori"} Kampanyaları | Kampanya Radar`,
					description: category?.name || "Kategori",
					siteName: "KampanyaRadar",
				}}
				twitter={{
					handle: "@handle",
					site: "@site",
					cardType: "summary_large_image",
				}}
			/>
			<CategoryHeader category={category} />
			<Ad
				position="center"
				ad={ads?.find((item) => item.position === "category_header")}
			/>
			<section className="container">
				<CategoryContent
					url={url}
					items={items}
					category={category}
				></CategoryContent>
			</section>
		</Layout>
	);
}
