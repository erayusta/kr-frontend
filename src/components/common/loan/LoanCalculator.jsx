
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LOAN_MATURIES, LOAN_TYPES, loanTypeSlug } from "@/constants/loan";
import {
	adaptLoanCalculationsResponseToOffers,
	parseAmountToNumber,
	postLoanCalculations,
} from "@/lib/loanCalculations";
import createNumberMask from "@/utils/createNumberMask";
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import MaskedInput from "react-text-mask";

const numberMask = createNumberMask({
	prefix: "",
	suffix: "",
	includeThousandsSeparator: true,
	thousandsSeparatorSymbol: ".",
	allowDecimal: true,
	decimalSymbol: ",",
	decimalLimit: 2,
	requireDecimal: false,
	allowNegative: false,
	allowLeadingZeroes: false,
	integerLimit: null,
});

function validateInputs(amount, maturity) {
	const parsedAmount = parseAmountToNumber(amount);
	const parsedMonths = parseInt(maturity, 10);

	if (!Number.isFinite(parsedAmount) || parsedAmount < 1000) {
		return { ok: false, message: "Kredi tutarı en az 1.000 olmalı." };
	}
	if (!Number.isInteger(parsedMonths) || parsedMonths < 1 || parsedMonths > 36) {
		return { ok: false, message: "Vade 1-36 ay aralığında olmalı." };
	}

	return { ok: true, parsedAmount, parsedMonths };
}

