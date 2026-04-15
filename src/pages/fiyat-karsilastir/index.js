import { useState, useCallback } from 'react';
import Head from 'next/head';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductGrid from '@/components/common/marketplace/ProductGrid';
import ProductFilters from '@/components/common/marketplace/ProductFilters';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/marketplace/products?per_page=24&page=1', 'get');
    return {
      props: {
        initialProducts: data.data || [],
        initialTotal: data.meta?.total || data.total || 0,
        initialLastPage: data.meta?.last_page || data.last_page || 1,
      },
    };
  } catch (error) {
    console.error('[Marketplace SSR] ERROR:', error.message);
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialLastPage: 1,
      },
    };
  }
}

export default function FiyatKarsilastir({ initialProducts, initialTotal, initialLastPage }) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', store: '', sort: 'newest', page: 1 });

  const fetchProducts = useCallback(async (newFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('per_page', '24');
      params.set('page', String(newFilters.page || 1));
      if (newFilters.q) params.set('q', newFilters.q);
      if (newFilters.store) params.set('store', newFilters.store);
      if (newFilters.sort) params.set('sort', newFilters.sort);

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
    fetchProducts(newFilters);
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
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
      </Head>

      <div className="container py-6 px-4 md:px-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fiyat Karşılaştır</h1>
          <p className="text-sm text-gray-500 mt-1">
            Marketlerdeki ürün fiyatlarını karşılaştırın
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={total}
        />

        {/* Product grid */}
        <ProductGrid products={products} loading={loading} />

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium border transition-colors',
                filters.page <= 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </button>

            <span className="text-sm text-gray-600">
              Sayfa{' '}
              <span className="font-semibold text-gray-900">{filters.page}</span>
              {' '}/{' '}
              <span className="font-semibold text-gray-900">{lastPage}</span>
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= lastPage}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium border transition-colors',
                filters.page >= lastPage
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white',
              )}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
