import Autoplay from "embla-carousel-autoplay";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import PostCard from "../PostCard";

export default function ({ posts }) {
	return (
        <section className="bg-transparent">
            <Card key={"latest-post"} className="max-w-full rounded-2xl border border-gray-200/70 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 border-b border-gray-100">
					<div className="flex flex-row items-center  gap-x-3">
						<Paperclip></Paperclip>
						<CardTitle className="md:text-xl text-md">
							{" "}
							Son Blog Yazıları
						</CardTitle>
					</div>

                <Button asChild variant="outline" className="text-xs md:text-sm hover:bg-accent hover:text-accent-foreground">
                    <Link href="/blog" aria-label="Tüm blog yazılarını gör">Tümünü Gör</Link>
                </Button>
                </CardHeader>
                <CardContent className="p-3 sm:p-5">
                    <Carousel
                        className="w-full"
                        plugins={[
                            Autoplay({
                                delay: 2500,
                                stopOnInteraction: false,
                                stopOnMouseEnter: true,
                            }),
                        ]}
                        opts={{ loop: true, align: 'start' }}
                    >
                        <CarouselContent className="flex items-stretch">
                            {posts?.map((post) => (
                                <CarouselItem
                                    className={"basis-[86%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"}
                                    key={post.id}
                                >
									{" "}
									<PostCard {...post}></PostCard>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="hidden md:block" />
						<CarouselNext className="hidden md:block" />
					</Carousel>
				</CardContent>
			</Card>
		</section>
	);
}
