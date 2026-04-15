import { ShoppingBag } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 12 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholders have no identity
            <SkeletonCard key={i} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
