import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LoanPaymentPlansTable } from "./LoanPaymentPlansTable";

function buildPaymentPlan({
	amount,
	months,
	annualInterestRate,
	monthlyInstallment,
}) {
	const principal = Number(amount);
	const n = Number(months);
	const yearlyRate = Number(annualInterestRate);

	if (!Number.isFinite(principal) || principal <= 0) return [];
	if (!Number.isInteger(n) || n <= 0) return [];
	if (!Number.isFinite(yearlyRate) || yearlyRate < 0) return [];

	const r = yearlyRate / 100 / 12; // annual -> monthly
	let installment = Number(monthlyInstallment);

	if (!Number.isFinite(installment) || installment <= 0) {
		if (r === 0) installment = principal / n;
		else {
			const pow = Math.pow(1 + r, n);
			installment = (principal * (r * pow)) / (pow - 1);
		}
	}

	let remaining = principal;
	const plan = [];

	for (let period = 1; period <= n; period += 1) {
		const interest = r === 0 ? 0 : remaining * r;
		let principalPayment = installment - interest;

		if (period === n) principalPayment = remaining;

		const installmentAmount = principalPayment + interest;
		remaining = Math.max(0, remaining - principalPayment);

		plan.push({
			period,
			installmentAmount,
			principal: principalPayment,
			interest,
			kkdf: 0,
			bsmv: 0,
			remainingPrincipal: remaining,
		});
	}

	return plan;
}

export default function LoanDetailContent({ loan }) {
	const hasRedirect = Boolean(loan?.data?.redirect);

	const paymentPlans = Array.isArray(loan?.data?.paymentPlans)
		? loan.data.paymentPlans
		: [];

	const amount =
		loan?.data?.amount ?? loan?.data?.loanAmount ?? loan?.meta?.amount ?? 10000;
	const maturity =
		loan?.data?.maturity ?? loan?.data?.months ?? loan?.meta?.maturity ?? 12;
	const interestRate =
		loan?.data?.interest ?? loan?.data?.bracket?.interestRate ?? 0;

	const computedPlans = useMemo(() => {
		if (paymentPlans.length > 0) return paymentPlans;
		return buildPaymentPlan({
			amount,
			months: maturity,
			annualInterestRate: interestRate,
			monthlyInstallment: loan?.data?.monthlyInstallment,
		});
	}, [
		amount,
		interestRate,
		maturity,
		paymentPlans,
		loan?.data?.monthlyInstallment,
	]);

	const backToOffersHref = loan?.loanType?.slug
		? `/kredi/${loan.loanType.slug}?amount=${amount}&maturity=${maturity}`
		: "/kredi";

	return (
		<section className="w-full pb-20">
			<div className="container px-4 md:px-6">
				<div className="mt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight mb-1">Ödeme Planı</h2>
						<p className="text-sm text-muted-foreground">Taksit, ana para ve faiz dağılımı</p>
					</div>
					<div className="flex gap-2">
						<Button asChild variant="outline">
							<Link href={backToOffersHref}>Tekliflere Dön</Link>
						</Button>
						{hasRedirect ? (
							<Button asChild className="sm:w-auto">
								<Link rel="nofollow" href={loan.data.redirect}>Hemen Başvur</Link>
							</Button>
						) : (
							<Button disabled className="sm:w-auto">Başvuru linki yok</Button>
						)}
					</div>
				</div>

				<LoanPaymentPlansTable paymentPlans={computedPlans} />
			</div>
		</section>
	);
}
