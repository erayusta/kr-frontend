import { useRouter } from 'next/router';
import { X, Scale } from 'lucide-react';
import { useCompare } from '@/context/compareContext';
import { getCdnImageUrl, formatPrice } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

const SLOT_COUNT = 3;

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, max } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  const handleCompare = () => {
    const slugs = compareList.map((p) => p.slug).join(',');
    router.push(`/karsilastir?slugs=${encodeURIComponent(slugs)}`);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg py-3 px-4">
      <div className="container mx-auto flex items-center gap-3">
        {/* Slots */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {[...Array(SLOT_COUNT)].map((_, i) => {
            const product = compareList[i];
            if (product) {
              const rawImg = product.image || product.images?.[0] || null;
              const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
              return (
                <div
                  key={product.slug}
                  className="relative flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1.5 min-w-0 max-w-[180px] flex-shrink-0"
                >
                  {imgUrl ? (
                    // biome-ignore lint/performance/noImgElement: <explanation>
                    <img src={imgUrl} alt={product.title} className="w-8 h-8 object-contain flex-shrink-0 rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 truncate leading-tight">{product.title}</p>
                    {product.latest_price != null && (
                      <p className="text-xs text-orange-600 font-semibold">₺{formatPrice(product.latest_price)}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(product.slug)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 -mr-0.5"
                    aria-label="Karşılaştırmadan çıkar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={i}
                className="flex items-center justify-center w-[120px] h-[52px] rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 flex-shrink-0"
              >
                + Ürün ekle
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Temizle
          </button>
          <button
            type="button"
            onClick={handleCompare}
            disabled={compareList.length < 2}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              compareList.length >= 2
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            )}
          >
            <Scale className="h-4 w-4" />
            Karşılaştır ({compareList.length}/{max})
          </button>
        </div>
      </div>
    </div>
  );
}
