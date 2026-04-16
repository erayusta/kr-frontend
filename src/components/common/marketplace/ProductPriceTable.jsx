import { getStoreName, formatPrice } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

const STORE_ACCENT = {
  migros: 'bg-red-500',
  sok: 'bg-orange-400',
  a101: 'bg-red-700',
  carrefour: 'bg-blue-700',
};

export default function ProductPriceTable({ stores = [] }) {
  if (!stores || stores.length === 0) {
    return (
      <div className="rounded-lg border border-gray-100 p-6 text-center text-sm text-gray-400">
        Fiyat bilgisi bulunamadı
      </div>
    );
  }

  // Find lowest active price for "En Ucuz" badge
  const prices = stores
    .map((s) => (s.sale_price != null && s.sale_price < s.price ? s.sale_price : s.price))
    .filter((p) => p != null && p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-50">
        {stores.map((store, idx) => {
          const hasSale =
            store.sale_price != null &&
            store.sale_price !== store.price &&
            store.sale_price < store.price;

          const activePrice = hasSale ? store.sale_price : store.price;
          const isCheapest = lowestPrice != null && activePrice === lowestPrice;
          const accentClass = STORE_ACCENT[store.name] || 'bg-gray-400';

          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Store rows may lack stable id
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 px-3 py-3 transition-colors',
                store.in_stock ? 'hover:bg-gray-50/60' : 'opacity-60',
              )}
            >
              {/* Colored left accent */}
              <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', accentClass)} />

              {/* Store name */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {getStoreName(store.name)}
                </span>
                {isCheapest && store.in_stock && (
                  <span className="inline-flex items-center bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0">
                    En Ucuz
                  </span>
                )}
              </div>

              {/* Price — strikethrough original + green sale in same cell */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasSale ? (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₺{formatPrice(store.price)}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ₺{formatPrice(store.sale_price)}
                    </span>
                  </>
                ) : store.price != null ? (
                  <span className="text-sm font-bold text-gray-800">
                    ₺{formatPrice(store.price)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>

              {/* CTA / stock status */}
              <div className="flex-shrink-0">
                {store.in_stock ? (
                  store.link ? (
                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                      Satın Al
                    </a>
                  ) : null
                ) : (
                  <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    Stok Yok
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
