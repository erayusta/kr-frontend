import { ChevronRight, MountainIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";


export default function PostCard({ image, title, id, slug }){


 return (
  <Card key={id} className="group max-w-[360px] border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-colors duration-200">
    <div className="relative w-full h-56 md:h-60 rounded-t-lg overflow-hidden bg-white">
      {image ? (
        <Image
          alt={title || 'Blog post'}
          title={title || 'Blog post'}
          src={image}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <MountainIcon className="text-gray-400" size={48} />
        </div>
      )}
    </div>

    <div className="px-3 py-3">
      <h3 className="text-sm text-blue-950 mt-1 h-14 line-clamp-2">{title}</h3>
      <Button asChild variant="outline" className="w-full rounded-b-lg mt-2">
        <Link title={title} href={`/blog/${slug}`}>
          Devamını Oku <ChevronRight size={18} />
        </Link>
      </Button>
    </div>
  </Card>
 )

}
