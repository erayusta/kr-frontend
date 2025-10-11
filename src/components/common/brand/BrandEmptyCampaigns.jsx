import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel"
import { getIcon } from "@/lib/utils"
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function ({category}){

return(<section className="mt-10 mb-10 py-10">
<Card className="bg-transparent">
 <CardHeader>
  <ShieldAlert></ShieldAlert>
  <CardTitle>Kampanya Bulunamadı</CardTitle>
  <CardDescription>Aradığınız Kriterlere Uygun Kampanya Bulunumadı.</CardDescription>
 </CardHeader>
</Card>
</section>
)

}