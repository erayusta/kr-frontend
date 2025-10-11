// components/CampaignCouponCode.js
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ({ campaign }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(campaign.couponCode);
    alert('Kupon Kodu Kopyalandı');
  };

  return (
    <div className="">
      <div className="">
        
        <div>
          <div className="w-[100%] mb-5 my-auto">
            <div
              className="relative justify-center px-10 py-6 text-center border-2 border-dashed rounded-lg  bg-gradient-to-br ">
              <h4 className="mb-4 font-semibold text-md">Kupon Kodunu Kopyalayın <br /> Ve Sitede Kullanın </h4>
              <div className="flex items-center justify-center mb-6 space-x-2">
                <span id="cpnCode" className="px-4 py-2 border border-dashed rounded-md border-blue-950 text-blue-950">{campaign.couponCode}</span>
                <Button onClick={copyToClipboard} id="cpnBtn">  Kopyala</Button>
              </div>
              <div className="absolute left-0 w-12 h-12 -ml-6 transform -translate-y-1/2 bg-white rounded-full top-1/2"></div>
              <div className="absolute right-0 w-12 h-12 -mr-6 transform -translate-y-1/2 bg-white rounded-full top-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
