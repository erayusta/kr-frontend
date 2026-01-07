import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import apiRequest from "@/lib/apiRequest";

type ProductStore = {
	storeBrand?: string | null;
	store_brand?: string | null;
	storeId?: string | number | null;
	store_id?: string | number | null;
	store?: string | null;
	storeName?: string | null;
	store_name?: string | null;
	link?: string | null;
};

type RawProduct = {
	id?: number | string | null;
	gtin?: string | null;
	title?: string | null;
	name?: string | null;
	image?: string | null;
	image_link?: string | null;
	stores?: ProductStore[] | null;
};

type Product = {
	id: number | string | null;
	title: string;
	gtin: string | null;
	image: string | null;
	stores: ProductStore[];
};

type ApiPricePoint = {
	date: string;
	store: string;
	price: number;
};

type ApiPricesResponse = {
	prices?: ApiPricePoint[];
};

type StoreLatest = {
	store: string;
	price: number;
	date: string;
	link: string | null;
};

type PriceHistoryDatum = {
	date: string;
	price: number;
	ts: number;
};

type PriceHistoryTooltipProps = {
	active?: boolean;
	label?: string;
	payload?: Array<{ value?: number }>;
};

const STORE_LABELS: Record<string, string> = {
	migros: "Migros",
	sok: "Şok",
	a101: "A101",
	carrefour: "Carrefour",
};

