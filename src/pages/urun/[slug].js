import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductImageGallery from '@/components/common/campaign/product/ProductImageGallery';
import PriceHistoryChart from '@/components/common/campaign/product/PriceHistoryChart';
import ProductPriceTable from '@/components/common/marketplace/ProductPriceTable';
import serverApiRequest from '@/lib/serverApiRequest';
import { formatPrice, getCdnImageUrl } from '@/utils/storeUtils';

export async function getServerSideProps({ params }) {
  try {
    const data = await serverApiRequest(`/marketplace/products/${params.slug}`, 'get');
    return {
      props: { product: data },
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
  const priceHistory = product.price_history || [];

  const formatPriceFn = (value) => {
    if (value == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href="/fiyat-karsilastir" className="hover:text-orange-500 transition-colors">
            Fiyat Karşılaştır
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* Main content — two column on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
            {/* Brand */}
            {product.brand?.name && (
              <span className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
                {product.brand.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price table */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                <h2 className="text-base font-semibold text-gray-900">
                  Mağaza Fiyatları
                </h2>
              </div>
              <ProductPriceTable stores={product.stores || []} />
            </div>
          </div>
        </div>

        {/* Full-width price history chart */}
        {priceHistory.length > 0 && (
          <PriceHistoryChart
            apiPrices={priceHistory}
            formatPrice={formatPriceFn}
          />
        )}

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/fiyat-karsilastir"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Geri Dön
          </Link>
        </div>
      </div>
    </Layout>
  );
}
