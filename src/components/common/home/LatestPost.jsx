

import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel"
import { getIcon } from "@/lib/utils"
import { ArrowRight, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostCard from "../PostCard";

export default function({posts}){

 return (
 
 <section className="bg-transparent">
 <Card key={'latest-post'} className="bg-transparent max-w-full">
  <CardHeader className="flex flex-row items-center justify-between">
   <div className="flex flex-row items-center  gap-x-3">
   <Paperclip></Paperclip>
    <CardTitle className="md:text-xl text-md"> Son Blog Yazıları</CardTitle>
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

     {posts?.map(post => (
      <CarouselItem className={'basis-[86%] md:basis-1/4'} key={post.id}>  <PostCard {...post}></PostCard></CarouselItem>))}

    </CarouselContent>
    <CarouselPrevious  className="hidden md:block" />
    <CarouselNext  className="hidden md:block" />
   </Carousel>
  </CardContent>
 </Card>
</section>)
}