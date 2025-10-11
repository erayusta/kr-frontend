import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function GoodYearAdsModal({handleCloseAdsModal}) {
  return (
    <div className="fixed inset-0 z-40 hidden md:block">
      <Button 
        className="absolute right-5 top-5 z-50" 
        size="icon" 
        onClick={handleCloseAdsModal}
      >
        <XIcon className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </Button>
      <iframe 
        className="w-full h-full"
        src="https://kampanyaradar-static.b-cdn.net/kampanyaradar/ads/goodyear/index.html"
       
      ></iframe>
    </div>
  );
}
