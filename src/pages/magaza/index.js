import Head from 'next/head';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';

const STORES = [
  {
    key: 'migros',
    name: 'Migros',
    description: 'Türkiye\'nin en büyük süpermarket zincirlerinden biri.',
    gradient: 'from-red-500 to-red-700',
    badge: 'bg-red-600',
  },
  {
    key: 'sok',
    name: 'Şok Market',
    description: 'Uygun fiyatıyla günlük ihtiyaçlarınız için.',
    gradient: 'from-orange-400 to-orange-600',
    badge: 'bg-orange-500',
  },
  {
    key: 'a101',
    name: 'A101',
    description: 'Her bütçeye uygun, her köşede bir mağaza.',
    gradient: 'from-red-700 to-red-900',
    badge: 'bg-red-800',
  },
  {
    key: 'carrefour',
    name: 'CarrefourSA',
    description: 'Geniş ürün yelpazesiyle büyük alışveriş deneyimi.',
    gradient: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-600',
  },
];

export default function MagazaIndex() {
  return (
    <Layout>
      <Head>
        <title>Mağazalar - KampanyaRadar</title>
        <meta name="description" content="Migros, Şok, A101 ve Carrefour mağazalarındaki ürünleri karşılaştırın." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mağazalar</h1>
          </div>
          <p className="text-sm text-gray-500">
            Mağazayı seçin ve ürün fiyatlarını karşılaştırın
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORES.map((store) => (
            <Link
              key={store.key}
              href={`/magaza/${store.key}`}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${store.gradient} text-white p-6 hover:shadow-xl transition-all hover:scale-[1.02] group`}
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                  Mağaza
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                {store.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                Ürünleri Gör
                <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
