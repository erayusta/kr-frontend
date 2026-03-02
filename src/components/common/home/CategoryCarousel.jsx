import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { getIcon } from "@/lib/utils";

export default function CategoryCarousel({ data }) {
	if (!data || data.length === 0) return null;

	return (
		<div className="w-full mt-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-3">Kategoriler</h2>
			<Carousel
				plugins={[
					Autoplay({
						delay: 3000,
						stopOnInteraction: false,
						stopOnMouseEnter: true,
					}),
				]}
			>
				<CarouselContent>
					{data.map((item) => (
						<CarouselItem
							key={item.id}
							className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 flex justify-center items-center p-3"
						>
							<Link
								href={`/kategori/${item.slug}`}
								className="group flex flex-col items-center justify-center gap-2"
							>
								<div
									className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-3 transition-all duration-200
                                    ring-1 ring-transparent bg-white/70 backdrop-blur-sm
                                    group-hover:-translate-y-1 group-hover:ring-primary/40 group-hover:shadow-md group-hover:bg-white
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
								>
									<div
										className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
										dangerouslySetInnerHTML={{ __html: getIcon(item.name) }}
									/>
								</div>
								<span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors text-center line-clamp-1">
									{item.name}
								</span>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
