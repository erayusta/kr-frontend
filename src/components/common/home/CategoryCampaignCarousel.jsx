

import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel"
import { getIcon } from "@/lib/utils"
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


const CategoryCampaginsCarousel = ({ category, style }) => {

 return (<Card key={category.id} className="bg-transparent max-w-full">
  <CardHeader className="flex flex-row items-center justify-between">
   <div className="flex flex-row items-center  gap-x-3">
    <div dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}></div>
    <CardTitle className="md:text-xl text-md"> {category.name} Kampanyaları</CardTitle>
   </div>

   <Button asChild variant="outline">
   <Link href={`/kategori/${category.slug}`}>
   Tümünü Gör
   </Link>
    

   </Button>
  </CardHeader>
  <CardContent className="p-0 md:p-5">
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
        slidesToShow: 1,
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

     {category.campaigns.map(campaign => (
      <CarouselItem className={`${style == 'one' ? 'basis-[86%] md:basis-1/4' : 'basis-[86%] md:basis-1/2'}`} key={campaign.id}>  <CampaignCard {...campaign}></CampaignCard></CarouselItem>))}

    </CarouselContent>
 
{ style == 'one' && <>
 <CarouselPrevious className="hidden md:flex" />
  <CarouselNext className="hidden md:flex" />
    
 </>}

   
   </Carousel>
  </CardContent>
 </Card>)
}


const CategoryCampaginCarousel = ({ data }) => {

 return (<section className="bg-transparent">

  <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-10">
   {data?.slice(0, 2).map((category) => (
    <CategoryCampaginsCarousel key={category.id} category={category} />
   ))}
  </div>

  {data?.slice(2).map((category) => (
   <div key={category.id} className="grid md:grid-cols-1 grid-cols-1 gap-4 mt-10 ">
    <CategoryCampaginsCarousel style="one" category={category} />
   </div>
  ))}

 </section>

 )
}







export default CategoryCampaginCarousel;