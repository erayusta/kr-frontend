

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRightIcon,Loader2 } from "lucide-react";
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
import {LOAN_MATURIES, LOAN_TYPES, loanTypeSlug } from "@/constants/loan";
import createNumberMask from "@/utils/createNumberMask";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"


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


const LoanCalculateForm = ({ loanType, handleSetResults, handleSetAmount, handleSetMaturity, amount, maturity }) => {



 const [error, setError] = useState(null)
 const [isLoading, setLoading] = useState(false)

 const handleGetOffers = async () => {
  const params = new URLSearchParams({
   maturity: parseInt(maturity),
   loanType: loanType,
   amount: String(amount).includes('.') ? amount.replace(/\./g, ''): amount,
   limit: 4
  });

  setLoading(true)
  
  try {
    const response = await apiRequest(`/loan/offers?${params}`,'get')
    
    // API returns {data: [...], meta: {...}}
    if (response && response.data) {
      handleSetResults(response.data)
    } else {
      setError({ message: 'Beklenmeyen bir hata oluştu' })
    }
  } catch (error) {
    console.error('Failed to get loan offers:', error);
    setError({ message: 'Kredi tekliflerini yüklerken bir hata oluştu' })
  }
  
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
  <div className="grid grid-cols-2 gap-4">
   <div className="space-y-2">
    <Label htmlFor="amount">Kredi Tutarı</Label>
    <MaskedInput
     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
     mask={numberMask}
     id="amount" value={amount} onChange={(e) => handleSetAmount(e.target.value)} placeholder="10,000₺" type="text" />

   </div>
  <div className="space-y-2">
    <Label htmlFor="rate">Vade Süresi (Ay)</Label>
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
  </div>
  {isLoading !== true ? <Button loading onClick={() => handleGetOffers()} className="w-full">Kredi Hesapla</Button>
   :
   <Button className="w-full" disabled>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lütfen Bekleyin Teklifler Listeleniyor...</Button>
  }
 </Card>)
}

const LoanResultListItem = ({ data, index }) => {
 
 return ( <a rel="nofollow" href={data?.redirect}> <div className={`border py-3 px-5 md:px-5 relative group hover:bg-gray-100  ${index == 0 ? 'border-2 border-green-500':'bg-white' }  rounded-md border-gray-100`}>
  <div className="rounded-lg flex md:flex-row flex-col  md:items-center items-start justify-between">
   <div className="flex flex-col md:mb-0mb-3  md:items-center items-start space-x-2">
    {index == 0 && <div className="absolute top-[-10%] left-0 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
     En Uygun Faiz
    </div>}
    {data?.logo ? (
      <img
       className="object-fit "
       width={70}
       height={50}
       alt="Bank Logo"
       src={data.logo}
      />
    ) : (
      <div className="w-[70px] h-[50px] bg-gray-200 flex items-center justify-center rounded">
        <span className="text-xs text-gray-400">{data?.name || 'Logo'}</span>
      </div>
    )}
   </div>
   <div className="text-sm flex flex-row gap-x-6 md:gap-x-8 items-center ">
    <div>
     <p className="font-medium text-xs">Faiz Oranı</p>
     <p className="font-bold text-sm md:text-lg">%{data?.interest}</p>
    </div>
    <div>
     <p className="font-medium text-xs">Aylık Taksit</p>
     <p className="font-bold text-sm md:text-lg">{data?.monthlyPayment}</p>
    </div>
    <div>
     <p className="font-medium text-xs">Toplam Ödeme</p>
     <p className="font-bold text-sm md:text-lg">{data?.totalPayment}</p>
    </div>
    <div className="flex items-center space-x-2 flex md:hidden">
    <a rel="nofollow" href={data?.redirect} className="text-gray-600 flex items-center space-x-2" href="#">
     <ArrowRightIcon className="h-5 w-5" />
    </a>
   </div>
   </div>
   <div className="flex items-center space-x-2 hidden  md:flex">
    <a rel="nofollow" href={data?.redirect} className="text-gray-600 flex items-center space-x-2" >
     <ArrowRightIcon className="h-5 w-5" />
    </a>
   </div>
   
  </div>
 </div></a>)

}


