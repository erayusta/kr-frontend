
import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbLink,
 BreadcrumbList,
 BreadcrumbPage,
 BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { getIcon } from "@/lib/utils";
import Link from "next/link";
import LoanApplicationPlan from "./LoanApplicationPlan";

export default function ({ loan }) {
 return (<section className="w-full py-3  shadow  bg-white dark:bg-gray-800">
  <div className="md:container px-4">
   <div className="grid items-center gap-10 grid-cols-1 md:grid-cols-1">
    <Breadcrumb className="breadcrumb">
     <BreadcrumbList>
      <BreadcrumbItem>
       <BreadcrumbLink href="/">Anasayfa</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
       <BreadcrumbLink href="/components">{loan.loanType?.name}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
       <BreadcrumbPage>{loan.title.substring(0,25)}...</BreadcrumbPage>
      </BreadcrumbItem>
     </BreadcrumbList>
    </Breadcrumb>
    <div className="flex gap-x-3 md:flex-row flex-col items-center justify-between">
     <div className="flex flex-col justify-center space-y-4">
      <div className="space-y-2">
       <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">
        <img
         className="object-contain group-hover w-24 h-[40px]"
         src={loan.data.logo}
         alt="Image Description"
        />
       </div>
       <h1 className=" text-2xl md:text-3xl w-[85%] font-bold tracking-tighter ">{loan.title}</h1>
      </div>
      <div className="flex items-center gap-4">
        

       <div className="text-sm items-center gap-x-3 flex text-gray-500 dark:text-gray-400">
        <Button size="sm" variant="outline" className="items-center flex gap-4">
         <div className="text-md" dangerouslySetInnerHTML={{ __html: getIcon(loan.loanType.name) }}></div>
         <div>{loan.loanType.name}</div>
        </Button>
          <Button asChild  size="sm"  className="items-center flex gap-4">
           <Link rel="nofollow" href={loan.data.redirect} >
            Hemen Başvur
           </Link>

        </Button>
       </div>
      </div>
     </div>
     <div className="w-full mt-10">
      <LoanApplicationPlan data={loan?.data}></LoanApplicationPlan>
     </div>

    </div>
   </div>
  </div>
 </section>)
}