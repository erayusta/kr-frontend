import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bell, BellOff, ExternalLink, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import { getAllPriceAlerts, removePriceAlert, subscribePriceAlertsChanged } from '@/lib/priceAlerts';
import { getCdnImageUrl, formatPrice } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

export default function FiyatTakip() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const sync = () => setAlerts(getAllPriceAlerts());
    sync();
    return subscribePriceAlertsChanged(sync);
  }, []);

  const handleRemove = (slug) => {
    removePriceAlert(slug);
  };

  return (
    <Layout>
      <Head>
        <title>Fiyat Takip - KampanyaRadar</title>
        <meta name="description" content="Takipteki ürünleriniz. Hedef fiyata ulaşınca haberdar olun." />
      </Head>

      <div className="container py-8 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold text-gray-900">Fiyat Takip</h1>
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BellOff className="h-16 w-16 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Takip edilen ürün yok</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Ürün detay sayfasında hedef fiyat belirleyerek fiyat takibine başlayın.
            </p>
            <Link
              href="/fiyat-karsilastir"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert) => {
              const rawImg = alert.image || null;
              const imgUrl = rawImg ? getCdnImageUrl(rawImg) : null;
              const reached = alert.currentPrice != null && alert.currentPrice <= alert.targetPrice;
              return (
                <div
                  key={alert.slug}
                  className={cn(
                    'bg-white rounded-xl border shadow-sm p-4 flex gap-3',
                    reached ? 'border-green-200' : 'border-gray-100',
                  )}
                >
                  {/* Image */}
                  {imgUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {/* biome-ignore lint/performance/noImgElement: <explanation> */}
                      <img src={imgUrl} alt={alert.title} className="w-full h-full object-contain p-1" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/urun/${alert.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-orange-500 line-clamp-2 leading-snug transition-colors"
                    >
                      {alert.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">Şu anki: </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {alert.currentPrice != null ? `₺${formatPrice(alert.currentPrice)}` : '?'}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className={cn(
                        'text-sm font-semibold',
                        reached ? 'text-green-600' : 'text-orange-600',
                      )}>
                        ₺{formatPrice(alert.targetPrice)}
                      </span>
                    </div>

                    {reached && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        ✓ Hedef fiyata ulaşıldı!
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <Link
                      href={`/urun/${alert.slug}`}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors"
                      aria-label="Ürüne git"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(alert.slug)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      aria-label="Takipten çıkar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
