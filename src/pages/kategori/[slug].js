import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import CategoryContent from "@/components/common/category/CategoryContent";
import CategoryHeader from "@/components/common/category/CategoryHeader";
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
		const url = `/categories/${context.params.slug}?${query}`;
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
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

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

			{/* Sidebar (home hariç sayfalar için) */}
			<Ads ads={ads} positions={["sidebar"]} itemType="category" />

			<CategoryHeader category={category} />

			{/* Header banner */}
			<Ads ads={ads} positions={["category_header"]} itemType="category" />

			<section className="container pt-6">
				{/* Content middle */}
				<Ads ads={ads} positions={["content_middle"]} itemType="category" />

				<CategoryContent url={url} items={items} category={category} />

				{/* Footer */}
				<Ads ads={ads} positions={["footer"]} itemType="category" className="mt-8" />
			</section>
		</Layout>
	);
}
