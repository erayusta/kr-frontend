import { BadgeInfo } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LoanPaymentPlansTable } from "./LoanPaymentPlansTable";

export default function LoanDetailContent({ loan }) {
	const paymentPlans = Array.isArray(loan?.data?.paymentPlans)
		? loan.data.paymentPlans
		: [];

	const amount =
		loan?.data?.amount ?? loan?.data?.loanAmount ?? loan?.meta?.amount ?? 10000;
	const maturity =
		loan?.data?.maturity ?? loan?.data?.months ?? loan?.meta?.maturity ?? 12;
	const backToOffersHref = loan?.loanType?.slug
		? `/kredi/${loan.loanType.slug}?amount=${amount}&maturity=${maturity}`
		: "/kredi";

	return (
		<section className="w-full pb-20">
			<div className="container px-4 md:px-6">
				<div className="flex mt-10 items-center gap-4">
					<BadgeInfo />
					<h2 className="text-2xl font-semibold tracking-tight">Odeme Plani</h2>
				</div>

				{paymentPlans.length > 0 ? (
					<LoanPaymentPlansTable paymentPlans={paymentPlans} />
				) : (
					<Card className="mt-4 border-dashed">
						<CardHeader>
							<CardTitle className="text-lg">Detayli odeme plani henuz yok</CardTitle>
							<CardDescription>
								Bu banka icin taksit kirilimi (ana para/faiz/vergiler) su an paylasilmiyor.
								Aylik taksit ve toplam odeme bilgisini ust bolumden gorebilirsiniz.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col sm:flex-row gap-3">
							<Button asChild>
								<Link href={backToOffersHref}>Tekliflere Don</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href={backToOffersHref}>Tutar/Vade Degistir</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</section>
	);
}
