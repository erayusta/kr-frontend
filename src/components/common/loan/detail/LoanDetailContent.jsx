

import { BadgeInfo} from "lucide-react";
import { LoanPaymentPlansTable } from "./LoanPaymentPlansTable";

export default function LoanDetailContent({loan}){

 return ( <section className="w-full pb-20 ">
    <div className="container px-4 md:px-6">
    
         <div className="flex mt-10 items-center gap-4">
          <BadgeInfo />
          <h2 className="text-2xl font-semibold tracking-tighter">Ödeme Planı</h2>
         </div>
         <LoanPaymentPlansTable paymentPlans={loan?.data.paymentPlans}></LoanPaymentPlansTable>
    </div>
   </section>)
}  

 