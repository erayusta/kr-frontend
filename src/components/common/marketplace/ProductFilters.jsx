import { useRef } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const STORE_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'migros', label: 'Migros' },
  { value: 'sok', label: 'Şok' },
  { value: 'a101', label: 'A101' },
  { value: 'carrefour', label: 'Carrefour' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Yeniden Eskiye' },
  { value: 'price_asc', label: 'En Düşük Fiyat' },
  { value: 'price_desc', label: 'En Yüksek Fiyat' },
];

export default function ProductFilters({ filters = {}, onFilterChange, totalCount }) {
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ ...filters, q: value, page: 1 });
    }, 400);
  };

  const handleStoreChange = (value) => {
    onFilterChange({ ...filters, store: value, page: 1 });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sort: value, page: 1 });
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm mb-6 py-3 px-0">
      {/* Main filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          <Input
            type="text"
            defaultValue={filters.q || ''}
            onChange={handleSearchChange}
            placeholder="Ürün ara..."
            className="pl-9 h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg"
          />
        </div>

        {/* Store pill filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STORE_OPTIONS.map((opt) => {
            const isActive = (filters.store || '') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStoreChange(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="ml-auto flex-shrink-0">
          <Select
            value={filters.sort || 'newest'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-9 text-sm w-44 border-gray-200 focus:ring-orange-400 rounded-lg">
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result count */}
      {totalCount != null && (
        <p className="mt-2.5 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">
            {new Intl.NumberFormat('tr-TR').format(totalCount)}
          </span>{' '}
          ürün
        </p>
      )}
    </div>
  );
}
