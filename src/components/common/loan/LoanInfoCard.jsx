
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PercentIcon, ShieldIcon, WalletIcon } from "lucide-react";

export default function LoanInfoCard(){

 return (  <div className="grid md:grid-cols-3 gap-8 ">
              <Card className="flex bg-transparent hover:bg-white hover:shadow-md border-0 flex-col py-3 items-center text-center">
                <WalletIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl font-bold mb-2">Hızlı Başvuru</CardTitle>
                <CardDescription className="text-gray-600">Başvuru süreciniz sadece birkaç dakika sürer.</CardDescription>
              </Card>
              <Card className="flex flex-col hover:bg-white hover:shadow-md  bg-transparent border-0 py-3 items-center text-center">
                <PercentIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl font-bold mb-2">Uygun Faiz Oranları</CardTitle>
                <CardDescription className="text-gray-600">Banka tekliflerini karşılaştırarak en uygun faiz oranını bulun.</CardDescription>
              </Card>
              <Card className="flex flex-col hover:bg-white hover:shadow-md   bg-transparent border-0 py-3 items-center text-center">
                <ShieldIcon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl font-bold mb-2">Güvenli İşlem</CardTitle>
                <CardDescription className="text-gray-600">Kişisel verileriniz güvenle korunur.</CardDescription>
              </Card>
            </div>)

}