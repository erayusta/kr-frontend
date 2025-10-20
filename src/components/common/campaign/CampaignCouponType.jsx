// components/CampaignCouponCode.js
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

export default function ({ campaign }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaign.couponCode);
    alert('Kupon Kodu Kopyalandı');
  };

  return (
    <div className="w-full mb-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="relative overflow-visible">
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
              >
                Kopyala
              </Button>
            </div>
            
            {/* Sol ve Sağ Daireler (Kupon券 Efekti) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full border-2 border-dashed border-orange-300"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full border-2 border-dashed border-orange-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
