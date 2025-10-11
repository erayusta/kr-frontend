

import { Button } from "@/components/ui/button"
import { BadgeInfo, ChevronRightIcon, Clock } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";
import Ad from "../ads/Ad";
import { IMAGE_BASE_URL } from "@/constants/site";
export default function BlogContent({ post, ads }) {




 return (<section className="w-full pb-20 ">
  <div className="container px-4 md:px-6">
   <div className="grid gap-8">
    <div className="mt-5">
     <div className="mt-4 max-w-5xl grid gap-4 text-sm/relaxed">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
       <img
        alt="Auction Item"
        class="md:w-[336px] md:h-[280px] rounded-sm w-full h-full  md:flex  object-center  shadow-sm object-fill justify-center mt-2"
        src={post.image}

       />
       <Ad position="center" ad={ads?.find(item => item.position == 'post_content_one')}></Ad>
       <Ad position="center" ad={ads?.find(item => item.position == 'post_content_two')}></Ad>
       <Ad position="right" ad={ads?.find(item => item.position == 'post_right')}></Ad>
       <Ad position="left" ad={ads?.find(item => item.position == 'post_left')}></Ad>

      </div>
      <div className="mt-5" dangerouslySetInnerHTML={{ __html: post.content }}></div>
     

     </div>
    </div>

   </div>
  </div>
 </section>)
}

