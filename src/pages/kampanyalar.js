import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Tag, ChevronRight, ChevronLeft, SlidersHorizontal, Search, X } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import CampaignCard from '@/components/common/CampaignCard';
import serverApiRequest from '@/lib/serverApiRequest';
import apiRequest from '@/lib/apiRequest';
import { cn } from '@/lib/utils';

const ITEM_TYPES = [
  { value: '', label: 'Tümü' },
  { value: 'general', label: 'Genel' },
  { value: 'product', label: 'Ürün' },
  { value: 'actual', label: 'Aktüel' },
  { value: 'car', label: 'Araç' },
  { value: 'real-estate', label: 'Emlak' },
  { value: 'coupon', label: 'Kupon' },
  { value: 'credit', label: 'Kredi' },
  { value: 'gallery', label: 'Galeri' },
];

export async function getServerSideProps({ query }) {
  const page = parseInt(query.page || '1', 10);
  const category = query.category || '';
  const brand = query.brand || '';
  const search = query.search || '';
  const itemType = query.item_type || '';

  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set('category', category);
  if (brand) params.set('brand', brand);
  if (search) params.set('search', search);
  if (itemType) params.set('item_type', itemType);

  try {
    const [campaignData, categoryData] = await Promise.all([
      serverApiRequest(`/campaigns?${params.toString()}`, 'get'),
      serverApiRequest('/marketplace/categories', 'get').catch(() => ({ data: [] })),
    ]);

    return {
      props: {
        campaigns: campaignData.data || [],
        pagination: campaignData.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 },
        categories: categoryData.data || [],
        filters: { page, category, brand, search, itemType },
      },
    };
  } catch {
    return {
      props: {
        campaigns: [],
        pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
        categories: [],
        filters: { page: 1, category: '', brand: '', search: '', itemType: '' },
      },
    };
  }
}

function PaginationBar({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const buildPages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage <= 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50',
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {buildPages().map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
            p === currentPage ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-colors',
          currentPage >= totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50',
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function KampanyalarPage({ campaigns: initialCampaigns, pagination: initialPagination, categories, filters: initialFilters }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [pagination, setPagination] = useState(initialPagination);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  const pushFiltersToUrl = useCallback((newFilters) => {
    const query = {};
    if (newFilters.page > 1) query.page = String(newFilters.page);
    if (newFilters.category) query.category = newFilters.category;
    if (newFilters.brand) query.brand = newFilters.brand;
    if (newFilters.search) query.search = newFilters.search;
    if (newFilters.itemType) query.item_type = newFilters.itemType;
    router.push({ pathname: '/kampanyalar', query }, undefined, { shallow: true });
  }, [router]);

  const fetchCampaigns = useCallback(async (newFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(newFilters.page) });
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.brand) params.set('brand', newFilters.brand);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.itemType) params.set('item_type', newFilters.itemType);

      const data = await apiRequest(`/campaigns?${params.toString()}`, 'get');
      setCampaigns(data.data || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // React to router query changes (back/forward nav)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const q = router.query;
    const newFilters = {
      page: parseInt(q.page || '1', 10),
      category: q.category || '',
      brand: q.brand || '',
      search: q.search || '',
      itemType: q.item_type || '',
    };
    setFilters(newFilters);
    setSearchInput(newFilters.search);
    fetchCampaigns(newFilters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    pushFiltersToUrl(newFilters);
    fetchCampaigns(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    pushFiltersToUrl(newFilters);
    fetchCampaigns(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debounce search input
  const handleSearchChange = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter('search', value.trim());
    }, 400);
  };

  const clearFilters = () => {
    const reset = { page: 1, category: '', brand: '', search: '', itemType: '' };
    setFilters(reset);
    setSearchInput('');
    pushFiltersToUrl(reset);
    fetchCampaigns(reset);
  };

  const hasActiveFilters = filters.category || filters.brand || filters.search || filters.itemType;

  return (
    <Layout>
      <Head>
        <title>Tüm Kampanyalar - KampanyaRadar</title>
        <meta name="description" content="KampanyaRadar'da tüm kampanyaları keşfedin. Ürün, aktüel, araç, emlak ve daha fazlası." />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="h-7 w-7" />
            <h1 className="text-2xl md:text-3xl font-bold">Tüm Kampanyalar</h1>
          </div>
          <p className="text-orange-100 text-sm max-w-lg mb-4">
            Ürün fırsatları, aktüel kataloglar, araç kampanyaları ve daha fazlası.
          </p>
          <nav className="flex items-center gap-1.5 text-sm text-orange-200">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-orange-300" />
            <span className="text-white font-medium">Kampanyalar</span>
          </nav>
        </div>
      </div>

      <div className="container py-6 px-4 md:px-6">
        {/* Filters row */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Kampanya ara..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>

          {/* Item type chips */}
          <div className="flex gap-2 flex-wrap items-center">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {ITEM_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateFilter('itemType', t.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  filters.itemType === t.value
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white',
                )}
              >
                {t.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="h-3 w-3" />
                Temizle
              </button>
            )}
          </div>

          {/* Category chips — first 10 */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => updateFilter('category', filters.category === cat.slug ? '' : cat.slug)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                    filters.category === cat.slug
                      ? 'bg-gray-800 border-gray-800 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white',
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 mb-5">
          <span className="font-semibold text-gray-700">{pagination.totalCount}</span> kampanya
          {filters.search && <> — <span className="text-orange-500">&quot;{filters.search}&quot;</span></>}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Tag className="h-14 w-14 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Kampanya bulunamadı</h2>
            <p className="text-sm text-gray-500 mb-6">Filtrelerinizi değiştirerek tekrar deneyin.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.slug || campaign.id}
                  id={campaign.id}
                  slug={campaign.slug}
                  title={campaign.title}
                  image={campaign.image}
                  brands={campaign.brands}
                  endDate={campaign.endDate}
                  end_date={campaign.endDate}
                />
              ))}
            </div>
            <PaginationBar
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
