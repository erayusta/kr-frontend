import Link from 'next/link';
import { getCdnImageUrl, getStoreName, formatPrice } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] ? getCdnImageUrl(product.images[0]) : null;
  const visibleStores = (product.stores || []).slice(0, 4);

  return (
    <Link
      href={`/urun/${product.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden',
      )}
    >
      {/* Image */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {imageUrl ? (
          // biome-ignore lint/performance/noImgElement: External CDN URLs used for product images
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">Görsel yok</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Brand */}
        {product.brand?.name && (
          <span className="text-xs text-orange-500 font-medium uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Price */}
        {product.latest_price != null && (
          <p className="text-base font-bold text-gray-900 mt-auto">
            ₺{formatPrice(product.latest_price)}
          </p>
        )}

        {/* Store badges */}
        {visibleStores.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {visibleStores.map((store) => (
              <span
                key={store}
                className="inline-block text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5"
              >
                {getStoreName(store)}
              </span>
            ))}
            {product.store_count > 4 && (
              <span className="inline-block text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                +{product.store_count - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
