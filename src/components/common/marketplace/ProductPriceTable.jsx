import { getStoreName, formatPrice } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

export default function ProductPriceTable({ stores = [] }) {
  if (!stores || stores.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center text-sm text-gray-500">
        Fiyat bilgisi bulunamadı
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Mağaza</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">Fiyat</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">İndirimli Fiyat</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">Stok</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stores.map((store, idx) => {
            const hasSale =
              store.sale_price != null &&
              store.sale_price !== store.price &&
              store.sale_price < store.price;

            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: Store rows may lack stable id
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {/* Store name */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {getStoreName(store.name)}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right text-gray-700">
                  {store.price != null ? (
                    <span className={cn(hasSale && 'line-through text-gray-400')}>
                      ₺{formatPrice(store.price)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Sale price */}
                <td className="px-4 py-3 text-right">
                  {hasSale ? (
                    <span className="font-semibold text-green-600">
                      ₺{formatPrice(store.sale_price)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-3 text-center">
                  {store.in_stock ? (
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Stokta
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      Stok Yok
                    </span>
                  )}
                </td>

                {/* Link */}
                <td className="px-4 py-3 text-center">
                  {store.link ? (
                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-block text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                        store.in_stock
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none',
                      )}
                    >
                      Satın Al
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
