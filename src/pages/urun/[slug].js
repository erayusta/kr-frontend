import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Tag, Share2, Heart, Scale, Bell, BellOff } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductImageGallery from '@/components/common/campaign/product/ProductImageGallery';
import MultiStorePriceChart from '@/components/common/marketplace/MultiStorePriceChart';
import ProductPriceTable from '@/components/common/marketplace/ProductPriceTable';
import ProductCard from '@/components/common/marketplace/ProductCard';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { formatPrice, getCdnImageUrl, getStoreName } from '@/utils/storeUtils';
import { isFavorited, toggleFavorited, subscribeFavoritesChanged } from '@/lib/favorites';
import { useCompare } from '@/context/compareContext';
import { getPriceAlert, setPriceAlert, removePriceAlert, subscribePriceAlertsChanged } from '@/lib/priceAlerts';
import { cn } from '@/lib/utils';

export async function getServerSideProps({ params }) {
  try {
    const data = await serverApiRequest(`/marketplace/products/${params.slug}`, 'get');
    const product = data.data || data;
    return {
      props: { product },
    };
  } catch (error) {
    console.error('[Urun SSR] ERROR:', error.message);
    if (error.response?.status === 404) {
      return { notFound: true };
    }
    return { notFound: true };
  }
}

/**
 * Extract first meaningful word (>= 3 chars) from a string.
 * Falls back to null if none found.
 */
function extractSearchQuery(title, brandName) {
  if (title) {
    const words = title.split(/\s+/);
    const word = words.find((w) => w.length >= 3);
    if (word) return word;
  }
  return brandName || null;
}

