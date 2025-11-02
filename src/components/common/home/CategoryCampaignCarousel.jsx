import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getIcon } from "@/lib/utils";
import CampaignCard from "../CampaignCard";

const CategoryCampaginsCarousel = ({ category, style }) => {
	return (
		<Card
			key={category.id}
			className="bg-transparent max-w-full border-0 shadow-none"
		>
			{/* Üst başlık kısmı */}
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<div className="flex items-center gap-x-3">
					<div
						dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
						className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8"
					/>
					<CardTitle className="text-lg md:text-xl font-semibold">
						{category.name} Kampanyaları
					</CardTitle>
				</div>

				<Button
					asChild
					variant="outline"
					className="text-xs md:text-sm whitespace-nowrap"
				>
					<Link href={`/kategori/${category.slug}`}>Tümünü Gör</Link>
				</Button>
			</CardHeader>

			{/* Carousel kısmı */}
			<CardContent className="p-0 md:p-5">
				<Carousel
					className="w-full"
					plugins={[
						Autoplay({
							delay: 2500,
							stopOnInteraction: false,
							stopOnMouseEnter: true,
						}),
					]}
				>
					<CarouselContent className="flex items-stretch">
						{category.campaigns.map((campaign) => (
							<CarouselItem
								key={campaign.id}
								className={`${
									style === "one"
										? "basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
										: "basis-[85%] sm:basis-1/2"
								} flex-shrink-0 px-2`}
							>
								<CampaignCard {...campaign} />
							</CarouselItem>
						))}
					</CarouselContent>

					{style === "one" && (
						<>
							<CarouselPrevious className="hidden md:flex -left-3 md:-left-6" />
							<CarouselNext className="hidden md:flex -right-3 md:-right-6" />
						</>
					)}
				</Carousel>
			</CardContent>
		</Card>
	);
};

const CategoryCampaginCarousel = ({ data }) => {
	return (
		<section className="bg-transparent w-full">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
				{data?.slice(0, 2).map((category) => (
					<CategoryCampaginsCarousel key={category.id} category={category} />
				))}
			</div>

			<div className="flex flex-col gap-10 mt-10">
				{data?.slice(2).map((category) => (
					<CategoryCampaginsCarousel
						key={category.id}
						category={category}
						style="one"
					/>
				))}
			</div>
		</section>
	);
};

export default CategoryCampaginCarousel;