const LoanCalculateForm = ({
	loanType,
	amount,
	maturity,
	setAmount,
	setMaturity,
	onCalculate,
	isLoading,
}) => {
	const [error, setError] = useState(null);

	const handleCalculate = async () => {
		const validation = validateInputs(amount, maturity);
		if (!validation.ok) return setError({ message: validation.message });

		try {
			await onCalculate(String(validation.parsedAmount), String(validation.parsedMonths));
		} catch (err) {
			console.error("Failed to calculate loans:", err);
			setError({ message: "Kredi hesaplaması yapılırken bir hata oluştu." });
		}
	};

	if (error !== null) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Üzgünüm!</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
				<Button onClick={() => setError(null)} variant="ghost" className=" justify-end">
					Tekrar Dene
				</Button>
			</Alert>
		);
	}

	return (
		<Card className="p-6 space-y-6 mb-2">
			<div className="grid md:grid-cols-3 grid-cols-1 items-end gap-4">
				<div className="space-y-2">
					<Label className="text-sm md:text-md" htmlFor="amount">
						Kredi Tutarı
					</Label>
					<MaskedInput
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						mask={numberMask}
						id="amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
						placeholder="10.000"
						type="text"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-sm md:text-md" htmlFor="rate">
						Vade Süresi (Ay)
					</Label>
					<div className="flex items-center gap-2">
						<Select onValueChange={(value) => setMaturity(value)} value={maturity}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Vade Ay Seçiniz" />
							</SelectTrigger>
							<SelectContent position="popper">
								{(LOAN_MATURIES[loanType] || []).map((m) => (
									<SelectItem key={m} value={m.toString()}>
										{m} Ay
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{isLoading !== true ? (
					<Button onClick={handleCalculate} className="w-full">
						Kredi Hesapla
					</Button>
				) : (
					<Button className="w-full" disabled>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lütfen Bekleyin Teklifler
						Listeleniyor...
					</Button>
				)}
			</div>
		</Card>
	);
};

const LoanResultListItem = ({ data, index, loanType }) => {
	const router = useRouter();
	const detailHref =
		data?.slug
			? `/kredi/${loanTypeSlug[loanType]}/${data.slug}/detay?amount=${data?.amount}&maturity=${data?.maturity}&bankId=${data?.id}`
			: null;

	const redirectHref = typeof data?.redirect === "string" && data.redirect ? data.redirect : null;
	const clickHref = redirectHref || detailHref;
	const isClickable = Boolean(clickHref);

	const handleNavigate = () => {
		if (!clickHref) return;
		if (redirectHref) {
			window.location.assign(clickHref);
			return;
		}
		router.push(clickHref);
	};

	return (
		<div
			role={isClickable ? "button" : undefined}
			tabIndex={isClickable ? 0 : undefined}
			onKeyDown={
				isClickable
					? (e) => {
							if (e.key !== "Enter" && e.key !== " ") return;
							e.preventDefault();
							handleNavigate();
						}
					: undefined
			}
			onClick={
				isClickable
					? (e) => {
							if (e?.target?.closest?.("a,button")) return;
							handleNavigate();
						}
					: undefined
			}
			className={`space-y-4 bg-white ${index == 0 && "border-green-500"} border py-5 hover:border-2 hover:shadow-md relative px-3 group hover:gray-100  rounded-md border-gray-100 ${isClickable ? "cursor-pointer" : ""}`}
		>
			<div className="rounded-lg  md:flex-row flex flex-col gap-y-3 items-center justify-between">
				<div className="flex flex-col items-center space-x-2">
					{index == 0 && (
						<div className="absolute top-[-10px] left-0 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
							En Uygun Faiz
						</div>
					)}
					{data?.logo ? (
						<img width={100} className="object-fit" alt="Bank Logo" src={data.logo} />
					) : (
						<div className="w-[100px] h-[60px] bg-gray-200 flex items-center justify-center rounded">
							<span className="text-xs text-gray-400">{data?.name || "Logo"}</span>
						</div>
					)}
				</div>
				<div className="text-sm flex flex-row  gap-x-8 md:gap-x-20 items-center">
					<div>
						<p className="font-medium text-xs">Faiz Oranı</p>
						<p className="font-bold text-lg">%{data?.interest}</p>
					</div>
					<div>
						<p className="font-medium text-xs">Aylık Taksit</p>
						<p className="font-bold text-lg">{data?.monthlyPayment}</p>
					</div>
					<div className="hidden md:block">
						<p className="font-medium text-xs">Toplam Ödeme</p>
						<p className="font-bold text-lg">{data?.totalPayment}</p>
					</div>
				</div>
				<div className="flex items-center">
					<div className="flex items-center space-x-2 " onClick={(e) => e.stopPropagation()}>
						{detailHref ? (
							<Button asChild>
								<Link href={detailHref}>Kredi Detayı</Link>
							</Button>
						) : (
							<Button disabled>Kredi Detayı</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const LoanResultCard = ({ data, setResults, loanType }) => {
	return (
		<>
			{data?.offers?.length > 0 && (
				<Card className="mt-4 p-0 bg-transparent container w-full">
					<CardHeader className="flex flex-row items-center gap-x-2">
						<CardTitle className="font-bold">
							<Button onClick={() => setResults(null)} className="px-4 py-2" variant="outline">
								<ChevronLeft />
							</Button>
						</CardTitle>
						<CardTitle className="font-bold">{data.title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Tabs className="w-full" defaultValue="result-card">
							<TabsContent value="result-card">
								<div className="grid grid-cols-1 gap-y-2">
									{data?.offers?.map((item, index) => (
										<LoanResultListItem key={item.id || index} index={index} data={item} loanType={loanType} />
									))}
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			)}
		</>
	);
};

export default function LoanCalculator({ loan }) {
	const router = useRouter();
	const [results, setResults] = useState(null);
	const [loanType, setLoanType] = useState(loan?.loanType?.type || "personal");
	const [amount, setAmount] = useState("10000");
	const [maturity, setMaturity] = useState("12");
	const [isLoading, setLoading] = useState(false);
	const autoKeyRef = useRef("");

	const calculate = async (nextAmount = amount, nextMaturity = maturity) => {
		const validation = validateInputs(nextAmount, nextMaturity);
		if (!validation.ok) throw new Error(validation.message);

		setLoading(true);
		try {
			const response = await postLoanCalculations({
				amount: validation.parsedAmount,
				months: validation.parsedMonths,
				loanType,
			});
			const { offers, meta } = adaptLoanCalculationsResponseToOffers(response);
			setResults({
				title: meta?.month_label ? `${meta.month_label} Güncel Teklifler` : "Kredi Teklifleri",
				offers,
				meta,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!router.isReady) return;

		const qAmount = router.query.amount;
		const qMaturity = router.query.maturity;
		if (!qAmount || !qMaturity) return;

		const key = `${qAmount}_${qMaturity}_${loanType}`;
		if (autoKeyRef.current === key) return;
		autoKeyRef.current = key;

		const nextAmount = String(qAmount);
		const nextMaturity = String(qMaturity);

		setAmount(nextAmount);
		setMaturity(nextMaturity);
		calculate(nextAmount, nextMaturity).catch(() => {});
	}, [router.isReady, router.query.amount, router.query.maturity, loanType]);

	useEffect(() => {
		setLoanType(loan?.loanType?.type || "personal");
	}, [loan?.loanType?.type]);

	const offer = loan?.offers?.[0] || null;

	return (
		<>
			<Card className="bg-white">
				<CardHeader className="container">
					<CardTitle className="font-bold text-xl md:text-3xl md:w-[50%]">
						{loan?.page?.hero_title || "Kredi Hesaplama"}
					</CardTitle>
					<CardDescription className=" text-xs md:text-md">
						Güncel faiz oranları ile kredi hesaplama
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4  container relative grid grid-cols-1 md:grid-cols-2 ">
					<Tabs className="w-full bg-transparent" defaultValue={loanType}>
						<TabsList className="grid grid-cols-3 w-full">
							{LOAN_TYPES.map((lt) => (
								<TabsTrigger asChild key={lt.type} className="text-xs" value={lt.type}>
									<Link href={`/kredi/${lt.slug}`}>{lt.name}</Link>
								</TabsTrigger>
							))}
						</TabsList>

						{LOAN_TYPES.map((lt) => (
							<TabsContent key={lt.type} value={lt.type}>
								<LoanCalculateForm
									loanType={lt.type}
									amount={amount}
									maturity={maturity}
									setAmount={setAmount}
									setMaturity={setMaturity}
									onCalculate={calculate}
									isLoading={isLoading}
								/>
								{offer && !results?.offers?.length && (
									<div className="hidden md:block bg-white border py-5 relative px-3 rounded-md border-gray-100">
										<div className="rounded-lg flex flex-row items-center justify-between">
											<div className="flex flex-col items-center space-x-2">
												{offer?.logo ? (
													<img width={100} className="object-fit" alt="Bank Logo" src={offer.logo} />
												) : (
													<div className="w-[100px] h-[60px] bg-gray-200 flex items-center justify-center rounded">
														<span className="text-xs text-gray-400">{offer?.name || "Logo"}</span>
													</div>
												)}
											</div>
											<div className="text-sm flex flex-row gap-x-8 items-center">
												<div>
													<p className="font-medium text-xs">Faiz Oranı</p>
													<p className="font-bold text-lg">%{offer?.interest}</p>
												</div>
												<div>
													<p className="font-medium text-xs">Aylık Taksit</p>
													<p className="font-bold text-lg">{offer?.monthlyPayment}</p>
												</div>
												<div className="hidden md:block">
													<p className="font-medium text-xs">Toplam Ödeme</p>
													<p className="font-bold text-lg">{offer?.totalPayment}</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>

			{results?.offers?.length > 0 && (
				<LoanResultCard setResults={setResults} data={results} loanType={loanType} />
			)}
		</>
	);
}
