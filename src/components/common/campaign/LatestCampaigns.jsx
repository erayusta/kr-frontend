

import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel"
import { getIcon } from "@/lib/utils"
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import { Card,CardContent,CardHeader, CardTitle } from "@/components/ui/card";


const CategoryCampaginsCarousel = ({category, style}) => {

return(<Card key={category.id} className="bg-transparent max-w-full">
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
     <div className="flex flex-row items-center gap-x-3">
<div dangerouslySetInnerHTML={{ __html:getIcon(category.name == 'Seyahat' ? 'Ev Yaşam & Ofis':category.name == 'Bankacılık' ? 'Otomotiv':category.name) }}></div>
     <CardTitle className="text-lg sm:text-xl"> {category.name == 'Seyahat' ? 'Gayrimenkul Proje':category.name == 'Bankacılık' ? 'Otomotiv':category.name} Kampanyaları</CardTitle>
     </div>

     <Button variant="outline" className="w-full sm:w-auto">
       Tümünü Gör
     </Button>
    </CardHeader>
    <CardContent>
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
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
      
     {category.campaigns && Array.isArray(category.campaigns) ? category.campaigns.map(campaign => (
      <CarouselItem className={`${style == 'one' ? 'basis-[90%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5':'basis-full sm:basis-1/2 md:basis-1/3'}`} key={campaign.id || `campaign-${Math.random()}`}>  <CampaignCard {...campaign}></CampaignCard></CarouselItem>)) : null}
  
  </CarouselContent>
    <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block"  />
</Carousel>
    </CardContent>
   </Card>)
}


const LatestCampaigns = ({data}) => {

 return (<section className="bg-transparent space-y-10">
      {data && Array.isArray(data) ? data.map((category, index) => (
        <CategoryCampaginsCarousel key={category.id || `category-${index}`} style="one" category={category} />
      )) : null}
  
</section>

 )
}







export default LatestCampaigns
;