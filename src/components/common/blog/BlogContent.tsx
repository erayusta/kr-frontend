import Ad from "@/components/common/ads/Ad";
import type { Ad as AdType } from "@/types/ad";
import { IMAGE_BASE_URL } from "@/constants/site";

type BlogPost = {
	image?: string | null;
	content?: string | null;
};

type BlogContentProps = {
	post: BlogPost;
	ads?: AdType[] | null;
};

export default function BlogContent({ post, ads }: BlogContentProps) {
    const getAd = (position: AdType["position"]) => ads?.find((item) => item.position === position);
    const imgUrl = post?.image
        ? (post.image.startsWith("http") || post.image.startsWith("/")
            ? post.image
            : `${IMAGE_BASE_URL}/posts/${post.image}`)
        : null;

    return (
        <section className="w-full pb-20">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8">
                    <div className="mt-5">
                        <div className="mt-4 max-w-5xl grid gap-4 text-sm/relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
                                {imgUrl && (
                                    // Legacy-like image block (fixed box on md+)
                                    <img
                                        alt={post?.title || "Blog görseli"}
                                        className="md:w-[336px] md:h-[280px] rounded-sm w-full h-full object-fill object-center shadow-sm justify-center mt-2"
                                        src={imgUrl}
                                        loading="lazy"
                                    />
                                )}
                                <Ad variant="inline" ad={getAd("post_content_one")} />
                                <Ad variant="inline" ad={getAd("post_content_two")} />
                                <Ad variant="inline" ad={getAd("post_right")} />
                                <Ad variant="inline" ad={getAd("post_left")} />
                            </div>

                            {/* Content (raw HTML from CMS) */}
                            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is expected to be HTML from CMS. */}
                            <div
                                className="mt-5 rich-content"
                                dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
