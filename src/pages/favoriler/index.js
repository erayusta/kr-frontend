import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heart, ShoppingBag, Tag } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import apiRequest from '@/lib/apiRequest';
import { getFavoritesState, subscribeFavoritesChanged } from '@/lib/favorites';
import { cn } from '@/lib/utils';

function ProductTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slugs, setSlugs] = useState([]);

  useEffect(() => {
    const sync = () => setSlugs(getFavoritesState().product || []);
    sync();
    return subscribeFavoritesChanged(sync);
  }, []);

  useEffect(() => {
    if (slugs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled(
      slugs.map((slug) =>
        apiRequest(`/marketplace/products/${slug}`, 'get').then((res) => res.data || res)
      )
    ).then((results) => {
      setProducts(results.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value));
      setLoading(false);
    });
  }, [slugs]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Favori ürün bulunamadı</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Ürün kartlarındaki kalp ikonuna tıklayarak ürünleri favorilerinize ekleyin.
        </p>
        <Link href="/fiyat-karsilastir" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

function CampaignTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slugs, setSlugs] = useState([]);

  useEffect(() => {
    const sync = () => setSlugs(getFavoritesState().campaign || []);
    sync();
    return subscribeFavoritesChanged(sync);
  }, []);

  useEffect(() => {
    if (slugs.length === 0) {
      setCampaigns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled(
      slugs.map((slug) =>
        apiRequest(`/campaigns/${slug}`, 'get').then((res) => res.data || res)
      )
    ).then((results) => {
      setCampaigns(results.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value));
      setLoading(false);
    });
  }, [slugs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-100" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Tag className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Favori kampanya bulunamadı</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Kampanya sayfalarındaki kalp ikonuna tıklayarak kampanyaları kaydedin.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
          Kampanyaları Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.slug}
          href={`/kampanya/${campaign.slug}`}
          className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
          {campaign.image && (
            // biome-ignore lint/performance/noImgElement: campaign thumbnail
            <img src={campaign.image} alt={campaign.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">{campaign.title}</h3>
            {campaign.brands?.[0] && (
              <span className="text-xs text-orange-500 font-medium">{campaign.brands[0].name}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

const TABS = [
  { id: 'products', label: 'Ürünler', icon: ShoppingBag },
  { id: 'campaigns', label: 'Kampanyalar', icon: Tag },
];

export default function Favoriler() {
  const [activeTab, setActiveTab] = useState('products');
  const [counts, setCounts] = useState({ products: 0, campaigns: 0 });

  useEffect(() => {
    const sync = () => {
      const state = getFavoritesState();
      setCounts({ products: (state.product || []).length, campaigns: (state.campaign || []).length });
    };
    sync();
    return subscribeFavoritesChanged(sync);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Favorilerim - KampanyaRadar</title>
        <meta name="description" content="Favori ürünlerinizi ve kampanyalarınızı buradan takip edin." />
      </Head>

      <div className="container py-8 px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
          <h1 className="text-xl font-bold text-gray-900">Favorilerim</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-100">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'products' ? counts.products : counts.campaigns;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'ml-0.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold',
                    isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500',
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'products' ? <ProductTab /> : <CampaignTab />}
      </div>
    </Layout>
  );
}
