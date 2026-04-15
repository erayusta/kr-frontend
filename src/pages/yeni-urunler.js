import Head from 'next/head';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import serverApiRequest from '@/lib/serverApiRequest';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/marketplace/products?sort=newest&per_page=48', 'get');
    return { props: { products: data.data || [] } };
  } catch {
    return { props: { products: [] } };
  }
}

export default function YeniUrunler({ products }) {
  return (
    <Layout>
      <Head>
        <title>Yeni Ürünler - KampanyaRadar</title>
        <meta name="description" content="En son eklenen ürünleri keşfedin ve fiyatları karşılaştırın." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-b from-violet-50 to-white border-b border-violet-100/60">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-violet-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Yeni Ürünler</h1>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Kataloğumuza en son eklenen ürünler
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/fiyat-karsilastir"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2"
            >
              Tüm ürünleri görüntüle →
            </Link>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Henüz ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
