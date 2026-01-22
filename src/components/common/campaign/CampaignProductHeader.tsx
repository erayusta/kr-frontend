import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock12Icon, HeartIcon, Share2Icon } from "lucide-react";
import { getIcon } from "@/lib/utils";
import { useFavorite } from "@/hooks/useFavorite";

type CampaignBrand = { logo?: string; name?: string };
type CampaignCategory = { id?: string | number; name?: string };

type Campaign = {
	id?: string | number;
	_id?: string | number;
	slug?: string;
	title?: string;
	image?: string;
	link?: string | null;
	start_date?: string;
	end_date?: string;
	endDate?: string;
	brands?: CampaignBrand[];
	categories?: CampaignCategory[];
	product?: unknown;
	item?: unknown;
};

type Store = {
	storeBrand?: string;
	link?: string | null;
	stock_availability?: string;
	price?: number | string | null;
	[key: string]: unknown;
};

type PriceEntry = {
	store?: string;
	price?: number | string | null;
	[key: string]: unknown;
};

export default function CampaignProductHeader({ campaign }: { campaign: Campaign }) {
	const getImageUrl = (image?: string) => {
		if (!image)
			return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800";
		if (image.startsWith("http")) return image;
		return image;
	};

	const calculateRemainingDays = (endDate) => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diff = Math.ceil(
			(end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);
		return diff;
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const remainingDays = calculateRemainingDays(
		campaign.end_date || campaign.endDate,
	);

	const productData = (campaign?.product || campaign?.item || {}) as {
		stores?: unknown;
		latest_prices?: unknown;
		latestPrices?: unknown;
	};
	const stores: Store[] = Array.isArray(productData?.stores)
		? (productData.stores as Store[])
		: [];
	const latestPrices: PriceEntry[] = Array.isArray(productData?.latest_prices)
		? (productData.latest_prices as PriceEntry[])
		: Array.isArray(productData?.latestPrices)
			? (productData.latestPrices as PriceEntry[])
			: [];

	const storeByBrand = new Map<string, Store>(
		stores
			.filter((s) => typeof s?.storeBrand === "string" && s.storeBrand.length > 0)
			.map((s) => [s.storeBrand as string, s]),
	);

	const latestStores: Store[] =
		latestPrices.length > 0
			? latestPrices
					.filter((p) => typeof p?.store === "string" && p.store.length > 0)
					.map((p) => {
						const storeBrand = p.store as string;
						const matchedStore = storeByBrand.get(storeBrand);
						const priceNum = Number(p.price);

						return {
							...(matchedStore || {}),
							storeBrand,
							price: Number.isFinite(priceNum) ? priceNum : null,
							link: matchedStore?.link || campaign?.link || null,
							stock_availability:
								matchedStore?.stock_availability ||
								(priceNum > 0 ? "in stock" : "out of stock"),
						};
					})
			: stores;

	const lowestPrice = latestStores
		.filter((s) => {
			const priceNum = Number(s?.price);
			const isInStock =
				typeof s?.stock_availability === "string"
					? s.stock_availability === "in stock"
					: true;
			return Number.isFinite(priceNum) && priceNum > 0 && isInStock;
		})
		.sort((a, b) => Number(a.price) - Number(b.price))[0];

	const brandLogo = campaign?.brands?.[0]?.logo;
	const brandName = campaign?.brands?.[0]?.name;
	const categories = campaign?.categories || [];
	const priceSourceCount =
		latestPrices.length > 0 ? latestPrices.length : stores.length;

	const favoriteId = campaign?.id ?? campaign?._id ?? campaign?.slug;
	const { isFavorite, toggle, canToggle } = useFavorite("campaign", favoriteId);

	const formatPrice = (price) => {
		if (!price) return "";
		return new Intl.NumberFormat("tr-TR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

    // tweet link
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(campaign.title || "")}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/kampanya/${campaign.slug}`)}`;

    return (
        <section className="w-full py-3 shadow bg-white dark:bg-gray-800">
            <div className="xl:mx-auto xl:px-36">
                <div className="container px-4">
                    <div className="flex gap-x-3 items-center justify-between">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                {campaign.brands?.[0] && (
                                    <Link href={`/marka/${(campaign.brands[0].name || "").toLowerCase()}`}>
                                        <span className="inline-block rounded-md bg-gray-100 hover:shadow-md px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">
                                            <Image src={campaign.brands[0].logo || ""} alt={campaign.brands[0].name || "Marka"} width={96} height={32} className="h-8 w-auto object-contain" />
                                        </span>
                                    </Link>
                                )}
                                <h1 className="md:text-3xl text-xl w-[85%] font-bold tracking-tighter text-gray-900 dark:text-white">{campaign.title}</h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button size="sm" variant="outline">
                                    <Clock12Icon className="mr-2 h-4 w-4" />
                                    {remainingDays !== null && remainingDays < 0 ? "Süresi Doldu" : `${remainingDays ?? ""} Gün Kaldı`}
                                </Button>

                                {categories?.[0]?.name && (
                                    <div className="text-sm items-center flex text-gray-500 dark:text-gray-400">
                                        <Button asChild size="sm" variant="outline" className="items-center flex gap-4">
                                            <Link href="#">
                                                <span className="text-md" dangerouslySetInnerHTML={{ __html: getIcon(String(categories[0].name)) }} />
                                                <span>{String(categories[0].name).length > 20 ? `${String(categories[0].name).slice(0, 10)}...` : String(categories[0].name)}</span>
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex md:flex-row flex-col items-center gap-3">
                            <Button disabled={!canToggle} onClick={toggle} variant="secondary" className={`rounded-full hover:bg-orange-500 hover:text-white py-3 ${isFavorite ? "bg-orange-500 text-white" : ""}`}>
                                <HeartIcon className="mr-2 h-5 w-5" /> <span className="md:block hidden">Kaydet</span>
                            </Button>
                            <Button asChild variant="secondary" className="rounded-full hover:bg-orange-500 hover:text-white py-3">
                                <a target="_blank" rel="noopener noreferrer" href={tweetUrl}>
                                    <Share2Icon className="mr-2 h-5 w-5" />
                                    <span className="md:block hidden">Paylaş</span>
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


