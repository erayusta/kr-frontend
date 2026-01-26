import { ChevronRight, MountainIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";


export default function PostCard({ image, title, id, slug }){


 return (
  <Card key={id} className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
    <div className="relative w-full aspect-[4/3] rounded-t-lg overflow-hidden bg-gray-50">
      {image ? (
        <Image
          alt={title || 'Blog post'}
          title={title || 'Blog post'}
          src={image}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <MountainIcon className="text-gray-400" size={48} />
        </div>
      )}
    </div>

    <div className="px-3 sm:px-4 py-3">
      <h3 className="text-sm font-medium text-blue-950 mt-2 h-[75px] leading-tight break-words line-clamp-3">{title}</h3>
      <Button asChild variant="outline" className="w-full rounded-b-lg mt-2 text-xs sm:text-sm">
        <Link title={title} href={`/blog/${slug}`}>
          Devamını Oku <ChevronRight size={18} />
        </Link>
      </Button>
    </div>
  </Card>
 )

}
