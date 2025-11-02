import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

export default function BrandCarousel({ data }) {
	return (
		<div className="w-full mt-6">
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
								href={`/marka/${item.slug}`}
								className="flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
							>
								<Image
									src={item.logo}
									alt={item.name}
									width={80}
									height={80}
									className="object-contain w-16 h-16 sm:w-20 sm:h-20"
								/>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
