import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function BmwAdsLeft({handleCloseAdsModal}) {
  return (
    <div className="fixed inset-0 z-40 hidden md:block">
      <iframe 
        className="w-full h-full"
        src="https://kampanyaradar-static.b-cdn.net/kampanyaradar/ads/bmw/index.html"
       
      ></iframe>
    </div>
  );
}
