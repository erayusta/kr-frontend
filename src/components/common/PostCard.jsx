import { ChevronRight, MountainIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";


export default function PostCard({ image, title, id, slug }){


 return (
  <Card key={id} className="max-w-[360px] shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1">
    <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-white">
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
      <h3 className="text-sm md:text-base font-medium text-blue-950 mt-2 h-[75px] leading-tight break-words line-clamp-3">{title}</h3>
      <Button asChild variant="outline" className="w-full rounded-b-lg mt-2 text-xs sm:text-sm">
        <Link title={title} href={`/blog/${slug}`}>
          Devamını Oku <ChevronRight size={18} />
        </Link>
      </Button>
    </div>
  </Card>
 )

}
