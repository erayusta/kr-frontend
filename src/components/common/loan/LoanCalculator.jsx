

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRightIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft } from "lucide-react";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import MaskedInput from 'react-text-mask'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LOAN_MATURIES, LOAN_TYPES, loanType, loanTypeSlug } from "@/constants/loan";
import createNumberMask from "@/utils/createNumberMask";
import { useRouter } from "next/router";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { getIcon } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


const numberMask = createNumberMask({
 prefix: '₺ ',
 suffix: '',
 includeThousandsSeparator: true,
 thousandsSeparatorSymbol: '.',
 allowDecimal: true,
 decimalSymbol: ',',
 decimalLimit: 2,
 requireDecimal: false,
 allowNegative: false,
 allowLeadingZeroes: false,
 integerLimit: null
})

const LoanCalculateForm = ({ loanType, handleSetResults }) => {



 const [error, setError] = useState(null)
 const [isLoading, setLoading] = useState(false)
 const [amount, setAmount] = useState(10000)
 const [maturity, setMaturity] = useState(12)

 const handleSetAmount = (value) => {
  return setAmount(value.replace(/[^0-9.]/g, ''));
 }

 const handleSetMaturity = (value) => {
  setMaturity(value)
 }


 const handleGetOffers = async () => {


  const params = new URLSearchParams({
   maturity: parseInt(maturity),
   loanType: loanType,
   amount:String(amount).includes('.') ? amount.replace(/\./g, ''):amount,
   limit: 5
  });

  setLoading(true)
  const { data } = await apiRequest(`/loan/offers?${params}`,'get')

  if (data.status == false) {
   setLoading(false)
   return setError({ message: data.message, })
  }

  handleSetResults(data)
  setLoading(false)

 }


 if (error !== null) {
  return (
   <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Üzgünüm!</AlertTitle>
    <AlertDescription>
     {error.message}
    </AlertDescription>
    <Button onClick={() => setError(null)} variant="ghost" className=" justify-end">Tekrar Dene</Button>
   </Alert>
  )
 }




 return (<Card className="p-6 space-y-6 mb-2">
  <div className="grid md:grid-cols-3  grid-cols-1 items-end gap-4">
   <div className="space-y-2">
    <Label className="text-sm md:text-md" htmlFor="amount">Kredi Tutarı</Label>
    <MaskedInput
     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
     mask={numberMask}
     id="amount" value={amount} onChange={(e) => handleSetAmount(e.target.value)} placeholder="10,000₺" type="text" />

   </div>
   <div className="space-y-2">
    <Label className="text-sm md:text-md" htmlFor="rate">Vade Süresi (Ay)</Label>
    <div className="flex items-center gap-2">
     <Select onValueChange={(value) => handleSetMaturity(value)} value={maturity} >
      <SelectTrigger className="w-full">
       <SelectValue placeholder="Vade Ay Seçiniz" />
      </SelectTrigger>
      <SelectContent position="popper">
       {LOAN_MATURIES[loanType].map(loan => (<SelectItem value={loan}>{loan} Ay</SelectItem>))}
      </SelectContent>
     </Select>
    </div>
   </div>

   {isLoading !== true ? <Button loading onClick={() => handleGetOffers()} className="w-full p">Kredi Hesapla</Button>
    :
    <Button className="w-full" disabled>
     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lütfen Bekleyin Teklifler Listeleniyor...</Button>
   }
  </div>
 </Card>)
}

const LoanResultItem = ({ data, index }) => {

 return (<div className="space-y-4 hidden md:block bg-white border py-5 relative px-3 group hover:gray-100  rounded-md border-gray-100">
  <div className="rounded-lg flex flex-row items-center justify-between">
   <div className="flex flex-col  items-center space-x-2">
    {index == 0 && <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
     En Uygun Faiz
    </div>}
    {data?.logo ? (
      <img
       width={100}
      className="object-fit"
       alt="Bank Logo"
       src={data.logo}
      />
    ) : (
      <div className="w-[100px] h-[60px] bg-gray-200 flex items-center justify-center rounded">
        <span className="text-xs text-gray-400">{data?.name || 'Logo'}</span>
      </div>
    )}
   </div>
   <div className="text-sm flex flex-row gap-x-8 items-center">
    <div>
     <p className="font-medium text-xs">Faiz Oranı</p>
     <p className="font-bold text-lg">%{data?.interest}</p>
    </div>
    <div>
     <p className="font-medium text-xs">Aylık Taksit</p>
     <p className="font-bold text-lg">{data?.monthlyPayment}</p>
    </div>
    <div className="hidden md:block">
     <p className="font-medium text-xs">Toplam Ödeme</p>
     <p className="font-bold text-lg">{data?.totalPayment}</p>
    </div>
   </div>
   <div>
    <div className="flex items-center space-x-2 hidden md:flex">
     <Button asChild>
      <Link href={data?.redirect}>
       Hemen Başvur
      </Link>
     
     </Button>
    </div>
    <div className="flex items-center space-x-2 hidden md:flex">
     <Button variant="ghost">
      <Link href={`/kredi/${loanTypeSlug[data.loanType]}/${data?.slug}/detay?amount=${data?.amount}&maturity=${data.maturity}`}>
       Kredi Detayı
      </Link>

     </Button>
    </div>
   </div>
  </div>
 </div>)

}

