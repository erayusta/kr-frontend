import Head from 'next/head';
import Link from 'next/link';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import serverApiRequest from '@/lib/serverApiRequest';

export async function getServerSideProps() {
  try {
    // Fetch products sorted by most stores (proxy for popularity), stocked, per_page=48
    const data = await serverApiRequest(
      '/marketplace/products?sort=newest&in_stock=true&per_page=48',
      'get',
    );
    return { props: { products: data.data || [] } };
  } catch {
    return { props: { products: [] } };
  }
}

export default function PopulerUrunlerPage({ products }) {
  return (
    <Layout>
      <Head>
        <title>Popüler Ürünler - KampanyaRadar</title>
        <meta name="description" content="Migros, Şok, A101 ve Carrefour'da en çok satılan ve stokta bulunan ürünler." />
        <meta property="og:title" content="Popüler Ürünler - KampanyaRadar" />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="container px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-7 w-7" />
            <h1 className="text-2xl md:text-3xl font-bold">Popüler Ürünler</h1>
          </div>
          <p className="text-blue-100 text-sm md:text-base max-w-lg">
            Birden fazla mağazada stokta bulunan ve en çok aranan ürünler.
          </p>
          <nav className="flex items-center gap-1.5 text-sm text-blue-200 mt-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
            <span className="text-white font-medium">Popüler Ürünler</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 px-4 md:px-6">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-200" strokeWidth={1.5} />
            <p className="text-sm">Şu anda popüler ürün bulunamadı.</p>
            <Link
              href="/fiyat-karsilastir"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-orange-500 hover:text-orange-600"
            >
              Tüm ürünlere bak <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{products.length}</span> ürün
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/fiyat-karsilastir?in_stock=true"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Tüm Ürünleri Gör <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
