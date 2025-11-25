import { Paperclip } from "lucide-react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import { Layout } from "@/components/layouts/layout";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import serverApiRequest from "@/lib/serverApiRequest";
export async function getServerSideProps(context) {
	try {
		let query = new URLSearchParams(context.query).toString();
		const url = `/posts?${query}`;
		const data = await serverApiRequest(url, "get");

		return {
			props: {
				items: data?.data || [],
				ads: data?.ads || [],
				url: url || "",
			},
		};
	} catch (error) {
		console.log("hata!", error);
		return {
			notFound: true,
		};
	}
}

export default function Blog({ category, items, ads, url }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

	return (
		<Layout>
			<NextSeo
				title={`Blog Yazıları | Kampanya Radar`}
				description={`blog yazıları kampanyaradar`}
				canonical={canonical}
				openGraph={{
					url: canonical,
					title: `Blog Yazıları | Kampanya Radar`,
					description: "blog",
					siteName: "KampanyaRadar",
				}}
				twitter={{
					handle: "@handle",
					site: "@site",
					cardType: "summary_large_image",
				}}
			/>
			<section className="w-full py-3  mb-5 shadow  bg-white dark:bg-gray-800">
				<div className="md:container px-4">
					<div className="grid items-center gap-10 grid-cols-1 md:grid-cols-1">
						<div className="flex gap-x-3 items-center justify-between">
							<div className="flex flex-row gap-3 items-center">
								<div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">
									<Paperclip></Paperclip>
								</div>
								<h1 className="text-3xl w-[85%] font-bold tracking-tighter ">
									Blog Yazıları
								</h1>
							</div>
							<div className="flex md:flex-row flex-col items-center gap-3"></div>
						</div>
					</div>
				</div>
			</section>
			<section className="container">
				<InfiniteScroll type={"posts"} initialItems={items || []} url={url} />
			</section>
		</Layout>
	);
}
