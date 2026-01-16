import { formatPrice } from "@/utils/loan";

function toFiniteNumber(value) {
	const numberValue = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(numberValue) ? numberValue : null;
}

function formatPercent(value) {
	const numberValue = toFiniteNumber(value);
	if (numberValue === null) return null;

	const formatted = new Intl.NumberFormat("tr-TR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numberValue);

	return `%${formatted}`;
}

export default function LoanApplicationPlan({ data }) {
	if (!data) return null;

	const loanType = data?.loanType;
	const loanAmount = toFiniteNumber(data?.loanAmount ?? data?.amount);
	const totalPayment = toFiniteNumber(data?.totalPayment);
	const totalInterest =
		toFiniteNumber(data?.totalInterest) ??
		(loanAmount !== null && totalPayment !== null ? totalPayment - loanAmount : null);

	const tahsisUcreti =
		data?.slug === "enpara"
			? 0
			: loanAmount !== null
				? loanAmount * (0.57 / 100)
				: null;

	const items = [
		{ label: "Faiz Oranı", value: formatPercent(data?.interest) },
		{ label: "Toplam Faiz", value: totalInterest !== null ? formatPrice(totalInterest) : null },
		{ label: "Tahsis Ücreti", value: tahsisUcreti !== null ? formatPrice(tahsisUcreti) : null },
		{
			label: "Aylık Taksit",
			value:
				toFiniteNumber(data?.monthlyInstallment) !== null
					? formatPrice(data.monthlyInstallment)
					: null,
		},
		{ label: "Toplam Ödeme", value: totalPayment !== null ? formatPrice(totalPayment) : null },
		...(loanType === "mortgage"
			? [
					{
						label: "Ekspertiz Ücreti",
						value:
							toFiniteNumber(data?.expertiseFee) !== null ? formatPrice(data.expertiseFee) : null,
					},
					{
						label: "Taşınmaz Rehin Ücreti",
						value:
							toFiniteNumber(data?.mortgageFee) !== null ? formatPrice(data.mortgageFee) : null,
					},
				]
			: loanType === "newCar"
				? [
						{
							label: "Rehin Ücreti",
							value:
								toFiniteNumber(data?.orignationFee) !== null
									? formatPrice(data.orignationFee)
									: null,
						},
					]
				: []),
	].filter((x) => typeof x.value === "string" && x.value.trim() !== "");

	return (
		<div className="w-full">
			<div className="divide-y">
				{items.map((item) => (
					<div key={item.label} className="flex items-center justify-between py-3">
						<p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
						<p className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">{item.value}</p>
					</div>
				))}
			</div>
		</div>
	);
}
