
import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbLink,
 BreadcrumbList,
 BreadcrumbPage,
 BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Clock12Icon, HeartIcon, Share2Icon } from "lucide-react";
import { remainingDay } from "@/utils/campaign";
import { getIcon } from "@/lib/utils";
import Link from "next/link";

export default function ({ post }) {
 return (<section className="w-full py-3  shadow  bg-white dark:bg-gray-800">
  <div className="md:container px-4">
   <div className="grid items-center gap-10 grid-cols-1 md:grid-cols-1">
    <Breadcrumb className="">
     <BreadcrumbList>
      <BreadcrumbItem>
       <BreadcrumbLink href="/">Anasayfa</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
       <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
       <BreadcrumbPage>{post.title.substring(0,30)}...</BreadcrumbPage>
      </BreadcrumbItem>
     </BreadcrumbList>
    </Breadcrumb>

    <div className="flex gap-x-3 items-center justify-between">
     <div className="flex flex-col justify-center space-y-4">
      <div className="space-y-2">
     <div className="text-sm items-center flex text-gray-500 dark:text-gray-400">
        {post.categories && post.categories.length > 0 && (
        <Button size="sm" variant="outline" className="items-center flex gap-4">
         <div className="text-md" dangerouslySetInnerHTML={{ __html: getIcon(post.categories[0].name) }}></div>
         <div>{post.categories[0].name}</div>
        </Button>
        )}
       </div>
       <h1 className="text-3xl w-[85%] font-bold tracking-tighter ">{post.title}</h1>
      </div>
      <div className="flex items-center gap-4">
       


       
      </div>
     </div>
     <div className="flex md:flex-row flex-col items-center gap-3">
      <Button disabled variant="secondary" className="rounded-full  hover:bg-orange-500 hover:text-white py-3">
       <HeartIcon className="mr-2 h-5 w-5"></HeartIcon> <span className="md:block hidden">Kaydet</span>
      </Button>
      <Button asChild variant="secondary" className="rounded-full hover:bg-orange-500 hover:text-white py-3">
       <Link target="_blank" href={`https://twitter.com/intent/tweet?text=${post.title}&url=${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`}>
        <Share2Icon className="mr-2 h-5 w-5"></Share2Icon>
        <span className="md:block hidden">Paylaş</span>
       </Link>
      </Button>
     </div>
    </div>
   </div>
  </div>
 </section>)
}