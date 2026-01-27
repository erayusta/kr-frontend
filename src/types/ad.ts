export type AdType = "html" | "image";

export type AdPosition =
	| "home_header"
	| "home_left"
	| "home_right"
	| "category_header"
	| "category_left"
	| "category_right"
	| "brand_header"
	| "brand_left"
	| "brand_right"
	| "blog_header"
	| "blog_left"
	| "blog_right"
	| "campaign_header"
	| "campaign_left"
	| "campaign_right"
	| "content_middle"
	| "footer"
	| "sidebar"
	| "post_content_one"
	| "post_content_two"
	| "post_right"
	| "post_left";

export type AdDevice = "desktop" | "mobile" | "both";
export type AdItemType = "general" | "brand" | "category" | "campaign" | string;

export interface Ad {
	id: number;
	name: string;
	type: AdType;
	dimensions: string | null;
	position: AdPosition;
	image: string | null;
	link: string | null;
	code: string | null;
	item_type: AdItemType;
	device: AdDevice;
}
