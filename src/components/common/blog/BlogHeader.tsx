import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { IMAGE_BASE_URL } from "@/constants/site";
import { useFavorite } from "@/hooks/useFavorite";
import { getIcon } from "@/lib/utils";
import { CalendarDays, Clock, HeartIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type BlogCategory = {
	name: string;
	slug?: string;
};

type BlogPost = {
	id?: string | number;
	title: string;
	slug?: string;
	image?: string | null;
	content?: string | null;
	categories?: BlogCategory[] | null;
	published_at?: string | null;
	created_at?: string | null;
	createdAt?: string | null;
	date?: string | null;
};

type BlogHeaderProps = {
	post: BlogPost;
};

const getImageUrl = (image: BlogPost["image"]): string => {
	if (!image) return "/sample-info.png";
	if (image.startsWith("http") || image.startsWith("/")) return image;
	return `${IMAGE_BASE_URL}/posts/${image}`;
};

const estimateReadingMinutes = (html: string): number => {
	const plainText = html.replace(/<\/?[^>]+(>|$)/g, " ");
	const wordCount = plainText.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(wordCount / 200));
};

export default function BlogHeader({ post }: BlogHeaderProps) {
	const [imageSrc, setImageSrc] = useState(() => getImageUrl(post?.image));
	const favoriteId = post?.id ?? post?.slug;
	const { isFavorite, toggle, canToggle } = useFavorite("post", favoriteId);

	const publishedAt =
		post?.published_at || post?.created_at || post?.createdAt || post?.date;

	const formattedDate = useMemo(() => {
		if (!publishedAt) return null;
		const date = new Date(publishedAt);
		if (Number.isNaN(date.getTime())) return null;
		return date.toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}, [publishedAt]);

	const readingMinutes = useMemo(() => {
		if (!post?.content) return null;
		return estimateReadingMinutes(post.content);
	}, [post?.content]);

	const titleCrumb =
		post?.title?.length > 50 ? `${post.title.substring(0, 50)}...` : post?.title;

	const shareUrl = process.env.NEXT_PUBLIC_BASE_URL
		? `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post?.slug}`
		: "";

	const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		post?.title || "",
	)}&url=${encodeURIComponent(shareUrl)}`;

	return (
		<section className="bg-[#FFFAF4] dark:bg-gray-950">
			<div className="xl:mx-auto xl:px-36">
				<div className="container px-4 py-4">
					<Breadcrumb>
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
								<BreadcrumbPage>{titleCrumb}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</div>

			<div className="xl:mx-auto xl:px-36 pb-8">
				<div className="container px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-800">
						<div className="bg-gradient-to-br from-white via-orange-50 to-amber-100 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#ea580c] p-8 lg:p-12 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full -mr-32 -mt-32" />
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 dark:bg-white/5 rounded-full -ml-24 -mb-24" />

							<div className="relative z-10 space-y-6">
								{post?.categories?.[0] && (
									<Button
										size="sm"
										variant="outline"
										className="items-center flex gap-3 bg-white/70 border-slate-200 text-slate-900 hover:bg-white dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
									>
										{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Icon HTML is controlled locally. */}
										<div
											className="text-base"
											dangerouslySetInnerHTML={{
												__html: getIcon(post.categories[0].name),
											}}
										/>
										<div>{post.categories[0].name}</div>
									</Button>
								)}

								<div className="space-y-3">
									<h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
										{post?.title}
									</h1>

									{(formattedDate || readingMinutes) && (
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-700 dark:text-white/80 text-sm">
											{formattedDate && (
												<span className="inline-flex items-center gap-2">
													<CalendarDays className="h-4 w-4" />
													{formattedDate}
												</span>
											)}
											{readingMinutes && (
												<span className="inline-flex items-center gap-2">
													<Clock className="h-4 w-4" />
													{readingMinutes} dk okuma
												</span>
											)}
										</div>
									)}
								</div>
							</div>

							<div className="relative z-10 flex flex-wrap items-center gap-3">
								{canToggle && (
									<Button
										aria-pressed={isFavorite}
										onClick={toggle}
										variant="secondary"
										className="rounded-full hover:bg-orange-500 hover:text-white"
										title={isFavorite ? "Kaydedildi" : "Kaydet"}
									>
										<HeartIcon
											className="mr-2 h-5 w-5"
											fill={isFavorite ? "currentColor" : "none"}
										/>
										<span className="md:block hidden">
											{isFavorite ? "Kaydedildi" : "Kaydet"}
										</span>
									</Button>
								)}

								<Button
									asChild
									variant="secondary"
									className="rounded-full hover:bg-orange-500 hover:text-white"
								>
									<Link target="_blank" href={tweetHref}>
										<Share2Icon className="mr-2 h-5 w-5" />
										<span className="md:block hidden">Paylaş</span>
									</Link>
								</Button>
							</div>
						</div>

						<div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-[340px]">
							<Image
								src={imageSrc}
								alt={post?.title || "Blog görseli"}
								fill
								priority
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 50vw"
								onError={() => setImageSrc("/sample-info.png")}
								unoptimized
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