const LoanResultCard = ({ data, setResults }) => {
 return (<Card className="px-1">
  <CardHeader className="flex flex-row items-center gap-x-2">
   <CardTitle className="font-bold"><Button onClick={() => setResults([])} className="px-4 py-2" variant="outline"><ChevronLeft></ChevronLeft></Button></CardTitle>
   <CardTitle className="font-bold text-md md:text-xl">Kredi Hesaplama Sonuçları</CardTitle>
  </CardHeader>
  <CardContent className="p-0 space-y-4">
   <Tabs className="w-full max-w-3xl" defaultValue="result-card">
    <TabsContent value="result-card">
     <div className="grid grid-cols-1 gap-y-2 ">
      {Array.isArray(data) && data.filter(item => item !== null).map((item, index) => <LoanResultListItem key={item.id || index} index={index} data={item}></LoanResultListItem>)}
           </div>

    </TabsContent>
   </Tabs>
  </CardContent>
 </Card>)
}




export default function LoanCalculator() {

 const [results, setResults] = useState([])
 const [loanType, setLoanType] = useState('personal')
 const [offer, setOffer] = useState({})

 const handleGetFirstOffer = () => {
  const params = new URLSearchParams({
   maturity: parseInt(12),
   loanType: loanType,
   amount: 10000,
   limit: 8
  });
  apiRequest(`/loan/offers?${params}`,'get')
    .then(response => {
      // API returns {data: [...], meta: {...}}
      if (response && response.data && response.data.length > 0) {
        // Get the last offer or the first one if less than 8
        const lastIndex = Math.min(response.data.length - 1, 7);
        setOffer(response.data[lastIndex]);
      }
    })
    .catch(error => {
      console.error('Failed to get loan offers:', error);
    });
 }

 useEffect(() => {
  handleGetFirstOffer()
 }, [])

  const [amount, setAmount] = useState(10000)
 const [maturity, setMaturity] = useState(12)

  const handleSetAmount = (value) => {
return  setAmount(value.replace(/[^0-9.]/g, ''));
 }

 const handleSetMaturity = (value) => {
  setMaturity(value)
 }


 const handleLoanTabChange = (value) => {
  handleGetFirstOffer()
  setLoanType(value)
 }

 const handleSetResults = (data) => {
  setResults(data)
 }
 

 return (
  <>
   {results?.length <= 0 ?
    <Card className="mt-4 p-0">
     <CardHeader>
      <CardTitle className="font-bold md:text-xl text-md">Kredi Hesaplama</CardTitle>
      <CardDescription>2024 Mayıs Güncel Faiz Oranları İle Kredi Hesaplama</CardDescription>
     </CardHeader>
     <CardContent className="space-y-4 p-0 md:p-3">
      <Tabs className="w-full max-w-3xl" defaultValue="personal">
       <TabsList className="grid grid-cols-3 w-full">
        {LOAN_TYPES.map(loan => <TabsTrigger className="md:text-md text-xs" onClick={() => handleLoanTabChange(loan.type)} key={loan.type} value={loan.type}>{loan.name}</TabsTrigger>)}
       </TabsList>
       {LOAN_TYPES.map(loan => <TabsContent value={loan.type}>
        <LoanCalculateForm amount={amount} maturity={maturity}  handleSetAmount={handleSetAmount} handleSetMaturity={handleSetMaturity}  handleSetResults={handleSetResults} loanType={loan.type} ></LoanCalculateForm>
        <LoanResultListItem data={offer}></LoanResultListItem>
       </TabsContent>)}
      </Tabs>
     </CardContent>
    </Card> :
    <>
     <LoanResultCard setResults={setResults} data={results}></LoanResultCard>
      <Button asChild className="w-full mt-3 justify-center">
       <Link  href={`/kredi/${loanTypeSlug[loanType]}?amount=${amount}&maturity=${maturity}`}>
       Daha Fazla Teklif Göster
       </Link>
      
       </Button>

    </>
   
   }</>



 );
}
