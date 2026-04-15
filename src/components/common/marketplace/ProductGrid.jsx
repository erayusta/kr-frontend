import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products = [], loading = false }) {
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" strokeWidth={1.5} />
        <p className="text-base font-medium text-gray-600">Ürün bulunamadı</p>
        <p className="text-sm text-gray-400 mt-1">Farklı bir arama veya filtre deneyin</p>
      </div>
    );
  }

  // Initial load (no products yet): show skeletons
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholders have no identity
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Re-filtering existing results: overlay spinner over cards
  return (
    <div className="relative">
      {loading && products.length > 0 && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div
        className={cn(
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
          loading && products.length > 0 && 'pointer-events-none',
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
