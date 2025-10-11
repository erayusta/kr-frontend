import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, Calculator, GitCompareArrows, SearchIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import ProductPriceComparision from "./ProductPriceComparision"
import LoanCalculator from "./LoanCalculator"




export default function HeroLp() {
  return (
    <Tabs className="w-full max-w-2xl" defaultValue="personal">
      <TabsList className="grid grid-cols-2 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
        <TabsTrigger
          className="rounded-full  py-2 gap-x-4 md:text-sm text-xs font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 data-[state=active]:bg-primary data-[state=active]:text-white"
          value="personal"
        >
          <Calculator size={18} />
          Kredi Hesaplama
        </TabsTrigger>
        <TabsTrigger
          className="rounded-full gap-x-4 py-2 text-xs md:text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 data-[state=active]:bg-primary data-[state=active]:text-white"
          value="business"
        >
          <GitCompareArrows size={18} />
          Fiyat Karşılaştır
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
<LoanCalculator></LoanCalculator>
      </TabsContent>
      <TabsContent value="business">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="font-bold md:text-xl text-md">Ürün Fiyat Karşılaştırma</CardTitle>
            <CardDescription>Almak İstediğin Ürünün En ucuz Nerde Olduğu Bul</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductPriceComparision />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
