import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductGrid from '@/components/common/marketplace/ProductGrid';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

const STORES = {
  migros:    { name: 'Migros',    color: 'from-red-600 to-red-700',      badge: 'bg-red-600 text-white' },
  sok:       { name: 'Şok',       color: 'from-orange-500 to-orange-600', badge: 'bg-orange-500 text-white' },
  a101:      { name: 'A101',      color: 'from-red-800 to-red-900',       badge: 'bg-red-800 text-white' },
  carrefour: { name: 'Carrefour', color: 'from-blue-600 to-blue-700',     badge: 'bg-blue-600 text-white' },
};

export async function getServerSideProps({ params, query }) {
  const storeKey = params.store?.toLowerCase();
  const storeInfo = STORES[storeKey];

  if (!storeInfo) {
    return { notFound: true };
  }

  try {
    const page = Number(query.page) || 1;
    const sort = query.sort || 'newest';
    const params2 = new URLSearchParams({ store: storeKey, per_page: '24', page: String(page), sort });
    const data = await serverApiRequest(`/marketplace/products?${params2.toString()}`, 'get');

    return {
      props: {
        storeKey,
        storeInfo,
        initialProducts: data.data || [],
        initialTotal: data.meta?.total || data.total || 0,
        initialLastPage: data.meta?.last_page || data.last_page || 1,
        initialSort: sort,
        initialPage: page,
      },
    };
  } catch {
    return {
      props: {
        storeKey,
        storeInfo,
        initialProducts: [],
        initialTotal: 0,
        initialLastPage: 1,
        initialSort: 'newest',
        initialPage: 1,
      },
    };
  }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Önce Ucuz' },
  { value: 'price_desc', label: 'Önce Pahalı' },
];

function PaginationBar({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
        className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white')}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages[0] > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)} className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-sm bg-white text-gray-600 hover:bg-gray-100">1</button>
          {pages[0] > 2 && <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">…</span>}
        </>
      )}
      {pages.map((page) => (
        <button key={page} type="button" onClick={() => onPageChange(page)}
          className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
            page === currentPage ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white')}>
          {page}
        </button>
      ))}
      {pages[pages.length - 1] < lastPage && (
        <>
          {pages[pages.length - 1] < lastPage - 1 && <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">…</span>}
          <button type="button" onClick={() => onPageChange(lastPage)} className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-sm bg-white text-gray-600 hover:bg-gray-100">{lastPage}</button>
        </>
      )}
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= lastPage}
        className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage >= lastPage ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-gray-200 text-gray-600 hover:bg-gray-100 bg-white')}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function MagazaSayfasi({ storeKey, storeInfo, initialProducts, initialTotal, initialLastPage, initialSort, initialPage }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchProducts = useCallback(async (newSort, newPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ store: storeKey, per_page: '24', page: String(newPage), sort: newSort });
      const data = await apiRequest(`/marketplace/products?${params.toString()}`, 'get');
      setProducts(data.data || []);
      setTotal(data.meta?.total || data.total || 0);
      setLastPage(data.meta?.last_page || data.last_page || 1);
    } catch {
      // sessiz geç
    } finally {
      setLoading(false);
    }
  }, [storeKey]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    router.push({ pathname: `/magaza/${storeKey}`, query: { sort: newSort } }, undefined, { shallow: true });
    fetchProducts(newSort, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push({ pathname: `/magaza/${storeKey}`, query: { sort, page: String(newPage) } }, undefined, { shallow: true });
    fetchProducts(sort, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Head>
        <title>{storeInfo.name} Ürünleri - KampanyaRadar</title>
        <meta name="description" content={`${storeInfo.name}'daki tüm ürün fiyatlarını keşfedin ve karşılaştırın.`} />
      </Head>

      {/* Hero */}
      <div className={`bg-gradient-to-r ${storeInfo.color} text-white`}>
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/fiyat-karsilastir" className="hover:text-white transition-colors">Fiyat Karşılaştır</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-medium">{storeInfo.name}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{storeInfo.name} Ürünleri</h1>
          {total > 0 && (
            <p className="text-white/80 text-sm">
              {total.toLocaleString('tr-TR')} ürün
            </p>
          )}
        </div>
      </div>

      <div className="container px-4 md:px-6 py-6">
        {/* Sort bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-gray-500 mr-1">Sırala:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSortChange(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                sort === opt.value
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <ProductGrid products={products} loading={loading} />

        {!loading && (
          <PaginationBar currentPage={page} lastPage={lastPage} onPageChange={handlePageChange} />
        )}
      </div>

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
