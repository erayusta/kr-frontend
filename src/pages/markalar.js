import Head from 'next/head';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import serverApiRequest from '@/lib/serverApiRequest';
import { getCdnImageUrl } from '@/utils/storeUtils';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/marketplace/brands', 'get');
    return { props: { brands: data.data || [] } };
  } catch {
    return { props: { brands: [] } };
  }
}

export default function Markalar({ brands }) {
  return (
    <Layout>
      <Head>
        <title>Markalar - KampanyaRadar</title>
        <meta name="description" content="Marketplace'teki tüm markaları keşfedin ve fiyatları karşılaştırın." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Markalar</h1>
          </div>
          <p className="text-sm text-gray-500">
            {brands.length > 0 ? `${brands.length} marka, ürün fiyatlarıyla birlikte` : 'Markalar yükleniyor…'}
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {brands.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Henüz marka bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {brands.map((brand) => {
              const logoUrl = brand.logo ? getCdnImageUrl(brand.logo) : null;
              return (
                <Link
                  key={brand.slug}
                  href={`/fiyat-karsilastir?brand_slug=${brand.slug}`}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
                >
                  {logoUrl ? (
                    // biome-ignore lint/performance/noImgElement: brand logo
                    <img
                      src={logoUrl}
                      alt={brand.name}
                      className="h-10 w-auto object-contain mb-2 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                      <span className="text-orange-400 font-bold text-sm">{brand.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-800 text-center group-hover:text-orange-600 transition-colors line-clamp-1">
                    {brand.name}
                  </span>
                  <span className="mt-0.5 text-[10px] text-gray-400">
                    {brand.product_count?.toLocaleString('tr-TR')} ürün
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
