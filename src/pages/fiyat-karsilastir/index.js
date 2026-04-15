import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, X, ArrowUp } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductGrid from '@/components/common/marketplace/ProductGrid';
import ProductFilters from '@/components/common/marketplace/ProductFilters';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

export async function getServerSideProps({ query }) {
  try {
    const params = new URLSearchParams();
    params.set('per_page', '24');
    params.set('page', String(Number(query.page) || 1));
    if (query.q) params.set('q', query.q);
    if (query.store) params.set('store', query.store);
    if (query.sort) params.set('sort', query.sort);
    if (query.in_stock === 'true') params.set('in_stock', 'true');
    if (query.min_price) params.set('min_price', query.min_price);
    if (query.max_price) params.set('max_price', query.max_price);
    if (query.category_slug) params.set('category_slug', query.category_slug);
    if (query.brand_slug) params.set('brand_slug', query.brand_slug);
    if (query.has_discount === 'true') params.set('has_discount', 'true');

    const [data, categoriesData, brandsData] = await Promise.all([
      serverApiRequest(`/marketplace/products?${params.toString()}`, 'get'),
      serverApiRequest('/marketplace/categories', 'get').catch(() => null),
      serverApiRequest('/marketplace/brands', 'get').catch(() => null),
    ]);

    // Marketplace categories returns { data: [...] }
    const popularCategories = (categoriesData?.data || []).slice(0, 10);
    const popularBrands = (brandsData?.data || []).slice(0, 12);

    const initialFilters = {
      q: query.q || '',
      store: query.store || '',
      sort: query.sort || 'newest',
      in_stock: query.in_stock === 'true',
      min_price: query.min_price || '',
      max_price: query.max_price || '',
      category_slug: query.category_slug || '',
      brand_slug: query.brand_slug || '',
      has_discount: query.has_discount === 'true',
      page: Number(query.page) || 1,
    };

    return {
      props: {
        initialProducts: data.data || [],
        initialTotal: data.meta?.total || data.total || 0,
        initialLastPage: data.meta?.last_page || data.last_page || 1,
        initialFilters,
        popularCategories,
        popularBrands,
      },
    };
  } catch (error) {
    console.error('[Marketplace SSR] ERROR:', error.message);
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialLastPage: 1,
        popularCategories: [],
        popularBrands: [],
        initialFilters: {
          q: '',
          store: '',
          sort: 'newest',
          in_stock: false,
          min_price: '',
          max_price: '',
          category_slug: '',
          brand_slug: '',
          has_discount: false,
          page: 1,
        },
      },
    };
  }
}

const STORE_BADGES = [
  { key: 'migros', label: 'Migros', bg: 'bg-red-500' },
  { key: 'sok', label: 'Şok', bg: 'bg-orange-400' },
  { key: 'a101', label: 'A101', bg: 'bg-red-700' },
  { key: 'carrefour', label: 'Carrefour', bg: 'bg-blue-600' },
];