function formatPrice(price: number) {
	return new Intl.NumberFormat("tr-TR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
}

function PriceHistoryTooltip({
	active,
	payload,
	label,
}: PriceHistoryTooltipProps) {
	const val = payload?.[0]?.value;
	if (!active || !Number.isFinite(val)) return null;

	return (
		<div className="bg-white p-3 rounded-lg shadow-md border text-sm">
			<p className="font-medium">{label}</p>
			<p className="text-orange-600 font-semibold">{formatPrice(val)} TL</p>
			<p className="text-xs text-gray-500 mt-1">Günün en düşük fiyatı</p>
		</div>
	);
}

function normalizeProduct(raw: unknown): Product | null {
	if (!raw || typeof raw !== "object") return null;
	const p = raw as RawProduct;

	return {
		id: p.id ?? p.gtin ?? p.title ?? p.name ?? null,
		title: p.title ?? p.name ?? "",
		gtin: p.gtin ?? null,
		image: p.image_link ?? p.image ?? null,
		stores: Array.isArray(p.stores) ? p.stores : [],
	};
}

function findStoreLink(
	stores: ProductStore[],
	storeCode: string,
): string | null {
	const code = storeCode.toLowerCase();

	const direct = stores.find((s) => {
		const storeBrand = String(
			s?.storeBrand ?? s?.store_brand ?? "",
		).toLowerCase();
		const storeId = String(
			s?.storeId ?? s?.store_id ?? s?.store ?? "",
		).toLowerCase();
		const storeName = String(s?.storeName ?? s?.store_name ?? "").toLowerCase();
		return storeBrand === code || storeId === code || storeName.includes(code);
	});

	return direct?.link ? String(direct.link) : null;
}

export default function ProductPriceComparision() {
	const searchInputId = useId();

	const [searchText, setSearchText] = useState("");
	const [items, setItems] = useState<RawProduct[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [apiPrices, setApiPrices] = useState<ApiPricePoint[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [apiLoading, setApiLoading] = useState(false);

	useEffect(() => {
		const q = searchText.trim();
		if (q.length < 2) {
			setItems([]);
			setIsSearching(false);
			return;
		}

		let cancelled = false;
		const timeoutId = setTimeout(async () => {
			setIsSearching(true);
			try {
				const response = await apiRequest(
					`/product?name=${encodeURIComponent(q)}`,
					"get",
				);
				const list = Array.isArray((response as { data?: unknown })?.data)
					? ((response as { data: RawProduct[] }).data ?? [])
					: Array.isArray(response)
						? (response as RawProduct[])
						: [];

				if (!cancelled) setItems(list);
			} catch (error) {
				console.error("Product search failed:", error);
				if (!cancelled) setItems([]);
			} finally {
				if (!cancelled) setIsSearching(false);
			}
		}, 350);

		return () => {
			cancelled = true;
			clearTimeout(timeoutId);
		};
	}, [searchText]);

	useEffect(() => {
		const gtin = selectedProduct?.gtin;
		if (!gtin) {
			setApiPrices([]);
			setApiLoading(false);
			return;
		}

		const controller = new AbortController();

		(async () => {
			try {
				setApiLoading(true);
				setApiPrices([]);

				const res = await fetch(
					`https://kr.erusoft.com/api/v1/products/${encodeURIComponent(gtin)}/prices`,
					{
						method: "GET",
						signal: controller.signal,
						headers: { Accept: "application/json" },
					},
				);

				if (!res.ok) throw new Error(`Prices API error: ${res.status}`);

				const data = (await res.json()) as ApiPricesResponse;
				setApiPrices(Array.isArray(data?.prices) ? data.prices : []);
			} catch (err) {
				if ((err as { name?: string })?.name === "AbortError") return;
				console.error("Prices API fetch failed:", err);
				setApiPrices([]);
			} finally {
				setApiLoading(false);
			}
		})();

		return () => controller.abort();
	}, [selectedProduct?.gtin]);

	const apiStoresLatest = useMemo<StoreLatest[]>(() => {
		const byStore = new Map<string, ApiPricePoint>();

		for (const p of apiPrices) {
			if (!p?.store || !p?.date) continue;
			const priceNum = Number(p.price);
			if (!Number.isFinite(priceNum) || priceNum <= 0) continue;

			const prev = byStore.get(p.store);
			if (!prev) {
				byStore.set(p.store, p);
				continue;
			}
			if (p.date > prev.date) byStore.set(p.store, p);
		}

		const stores = selectedProduct?.stores ?? [];
		return Array.from(byStore.values())
			.map((p) => ({
				store: p.store,
				price: Number(p.price),
				date: p.date,
				link: findStoreLink(stores, p.store),
			}))
			.sort((a, b) => a.price - b.price);
	}, [apiPrices, selectedProduct?.stores]);

	const cheapestSeller = apiStoresLatest[0] ?? null;

	const priceHistoryData = useMemo<PriceHistoryDatum[]>(() => {
		const minByDate = new Map<string, number>();

		for (const p of apiPrices) {
			if (!p?.date) continue;
			const priceNum = Number(p.price);
			if (!Number.isFinite(priceNum) || priceNum <= 0) continue;

			const cur = minByDate.get(p.date);
			if (cur === undefined || priceNum < cur) minByDate.set(p.date, priceNum);
		}

		const sortedDates = Array.from(minByDate.keys()).sort();

		return sortedDates.map((d) => ({
			date: new Date(`${d}T00:00:00`).toLocaleDateString("tr-TR", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}),
			price: minByDate.get(d) ?? 0,
			ts: new Date(`${d}T00:00:00`).getTime(),
		}));
	}, [apiPrices]);

	return (
		<div className="w-full max-w-4xl mx-auto bg-white rounded-lg dark:bg-gray-950">
			<div className="flex-1">
				<div className="flex items-center mb-4">
					<Input
						className="flex-1 mr-4 bg-gray-100 dark:bg-gray-800 border-none focus:ring-0 focus:border-none"
						placeholder="Ürün Ara..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						type="text"
						id={searchInputId}
					/>
				</div>

				{searchText.trim().length >= 2 && (
					<ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
						{isSearching && (
							<div className="flex flex-col justify-center items-center space-x-4">
								<Skeleton className="h-12 bg-gray-100 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 bg-gray-100 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
								Ürün sorgulanıyor...
							</div>
						)}
						{items.map((rawItem, idx) => {
							const item = normalizeProduct(rawItem);
							if (!item) return null;

							return (
								<li key={item.gtin || item.id || `${item.title}-${idx}`}>
									<button
										type="button"
										onClick={() => {
											setSelectedProduct(item);
											setSearchText("");
											setItems([]);
										}}
										className="w-full text-left flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
									>
										{item.image ? (
											<Image
												className="w-6 h-6 rounded"
												src={item.image}
												alt={item.title}
												width={24}
												height={24}
												unoptimized
											/>
										) : null}
										<span className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
											{item.title}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			{!searchText && selectedProduct && (
				<div>
					<div className="flex items-center border-b dark:border-gray-800">
						<div className="flex justify-center mr-auto items-center gap-4">
							{selectedProduct.image ? (
								<Image
									alt={selectedProduct.title}
									className="rounded-md"
									height={80}
									src={selectedProduct.image}
									style={{ aspectRatio: "80/80", objectFit: "cover" }}
									width={80}
									unoptimized
								/>
							) : null}
							<div>
								<h3 className="font-semibold text-lg">
									{selectedProduct.title}
								</h3>
								<p className="text-gray-500 dark:text-gray-400">
									{apiLoading
										? "Fiyatlar yükleniyor..."
										: cheapestSeller
											? `En Ucuz Fiyat: ${cheapestSeller.price} TL (${STORE_LABELS[cheapestSeller.store] || cheapestSeller.store})`
											: "Fiyat bilgisi yok."}
								</p>
							</div>
						</div>
					</div>

					<div className="mt-5 space-y-5">
						{apiStoresLatest.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">
									{apiStoresLatest.length} Adet Fiyat Bulundu
								</h3>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{apiStoresLatest.map((item, index) => {
										const content = (
											<>
												{index === 0 && (
													<div className="absolute left-0 bg-green-500 rounded-full text-white text-xs font-medium">
														<CheckIcon size={18} />
													</div>
												)}
												<p className="text-xs text-gray-600 dark:text-gray-300">
													{STORE_LABELS[item.store] || item.store}
												</p>
												<p className="font-bold center text-xs md:text-md">
													{item.price} TL
												</p>
											</>
										);

										const className = `${index === 0 ? "bg-gray-100" : ""} hover:bg-gray-100 flex relative rounded-md items-center flex-col p-2 ${item.link ? "cursor-pointer" : ""}`;

										return item.link ? (
											<a
												key={item.store}
												href={item.link}
												target="_blank"
												rel="noopener noreferrer"
												className={className}
											>
												{content}
											</a>
										) : (
											<div key={item.store} className={className}>
												{content}
											</div>
										);
									})}
								</div>
							</div>
						)}

						{apiPrices.length > 0 && (
							<div className="bg-transparent rounded-xl border border-gray-100 p-4">
								<h3 className="text-sm font-semibold text-gray-900 mb-3">
									Fiyat Geçmişi
								</h3>

								{priceHistoryData.length > 0 ? (
									<div className="w-full h-48">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={priceHistoryData}>
												<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
												<XAxis
													dataKey="date"
													tick={{ fontSize: 11 }}
													tickLine={{ stroke: "#9ca3af" }}
												/>
												<YAxis
													tickFormatter={(value: number) =>
														new Intl.NumberFormat("tr-TR").format(value)
													}
													tick={{ fontSize: 12 }}
													tickLine={{ stroke: "#9ca3af" }}
												/>
												<Tooltip content={<PriceHistoryTooltip />} />
												<Area
													type="monotone"
													dataKey="price"
													stroke="#f97316"
													fill="#f97316"
													strokeWidth={2}
													fillOpacity={0.25}
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>
								) : (
									<p className="text-gray-500 text-sm">
										Grafik için geçerli fiyat bulunamadı.
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
