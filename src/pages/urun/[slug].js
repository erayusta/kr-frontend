import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Tag } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductImageGallery from '@/components/common/campaign/product/ProductImageGallery';
import PriceHistoryChart from '@/components/common/campaign/product/PriceHistoryChart';
import ProductPriceTable from '@/components/common/marketplace/ProductPriceTable';
import serverApiRequest from '@/lib/serverApiRequest';
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

              {/* Description */}
              {product.description && (
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
