import Image from "next/image"
import { useEffect, useState } from "react";
import { IMAGE_BASE_URL } from "@/constants/site";

const AdItem = ({ad}) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    const adContainer = document.getElementById("ad-container");

    const checkAdLoad = () => {
      if (window.pigeon && window.pigeon.ads && window.pigeon.ads.length > 0) {
        setIsAdLoaded(true); 
      } else {
        setIsAdLoaded(false); 
      }
    };

    if (window.pigeon) {
      checkAdLoad();
    } else {
      window.addEventListener('pigeonLoaded', checkAdLoad);
    }

    document.addEventListener("pigeonAdLoaded", () => {
      setIsAdLoaded(true); 
    });

    setTimeout(checkAdLoad, 3000);

    return () => {
      window.removeEventListener('pigeonLoaded', checkAdLoad);
      document.removeEventListener("pigeonAdLoaded", () => setIsAdLoaded(true));
    };
  }, [mounted]);
  
 if (!mounted) {
  return null; // Don't render anything during SSR
 }
 
 if(ad?.type == 'html'){
  return <div id="ad-container" className={`${isAdLoaded ? 'block' : 'hidden'} h-64 bg-gray-200`} dangerouslySetInnerHTML={{ __html:ad?.code}}></div>
 }else{
  if(ad?.image){
   return <a href={ad?.link} className="mt-10 mb-10"><img className="h-auto m-auto" src={`${IMAGE_BASE_URL}/ads/${ad?.image}`} alt={ad?.title || 'Reklam görseli'}/></a>
  }
 } 
}


export default function Ad({position,ad}){

switch(position){

case  'right':
 return (<div className="fixed right-0 z-50 hidden md:block"><AdItem ad={ad}></AdItem></div>)
case  'left':
 return (<div className="fixed right-0 z-50 hidden md:block"><AdItem ad={ad}></AdItem></div>)
case 'center':
  return (<div className="flex justify-center mt-3"><AdItem ad={ad}></AdItem></div>)
default:
  return (<div className="flex justify-center mt-3"><AdItem ad={ad}></AdItem></div>) 
}

}
