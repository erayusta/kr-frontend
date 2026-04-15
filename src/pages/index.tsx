import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NextSeo } from "next-seo";
import BrandCarousel from "@/components/common/home/BrandCarousel";
import CategoryCarousel from "@/components/common/home/CategoryCarousel";
import CategoryCampaginCarousel from "@/components/common/home/CategoryCampaignCarousel";
import HeroCarousel from "@/components/common/home/HeroCarousel";
import HeroLp from "@/components/common/home/HeroLp";
import InfoBox from "@/components/common/home/InfoBox";
import LatestPost from "@/components/common/home/LatestPost";
import ProductCard from "@/components/common/marketplace/ProductCard";
import { Layout } from "@/components/layouts/layout";
import apiRequest from "@/lib/apiRequest";
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
	allCategories: any[];
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
				allCategories: data?.allCategories || [],
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
				allCategories: [],
				ads: [],
				posts: [],
			},
		};
	}
};

function LowestPricesSection() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiRequest("/marketplace/products/featured", "get")
			.then((data: any) => {
				setProducts(data?.data || []);
			})
			.catch(() => {
				// Sessizce geç
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="container mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-1 h-5 bg-orange-500 rounded-full" />
					<h2 className="text-base font-semibold text-gray-900">⚡ Günün Fırsatları</h2>
				</div>
				<Link
					href="/gunun-firsatlari"
					className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
				>
					Tümünü Gör &rarr;
				</Link>
			</div>

			<div className="overflow-x-auto pb-2">
				<div className="flex gap-4" style={{ minWidth: "max-content" }}>
					{loading
						? Array.from({ length: 8 }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards
									key={i}
									className="min-w-[160px] max-w-[180px] w-[160px] rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse"
								>
									<div className="aspect-square bg-gray-100" />
									<div className="p-3 flex flex-col gap-2">
										<div className="h-3 bg-gray-100 rounded w-1/2" />
										<div className="h-4 bg-gray-100 rounded w-full" />
										<div className="h-4 bg-gray-100 rounded w-3/4" />
										<div className="h-6 bg-orange-50 rounded-full w-2/3 mt-1" />
									</div>
								</div>
							))
						: products.map((product) => (
								<div key={product.slug} className="min-w-[160px] max-w-[180px] w-[160px] flex-shrink-0">
									<ProductCard product={product} />
								</div>
							))}
				</div>
			</div>
		</div>
	);
}

function PriceDropsSection() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiRequest("/marketplace/products/price-drops", "get")
			.then((data: any) => {
				setProducts(data?.data || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	if (!loading && products.length === 0) return null;

	return (
		<div className="container mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-1 h-5 bg-green-500 rounded-full" />
					<h2 className="text-base font-semibold text-gray-900">📉 Fiyatı Düşen Ürünler</h2>
				</div>
				<Link href="/fiyat-dusus" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
					Tümünü Gör &rarr;
				</Link>
			</div>

			<div className="overflow-x-auto pb-2">
				<div className="flex gap-4" style={{ minWidth: "max-content" }}>
					{loading
						? Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="min-w-[160px] max-w-[180px] w-[160px] rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse"
								>
									<div className="aspect-square bg-gray-100" />
									<div className="p-3 flex flex-col gap-2">
										<div className="h-3 bg-gray-100 rounded w-1/2" />
										<div className="h-4 bg-gray-100 rounded w-full" />
										<div className="h-6 bg-green-50 rounded-full w-2/3 mt-1" />
									</div>
								</div>
							))
						: products.map((product) => (
								<div key={product.slug} className="min-w-[160px] max-w-[180px] w-[160px] flex-shrink-0">
									<ProductCard product={product} />
								</div>
							))}
				</div>
			</div>
		</div>
	);
}

