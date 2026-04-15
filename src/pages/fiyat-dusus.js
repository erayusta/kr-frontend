import Head from 'next/head';
import Link from 'next/link';
import { TrendingDown, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import { getCdnImageUrl, formatPrice, getStoreName } from '@/utils/storeUtils';
import serverApiRequest from '@/lib/serverApiRequest';
import { cn } from '@/lib/utils';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/marketplace/products/price-drops', 'get');
    return { props: { products: data.data || [] } };
  } catch {
    return { props: { products: [] } };
  }
}

export default function FiyatDusus({ products }) {
  return (
    <Layout>
      <Head>
        <title>Fiyatı Düşen Ürünler - KampanyaRadar</title>
        <meta name="description" content="Son güncellemede fiyatı düşen ürünler. En büyük indirimler burada." />
        <meta property="og:title" content="Fiyatı Düşen Ürünler - KampanyaRadar" />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="container px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown className="h-7 w-7" />
            <h1 className="text-2xl md:text-3xl font-bold">Fiyatı Düşen Ürünler</h1>
          </div>
          <p className="text-green-100 text-sm md:text-base max-w-lg">
            Son senkronizasyonda fiyatı düşen ürünler — en büyük indirimden küçüğe sıralı.
          </p>
          <nav className="flex items-center gap-1.5 text-sm text-green-200 mt-4">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-green-300" />
            <span className="text-white font-medium">Fiyatı Düşen Ürünler</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 px-4 md:px-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <TrendingDown className="h-14 w-14 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Henüz fiyat düşüşü yok</h2>
            <p className="text-sm text-gray-400">Senkronizasyon sonrası burada fiyat düşen ürünler görünecek.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{products.length}</span> üründe fiyat düşüşü tespit edildi
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const rawImg = product.image || product.images?.[0] || null;
                const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
                return (
                  <Link
                    key={product.slug}
                    href={`/urun/${product.slug}`}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex gap-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                      {imgUrl ? (
                        // biome-ignore lint/performance/noImgElement: <explanation>
                        <img src={imgUrl} alt={product.title} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TrendingDown className="h-8 w-8 text-gray-200" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {product.brand?.name && (
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                          {product.brand.name}
                        </span>
                      )}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mt-0.5">
                        {product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {product.prev_price != null && (
                          <span className="text-xs text-gray-400 line-through">
                            ₺{formatPrice(product.prev_price)}
                          </span>
                        )}
                        <span className="text-sm font-bold text-gray-900">
                          ₺{formatPrice(product.latest_price)}
                        </span>
                        {product.drop_pct > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                            <TrendingDown className="h-3 w-3" />
                            -{product.drop_pct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/fiyat-karsilastir?sort=price_asc"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Tüm Ürünleri Gör <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
