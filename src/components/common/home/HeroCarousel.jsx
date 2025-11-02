import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

const HeroCarousel = ({ data }) => {
	return (
		<div className="w-full rounded-2xl overflow-hidden h-full">
			<Carousel
				className="w-full h-full "
				plugins={[
					Autoplay({
						delay: 2500,
						stopOnInteraction: false,
						stopOnMouseEnter: true,
					}),
				]}
			>
				<CarouselContent>
					{data?.map((item) => (
						<CarouselItem
							key={item.id}
							className="relative aspect-[16/9] sm:aspect-[4/3] md:aspect-[5/3] lg:aspect-[1/1] bg-blue-50"
						>
							<Link href={item.link || "#"} className="block w-full h-full">
								<Image
									src={item.image}
									alt={item.title || "Kampanya"}
									fill
									className="object-cover w-full h-full rounded-2xl"
									sizes="100vw"
									priority
								/>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default HeroCarousel;
