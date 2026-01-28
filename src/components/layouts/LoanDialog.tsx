// components/layout/LoanDialog.tsx
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/utils";
import { useRouter } from "next/router";

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
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleRoute = () => setIsOpen(false);
		router.events.on("routeChangeStart", handleRoute);
		return () => router.events.off("routeChangeStart", handleRoute);
	}, [router.events]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, 150);
	};

	return (
		<>
			{/* Blur Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
					style={{ top: '64px' }}
					onMouseEnter={handleMouseLeave}
				/>
			)}

			<div
				className="relative"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Button
					className={`flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
						isOpen
							? "bg-orange-500 text-white"
							: "text-foreground hover:bg-orange-500 hover:text-white"
					}`}
					variant="ghost"
				>
					Krediler
					<ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
				</Button>

				{/* Dropdown Menu */}
				{isOpen && (
					<div className="absolute top-full left-0 mt-2 z-50">
						<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[240px]">
							<div className="p-2">
								{LOAN_TYPES.map((loan) => (
									<Link
										key={loan.href}
										href={loan.href}
										className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-150"
									>
										<div className="flex items-center gap-3">
											<div
												className="product-des w-5 h-5 flex items-center justify-center text-gray-600"
												dangerouslySetInnerHTML={{ __html: getIcon(loan.iconKey) }}
											/>
											<span className="font-medium">{loan.name}</span>
										</div>
										<ChevronRightIcon className="h-4 w-4 text-gray-400" />
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export { LOAN_TYPES };