const LoanResultListItem = ({ data, index }) => {

 return (<div className={`space-y-4 bg-white ${index == 0 && 'border-green-500'} border py-5 hover:border-2 hover:shadow-md relative px-3 group hover:gray-100  rounded-md border-gray-100`}>
  <div className="rounded-lg  md:flex-row flex flex-col gap-y-3 items-center justify-between">
   <div className="flex flex-col items-center space-x-2">
    {index == 0 && <div className="absolute top-[-10px] left-0 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
     En Uygun Faiz
    </div>}
    <Link asChild href={`/kredi/${loanTypeSlug[data.loanType]}/${data?.slug}`}>
    {data?.logo ? (
      <img
       width={100}
      className="object-fit"
       alt="Bank Logo"
       src={data.logo}
      />
    ) : (
      <div className="w-[100px] h-[60px] bg-gray-200 flex items-center justify-center rounded">
        <span className="text-xs text-gray-400">{data?.name || 'Logo'}</span>
      </div>
    )}
    </Link>
   </div>
   <div className="text-sm flex flex-row  gap-x-8 md:gap-x-20 items-center">
      <div>
     <p className="font-medium text-xs">Faiz Oranı</p>
     <p className="font-bold text-lg">%{data?.interest}</p>
     
    </div>
    
    <div>
     <p className="font-medium text-xs">Faiz Oranı</p>
     <p className="font-bold text-lg">%{data?.interest}</p>
    </div>
    <div>
     <p className="font-medium text-xs">Aylık Taksit</p>
     <p className="font-bold text-lg">{data?.monthlyPayment}</p>
    </div>
    <div className="hidden md:block">
     <p className="font-medium text-xs">Toplam Ödeme</p>
     <p className="font-bold text-lg">{data?.totalPayment}</p>
    </div>
   </div>
   <div className="flex items-center">
    <div className="flex items-center space-x-2 ">
     <Button asChild>
      <Link rel={"nofollow"} href={data?.redirect}>
       Hemen Başvur
      </Link>
     
     </Button>
    </div>
    <div className="flex items-center space-x-2 ">
     <Button variant="ghost">
      <Link href={`/kredi/${loanTypeSlug[data.loanType]}/${data?.slug}/detay?amount=${data?.amount}&maturity=${data.maturity}`}>
       Kredi Detayı
      </Link>

     </Button>
    </div>
   </div>
  </div>
 </div>)

}


const LoanResultCard = ({ data, setResults }) => {
 return (
  <>
   {data?.offers?.length > 0 && <Card className="mt-4 p-0 bg-transparent container w-full">
    <CardHeader className="flex flex-row items-center gap-x-2">
     <CardTitle className="font-bold"><Button onClick={() => setResults([])} className="px-4 py-2" variant="outline"><ChevronLeft></ChevronLeft></Button></CardTitle>
     <CardTitle className="font-bold">{data.title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
     <Tabs className="w-full" defaultValue="result-card">
      <TabsContent value="result-card">
       <div className="grid grid-cols-1 gap-y-2">
        {data?.offers?.map((item, index) => <LoanResultListItem index={index} data={item}></LoanResultListItem>)}
       </div>

      </TabsContent>
     </Tabs>
    </CardContent>
   </Card>}
  </>
 )
}




export default function LoanCalculator({ loan }) {

 const [results, setResults] = useState([])
 const [loanType, setLoanType] = useState('personal')

 const offer = loan.offers[0]

 const handleLoanTabChange = (value) => {
  handleGetFirstOffer()
  setLoanType(value)

 }

 const handleSetResults = (data) => {
  setResults(data)
 }




 return (
  <>

   <Card className="bg-white">
    <CardHeader className="container">
          
     <CardTitle className="font-bold text-xl md:text-3xl md:w-[50%]">{loan.page.hero_title}</CardTitle>
     <CardDescription className=" text-xs md:text-md">2024 Haziran Güncel Faiz Oranları İle Kredi Hesaplama</CardDescription>
       <div className="block md:hidden">
      <img className=" w-[350px] bottom-0 bg-amber-500/10 rounded-t-full mt-5" src="/mobil-loan.png"></img>
     </div>
    </CardHeader>
    <CardContent className="space-y-4  container relative grid grid-cols-1 md:grid-cols-2 ">

     <Tabs className="w-full bg-transparent" defaultValue={loanType}>
      <TabsList className="grid grid-cols-3 w-full">
       {LOAN_TYPES.map(loan => <TabsTrigger asChild key={loan.type} className="text-xs" value={loan.type}>
        <Link href={`/kredi/${loan.slug}`} className="items-center gap-x-3 ">
         
         {loan.name}
        </Link>
       </TabsTrigger>)}
      </TabsList>
      {LOAN_TYPES.map(loan => <TabsContent value={loan.type}>
     
       <LoanCalculateForm handleSetResults={handleSetResults} loanType={loan.type} ></LoanCalculateForm>
       <LoanResultItem data={offer}></LoanResultItem>
      </TabsContent>)}
     </Tabs>
     <div className="md:block hidden">
      <img className="absolute bottom-0 bg-amber-500/10 rounded-t-full right-5" width={500} src="https://i.ibb.co/Xj0yR76/young-beautiful-girl-wearing-orange-t-shirt-pointing-side-smiling-cheerfully-standing-isolated-orang.png"></img>
     </div>
    </CardContent>
   </Card>
   <LoanResultCard setResults={setResults} data={results}></LoanResultCard>

  </>



 );
}
