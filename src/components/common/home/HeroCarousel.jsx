import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { Carousel, CarouselItem, CarouselContent } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'
import { IMAGE_BASE_URL } from "@/constants/site";

const HeroCarousel = ({data, children}) => {

 


 return (
  <div className="max-w-full rounded-md">
     <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
          stopOnMouseEnter: true
        }),
      ]}
      opts={{
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
            },
          },
        ],
      }}
    >
      <CarouselContent>
       {data?.map(item =>  <CarouselItem key={item.id}><a href={item.link} className="keen-slider__slide rounded-md bg-slate-300">
        <Image width={600} height={600}  className=" object-fit  rounded-md" src={item.image} alt={item.title || 'Kampanya'}/>
       </a></CarouselItem>)}
       </CarouselContent>
   </Carousel>
{children}
  </div>

 )
}







export default HeroCarousel;