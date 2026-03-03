import { Tag, Store } from "lucide-react";
import { IMAGE_BASE_URL } from "@/constants/site";

export default function HotspotPopover({ hotspot }) {
	if (!hotspot) return null;

	const getImageUrl = (url) => {
		if (!url) return null;
		if (url.startsWith("http")) return url;
		return `${IMAGE_BASE_URL}/${url}`;
	};

	const formatPrice = (price, currency = "TRY") => {
		if (!price) return null;
		return new Intl.NumberFormat("tr-TR", {
			style: "currency",
			currency,
			minimumFractionDigits: 2,
		}).format(price);
	};

	const imageUrl = getImageUrl(hotspot.image_url);

	return (
		<div className="w-56 p-0">
			{imageUrl && (
				<div className="aspect-square w-full bg-gray-50 rounded-t-md overflow-hidden">
					{/* biome-ignore lint/performance/noImgElement: CDN URL */}
					<img
						src={imageUrl}
						alt={hotspot.title || "Ürün"}
						className="w-full h-full object-contain p-2"
					/>
				</div>
			)}

			<div className="p-3 space-y-1.5">
				{hotspot.title && (
					<p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
						{hotspot.title}
					</p>
				)}

				{hotspot.brand && (
					<div className="flex items-center gap-1.5 text-xs text-gray-500">
						<Tag className="h-3 w-3 flex-shrink-0" />
						<span>{hotspot.brand}</span>
					</div>
				)}

				{hotspot.store_brand && (
					<div className="flex items-center gap-1.5 text-xs text-gray-500">
						<Store className="h-3 w-3 flex-shrink-0" />
						<span>{hotspot.store_brand}</span>
					</div>
				)}

				{hotspot.snapshot_price && (
					<div className="pt-1.5 border-t border-gray-100">
						<p className="text-lg font-bold text-orange-600">
							{formatPrice(hotspot.snapshot_price, hotspot.currency)}
						</p>
						{hotspot.snapshot_date && (
							<p className="text-[10px] text-gray-400">
								{hotspot.snapshot_date} tarihli fiyat
							</p>
						)}
					</div>
				)}

				{hotspot.note && (
					<p className="text-xs text-gray-600 italic bg-gray-50 p-1.5 rounded">
						{hotspot.note}
					</p>
				)}
			</div>
		</div>
	);
}