function PaginationBar({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  // Build page number window: show up to 5 pages centered on current page
  const buildPages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + 4);
    // Adjust start if near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage <= 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300',
        )}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* First page + ellipsis */}
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
            <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">
              …
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
              : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300',
          )}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {pages[pages.length - 1] < lastPage && (
        <>
          {pages[pages.length - 1] < lastPage - 1 && (
            <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">
              …
            </span>
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

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage >= lastPage
            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white hover:border-gray-300',
        )}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function FiyatKarsilastir({ initialProducts, initialTotal, initialLastPage, initialFilters, popularCategories = [], popularBrands = [] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync filter state when navigating back/forward via browser history
  useEffect(() => {
    const handleRouteChange = () => {
      const q = router.query;
      setFilters({
        q: q.q || '',
        store: q.store || '',
        sort: q.sort || 'newest',
        in_stock: q.in_stock === 'true',
        min_price: q.min_price || '',
        max_price: q.max_price || '',
        category_slug: q.category_slug || '',
        brand_slug: q.brand_slug || '',
        has_discount: q.has_discount === 'true',
        page: Number(q.page) || 1,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events, router.query]);

  const pushToUrl = useCallback((newFilters) => {
    const cleanQuery = {};
    if (newFilters.q) cleanQuery.q = newFilters.q;
    if (newFilters.store) cleanQuery.store = newFilters.store;
    if (newFilters.sort && newFilters.sort !== 'newest') cleanQuery.sort = newFilters.sort;
    if (newFilters.in_stock) cleanQuery.in_stock = 'true';
    if (newFilters.min_price) cleanQuery.min_price = newFilters.min_price;
    if (newFilters.max_price) cleanQuery.max_price = newFilters.max_price;
    if (newFilters.category_slug) cleanQuery.category_slug = newFilters.category_slug;
    if (newFilters.brand_slug) cleanQuery.brand_slug = newFilters.brand_slug;
    if (newFilters.has_discount) cleanQuery.has_discount = 'true';
    if (newFilters.page && newFilters.page > 1) cleanQuery.page = String(newFilters.page);

    router.push(
      { pathname: '/fiyat-karsilastir', query: cleanQuery },
      undefined,
      { shallow: true },
    );
  }, [router]);

  const fetchProducts = useCallback(async (newFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('per_page', '24');
      params.set('page', String(newFilters.page || 1));
      if (newFilters.q) params.set('q', newFilters.q);
      if (newFilters.store) params.set('store', newFilters.store);
      if (newFilters.sort) params.set('sort', newFilters.sort);
      if (newFilters.in_stock) params.set('in_stock', 'true');
      if (newFilters.min_price) params.set('min_price', newFilters.min_price);
      if (newFilters.max_price) params.set('max_price', newFilters.max_price);
      if (newFilters.category_slug) params.set('category_slug', newFilters.category_slug);
      if (newFilters.brand_slug) params.set('brand_slug', newFilters.brand_slug);
      if (newFilters.has_discount) params.set('has_discount', 'true');

      const data = await apiRequest(`/marketplace/products?${params.toString()}`, 'get');
      setProducts(data.data || []);
      setTotal(data.meta?.total || data.total || 0);
      setLastPage(data.meta?.last_page || data.last_page || 1);
    } catch (error) {
      console.error('[Marketplace] Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    pushToUrl(newFilters);
    fetchProducts(newFilters);
  }, [fetchProducts, pushToUrl]);

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    pushToUrl(updated);
    fetchProducts(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Head>
        <title>Fiyat Karşılaştır - KampanyaRadar</title>
        <meta
          name="description"
          content="Migros, Şok, A101 ve Carrefour'daki ürün fiyatlarını karşılaştırın. En ucuz fiyatı bulun."
        />
        <meta property="og:title" content="Fiyat Karşılaştır - KampanyaRadar" />
        <meta property="og:description" content="Migros, Şok, A101 ve Carrefour'daki ürün fiyatlarını karşılaştırın." />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero section */}
      <div className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100/60">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Fiyat Karşılaştır
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-6 max-w-lg">
            Migros, Şok, A101 ve Carrefour'daki fiyatları gerçek zamanlı karşılaştırın
          </p>

          {/* Store badges */}
          <div className="flex flex-wrap gap-2">
            {STORE_BADGES.map((store) => (
              <Link
                key={store.key}
                href={`/magaza/${store.key}`}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity',
                  store.bg,
                )}
              >
                {store.label}
              </Link>
            ))}
          </div>
          {total > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              {total.toLocaleString('tr-TR')} ürün karşılaştırılıyor
            </p>
          )}

          {/* Popular category chips */}
          {popularCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {popularCategories.map((cat) => {
                const isActive = filters.category_slug === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleFilterChange({ ...filters, category_slug: isActive ? '' : cat.slug, page: 1 })}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                      isActive
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white/80 text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600',
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular brand chips */}
          {popularBrands.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {popularBrands.map((brand) => {
                const isActive = filters.brand_slug === brand.slug;
                return (
                  <button
                    key={brand.slug}
                    type="button"
                    onClick={() => handleFilterChange({ ...filters, brand_slug: isActive ? '' : brand.slug, page: 1 })}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                      isActive
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white/80 text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900',
                    )}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container py-6 px-4 md:px-6">
        {/* Active context filters (category / brand) */}
        {(filters.category_slug || filters.brand_slug) && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {filters.category_slug && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
                Kategori: {popularCategories.find((c) => c.slug === filters.category_slug)?.name || filters.category_slug}
                <button
                  type="button"
                  onClick={() => handleFilterChange({ ...filters, category_slug: '', page: 1 })}
                  className="text-orange-400 hover:text-orange-600 ml-0.5"
                  aria-label="Kategori filtresini kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.brand_slug && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
                Marka: {popularBrands.find((b) => b.slug === filters.brand_slug)?.name || filters.brand_slug}
                <button
                  type="button"
                  onClick={() => handleFilterChange({ ...filters, brand_slug: '', page: 1 })}
                  className="text-orange-400 hover:text-orange-600 ml-0.5"
                  aria-label="Marka filtresini kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={total}
        />

        {/* Product grid */}
        <ProductGrid products={products} loading={loading} />

        {/* Pagination */}
        {!loading && (
          <PaginationBar
            currentPage={filters.page}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-300 shadow-md rounded-full transition-all"
          aria-label="Yukarı çık"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </Layout>
  );
}