export default function UrunDetay({ product }) {
  // Normalise images to full CDN URLs so ProductImageGallery gets absolute URLs
  const galleryImages = (product.images || []).map((img) => getCdnImageUrl(img)).filter(Boolean);

  const priceHistory = product.price_history || [];

  const storeCount = (product.stores || []).length;

  // Favorite state
  const [fav, setFav] = useState(false);
  useEffect(() => {
    const sync = () => setFav(isFavorited('product', product.slug));
    sync();
    return subscribeFavoritesChanged(sync);
  }, [product.slug]);
  const handleFavToggle = useCallback(() => {
    setFav(toggleFavorited('product', product.slug));
  }, [product.slug]);

  // Compare state
  const { toggleCompare, isInCompare, canAdd } = useCompare();
  const inCompare = isInCompare(product.slug);

  // Price alert state
  const [alert, setAlert] = useState(null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertInput, setAlertInput] = useState('');
  useEffect(() => {
    const sync = () => setAlert(getPriceAlert(product.slug));
    sync();
    return subscribePriceAlertsChanged(sync);
  }, [product.slug]);
  const handleSaveAlert = () => {
    const target = parseFloat(alertInput);
    if (!target || target <= 0) return;
    setPriceAlert(product.slug, {
      slug: product.slug,
      title: product.title,
      image: galleryImages[0] || null,
      currentPrice: product.latest_price,
      targetPrice: target,
    });
    setShowAlertForm(false);
    setAlertInput('');
  };

  // Share button state
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {
        // Kullanıcı iptal etti
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API kullanılamıyor
      }
    }
  };

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const q = extractSearchQuery(product.title, product.brand?.name);
    if (!q) return;

    let cancelled = false;
    apiRequest(`/marketplace/products?q=${encodeURIComponent(q)}&per_page=8`, 'get')
      .then((data) => {
        if (cancelled) return;
        const results = (data.data || []).filter((p) => p.slug !== product.slug);
        setRelatedProducts(results);
      })
      .catch(() => {
        // Hata durumunda sessizce geç
      });

    return () => {
      cancelled = true;
    };
  }, [product.slug, product.title, product.brand?.name]);

  const ogImage = galleryImages[0] || null;
  const ogDescription = product.description
    ? product.description.slice(0, 160)
    : `${product.title} fiyat karşılaştırması`;

  return (
    <Layout>
      <Head>
        <title>{product.title} - KampanyaRadar</title>
        <meta
          name="description"
          content={
            product.description
              ? product.description.slice(0, 160)
              : `${product.title} fiyat karşılaştırması - KampanyaRadar`
          }
        />
        <meta property="og:title" content={`${product.title} - KampanyaRadar`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="product" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={`https://kampanyaradar.com/urun/${product.slug}`} />

        {/* BreadcrumbList structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://kampanyaradar.com" },
                { "@type": "ListItem", "position": 2, "name": "Fiyat Karşılaştır", "item": "https://kampanyaradar.com/fiyat-karsilastir" },
                { "@type": "ListItem", "position": 3, "name": product.title, "item": `https://kampanyaradar.com/urun/${product.slug}` },
              ],
            }),
          }}
        />

        {/* Product structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.title,
              "description": product.description || product.title,
              "image": galleryImages[0] || undefined,
              "brand": product.brand ? { "@type": "Brand", "name": product.brand.name } : undefined,
              "offers": (product.stores || []).filter((s) => s.price).map((s) => ({
                "@type": "Offer",
                "price": s.sale_price || s.price,
                "priceCurrency": "TRY",
                "availability": s.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": s.link || undefined,
                "seller": { "@type": "Organization", "name": s.name },
              })),
            }),
          }}
        />
      </Head>

      <div className="container py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            KampanyaRadar
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
          <Link href="/fiyat-karsilastir" className="hover:text-orange-500 transition-colors">
            Fiyat Karşılaştır
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* Main content — two column on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Left: Image gallery */}
          <div>
            <ProductImageGallery
              images={galleryImages}
              colors={[]}
              title={product.title}
            />
          </div>

          {/* Right: Info + price table */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              {/* Brand */}
              {product.brand?.name && (
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                  {product.brand.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* En Düşük Fiyat badge */}
              {product.latest_price != null && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-bold px-3 py-1.5 rounded-lg">
                    <Tag className="h-3.5 w-3.5" />
                    En Düşük Fiyat: ₺{formatPrice(product.latest_price)}
                  </span>
                  {product.stock_summary?.cheapest_store && (
                    <span className="text-xs text-gray-500">
                      {getStoreName(product.stock_summary.cheapest_store.store)}&apos;da
                    </span>
                  )}
                  {product.prev_price != null && product.prev_price !== product.latest_price && (() => {
                    const pct = ((product.latest_price - product.prev_price) / product.prev_price) * 100;
                    const isDown = pct < 0;
                    return (
                      <span className={cn(
                        'text-xs font-bold px-2 py-1 rounded-lg',
                        isDown ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-500',
                      )}>
                        {isDown ? '▼' : '▲'} {Math.abs(pct).toFixed(1)}% {isDown ? 'düşüş' : 'artış'}
                      </span>
                    );
                  })()}
                </div>
              )}

              {/* Share + Favorite + Compare buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleFavToggle}
                  className={cn(
                    'inline-flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg transition-colors',
                    fav
                      ? 'text-rose-500 border-rose-300 bg-rose-50 hover:bg-rose-100'
                      : 'text-gray-500 border-gray-200 bg-white hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50',
                  )}
                >
                  <Heart className="h-3.5 w-3.5" fill={fav ? 'currentColor' : 'none'} />
                  {fav ? 'Favorilerde' : 'Favori'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product)}
                  disabled={!inCompare && !canAdd}
                  className={cn(
                    'inline-flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg transition-colors',
                    inCompare
                      ? 'text-orange-600 border-orange-300 bg-orange-50 hover:bg-orange-100'
                      : 'text-gray-500 border-gray-200 bg-white hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50',
                    !inCompare && !canAdd && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <Scale className="h-3.5 w-3.5" />
                  {inCompare ? 'Karşılaştırmada' : 'Karşılaştır'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {copied ? 'Kopyalandı!' : 'Paylaş'}
                </button>
              </div>

              {/* Price alert */}
              {alert ? (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                  <Bell className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 flex-1">
                    Hedef fiyat: <strong>₺{formatPrice(alert.targetPrice)}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => removePriceAlert(product.slug)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Alarmı kaldır"
                  >
                    <BellOff className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : showAlertForm ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={alertInput}
                    onChange={(e) => setAlertInput(e.target.value)}
                    placeholder={`Hedef fiyat (şu an ₺${product.latest_price ? formatPrice(product.latest_price) : '?'})`}
                    className="flex-1 h-9 text-sm border border-gray-200 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveAlert}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAlertForm(false); setAlertInput(''); }}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-sm rounded-lg transition-colors hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAlertForm(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors self-start"
                >
                  <Bell className="h-3.5 w-3.5" />
                  Fiyat Takip
                </button>
              )}

              {/* Description */}
              {product.description && product.description !== product.title && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price table section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Mağaza Fiyatları
                </h2>
              </div>

              {/* Store count subtitle */}
              {storeCount > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  Bu ürün{' '}
                  <span className="font-semibold text-gray-700">{storeCount}</span>{' '}
                  mağazada satılıyor
                </p>
              )}

              <ProductPriceTable stores={product.stores || []} />
            </div>
          </div>
        </div>

        {/* Categories + Attributes row */}
        {((product.categories?.length > 0) || (product.attributes && Object.keys(product.attributes).length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Categories */}
            {product.categories?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-orange-500 rounded-full" />
                  <h2 className="text-sm font-semibold text-gray-900">Kategoriler</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/fiyat-karsilastir?category_slug=${cat.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 hover:bg-orange-100 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-orange-500 rounded-full" />
                  <h2 className="text-sm font-semibold text-gray-900">Ürün Özellikleri</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 first:pt-0 last:pb-0">
                      <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-medium text-gray-900 text-right max-w-[60%]">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full-width price history chart — per-store lines */}
        {priceHistory.length > 0 && (
          <div className="mb-8">
            <MultiStorePriceChart priceHistory={priceHistory} />
          </div>
        )}

        {/* Related products — Benzer Ürünler */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900">Benzer Ürünler</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {relatedProducts.map((p) => (
                <div key={p.slug} className="snap-start flex-shrink-0 w-44 sm:w-52">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-4">
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
