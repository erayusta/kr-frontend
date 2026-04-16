import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Search, ChevronRight, Package, Tag, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import ProductCard from '@/components/common/marketplace/ProductCard';
import { getCdnImageUrl, formatPrice } from '@/utils/storeUtils';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'products', label: 'Ürünler' },
  { id: 'campaigns', label: 'Kampanyalar' },
];

export default function AramaPage() {
  const router = useRouter();
  const inputRef = useRef(null);

  const [query, setQuery] = useState(router.query.q || '');
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceTimer = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync query from URL on mount / navigation
  useEffect(() => {
    if (router.query.q) {
      setQuery(router.query.q);
    }
  }, [router.query.q]);

  const performSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setProducts([]);
      setCampaigns([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const [productRes, campaignRes] = await Promise.allSettled([
        apiRequest(`/marketplace/products?q=${encodeURIComponent(q)}&per_page=24`, 'get'),
        apiRequest(`/campaigns?search=${encodeURIComponent(q)}&limit=12`, 'get'),
      ]);

      setProducts(productRes.status === 'fulfilled' ? (productRes.value?.data || []) : []);
      setCampaigns(campaignRes.status === 'fulfilled' ? (campaignRes.value?.data || []) : []);
    } catch {
      setProducts([]);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search on query change
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(query.trim());
        // Update URL without full navigation
        router.replace({ pathname: '/arama', query: { q: query.trim() } }, undefined, { shallow: true });
      }, 350);
    } else {
      setProducts([]);
      setCampaigns([]);
      setSearched(false);
    }
    return () => clearTimeout(debounceTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Also run search immediately if URL has q param on first load
  useEffect(() => {
    if (router.query.q && router.query.q.length >= 2) {
      performSearch(router.query.q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query.trim());
  };

  const productCount = products.length;
  const campaignCount = campaigns.length;
  const totalCount = productCount + campaignCount;

  const showProducts = activeTab === 'all' || activeTab === 'products';
  const showCampaigns = activeTab === 'all' || activeTab === 'campaigns';

  return (
    <Layout>
      <Head>
        <title>{query ? `"${query}" arama sonuçları - KampanyaRadar` : 'Arama - KampanyaRadar'}</title>
        <meta name="description" content="KampanyaRadar'da ürün ve kampanya arayın." />
      </Head>

      {/* Search bar hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container px-4 md:px-6 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-orange-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-orange-300" />
            <span className="text-white font-medium">Arama</span>
          </nav>

          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300 pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün, kampanya, marka ara..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-orange-200 focus:outline-none focus:bg-white/20 focus:border-white/40 text-base"
              autoComplete="off"
              spellCheck={false}
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-200 animate-spin" />
            )}
          </form>
        </div>
      </div>

      <div className="container py-6 px-4 md:px-6">
        {/* Tabs + result count */}
        {searched && !loading && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex gap-1">
              {TABS.map((tab) => {
                const count = tab.id === 'products' ? productCount : tab.id === 'campaigns' ? campaignCount : totalCount;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    {tab.label}
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500',
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">&quot;{query}&quot;</span> için {totalCount} sonuç
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && totalCount === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              &quot;{query}&quot; için ürün veya kampanya bulunamadı. Farklı bir kelime deneyin.
            </p>
            <div className="flex gap-3">
              <Link href="/fiyat-karsilastir" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
                Tüm Ürünler
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Ana Sayfa
              </Link>
            </div>
          </div>
        )}

        {/* Idle state — no search yet */}
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-14 w-14 text-gray-200 mb-4" strokeWidth={1} />
            <p className="text-sm text-gray-400">Aramak istediğiniz ürün veya kampanyayı yazın.</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && totalCount > 0 && (
          <div className="space-y-10">
            {/* Products section */}
            {showProducts && productCount > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Ürünler <span className="text-sm font-normal text-gray-400">({productCount})</span>
                    </h2>
                  </div>
                  {productCount >= 24 && (
                    <Link
                      href={`/fiyat-karsilastir?q=${encodeURIComponent(query)}`}
                      className="text-xs text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                    >
                      Tümünü gör <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Campaigns section */}
            {showCampaigns && campaignCount > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-orange-500" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Kampanyalar <span className="text-sm font-normal text-gray-400">({campaignCount})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {campaigns.map((campaign) => {
                    const rawImg = campaign.image || campaign.thumbnail || null;
                    const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
                    return (
                      <Link
                        key={campaign.slug}
                        href={`/kampanya/${campaign.slug}`}
                        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="aspect-video bg-gray-50 overflow-hidden">
                          {imgUrl ? (
                            // biome-ignore lint/performance/noImgElement: Campaign card uses arbitrary remote URLs
                            <img
                              src={imgUrl}
                              alt={campaign.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Tag className="h-8 w-8 text-gray-200" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          {campaign.brands?.[0]?.name && (
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                              {campaign.brands[0].name}
                            </span>
                          )}
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mt-0.5 group-hover:text-orange-500 transition-colors">
                            {campaign.title}
                          </h3>
                          {campaign.latest_price && (
                            <p className="text-xs text-gray-500 mt-1">₺{formatPrice(campaign.latest_price)}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
