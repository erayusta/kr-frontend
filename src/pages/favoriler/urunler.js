import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import apiRequest from '@/lib/apiRequest';
import { getFavoritesState, subscribeFavoritesChanged } from '@/lib/favorites';

export default function FavoriteProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slugs, setSlugs] = useState([]);

  // Read slugs from localStorage
  useEffect(() => {
    const sync = () => {
      const state = getFavoritesState();
      setSlugs(state.product || []);
    };
    sync();
    return subscribeFavoritesChanged(sync);
  }, []);

  // Fetch product details for each slug
  useEffect(() => {
    if (slugs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled(
      slugs.map((slug) =>
        apiRequest(`/marketplace/products/${slug}`, 'get').then((res) => res.data || res)
      )
    ).then((results) => {
      const found = results
        .filter((r) => r.status === 'fulfilled' && r.value)
        .map((r) => r.value);
      setProducts(found);
      setLoading(false);
    });
  }, [slugs]);

  return (
    <Layout>
      <Head>
        <title>Favori Ürünler - KampanyaRadar</title>
        <meta name="description" content="Kaydettiğiniz ürünleri buradan takip edin." />
      </Head>

      <div className="container py-8 px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
          <h1 className="text-xl font-bold text-gray-900">Favori Ürünler</h1>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Henüz favori ürün yok</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Ürün kartlarındaki kalp ikonuna tıklayarak ürünleri favorilerinize ekleyebilirsiniz.
            </p>
            <Link
              href="/fiyat-karsilastir"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
