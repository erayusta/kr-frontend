import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import serverApiRequest from '@/lib/serverApiRequest';
import { formatPrice, getCdnImageUrl, getStoreName, STORE_CONFIG } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

export async function getServerSideProps({ query }) {
  const slugsParam = query.slugs || '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (slugs.length < 2) {
    return { redirect: { destination: '/fiyat-karsilastir', permanent: false } };
  }

  try {
    const products = await Promise.all(
      slugs.map((slug) =>
        serverApiRequest(`/marketplace/products/${slug}`, 'get')
          .then((d) => d.data || d)
          .catch(() => null),
      ),
    );

    const validProducts = products.filter(Boolean);
    if (validProducts.length < 2) {
      return { redirect: { destination: '/fiyat-karsilastir', permanent: false } };
    }

    return { props: { products: validProducts } };
  } catch {
    return { redirect: { destination: '/fiyat-karsilastir', permanent: false } };
  }
}

const STORES_ORDER = ['migros', 'sok', 'a101', 'carrefour'];

const STORE_COLORS = {
  migros: 'text-red-600',
  sok: 'text-orange-500',
  a101: 'text-red-800',
  carrefour: 'text-blue-700',
};

function getPriceForStore(product, storeName) {
  const stores = product.stores || [];
  const store = stores.find((s) => s.name?.toLowerCase() === storeName.toLowerCase());
  if (!store) return null;
  return { price: store.sale_price || store.price || null, inStock: store.in_stock ?? false, link: store.link || null };
}

function RowLabel({ children }) {
  return (
    <td className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-100 whitespace-nowrap w-32">
      {children}
    </td>
  );
}

