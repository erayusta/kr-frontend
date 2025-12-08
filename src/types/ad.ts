export type AdType = "html" | "image";

export type AdPosition =
	| "home_header"
	| "home_left"
	| "home_right"
	| "category_header"
	| "brand_header"
	| "campaign_header"
	| "content_middle"
	| "footer"
	| "sidebar";

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
