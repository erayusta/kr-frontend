import { useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORE_OPTIONS = [
  { value: '', label: 'Tüm Mağazalar' },
  { value: 'migros', label: 'Migros' },
  { value: 'sok', label: 'Şok' },
  { value: 'a101', label: 'A101' },
  { value: 'carrefour', label: 'Carrefour' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Artan Fiyat' },
  { value: 'price_desc', label: 'Azalan Fiyat' },
];

export default function ProductFilters({ filters = {}, onFilterChange, totalCount }) {
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ ...filters, q: value, page: 1 });
    }, 400);
  };

  const handleStoreChange = (e) => {
    onFilterChange({ ...filters, store: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value, page: 1 });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none"
          />
          <input
            ref={searchRef}
            type="text"
            defaultValue={filters.q || ''}
            onChange={handleSearchChange}
            placeholder="Ürün ara..."
            className={cn(
              'w-full pl-9 pr-4 py-2 text-sm rounded-md border border-gray-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
              'placeholder:text-gray-400',
            )}
          />
        </div>

        {/* Store filter */}
        <select
          value={filters.store || ''}
          onChange={handleStoreChange}
          className={cn(
            'py-2 pl-3 pr-8 text-sm rounded-md border border-gray-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
            'text-gray-700',
          )}
        >
          {STORE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort select */}
        <select
          value={filters.sort || 'newest'}
          onChange={handleSortChange}
          className={cn(
            'py-2 pl-3 pr-8 text-sm rounded-md border border-gray-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent',
            'text-gray-700',
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      {totalCount != null && (
        <p className="mt-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{totalCount}</span> ürün bulundu
        </p>
      )}
    </div>
  );
}
