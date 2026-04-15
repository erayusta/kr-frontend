import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getRecentlyViewed, subscribeRecentlyViewedChanged } from '@/lib/recentlyViewed';
import { getCdnImageUrl, formatPrice } from '@/utils/storeUtils';

export default function RecentlyViewedSection({ excludeSlug, limit = 6 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sync = () => {
      const all = getRecentlyViewed().filter((p) => p.slug !== excludeSlug);
      setItems(all.slice(0, limit));
    };
    sync();
    return subscribeRecentlyViewedChanged(sync);
  }, [excludeSlug, limit]);

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-gray-400" />
        <h2 className="text-base font-semibold text-gray-900">Son Baktıklarınız</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {items.map((product) => {
          const rawImg = product.image || null;
          const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
          return (
            <Link
              key={product.slug}
              href={`/urun/${product.slug}`}
              className="snap-start flex-shrink-0 w-32 sm:w-36 group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                {imgUrl ? (
                  // biome-ignore lint/performance/noImgElement: <explanation>
                  <img src={imgUrl} alt={product.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-200" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-2">
                {product.brand?.name && (
                  <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wider truncate">
                    {product.brand.name}
                  </p>
                )}
                <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                  {product.title}
                </p>
                {product.latest_price != null && (
                  <p className="text-xs font-bold text-orange-600 mt-1">
                    ₺{formatPrice(product.latest_price)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
