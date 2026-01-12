import apiRequest from "@/lib/apiRequest";
import { formatPrice } from "@/utils/priceUtils";

const FE_TO_API_LOAN_TYPE = {
	personal: "personal",
	newCar: "auto",
	mortgage: "mortgage",
};

const API_TO_FE_LOAN_TYPE = {
	personal: "personal",
	auto: "newCar",
	mortgage: "mortgage",
};

export function toApiLoanType(feLoanType) {
	return FE_TO_API_LOAN_TYPE[feLoanType] || feLoanType;
}

export function fromApiLoanType(apiLoanType) {
	return API_TO_FE_LOAN_TYPE[apiLoanType] || apiLoanType;
}

export function parseAmountToNumber(amount) {
	if (typeof amount === "number") return amount;
	if (typeof amount !== "string") return NaN;

	const cleaned = amount.replace(/[^\d]/g, "");
	if (!cleaned) return NaN;
	return Number(cleaned);
}

export function calculateLoanDetails({ amount, months, interestRate }) {
	const monthlyRate = interestRate / 100 / 12;
	const pow = Math.pow(1 + monthlyRate, months);

	if (!isFinite(pow) || pow === 1) {
		return {
			monthly_payment: amount / months,
			total_payment: amount,
		};
	}

	const monthlyPayment =
		(amount * (monthlyRate * pow)) / (pow - 1);
	const totalPayment = monthlyPayment * months;

	return {
		monthly_payment: monthlyPayment,
		total_payment: totalPayment,
	};
}

export async function postLoanCalculations({
	amount,
	months,
	loanType,
	bankIds,
}) {
	const payload = {
		amount,
		months,
		loan_type: toApiLoanType(loanType),
	};
	if (Array.isArray(bankIds) && bankIds.length > 0) {
		payload.banks = bankIds;
	}

	return apiRequest("/loans/calculations", "post", payload);
}

export function adaptLoanCalculationsResponseToOffers(response) {
	const items = Array.isArray(response?.data) ? response.data : [];
	const meta = response?.meta || null;

	const offers = items
		.map((item) => {
			const bank = item?.bank || {};
			const bracket = item?.bracket || {};
			const loanDetails = item?.loan_details || {};

			const amount = loanDetails.amount ?? meta?.amount;
			const months = loanDetails.months ?? meta?.maturity;
			const interestRate =
				loanDetails.interest_rate ?? bracket.interestRate;

			const computed = calculateLoanDetails({
				amount,
				months,
				interestRate,
			});

			const monthly_payment =
				loanDetails.monthly_payment ?? computed.monthly_payment;
			const total_payment =
				loanDetails.total_payment ?? computed.total_payment;

			return {
				id: bank.id,
				name: bank.name,
				slug: bank.slug,
				logo: bank.logo,
				redirect: item?.redirect ?? null,
				loanType: fromApiLoanType(bracket.loan_type),
				amount,
				maturity: months,
				interest: interestRate,
				monthlyPayment: formatPrice(monthly_payment, { fallback: "-" }),
				totalPayment: formatPrice(total_payment, { fallback: "-" }),
				_raw: item,
			};
		})
		.filter((x) => !!x?.id);

	return { offers, meta };
}
