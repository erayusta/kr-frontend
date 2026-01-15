import { ChevronRight, MountainIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";


export default function PostCard({ image, title, id, slug }){


 return (
  <Card key={id} className="group max-w-[360px] border border-gray-100 rounded-xl shadow-md transition-transform ease-out duration-200 md:hover:scale-[1.015] md:hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/20">
    <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 rounded-t-lg overflow-hidden bg-white">
      {image ? (
        <Image
          alt={title || 'Blog post'}
          title={title || 'Blog post'}
          src={image}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <MountainIcon className="text-gray-400" size={48} />
        </div>
      )}
    </div>

    <div className="px-3 sm:px-4 py-3">
      <h3 className="text-[13px] sm:text-sm md:text-base font-medium text-blue-950 mt-1 sm:mt-1.5 leading-tight break-words line-clamp-3">{title}</h3>
      <Button asChild variant="outline" className="w-full rounded-b-lg mt-2 text-xs sm:text-sm">
        <Link title={title} href={`/blog/${slug}`}>
          Devamını Oku <ChevronRight size={18} />
        </Link>
      </Button>
    </div>
  </Card>
 )

}
