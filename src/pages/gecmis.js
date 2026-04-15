import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import { getCdnImageUrl, formatPrice } from '@/utils/storeUtils';
import { getRecentlyViewed, clearRecentlyViewed, subscribeRecentlyViewedChanged } from '@/lib/recentlyViewed';

export default function GecmisPage() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setItems(getRecentlyViewed());
    sync();
    return subscribeRecentlyViewedChanged(sync);
  }, []);

  const handleClear = () => {
    clearRecentlyViewed();
  };

  return (
    <Layout>
      <Head>
        <title>Son Baktıklarım - KampanyaRadar</title>
        <meta name="description" content="Son incelediğiniz ürünler." />
      </Head>

      <div className="container py-8 px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-orange-500 transition-colors">KampanyaRadar</Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="text-gray-900 font-medium">Son Baktıklarım</span>
            </nav>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Son Baktıklarım
            </h1>
          </div>
          {mounted && items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Temizle
            </button>
          )}
        </div>

        {/* Content */}
        {!mounted || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Clock className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Henüz ürün bakmadınız</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Ürün detay sayfalarını ziyaret ettiğinizde burada görünecek.
            </p>
            <Link
              href="/fiyat-karsilastir"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{items.length}</span> ürün
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((product) => {
                const rawImg = product.image || null;
                const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
                const viewedDate = product.viewedAt
                  ? new Date(product.viewedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
                  : null;

                return (
                  <Link
                    key={product.slug}
                    href={`/urun/${product.slug}`}
                    className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      {imgUrl ? (
                        // biome-ignore lint/performance/noImgElement: Recently viewed uses arbitrary remote URLs
                        <img
                          src={imgUrl}
                          alt={product.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Clock className="h-8 w-8 text-gray-200" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      {product.brand?.name && (
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider truncate">
                          {product.brand.name}
                        </p>
                      )}
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug mt-0.5 flex-1">
                        {product.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        {product.latest_price != null ? (
                          <p className="text-sm font-bold text-orange-600">
                            ₺{formatPrice(product.latest_price)}
                          </p>
                        ) : (
                          <span />
                        )}
                        {viewedDate && (
                          <p className="text-[10px] text-gray-400">{viewedDate}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
