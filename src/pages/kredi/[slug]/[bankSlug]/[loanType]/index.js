import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import LoanDetailContent from "@/components/common/loan/detail/LoanDetailContent";
import LoanDetailHeader from "@/components/common/loan/detail/LoanDetailHeader";
import { Layout } from "@/components/layouts/layout";
import { LOAN_TYPES, loanType } from "@/constants/loan";
import serverApiRequest from "@/lib/serverApiRequest";

export async function getServerSideProps(context) {
	const { slug, bankSlug } = context.params;
	const amount = Math.max(1000, parseInt(context.query.amount, 10) || 10000);
	const months = Math.min(36, Math.max(1, parseInt(context.query.maturity, 10) || 12));
	const bankId = context.query.bankId ? parseInt(context.query.bankId, 10) : null;

	const feLoanType = loanType[slug]; // personal | newCar | mortgage
	const apiLoanType = feLoanType === "newCar" ? "auto" : feLoanType;
	const loanTypeName =
		LOAN_TYPES.find((x) => x.type === feLoanType)?.name || feLoanType;

	let loan = null;

	if (bankId) {
		const calc = await serverApiRequest("/loans/calculations", "post", {
			amount,
			months,
			loan_type: apiLoanType,
			banks: [bankId],
		});

		const item = Array.isArray(calc?.data) ? calc.data[0] : null;
		if (!item?.bank) {
			return { notFound: true };
		}

		const details = item.loan_details || {};
		const interest = details.interest_rate ?? item?.bracket?.interestRate ?? 0;
		const monthly = details.monthly_payment ?? 0;
		const total = details.total_payment ?? 0;
		const principal = details.amount ?? amount;

		loan = {
			title: `${item.bank.name} - ${loanTypeName}`,
			loanType: { type: feLoanType, name: loanTypeName, slug },
			meta: calc?.meta || null,
			data: {
				bankId: item.bank.id,
				slug: item.bank.slug || bankSlug,
				name: item.bank.name,
				logo: item.bank.logo,
				redirect: null,
				loanType: feLoanType,
				loanAmount: principal,
				amount: principal,
				maturity: details.months ?? months,
				months: details.months ?? months,
				interest,
				monthlyInstallment: monthly,
				totalPayment: total,
				totalInterest: total - principal,
				bracket: item.bracket || null,
				approx: item?.bracket?.approx ?? false,
				paymentPlans: [],
			},
		};
	} else {
		const params = new URLSearchParams({ maturity: months, amount });
		loan = await serverApiRequest(
			`/loan/${feLoanType}/${bankSlug}/detail?${params.toString()}`,
			"get",
		);
	}

	return {
		props: {
			loan: loan,
		},
	};
}

export default function LoanIndex({ loan }) {
	const router = useRouter();
	const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;
	return (
		<Layout>
			<NextSeo
				title={`${loan.title} | Kampanyaradar`}
				description={`kampanyaradar`}
				canonical={canonical}
				openGraph={{
					url: canonical,
					title: `${loan.title} | Kampanya Radar`,
					description: "",
					siteName: "KampanyaRadar",
				}}
				twitter={{
					handle: "@handle",
					site: "@site",
					cardType: "summary_large_image",
				}}
			/>
			<LoanDetailHeader loan={loan}></LoanDetailHeader>
			<LoanDetailContent loan={loan}></LoanDetailContent>
		</Layout>
	);
}
