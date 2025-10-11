
import { Button } from "@/components/ui/button"
import { Clock12Icon, HeartIcon, Share2Icon } from "lucide-react";
import Link from "next/link";

export default function PageHeader({ page }) {
 return (<section className="w-full py-3  shadow  bg-white dark:bg-gray-800">
  <div className="md:container px-4">
   <div className="grid items-center gap-10 grid-cols-1 md:grid-cols-1">
    <div className="flex gap-x-3 items-center justify-between">
     <div className="flex flex-col justify-center space-y-4">
      <div className="space-y-2">
       <h1 className="text-3xl  font-bold tracking-tighter ">{page.title}</h1>
      </div>
     
     </div>
   
    </div>
   </div>
  </div>
 </section>)
}