// components/layout/LoanDialog.tsx
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/utils";

interface LoanType {
	name: string;
	href: string;
	iconKey: string;
}

const LOAN_TYPES: LoanType[] = [
	{ name: "İhtiyaç Kredisi", href: "/kredi/ihtiyac-kredisi", iconKey: "Lira" },
	{ name: "Taşıt Kredisi", href: "/kredi/tasit-kredisi", iconKey: "Otomotiv" },
	{
		name: "Konut Kredisi",
		href: "/kredi/konut-kredisi",
		iconKey: "Ev Yaşam & Ofis",
	},
];

export const LoanDialog = () => {
	const [open, setOpen] = useState(false);

	const handleSelectLoan = () => {
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="flex items-center gap-2 px-3 py-2 rounded-md text-sm leading-tight text-foreground hover:bg-accent hover:text-accent-foreground"
					variant="ghost"
				>
					<ChevronDownIcon className="h-5 w-5" />
					Krediler
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Tüm Kredi Türleri</DialogTitle>
					<DialogDescription>
						Hesaplama Yapmak İstediğiniz Kredi Türlerini Keşfedin.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-y-2">
					{LOAN_TYPES.map((loan) => (
						<Button
							key={loan.href}
							asChild
							className="flex w-full justify-between items-center gap-2"
							variant="ghost"
						>
							<Link href={loan.href} onClick={handleSelectLoan}>
								<div
									className="product-des"
									dangerouslySetInnerHTML={{ __html: getIcon(loan.iconKey) }}
								/>
								{loan.name}
								<ChevronRightIcon className="h-4 w-4" />
							</Link>
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export { LOAN_TYPES };
