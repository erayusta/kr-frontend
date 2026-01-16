import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/loan";

export function LoanPaymentPlansTable({ paymentPlans }) {
	const plans = Array.isArray(paymentPlans) ? paymentPlans : [];

	if (plans.length === 0) {
		return (
			<div className="w-full mt-4 text-sm text-gray-600">
				Odeme plani bilgisi su an mevcut degil.
			</div>
		);
	}

	return (
		<div className="w-full mt-6 rounded-lg border bg-white shadow-sm">
			<Table className="min-w-[720px]">
				<TableHeader className="sticky top-0 bg-white">
					<TableRow>
						<TableHead className="w-[100px]">Ay</TableHead>
						<TableHead className="text-right">Taksit</TableHead>
						<TableHead className="text-right">Ana Para</TableHead>
						<TableHead className="text-right">Faiz</TableHead>
						<TableHead className="text-right">Bakiye</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{plans.map((item) => (
						<TableRow key={item.period}>
							<TableCell className="font-medium">{item.period}</TableCell>
							<TableCell className="text-right">{formatPrice(item.installmentAmount)}</TableCell>
							<TableCell className="text-right">{formatPrice(item.principal)}</TableCell>
							<TableCell className="text-right">{formatPrice(item.interest)}</TableCell>
							<TableCell className="text-right">{formatPrice(item.remainingPrincipal)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={4} className="text-right font-semibold">Toplam</TableCell>
						<TableCell className="text-right font-semibold">
							{formatPrice(plans.reduce((acc, item) => acc + item.installmentAmount, 0))}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