export default function KarsilastirPage({ products }) {
  const colCount = products.length;

  return (
    <Layout>
      <Head>
        <title>Ürün Karşılaştırma - KampanyaRadar</title>
        <meta name="description" content="Ürünleri yan yana karşılaştırın, en iyi fiyatı bulun." />
      </Head>

      <div className="container py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-orange-500 transition-colors">KampanyaRadar</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <Link href="/fiyat-karsilastir" className="hover:text-orange-500 transition-colors">Fiyat Karşılaştır</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <span className="text-gray-900 font-medium">Ürün Karşılaştırma</span>
        </nav>

        <h1 className="text-xl font-bold text-gray-900 mb-6">Ürün Karşılaştırma</h1>

        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full border-collapse">
            {/* Product headers */}
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 bg-gray-50 border-r border-gray-100 w-32" />
                {products.map((product) => {
                  const rawImg = product.image || product.images?.[0] || null;
                  const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
                  return (
                    <th key={product.slug} className="py-4 px-4 text-left align-top">
                      <div className="flex flex-col gap-2">
                        <div className="w-20 h-20 mx-auto bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                          {imgUrl ? (
                            // biome-ignore lint/performance/noImgElement: <explanation>
                            <img src={imgUrl} alt={product.title} className="w-full h-full object-contain p-1" />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-gray-200" strokeWidth={1.5} />
                          )}
                        </div>
                        {product.brand?.name && (
                          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider text-center">
                            {product.brand.name}
                          </span>
                        )}
                        <Link
                          href={`/urun/${product.slug}`}
                          className="text-sm font-semibold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 text-center"
                        >
                          {product.title}
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {/* Latest price row */}
              <tr>
                <RowLabel>En Düşük</RowLabel>
                {products.map((product) => {
                  const prices = (product.stores || [])
                    .map((s) => s.sale_price || s.price)
                    .filter((p) => p != null && p > 0)
                    .map(Number);
                  const minPrice = prices.length ? Math.min(...prices) : null;
                  const isLowest = products.every((p) => {
                    const ps = (p.stores || []).map((s) => s.sale_price || s.price).filter((x) => x != null && x > 0).map(Number);
                    return ps.length === 0 || Math.min(...ps) >= (minPrice ?? Infinity);
                  });
                  return (
                    <td key={product.slug} className="py-3 px-4 text-center">
                      {minPrice != null ? (
                        <span className={cn(
                          'inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg',
                          isLowest ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-900',
                        )}>
                          ₺{formatPrice(minPrice)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Per-store price rows */}
              {STORES_ORDER.map((storeName) => {
                const storeData = products.map((p) => getPriceForStore(p, storeName));
                const hasAny = storeData.some((d) => d !== null);
                if (!hasAny) return null;

                const prices = storeData.map((d) => d?.price ? Number(d.price) : null);
                const validPrices = prices.filter((p) => p != null && p > 0);
                const minPr = validPrices.length ? Math.min(...validPrices) : null;

                return (
                  <tr key={storeName}>
                    <RowLabel>{getStoreName(storeName)}</RowLabel>
                    {products.map((product, i) => {
                      const d = storeData[i];
                      if (!d || d.price == null) {
                        return (
                          <td key={product.slug} className="py-3 px-4 text-center">
                            <span className="text-gray-300 text-xs">Yok</span>
                          </td>
                        );
                      }
                      const isBest = minPr != null && Number(d.price) === minPr;
                      return (
                        <td key={product.slug} className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                              'text-sm font-semibold',
                              isBest ? 'text-green-600' : STORE_COLORS[storeName] || 'text-gray-700',
                            )}>
                              ₺{formatPrice(d.price)}
                            </span>
                            {!d.inStock && <span className="text-[10px] text-red-400">Stok yok</span>}
                            {d.link && (
                              <a
                                href={d.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-orange-500 transition-colors"
                              >
                                Git <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Brand row */}
              {products.some((p) => p.brand?.name) && (
                <tr>
                  <RowLabel>Marka</RowLabel>
                  {products.map((product) => (
                    <td key={product.slug} className="py-3 px-4 text-center text-sm text-gray-700">
                      {product.brand?.name || <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              )}

              {/* Categories row */}
              {products.some((p) => p.categories?.length > 0) && (
                <tr>
                  <RowLabel>Kategori</RowLabel>
                  {products.map((product) => (
                    <td key={product.slug} className="py-3 px-4 text-center">
                      {product.categories?.length > 0
                        ? product.categories.map((c) => c.name).join(', ')
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                  ))}
                </tr>
              )}

              {/* Store count row */}
              <tr>
                <RowLabel>Mağaza</RowLabel>
                {products.map((product) => {
                  const count = (product.stores || []).length;
                  return (
                    <td key={product.slug} className="py-3 px-4 text-center text-sm text-gray-700">
                      {count} mağaza
                    </td>
                  );
                })}
              </tr>

              {/* Attributes rows — show attributes that appear in at least one product */}
              {(() => {
                const allKeys = new Set();
                for (const p of products) {
                  if (p.attributes && typeof p.attributes === 'object') {
                    for (const k of Object.keys(p.attributes)) {
                      allKeys.add(k);
                    }
                  }
                }
                return Array.from(allKeys).map((key) => (
                  <tr key={key}>
                    <RowLabel>{key.replace(/_/g, ' ')}</RowLabel>
                    {products.map((product) => {
                      const val = product.attributes?.[key];
                      return (
                        <td key={product.slug} className="py-3 px-4 text-center text-xs text-gray-700">
                          {val != null
                            ? (Array.isArray(val) ? val.join(', ') : String(val))
                            : <span className="text-gray-300">—</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ));
              })()}

              {/* CTA row */}
              <tr className="bg-gray-50/50">
                <td className="py-4 px-4 bg-gray-50 border-r border-gray-100" />
                {products.map((product) => (
                  <td key={product.slug} className="py-4 px-4 text-center">
                    <Link
                      href={`/urun/${product.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Detay
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link
            href="/fiyat-karsilastir"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Tüm ürünlere dön
          </Link>
        </div>
      </div>
    </Layout>
  );
}
