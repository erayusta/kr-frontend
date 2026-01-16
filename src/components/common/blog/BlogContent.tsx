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
    const getAd = (position: AdType["position"]) => ads?.find((item) => item.position === position);

    return (
        <section className="w-full pb-20">
            <div className="container px-4 md:px-6">
                <div className="max-w-5xl mx-auto grid gap-6">
                    <div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm p-4 sm:p-6">
                        {/* Ads (optional, shows only if present) */}
                        {(getAd("post_content_one") || getAd("post_content_two") || getAd("post_left") || getAd("post_right")) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <Ad variant="inline" ad={getAd("post_content_one")} />
                                <Ad variant="inline" ad={getAd("post_content_two")} />
                                <Ad variant="inline" ad={getAd("post_left")} />
                                <Ad variant="inline" ad={getAd("post_right")} />
                            </div>
                        )}

                        {/* Content */}
                        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is expected to be HTML from CMS. */}
                        <article className="rich-content" dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
