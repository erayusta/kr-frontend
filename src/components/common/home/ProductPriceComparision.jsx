import { ArrowRightIcon, CheckIcon, SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiRequest from "@/lib/apiRequest";

const ResponsiveLine = dynamic(
	() => import("@nivo/line").then((m) => m.ResponsiveLine),
	{ ssr: false },
);

const ProductPriceComparision = () => {
	const [searchText, setSearchText] = useState("");
	const [items, setItems] = useState([]);
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const search = async () => {
		if (!searchText || searchText.trim() === "") {
			return;
		}

		setItems([]);
		setIsLoading(true);

		try {
			const response = await apiRequest(`/product?name=${searchText}`, "get");
			setItems(response || []);
		} catch (error) {
			console.error("Product search failed:", error);
			setItems([]);
		}

		setIsLoading(false);
	};

	const createChart = () => {
		if (!data) return [];

		const priceHistoryData = data.priceHistories;

		const filteredData = priceHistoryData.filter((item) => {
			const date = new Date(item.date);
			const sixMonthsAgo = new Date(date.getFullYear(), date.getMonth() - 5, 1);
			return date >= sixMonthsAgo;
		});

		const groupedData = {};
		filteredData.forEach((item) => {
			const date = new Date(item.date);
			const key = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}`;
			if (!groupedData[key]) {
				groupedData[key] = [];
			}
			groupedData[key].push(item);
		});

		const seriesData = [];
		Object.keys(groupedData).forEach((key) => {
			const group = groupedData[key];
			const prices = group.map((item) => item.storePrice);
			const averagePrice =
				prices.reduce((sum, price) => sum + price, 0) / prices.length;
			const month = new Date(group[0].date).toLocaleDateString("tr-TR", {
				month: "long",
				year: "numeric",
			});
			seriesData.push({ x: month, y: averagePrice.toFixed(2) });
		});

		return [
			{
				id: "Fiyat Geçmişi",
				data: seriesData,
			},
		];
	};

	const chartData = useMemo(createChart, [data]);

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
						id="input-group-search"
					/>
					<Button onClick={() => search()} size="icon">
						<SearchIcon className="w-5 h-5" />
					</Button>
				</div>

				{searchText && (
					<ul
						className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
						aria-labelledby="dropdownSearchButton"
					>
						{isLoading && (
							<div className="flex flex-col justify-center items-center space-x-4">
								<Skeleton className="h-12 bg-gray-100 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 bg-gray-100 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
								Ürün Sorgulanıyor...
							</div>
						)}
						{items.map((item) => (
							<li key={item?.title}>
								<div
									onClick={() => {
										setData(item);
										setSearchText("");
										setItems([]);
									}}
									className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
								>
									<img
										className="w-6 h-6 rounded-t-lg"
										src={item?.stores[0].image_link}
										alt=""
									/>
									<label className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
										{item?.title}
									</label>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
			{!searchText && data && (
				<div>
					<div className="flex items-center border-b dark:border-gray-800">
						<div className="flex justify-center mr-auto items-center gap-4">
							<img
								alt="Product Image"
								className="rounded-md"
								height={80}
								src={data?.cheapestSeller.image_link}
								style={{ aspectRatio: "80/80", objectFit: "cover" }}
								width={80}
							/>
							<div>
								<h3 className="font-semibold text-lg">{data?.title}</h3>
								<p className="text-gray-500 dark:text-gray-400">
									En Ucuz Fiyat:{data?.cheapestSeller.price} TL
								</p>
								<Button asChild className="mb-2">
									<Link
										href={`${data?.cheapestSeller.link}?utm_source=kampanyaradar&utm_medium=karsilastirma&utm_campaign=kampanyaradar-fiyat-karsilastirma`}
									>
										En Ucuz Mağazaya Git
									</Link>
								</Button>
							</div>
						</div>
					</div>
					<div className="mt-5">
						<div className={`grid grid-cols-${data.stores.length} `}>
							{data.stores.map((item, index) => (
								<Link
									key={item.id}
									href={`${item?.link}?utm_source=kampanyaradar&utm_medium=karsilastirma&utm_campaign=kampanyaradar-fiyat-karsilastirma`}
								>
									<div
										className={`${index == 0 ? "bg-gray-100" : ""} hover:bg-gray-100 flex w-[80%] relative  rounded-md items-center flex-col`}
									>
										{index === 0 && (
											<div className="absolute left-0 bg-green-500 rounded-full text-white  rounded-md text-xs font-medium">
												<CheckIcon size={18}></CheckIcon>
											</div>
										)}
										<img
											height={20}
											src={item.storeBrandLogo}
											alt={`${item.storeName || "Mağaza"} logosu`}
											style={{ aspectRatio: "40/40", objectFit: "contain" }}
											width={40}
										/>
										<p className="font-bold center text-xs md:text-md">
											{item?.price} TL
										</p>
										<div className="flex items-center space-x-2 ">
											<ArrowRightIcon className="h-5 w-5" />
										</div>
									</div>
								</Link>
							))}
						</div>
						<div className="w-full">
							<div className="h-[250px]">
								<ResponsiveLine
									data={chartData}
									margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
									xScale={{ type: "point" }}
									yScale={{
										type: "linear",
										min: "auto",
										max: "auto",
										stacked: true,
										reverse: false,
									}}
									axisTop={null}
									axisRight={null}
									axisBottom={{
										orient: "bottom",
										tickSize: 5,
										tickPadding: 5,
										tickRotation: 0,
										legend: "Tarih",
										legendOffset: 36,
										legendPosition: "middle",
									}}
									axisLeft={{
										orient: "left",
										tickSize: 5,
										tickPadding: 5,
										tickRotation: 0,
										legend: "Ortalama Fiyat (TL)",
										legendOffset: -40,
										legendPosition: "middle",
									}}
									colors={{ scheme: "nivo" }}
									pointSize={10}
									pointColor={{ theme: "background" }}
									pointBorderWidth={2}
									pointBorderColor={{ from: "serieColor" }}
									pointLabelYOffset={-12}
									useMesh={true}
									legends={[
										{
											anchor: "bottom-right",
											direction: "column",
											justify: false,
											translateX: 100,
											translateY: 0,
											itemsSpacing: 0,
											itemDirection: "left-to-right",
											itemWidth: 80,
											itemHeight: 20,
											itemOpacity: 0.75,
											symbolSize: 12,
											symbolShape: "circle",
											symbolBorderColor: "rgba(0, 0, 0, .5)",
											effects: [
												{
													on: "hover",
													style: {
														itemBackground: "rgba(0, 0, 0, .03)",
														itemOpacity: 1,
													},
												},
											],
										},
									]}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductPriceComparision;
