import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PercentCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

const MIN_DISCOUNT_OPTIONS = [
  { value: '', label: 'Tüm İndirimler' },
  { value: '10', label: '%10+' },
  { value: '20', label: '%20+' },
  { value: '30', label: '%30+' },
  { value: '50', label: '%50+' },
];

export async function getServerSideProps({ query }) {
  const page = parseInt(query.page || '1', 10);
  const minDiscount = query.min_discount || '';

  const params = new URLSearchParams({
    sort: 'discount',
    has_discount: 'true',
    per_page: '48',
    page: String(page),
  });
  if (minDiscount) params.set('min_discount', minDiscount);

  try {
    const data = await serverApiRequest(`/marketplace/products?${params.toString()}`, 'get');
    return {
      props: {
        products: data.data || [],
        meta: data.meta || { total: 0, last_page: 1, current_page: 1 },
        initialFilters: { page, minDiscount },
      },
    };
  } catch {
    return {
      props: {
        products: [],
        meta: { total: 0, last_page: 1, current_page: 1 },
        initialFilters: { page: 1, minDiscount: '' },
      },
    };
  }
}

function PaginationBar({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;
  const pages = [];
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
        className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors', currentPage <= 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
      ><ChevronLeft className="h-4 w-4" /></button>
      {pages.map((p) => (
        <button key={p} type="button" onClick={() => onPageChange(p)}
          className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors', p === currentPage ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
        >{p}</button>
      ))}
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= lastPage}
        className={cn('flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors', currentPage >= lastPage ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
      ><ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}

export default function IndirimTakipPage({ products: initialProducts, meta: initialMeta, initialFilters }) {
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (newFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort: 'discount',
        has_discount: 'true',
        per_page: '48',
        page: String(newFilters.page),
      });
      if (newFilters.minDiscount) params.set('min_discount', newFilters.minDiscount);
      const data = await apiRequest(`/marketplace/products?${params.toString()}`, 'get');
      setProducts(data.data || []);
      setMeta(data.meta || { total: 0, last_page: 1, current_page: 1 });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMinDiscount = (value) => {
    const newFilters = { ...filters, minDiscount: value, page: 1 };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchProducts(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Head>
        <title>İndirim Takip - KampanyaRadar</title>
        <meta name="description" content="En yüksek indirimli ürünler. Fiyatı düşen ürünleri büyük indirim yüzdesine göre sırala." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <PercentCircle className="h-7 w-7" />
            <h1 className="text-2xl md:text-3xl font-bold">İndirim Takip</h1>
          </div>
          <p className="text-orange-100 text-sm md:text-base max-w-lg">
            En yüksek indirim yüzdesiyle sıralı ürünler. Kaçırılmayacak fırsatlar.
          </p>
          <nav className="flex items-center gap-1.5 text-sm text-orange-200 mt-4">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-orange-300" />
            <Link href="/fiyat-dusus" className="hover:text-white transition-colors">Fiyat Düşüşleri</Link>
            <ChevronRight className="h-3.5 w-3.5 text-orange-300" />
            <span className="text-white font-medium">İndirim Takip</span>
          </nav>
        </div>
      </div>

      <div className="container py-6 px-4 md:px-6">
        {/* Min discount chips */}
        <div className="flex gap-2 flex-wrap mb-5">
          {MIN_DISCOUNT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleMinDiscount(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                filters.minDiscount === opt.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Result count */}
        {meta.total > 0 && (
          <p className="text-xs text-gray-500 mb-5">
            <span className="font-semibold text-gray-700">{meta.total.toLocaleString('tr-TR')}</span> indirimli ürün
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PercentCircle className="h-14 w-14 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Ürün bulunamadı</h2>
            <button type="button" onClick={() => handleMinDiscount('')} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors mt-4">
              Tüm İndirimleri Gör
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <PaginationBar currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </Layout>
  );
}
