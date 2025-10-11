

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
    <CardHeader className="flex flex-row items-center justify-between">
     <div className="flex flex-row items-center  gap-x-3">
<div  dangerouslySetInnerHTML={{ __html:getIcon(category.name == 'Seyahat' ? 'Ev Yaşam & Ofis':category.name == 'Bankacılık' ? 'Otomotiv':category.name) }}></div>
     <CardTitle className="md:text-xl text-md"> {category.name == 'Seyahat' ? 'Gayrimenkul Proje':category.name == 'Bankacılık' ? 'Otomotiv':category.name} Kampanyaları</CardTitle>
     </div>

     <Button variant="outline">
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
      
     {category.campaigns && Array.isArray(category.campaigns) ? category.campaigns.map(campaign => (
      <CarouselItem className={`${style == 'one' ? 'basis-[85%] md:basis-1/5':'basis-1/2 md:basis-1/2'}`} key={campaign.id || `campaign-${Math.random()}`}>  <CampaignCard {...campaign}></CampaignCard></CarouselItem>)) : null}
  
  </CarouselContent>
    <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block"  />
</Carousel>
    </CardContent>
   </Card>)
}


const LatestCampaigns = ({data}) => {

 return (<section className="bg-transparent">
 
      {data && Array.isArray(data) ? data.map((category, index) => (
        <div key={category.id || `category-${index}`} className="grid md:grid-cols-1 grid-cols-1 gap-4 mt-10 ">
          <CategoryCampaginsCarousel style="one" category={category} />
        </div>
      )) : null}
  
</section>

 )
}







export default LatestCampaigns
;