

import Layout from "@/components/layouts/layout";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";
import { loanType } from "@/constants/loan";
import LoanDetailHeader from "@/components/common/loan/detail/LoanDetailHeader";
import LoanDetailContent from "@/components/common/loan/detail/LoanDetailContent";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

export async function getServerSideProps(context) {
 const { slug, bankSlug } = context.params;
 const params = new URLSearchParams({
   maturity: parseInt(context.query.maturity) || 12,
   amount: context.query.amount || 10000,
  });
 const loan = await serverApiRequest(`/loan/${loanType[slug]}/${bankSlug}/detail?${params.toString()}`,'get')
console.log(loan)
 return {
  props: {
   loan: loan
  }
 }

}


export default function LoanIndex({ loan }) {
const router = useRouter()
 const canonical = `https://www.kampanyaradar.com${router.asPath}`
 return (
  <Layout>
   <NextSeo
    title={`${loan.title} | Kampanyaradar`}
    description={`kampanyaradar`}
    canonical={canonical}
    openGraph={{
     url: canonical,
     title: `${loan.title} | Kampanya Radar`,
     description:'',
     siteName: 'KampanyaRadar',
    }}
    twitter={{
     handle: '@handle',
     site: '@site',
     cardType: 'summary_large_image',
    }}
   />
  <LoanDetailHeader loan={loan}></LoanDetailHeader>
  <LoanDetailContent loan={loan}></LoanDetailContent>
  </Layout>);
}
