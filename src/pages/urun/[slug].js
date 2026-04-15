import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Tag, Share2 } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductImageGallery from '@/components/common/campaign/product/ProductImageGallery';
import PriceHistoryChart from '@/components/common/campaign/product/PriceHistoryChart';
import ProductPriceTable from '@/components/common/marketplace/ProductPriceTable';
import ProductCard from '@/components/common/marketplace/ProductCard';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { formatPrice, getCdnImageUrl } from '@/utils/storeUtils';

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

  // PriceHistoryChart expects: apiPrices = [{ date: 'YYYY-MM-DD', price: number }, ...]
  // price_history format: [{ date, migros, sok, a101, carrefour }] — flatten to {date, price} rows
  const priceHistory = (product.price_history || []).flatMap((entry) => {
    const storeKeys = ['migros', 'sok', 'a101', 'carrefour'];
    return storeKeys
      .filter((s) => entry[s] != null && entry[s] > 0)
      .map((s) => ({ date: entry.date, store: s, price: Number(entry[s]) }));
  });

  const formatPriceFn = (value) => {
    if (value == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const storeCount = (product.stores || []).length;

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
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-bold px-3 py-1.5 rounded-lg">
                    <Tag className="h-3.5 w-3.5" />
                    En Düşük Fiyat: ₺{formatPrice(product.latest_price)}
                  </span>
                </div>
              )}

              {/* Share button */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {copied ? 'Kopyalandı!' : 'Paylaş'}
                </button>
              </div>

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

        {/* Full-width price history chart */}
        {priceHistory.length > 0 && (
          <div className="mb-8">
            {/* Chart title card */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900">
                Son 90 Günlük Fiyat Trendi
              </h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <PriceHistoryChart
                apiPrices={priceHistory}
                formatPrice={formatPriceFn}
              />
            </div>
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
