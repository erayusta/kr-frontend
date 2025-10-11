import { CalendarDaysIcon, ChevronLeft, ChevronRight, Clock10Icon, HeartIcon, MountainIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/constants/site";
import Image from "next/image";


export default function PostCard({ image, title, id, slug }){


 return (<Card key={id} className="max-w-[360px] shadow-md hadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1">

  <div className="relative group:">
   {image ? (
    <Image
     alt={title || 'Blog post'}
     title={title || 'Blog post'}
     className="w-full hover:bg-black h-48 object-cover rounded-t-lg"
     height={300}
     src={image}
     width={400}
    />
   ) : (
    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
      <MountainIcon className="text-gray-400" size={48} />
    </div>
   )}
  </div>




  <div className="px-2 py-2">

   <h3 className="text-sm text-blue-950 mt-2 h-[75px]">{title}</h3>
   <Button asChild variant="outline" className="w-full rounded-b-lg">
    <Link title={title} href={`/blog/${slug}`}> Devamını Oku <ChevronRight size={18}></ChevronRight></Link>
   </Button>
  </div>


 </Card>
 )

}

