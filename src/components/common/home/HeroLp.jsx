import { Calculator, GitCompareArrows } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanCalculator from "./LoanCalculator";
import ProductPriceComparision from "./ProductPriceComparision";

export default function HeroLp() {
	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col justify-center">
			<Tabs defaultValue="personal" className="w-full">
				<TabsList className="grid grid-cols-2 rounded-full bg-gray-100 dark:bg-gray-800 p-1">
					<TabsTrigger
						value="personal"
						className="rounded-full py-2 gap-x-2 text-xs md:text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 data-[state=active]:bg-primary data-[state=active]:text-white"
					>
						<Calculator size={18} />
						Kredi Hesaplama
					</TabsTrigger>
					<TabsTrigger
						value="business"
						className="rounded-full py-2 gap-x-2 text-xs md:text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 data-[state=active]:bg-primary data-[state=active]:text-white"
					>
						<GitCompareArrows size={18} />
						Fiyat Karşılaştır
					</TabsTrigger>
				</TabsList>

				<TabsContent value="personal">
					<LoanCalculator />
				</TabsContent>

				<TabsContent value="business">
					<Card className="mt-4">
						<CardHeader>
							<CardTitle className="font-bold md:text-xl text-md">
								Ürün Fiyat Karşılaştırma
							</CardTitle>
							<CardDescription>
								Almak İstediğin Ürünün En Ucuz Nerede Olduğunu Bul
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductPriceComparision />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
