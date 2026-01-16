import { CalendarDaysIcon, ChevronLeft, ChevronRight, Clock10Icon, HeartIcon, MountainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Carousel, CarouselItem, CarouselContent } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, get } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Input, InputLabel } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { LOAN_MATURIES } from "@/constants/loan";
import { Children, useEffect, useState } from "react";
import {
	adaptLoanCalculationsResponseToOffers,
	parseAmountToNumber,
	postLoanCalculations,
} from "@/lib/loanCalculations";

const formSchema = z.object({
  amount: z.string().nullable(),
  maturity: z.string().nullable(), // Change this to string
});

const CalculateForm = ({children, amount, maturity, loan, handleCalculate}) => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: amount || '',
      maturity: maturity ? maturity.toString() : '12'
    },
  });
  
  const {handleSubmit, setValue, control} = methods;
 
   const handleAmountChange = (value) => {
    setValue("amount", value);
    handleCalculate(value, methods.getValues("maturity"));
  };

  const handleMaturityChange = (value) => {
    setValue("maturity", value);
    handleCalculate(methods.getValues("amount"), value);
  };


  return (
    <FormProvider {...methods}>
      <form  className="grid grid-cols-1 items-center gap-5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={methods.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tutar</FormLabel>
                <FormControl>
                  <Input type="text" {...field} onChange={(e) => handleAmountChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="maturity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vade</FormLabel>
                <Select
                  onValueChange={(value) => handleMaturityChange(value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Vade Ay Seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {(LOAN_MATURIES[loan?.loanType?.type] || []).map(maturityOption => (
                      <SelectItem key={maturityOption} value={maturityOption.toString()}>{maturityOption} Ay</SelectItem> 
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

    {children}

      </form>
    </FormProvider>
  )
}

const LoanBankCalculateCard = ({offer, loan }) => {

const [result, setResult] = useState(offer);

 const handleCalculate = async (amount, maturity) => {
  try {
   if (!amount || !maturity || !loan?.loanType?.type) {
     console.warn('Missing required parameters for loan calculation');
     return;
   }

   const parsedAmount = parseAmountToNumber(amount);
   const parsedMonths = parseInt(maturity, 10);
   const bankId = offer?.bankId ?? offer?.id;

   if (!Number.isFinite(parsedAmount) || parsedAmount < 1000) return;
   if (!Number.isInteger(parsedMonths) || parsedMonths < 1 || parsedMonths > 36) return;
   if (!bankId) return;

   const response = await postLoanCalculations({
    amount: parsedAmount,
    months: parsedMonths,
    loanType: loan.loanType.type,
    bankIds: [bankId],
   });
   const { offers } = adaptLoanCalculationsResponseToOffers(response);
   setResult(offers[0] || {});
  } catch (error) {
   console.error('Loan calculation error:', error);
  }
 }



  return (
    <Card key={offer.idr} className="max-w-[350px] shadow-md hover:shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          {(loan?.loanType?.slug && offer?.slug) ? (
            <Link href={`/kredi/${loan.loanType.slug}/${offer.slug}`}>
              <Image
                alt="Card Image"
                className="object-fit"
                height={0}
                src={offer?.logo || '/user.png'}
                width={60}
              />
            </Link>
          ) : (
            <Image
              alt="Card Image"
              className="object-fit"
              height={0}
              src={offer?.logo || '/user.png'}
              width={60}
            />
          )}
          <h3>{loan?.loanType?.name || 'Kredi'}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <CalculateForm handleCalculate={handleCalculate} loan={loan} amount={offer?.amount || 10000} maturity={offer?.maturity || 12}>

    {Object.keys(result).length !== 0 && 
    <>
    <ul className="flex w-full flex-col justify-between gap-2 text-sm">
          <li className="flex text-xs justify-between">
            Faiz:
            <span className="text-sky-950" x-text="`%${loan.interestRate}`">
              %{result?.interest}
            </span>
          </li>
          <li className="flex text-xs justify-between">
            Aylık Taksit:
            <span className="text-sky-950" x-text="`${loan.monthlyPayment} TL`">
              {result?.monthlyPayment}
            </span>
          </li>
          <li className="flex text-xs justify-between">
            Toplam Tutar:
            <span className="text-sky-950" x-text="`${loan.totalPayment} TL`">
              {result?.totalPayment}
            </span>
          </li>
        </ul>
         {offer?.slug ? (
           <Button className="text-white" asChild><Link href={`/kredi/${loan?.loanType?.slug}/${offer.slug}/detay?amount=${result?.amount || offer?.amount || 10000}&maturity=${result?.maturity || offer?.maturity || 12}&bankId=${offer?.bankId ?? offer?.id}`}>Detayı Gör <ChevronRight /> </Link></Button>
         ) : (
           <Button className="text-white" disabled>Detayı Gör <ChevronRight /> </Button>
         )}
        </>
        }

       
         </CalculateForm>
      </CardContent>
    </Card>
  )
}

export default function LoanCalculateCarousel({ loan }) {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
          stopOnMouseEnter: true
        }),
      ]}
      opts={{
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
            },
          },
        ],
      }}
    >
      <CarouselContent>
        {loan?.offers.map(offer => (
          <CarouselItem className='basis-1/1 md:basis-1/4' key={offer.id}>
            <LoanBankCalculateCard loan={loan} offer={offer}  />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
