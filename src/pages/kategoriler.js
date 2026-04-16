import Head from 'next/head';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import serverApiRequest from '@/lib/serverApiRequest';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/marketplace/categories', 'get');
    return { props: { categories: data.data || [] } };
  } catch {
    return { props: { categories: [] } };
  }
}

export default function Kategoriler({ categories }) {
  return (
    <Layout>
      <Head>
        <title>Kategoriler - KampanyaRadar</title>
        <meta name="description" content="Marketplace'teki tüm kategorileri keşfedin ve ürün fiyatlarını karşılaştırın." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-50 to-white border-b border-orange-100/60">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kategoriler</h1>
          </div>
          <p className="text-sm text-gray-500">
            {categories.length > 0 ? `${categories.length} kategori` : 'Kategoriler yükleniyor…'}
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Henüz kategori bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/fiyat-karsilastir?category_slug=${cat.slug}`}
                className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {cat.name}
                </span>
                <span className="mt-1.5 text-[11px] text-gray-400">
                  {cat.product_count?.toLocaleString('tr-TR')} ürün
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
