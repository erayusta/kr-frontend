
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
import { AlertCircle, ArrowRightIcon, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "@/utils/createNumberMask";

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

const LoanCalculateForm = ({
	loanType,
	handleSetResults,
	handleSetAmount,
	handleSetMaturity,
	amount,
	maturity,
}) => {
	const [error, setError] = useState(null);
	const [isLoading, setLoading] = useState(false);

	const handleGetOffers = async () => {
		const parsedAmount = parseAmountToNumber(amount);
		const parsedMonths = parseInt(maturity, 10);

		if (!Number.isFinite(parsedAmount) || parsedAmount < 1000) {
			return setError({ message: "Kredi tutarı en az 1.000 olmalı." });
		}

		if (!Number.isInteger(parsedMonths) || parsedMonths < 1 || parsedMonths > 36) {
			return setError({ message: "Vade 1-36 ay aralığında olmalı." });
		}

		setLoading(true);
		try {
			const response = await postLoanCalculations({
				amount: parsedAmount,
				months: parsedMonths,
				loanType,
			});
			const { offers } = adaptLoanCalculationsResponseToOffers(response);
			handleSetResults(offers.slice(0, 4));
		} catch (err) {
			console.error("Failed to calculate loans:", err);
			setError({ message: "Kredi hesaplaması yapılırken bir hata oluştu." });
		} finally {
			setLoading(false);
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
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="amount">Kredi Tutarı</Label>
					<MaskedInput
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						mask={numberMask}
						id="amount"
						value={amount}
						onChange={(e) => handleSetAmount(e.target.value)}
						placeholder="10.000"
						type="text"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="rate">Vade Süresi (Ay)</Label>
					<div className="flex items-center gap-2">
						<Select onValueChange={(value) => handleSetMaturity(value)} value={maturity}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Vade Ay Seçiniz" />
							</SelectTrigger>
							<SelectContent position="popper">
								{(LOAN_MATURIES[loanType] || []).map((month) => (
									<SelectItem key={month} value={month.toString()}>
										{month} Ay
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

				{isLoading !== true ? (
					<Button onClick={() => handleGetOffers()} className="w-full text-white transition-colors duration-200 hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-primary/40">
						Kredi Hesapla
					</Button>
				) : (
					<Button className="w-full text-white" disabled>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lütfen Bekleyin Teklifler
						Listeleniyor...
					</Button>
				)}
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
			className={`border py-3 px-5 md:px-5 relative group hover:bg-gray-100  ${
				index == 0 ? "border-2 border-green-500" : "bg-white"
			}  rounded-md border-gray-100 ${isClickable ? "cursor-pointer" : ""}`}
		>
			<div className="rounded-lg flex md:flex-row flex-col  md:items-center items-start justify-between">
				<div className="flex flex-col md:mb-0mb-3  md:items-center items-start space-x-2">
					{index == 0 && (
						<div className="absolute top-[-10%] left-0 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
							En Uygun Faiz
						</div>
					)}
					{data?.logo ? (
						<img className="object-fit " width={70} height={50} alt="Bank Logo" src={data.logo} />
					) : (
						<div className="w-[70px] h-[50px] bg-gray-200 flex items-center justify-center rounded">
							<span className="text-xs text-gray-400">{data?.name || "Logo"}</span>
						</div>
					)}
				</div>
				<div className="text-sm flex flex-row gap-x-6 md:gap-x-8 items-center ">
					<div>
						<p className="font-medium text-xs">Faiz Oranı</p>
						<p className="font-bold text-sm md:text-lg">%{data?.interest}</p>
					</div>
					<div>
						<p className="font-medium text-xs">Aylık Taksit</p>
						<p className="font-bold text-sm md:text-lg">{data?.monthlyPayment}</p>
					</div>
					<div>
						<p className="font-medium text-xs">Toplam Ödeme</p>
						<p className="font-bold text-sm md:text-lg">{data?.totalPayment}</p>
					</div>
					<div className="flex items-center space-x-2 flex md:hidden">
						{clickHref ? (
							redirectHref ? (
								<a
									className="text-gray-600 flex items-center space-x-2"
									href={redirectHref}
									rel="nofollow noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
								>
									<ArrowRightIcon className="h-5 w-5" />
								</a>
							) : (
								<Link
									className="text-gray-600 flex items-center space-x-2"
									href={detailHref}
									onClick={(e) => e.stopPropagation()}
								>
									<ArrowRightIcon className="h-5 w-5" />
								</Link>
							)
						) : (
							<span className="text-gray-300 flex items-center space-x-2">
								<ArrowRightIcon className="h-5 w-5" />
							</span>
						)}
					</div>
				</div>
				<div className="flex items-center space-x-2 hidden  md:flex">
					{clickHref ? (
						redirectHref ? (
							<a
								className="text-gray-600 flex items-center space-x-2"
								href={redirectHref}
								rel="nofollow noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
							>
								<ArrowRightIcon className="h-5 w-5" />
							</a>
						) : (
							<Link
								className="text-gray-600 flex items-center space-x-2"
								href={detailHref}
								onClick={(e) => e.stopPropagation()}
							>
								<ArrowRightIcon className="h-5 w-5" />
							</Link>
						)
					) : (
						<span className="text-gray-300 flex items-center space-x-2">
							<ArrowRightIcon className="h-5 w-5" />
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

const LoanResultCard = ({ data, setResults, loanType }) => {
	return (
		<Card className="px-1">
			<CardHeader className="flex flex-row items-center gap-x-2">
				<CardTitle className="font-bold">
					<Button onClick={() => setResults([])} className="px-4 py-2" variant="outline">
						<ChevronLeft />
					</Button>
				</CardTitle>
				<CardTitle className="font-bold text-md md:text-xl">Kredi Hesaplama Sonuçları</CardTitle>
			</CardHeader>
			<CardContent className="p-0 space-y-4">
				<Tabs className="w-full max-w-3xl" defaultValue="result-card">
					<TabsContent value="result-card">
						<div className="grid grid-cols-1 gap-y-2 ">
							{Array.isArray(data) &&
								data
									.filter((item) => item !== null)
									.map((item, index) => (
										<LoanResultListItem
											key={item.id || index}
											index={index}
											data={item}
											loanType={loanType}
										/>
									))}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default function LoanCalculator() {
	const [results, setResults] = useState([]);
	const [loanType, setLoanType] = useState("personal");
	const [offer, setOffer] = useState({});
	const [amount, setAmount] = useState("10000");
	const [maturity, setMaturity] = useState("12");

	const handleGetFirstOffer = async (nextLoanType = loanType) => {
		try {
			const response = await postLoanCalculations({
				amount: 10000,
				months: 12,
				loanType: nextLoanType,
			});
			const { offers } = adaptLoanCalculationsResponseToOffers(response);
			setOffer(offers[0] || {});
		} catch (err) {
			console.error("Failed to calculate loans:", err);
		}
	};

	useEffect(() => {
		handleGetFirstOffer();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSetAmount = (value) => {
		setAmount(value.replace(/[^0-9.]/g, ""));
	};

	const handleSetMaturity = (value) => {
		setMaturity(value);
	};

	const handleLoanTabChange = async (value) => {
		setLoanType(value);
		await handleGetFirstOffer(value);
	};

	const handleSetResults = (data) => {
		setResults(data);
	};

	return (
		<>
			{results?.length <= 0 ? (
				<Card className="mt-4 p-0">
					<CardHeader>
						<CardTitle className="font-bold md:text-xl text-md">Kredi Hesaplama</CardTitle>
						<CardDescription>Güncel faiz oranları ile kredi hesaplama</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 p-0 md:p-3">
						<Tabs className="w-full max-w-3xl" defaultValue="personal">
							<TabsList className="grid grid-cols-3 w-full rounded-full bg-gray-100 p-1">
								{LOAN_TYPES.map((loan) => (
									<TabsTrigger
										className="md:text-md text-xs rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
										onClick={() => handleLoanTabChange(loan.type)}
										key={loan.type}
										value={loan.type}
									>
										{loan.name}
									</TabsTrigger>
								))}
							</TabsList>
							{LOAN_TYPES.map((loan) => (
								<TabsContent key={loan.type} value={loan.type}>
									<LoanCalculateForm
										amount={amount}
										maturity={maturity}
										handleSetAmount={handleSetAmount}
										handleSetMaturity={handleSetMaturity}
										handleSetResults={handleSetResults}
										loanType={loan.type}
									/>
									<LoanResultListItem loanType={loanType} data={offer} />
								</TabsContent>
							))}
						</Tabs>
					</CardContent>
				</Card>
			) : (
				<>
					<LoanResultCard setResults={setResults} data={results} loanType={loanType} />
					<Button asChild className="w-full mt-3 justify-center text-white transition-colors duration-200 hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-primary/40">
						<Link
							href={`/kredi/${loanTypeSlug[loanType]}?amount=${parseAmountToNumber(
								amount,
							)}&maturity=${maturity}`}
						>
							Daha Fazla Teklif Göster
						</Link>
					</Button>
				</>
			)}
		</>
	);
}
