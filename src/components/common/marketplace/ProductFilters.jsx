import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
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
  { value: 'discount', label: 'En Yüksek İndirim' },
];

const DISCOUNT_OPTIONS = [
  { value: '', label: 'İndirimli' },
  { value: '10', label: '%10+' },
  { value: '20', label: '%20+' },
  { value: '30', label: '%30+' },
  { value: '50', label: '%50+' },
];

export default function ProductFilters({ filters = {}, onFilterChange, totalCount }) {
  const debounceRef = useRef(null);
  const priceDebounceRef = useRef(null);

  // Local controlled state for price inputs so typing feels instant
  const [minPrice, setMinPrice] = useState(filters.min_price || '');
  const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

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

  const handleInStockToggle = () => {
    onFilterChange({ ...filters, in_stock: !filters.in_stock, page: 1 });
  };

  const handleDiscountToggle = () => {
    const turningOff = filters.has_discount;
    onFilterChange({ ...filters, has_discount: !turningOff, min_discount: turningOff ? '' : filters.min_discount, page: 1 });
  };

  const handleMinDiscountChange = (value) => {
    onFilterChange({ ...filters, has_discount: true, min_discount: value, page: 1 });
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      onFilterChange({ ...filters, min_price: value, page: 1 });
    }, 600);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      onFilterChange({ ...filters, max_price: value, page: 1 });
    }, 600);
  };

  const clearPriceRange = () => {
    setMinPrice('');
    setMaxPrice('');
    clearTimeout(priceDebounceRef.current);
    onFilterChange({ ...filters, min_price: '', max_price: '', page: 1 });
  };

  const hasPriceFilter = minPrice !== '' || maxPrice !== '';

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm mb-6 py-3 px-0">
      {/* ── Mobile layout (< md): stacked ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {/* Search — full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          <Input
            type="text"
            defaultValue={filters.q || ''}
            onChange={handleSearchChange}
            placeholder="Ürün ara..."
            className="pl-9 h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg w-full"
          />
        </div>

        {/* Store pills — horizontal scroll, no wrap */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {STORE_OPTIONS.map((opt) => {
            const isActive = (filters.store || '') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStoreChange(opt.value)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500',
                )}
              >
                {opt.label}
              </button>
            );
          })}

          {/* In stock toggle — inline with store pills on mobile */}
          <button
            type="button"
            onClick={handleInStockToggle}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5',
              filters.in_stock
                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600',
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', filters.in_stock ? 'bg-white' : 'bg-gray-400')} />
            Stokta
          </button>

          {/* Discount toggle + min % chips */}
          <button
            type="button"
            onClick={handleDiscountToggle}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5',
              filters.has_discount
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-600',
            )}
          >
            📉 İndirimli
          </button>
          {filters.has_discount && DISCOUNT_OPTIONS.filter((o) => o.value).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleMinDiscountChange(opt.value === filters.min_discount ? '' : opt.value)}
              className={cn(
                'flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                filters.min_discount === opt.value
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Price range inputs */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min ₺"
            min="0"
            className="h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg flex-1"
          />
          <span className="text-gray-400 text-xs flex-shrink-0">—</span>
          <Input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max ₺"
            min="0"
            className="h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg flex-1"
          />
          {hasPriceFilter && (
            <button
              type="button"
              onClick={clearPriceRange}
              className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
              aria-label="Fiyat filtresini temizle"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort — full width */}
        <div className="w-full">
          <Select
            value={filters.sort || 'newest'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-9 text-sm w-full border-gray-200 focus:ring-orange-400 rounded-lg">
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

      {/* ── Desktop layout (≥ md): single row ── */}
      <div className="hidden md:flex gap-3 items-center">
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
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {STORE_OPTIONS.map((opt) => {
            const isActive = (filters.store || '') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStoreChange(opt.value)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
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

        {/* Price range inputs — between store pills and sort */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min ₺"
            min="0"
            className="h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg w-24"
          />
          <span className="text-gray-400 text-xs">—</span>
          <Input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max ₺"
            min="0"
            className="h-9 text-sm border-gray-200 focus-visible:ring-orange-400 rounded-lg w-24"
          />
          {hasPriceFilter && (
            <button
              type="button"
              onClick={clearPriceRange}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
              aria-label="Fiyat filtresini temizle"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* In stock toggle */}
        <button
          type="button"
          onClick={handleInStockToggle}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 flex-shrink-0',
            filters.in_stock
              ? 'bg-green-500 text-white border-green-500 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600',
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', filters.in_stock ? 'bg-white' : 'bg-gray-400')} />
          Stokta
        </button>

        {/* Discount toggle + min % chips */}
        <button
          type="button"
          onClick={handleDiscountToggle}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 flex-shrink-0',
            filters.has_discount
              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-600',
          )}
        >
          📉 İndirimli
        </button>
        {filters.has_discount && DISCOUNT_OPTIONS.filter((o) => o.value).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleMinDiscountChange(opt.value === filters.min_discount ? '' : opt.value)}
            className={cn(
              'px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex-shrink-0',
              filters.min_discount === opt.value
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
            )}
          >
            {opt.label}
          </button>
        ))}

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