function NewProductsSection() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiRequest("/marketplace/products?sort=newest&per_page=12", "get")
			.then((data: any) => {
				setProducts(data?.data || []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	if (!loading && products.length === 0) return null;

	return (
		<div className="container mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-1 h-5 bg-violet-500 rounded-full" />
					<h2 className="text-base font-semibold text-gray-900">✨ Yeni Ürünler</h2>
				</div>
				<Link href="/yeni-urunler" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
					Tümünü Gör &rarr;
				</Link>
			</div>

			<div className="overflow-x-auto pb-2">
				<div className="flex gap-4" style={{ minWidth: "max-content" }}>
					{loading
						? Array.from({ length: 8 }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards
									key={i}
									className="min-w-[160px] max-w-[180px] w-[160px] rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse"
								>
									<div className="aspect-square bg-gray-100" />
									<div className="p-3 flex flex-col gap-2">
										<div className="h-3 bg-gray-100 rounded w-1/2" />
										<div className="h-4 bg-gray-100 rounded w-full" />
										<div className="h-6 bg-violet-50 rounded-full w-2/3 mt-1" />
									</div>
								</div>
							))
						: products.map((product) => (
								<div key={product.slug} className="min-w-[160px] max-w-[180px] w-[160px] flex-shrink-0">
									<ProductCard product={product} />
								</div>
							))}
				</div>
			</div>
		</div>
	);
}

export default function Home({
	categories,
	carousels,
	brands,
	allCategories,
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
					<CategoryCarousel data={allCategories} />
				</div>

				{/* Content middle */}
				<Ads ads={ads} positions={["content_middle"]} />

				<div className="container mx-auto px-4">
					<CategoryCampaginCarousel data={categories} middleSlot={<BrandCarousel data={brands} />} />
					<InfoBox />
					<LatestPost posts={posts} />
				</div>

				{/* En Düşük Fiyatlar */}
				<div className="mt-8 mb-2">
					<LowestPricesSection />
				</div>

				{/* Fiyatı Düşen Ürünler */}
				<div className="mt-8 mb-2">
					<PriceDropsSection />
				</div>

				{/* Yeni Ürünler */}
				<div className="mt-8 mb-2">
					<NewProductsSection />
				</div>

				{/* Bugün Bitiyor — quick link */}
				<div className="container mx-auto px-4 mt-6 mb-2">
					<Link
						href="/bugun-bitiyor"
						className="flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl px-5 py-4 hover:opacity-95 transition-opacity shadow-sm"
					>
						<div className="flex items-center gap-3">
							<span className="text-2xl">⏰</span>
							<div>
								<p className="font-bold text-base">Bugün Bitiyor!</p>
								<p className="text-sm text-red-100">Son günlerinde olan kampanyaları kaçırma</p>
							</div>
						</div>
						<ChevronRight className="h-5 w-5 text-white/80" />
					</Link>
				</div>

				{/* Kampanyalar linki */}
				<div className="container mx-auto px-4 mt-8 mb-2">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<div className="w-1 h-5 bg-orange-500 rounded-full" />
							<h2 className="text-base font-semibold text-gray-900">🏷️ Kampanyalar</h2>
						</div>
						<Link href="/kampanyalar" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
							Tümünü Gör &rarr;
						</Link>
					</div>
					<div className="flex flex-wrap gap-2">
						{[
							{ href: '/kampanyalar', label: 'Tüm Kampanyalar', cls: 'bg-orange-500 text-white' },
							{ href: '/kampanyalar?item_type=product', label: 'Ürün Kampanyaları', cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
							{ href: '/kampanyalar?item_type=actual', label: 'Aktüel Kataloglar', cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
							{ href: '/kampanyalar?item_type=car', label: 'Araç Kampanyaları', cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
							{ href: '/kampanyalar?item_type=real-estate', label: 'Emlak', cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity ${item.cls}`}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				{/* Mağazalar */}
				<div className="container mx-auto px-4 mt-8 mb-2">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-1 h-5 bg-gray-400 rounded-full" />
						<h2 className="text-base font-semibold text-gray-900">Mağazalar</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						{[
							{ key: 'migros', label: 'Migros', bg: 'bg-red-600' },
							{ key: 'sok', label: 'Şok', bg: 'bg-orange-500' },
							{ key: 'a101', label: 'A101', bg: 'bg-red-800' },
							{ key: 'carrefour', label: 'Carrefour', bg: 'bg-blue-600' },
						].map((store) => (
							<Link
								key={store.key}
								href={`/magaza/${store.key}`}
								className={`inline-flex items-center px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm ${store.bg}`}
							>
								{store.label}
							</Link>
						))}
					</div>
				</div>

				{/* Footer */}
				<Ads ads={ads} positions={["footer"]} />
			</section>
		</Layout>
	);
}
