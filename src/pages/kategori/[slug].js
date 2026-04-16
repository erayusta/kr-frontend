import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import CategoryContent from "@/components/common/category/CategoryContent";
import CategoryHeader from "@/components/common/category/CategoryHeader";
import ProductGrid from "@/components/common/marketplace/ProductGrid";
import { Layout } from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";
import apiRequest from "@/lib/apiRequest";
import { cn } from "@/lib/utils";

const Ads = dynamic(
	() =>
		import("@/components/common/ads/Ad").then((mod) => ({ default: mod.Ads })),
	{ ssr: false },
);

export async function getServerSideProps(context) {
	context.res.setHeader(
		"Cache-Control",
		"public, s-maxage=60, stale-while-revalidate=300",
	);

	const slug = context.params.slug;
	console.log(`[Category SSR] START slug=${slug}`);

	try {
		const query = new URLSearchParams(context.query).toString();
		const url = `/categories/${slug}?${query}`;
		const data = await serverApiRequest(url, "get");
		console.log(`[Category SSR] API response received, has data: ${!!data?.data}`);

		return {
			props: {
				category: data.data || null,
				items: data?.campaigns || [],
				ads: data?.ads || [],
				url: url,
			},
		};
	} catch (error) {
		console.error(`[Category SSR] ERROR slug=${slug}:`, error.message);
		if (error.response) {
			console.error(`[Category SSR] Status: ${error.response.status}`);
		}
		if (error.code) {
			console.error(`[Category SSR] Error code: ${error.code}`);
		}
		return {
			notFound: true,
		};
	}
}

function CategoryPaginationBar({ currentPage, lastPage, onPageChange }) {
	if (lastPage <= 1) return null;

	const buildPages = () => {
		const pages = [];
		let start = Math.max(1, currentPage - 2);
		let end = Math.min(lastPage, start + 4);
		if (end - start < 4) start = Math.max(1, end - 4);
		for (let i = start; i <= end; i++) pages.push(i);
		return pages;
	};

	const pages = buildPages();

	return (
		<div className="flex items-center justify-center gap-1 mt-8">
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className={cn(
					"flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
					currentPage <= 1
						? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
						: "border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300",
				)}
				aria-label="Önceki sayfa"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			{pages[0] > 1 && (
				<>
					<button
						type="button"
						onClick={() => onPageChange(1)}
						className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 transition-colors"
					>
						1
					</button>
					{pages[0] > 2 && (
						<span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">…</span>
					)}
				</>
			)}

			{pages.map((page) => (
				<button
					key={page}
					type="button"
					onClick={() => onPageChange(page)}
					className={cn(
						"flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
						page === currentPage
							? "bg-orange-500 border-orange-500 text-white shadow-sm"
							: "border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300",
					)}
				>
					{page}
				</button>
			))}

			{pages[pages.length - 1] < lastPage && (
				<>
					{pages[pages.length - 1] < lastPage - 1 && (
						<span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">…</span>
					)}
					<button
						type="button"
						onClick={() => onPageChange(lastPage)}
						className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 transition-colors"
					>
						{lastPage}
					</button>
				</>
			)}

			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= lastPage}
				className={cn(
					"flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
					currentPage >= lastPage
						? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
						: "border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300",
				)}
				aria-label="Sonraki sayfa"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	);
}

function CategoryProductsSection({ categoryId, categoryName }) {
	const [activated, setActivated] = useState(false);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);

	const fetchProducts = useCallback(async (pageNum) => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiRequest(
				`/marketplace/products?category_id=${categoryId}&per_page=12&page=${pageNum}`,
				"get",
			);
			setProducts(data.data || []);
			setLastPage(data.meta?.last_page || data.last_page || 1);
		} catch (err) {
			console.error("[CategoryProducts] Fetch error:", err.message);
			setError("Ürünler yüklenirken bir hata oluştu.");
		} finally {
			setLoading(false);
		}
	}, [categoryId]);

	const handleActivate = () => {
		if (!activated) {
			setActivated(true);
			fetchProducts(1);
		}
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		fetchProducts(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<section className="mt-10">
			<div className="flex items-center justify-between gap-2 mb-6">
				<div className="flex items-center gap-2">
					<div className="w-1 h-6 bg-orange-500 rounded-full" />
					<h2 className="text-lg font-bold text-gray-900">Bu Kategoriye Ait Ürünler</h2>
				</div>
				{categoryName && (
					<Link
						href={`/fiyat-karsilastir?q=${encodeURIComponent(categoryName)}`}
						className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
					>
						Tümünü Gör &rarr;
					</Link>
				)}
			</div>

			{!activated ? (
				<button
					type="button"
					onClick={handleActivate}
					className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
				>
					<ShoppingBag className="h-4 w-4" />
					Ürünleri Göster
				</button>
			) : error ? (
				<p className="text-sm text-red-500">{error}</p>
			) : (
				<>
					<ProductGrid products={products} loading={loading} />
					{!loading && (
						<CategoryPaginationBar
							currentPage={page}
							lastPage={lastPage}
							onPageChange={handlePageChange}
						/>
					)}
				</>
			)}
		</section>
	);
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

			{/* Sidebar sol/sağ reklamlar */}
			<Ads ads={ads} positions={["category_left", "category_right"]} itemType="category" />

			<CategoryHeader category={category} />

			{/* Header banner */}
			<Ads ads={ads} positions={["category_header"]} itemType="category" />

			<section className="container pt-6">
				{/* Content middle */}
				<Ads ads={ads} positions={["content_middle"]} itemType="category" />

				<CategoryContent url={url} items={items} category={category} />

				<CategoryProductsSection categoryId={category.id} categoryName={category.name} />

				{/* Footer */}
				<Ads ads={ads} positions={["footer"]} itemType="category" className="mt-8" />
			</section>
		</Layout>
	);
}
