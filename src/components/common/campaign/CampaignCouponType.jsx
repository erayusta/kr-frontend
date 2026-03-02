import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Check, Copy } from 'lucide-react';

export default function CampaignCouponType({ campaign }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaign.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full mb-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="relative overflow-visible">
          {/* Kopyalandı Bildirimi */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-lg transition-all duration-300 ${
              copied
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <Check className="h-4 w-4" />
            Kupon kodu kopyalandı!
          </div>

          {/* Kupon Kartı */}
          <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 border-2 border-dashed border-orange-300 rounded-2xl px-12 py-8 text-center shadow-lg">
            {/* İkon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Ticket className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            {/* Başlık */}
            <h4 className="mb-2 font-bold text-xl text-gray-900">
              Kupon Kodunu Kopyalayın
            </h4>
            <p className="mb-6 text-sm text-gray-600">
              Ve Sitede Kullanın
            </p>

            {/* Kupon Kodu ve Buton */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <div className="px-6 py-3 bg-white border-2 border-dashed border-orange-400 rounded-lg">
                <span className="font-mono font-bold text-lg text-orange-600 tracking-wider">
                  {campaign.couponCode}
                </span>
              </div>
              <Button
                onClick={copyToClipboard}
                size="lg"
                className={`font-semibold px-6 gap-2 transition-all duration-200 ${
                  copied
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>

            {/* Sol ve Sağ Daireler (Kupon Efekti) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
