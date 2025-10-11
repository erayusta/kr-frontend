
 
import Layout from "@/components/layouts/layout";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";
import LoanCalculator from "@/components/common/loan/LoanCalculator";
import LoanTable from "@/components/common/loan/LoanTable";
import LoanFaqs from "@/components/common/loan/LoanFaqs";
import LoanInfoCard from "@/components/common/loan/LoanInfoCard";
import LoanCalculateCarousel from "@/components/common/loan/LoanBankCalculateCarousel";
import { loanType } from "@/constants/loan";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
try {

const {slug} = context.params;

const loan = await serverApiRequest(`/loan/${loanType[slug]}`,'get')

 return {
  props: {
   
 loan:loan

  }
 }

} catch (error) {
  return {
  notFound:true
 }
}

}


export default function LoanIndex({ loan }) {

 const router= useRouter()
 const canonical = `https://kampanyaradar.com${router.asPath}`


 return (
 <Layout>
  <NextSeo
    title={`En Uygun Faiz Oranları ile  ${loan.loanType.name} Hesaplama | Kampanyaradar`}
    description={`kampanyaradar`}
    canonical={canonical}
    openGraph={{
     url: canonical,
     title: `Kampanyaları | Kampanya Radar`,
     description:'',
     siteName: 'KampanyaRadar',
    }}
    twitter={{
     handle: '@handle',
     site: '@site',
     cardType: 'summary_large_image',
    }}
   />
  <section className="shadow-md shadow-orange-100">
  <LoanCalculator loan={loan}></LoanCalculator> 
   </section>
  
     <section className="py-12 container md:py-20">
         <LoanInfoCard></LoanInfoCard>
        </section>
         <section className="mt-[5px] container">
     <div className=" ml-auto mb-5 px-4 md:px-6 text-center">
        <h2 className="text-1xl md:text-3xl font-bold tracking-tight">
       Popüler {loan.loanType.name}
        </h2>
      </div>
    <LoanCalculateCarousel loan={loan}/>
   </section>
        <section className="container mt-20 mb-15">
          <div className=" ml-auto px-4 md:px-6 text-center">
        <h2 className="text-1xl md:text-3xl font-bold tracking-tight">
         {loan.loanType.name} Faiz Oranları
        </h2>
      </div>
         <LoanTable data={loan.banksTable}></LoanTable>
        </section>
        <section className="container mt-[100px] mb-[100px]">
         <div className=" ml-auto px-4 md:px-6 text-center">
        <h2 className="text-1xl md:text-3xl font-bold tracking-tight">
        Sıkça Sorulan Sorular
        </h2>
      </div>
         <LoanFaqs faqs={loan.page.faqs}></LoanFaqs>
        </section>
  </Layout> );
}
