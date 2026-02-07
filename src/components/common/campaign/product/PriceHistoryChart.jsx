import { useMemo } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

function PriceHistoryTooltip({ active, payload, label, formatPrice }) {
	if (!active || !payload || payload.length === 0) return null;

	const point = payload[0];
	const value = point?.value;
	const numericValue =
		typeof value === "number" ? value : value ? Number(value) : null;

	return (
		<div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
			<p className="font-medium text-gray-900">{label}</p>
			<p className="text-orange-600 font-semibold text-base">
				{formatPrice(numericValue)} TL
			</p>
			<p className="text-xs text-gray-500 mt-1">Günün en düşük fiyatı</p>
		</div>
	);
}

export default function PriceHistoryChart({ apiPrices = [], formatPrice }) {
	const priceHistoryData = useMemo(() => {
		const minByDate = new Map();

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
			price: minByDate.get(d),
			ts: new Date(`${d}T00:00:00`).getTime(),
		}));
	}, [apiPrices]);

	if (!apiPrices.length || !priceHistoryData.length) return null;

	return (
		<Card className="bg-white rounded-xl border border-gray-100 shadow-sm">
			<CardContent className="p-5">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-1 h-5 bg-orange-500 rounded-full" />
					<h3 className="text-base font-semibold text-gray-900">
						Fiyat Geçmişi
					</h3>
				</div>

				<div className="w-full h-56">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={priceHistoryData}>
							<defs>
								<linearGradient
									id="priceGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#f97316"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="#f97316"
										stopOpacity={0.02}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f1f5f9"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tickFormatter={(value) =>
									new Intl.NumberFormat("tr-TR").format(value)
								}
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								tickLine={false}
								axisLine={false}
								width={65}
							/>
							<Tooltip
								content={
									<PriceHistoryTooltip formatPrice={formatPrice} />
								}
							/>
							<Area
								type="monotone"
								dataKey="price"
								stroke="#f97316"
								fill="url(#priceGradient)"
								strokeWidth={2.5}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
