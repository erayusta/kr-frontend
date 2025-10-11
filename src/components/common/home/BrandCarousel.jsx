import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { Carousel, CarouselItem, CarouselContent } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/constants/site";
import Image from "next/image";


export default function BrandCarousel ({data}) {

 return (
  
     <Carousel
      className="mt-5"
      plugins={[
        Autoplay({
          delay: 3000,
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
       {data.map(item =>  <CarouselItem className="basis-[31%] md:basis-1/5 flex items-center justify-center w-20 hover:shadow-md  transition-transform duration-300 ease-in-out hover:-translate-y-1 h-20 m-auto bg-transparent" key={item.id}><a href={item.link} >
        <Link href={`/marka/${item.slug}`}>
        <Image height={60} width={60} className=""
             src={item.logo}
        />
        </Link>
       </a></CarouselItem>)}
       </CarouselContent>
   </Carousel>
 )
}
