import Ad from "@/components/common/ads/Ad";
import type { Ad as AdType } from "@/types/ad";

type BlogPost = {
	image?: string | null;
	content?: string | null;
};

type BlogContentProps = {
	post: BlogPost;
	ads?: AdType[] | null;
};

export default function BlogContent({ post, ads }: BlogContentProps) {
	console.log("hocam", ads);
	const getAd = (position: AdType["position"]) =>
		ads?.find((item) => item.position === position);

	return (
		<section className="w-full pb-20">
			<div className="container px-4 md:px-6">
				<div className="grid gap-8">
					<div className="mt-5">
						<div className="mt-4 max-w-5xl grid gap-4 text-sm/relaxed">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
								<Ad variant="inline" ad={getAd("post_content_one")} />
								<Ad variant="inline" ad={getAd("post_content_two")} />
								<Ad variant="inline" ad={getAd("post_right")} />
								<Ad variant="inline" ad={getAd("post_left")} />
							</div>

							{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is expected to be HTML from CMS. */}
							<div
								className="mt-5"
								dangerouslySetInnerHTML={{ __html: post?.content || "" }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
