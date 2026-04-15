import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { getCdnImageUrl, getStoreName, formatPrice, STORE_CONFIG } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

const STORE_DOT_COLORS = {
  migros: 'bg-red-500',
  sok: 'bg-orange-400',
  a101: 'bg-red-700',
  carrefour: 'bg-blue-600',
};

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const rawImage = product.image || product.images?.[0] || null;
  const imageUrl = rawImage ? getCdnImageUrl(rawImage) : null;
  const allStores = product.stores || [];
  const visibleStores = allStores.slice(0, 2);
  const extraCount = allStores.length > 2 ? allStores.length - 2 : 0;

  return (
    <Link
      href={`/urun/${product.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-xl border border-gray-100',
        'shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
      )}
    >
      {/* Image area */}
      <div className="relative bg-white aspect-square overflow-hidden">
        {imageUrl && !imgError ? (
          // biome-ignore lint/performance/noImgElement: <explanation>
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ShoppingBag className="h-12 w-12 text-gray-200" strokeWidth={1.5} />
          </div>
        )}

        {/* Store dots overlay at bottom of image */}
        {allStores.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            {visibleStores.map((store) => (
              <span
                key={store}
                title={getStoreName(store)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full ring-1 ring-white/80',
                  STORE_DOT_COLORS[store] || 'bg-gray-400',
                )}
              />
            ))}
            {extraCount > 0 && (
              <span className="text-[10px] font-semibold text-gray-500 bg-white/80 rounded-full px-1 leading-tight ring-1 ring-gray-200">
                +{extraCount}
              </span>
            )}
          </div>
        )}

        {/* Hover CTA overlay */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 py-2 px-3',
            'bg-gradient-to-t from-orange-500/90 to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'flex items-end justify-center',
          )}
        >
          <span className="text-xs font-semibold text-white tracking-wide pb-1">
            Fiyatları Karşılaştır
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Brand */}
        {product.brand?.name && (
          <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Lowest price pill */}
        {product.latest_price != null && (
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-100 text-xs font-semibold px-2.5 py-1 rounded-full">
              En düşük ₺{formatPrice(product.latest_price)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
