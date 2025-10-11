
import Layout from "@/components/layouts/layout";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { stripHtmlTags } from "@/lib/utils";
import PageHeader from "@/components/common/page/PageHeader";
import PageContent from "@/components/common/page/PageContent";

export async function getServerSideProps(context) {

try {
 
  const data = await serverApiRequest(`/page/${context.params.slug}`,'get');

 return {
  props: {
   page: data?.page || null,
   ads: data?.ads || []
  }
 }

} catch (error) {
 console.log('hata!', error)
 return {
  notFound:true
 }
}


}


export default function Post({ page, ads }) {
 const router = useRouter()
 const canonical = `http://localhost:3000${router.asPath}`

 // Handle missing page
 if (!page) {
   return (
     <Layout>
       <div className="container py-10">
         <h1>Sayfa bulunamadı</h1>
       </div>
     </Layout>
   );
 }

 return (
  <Layout>
   <NextSeo
      title={`${page.title} | Kampanya Radar`}
      description={stripHtmlTags(page.content)}
      canonical={canonical}
      openGraph={{
        url:canonical,
        title:`${page.title} | Kampanya Radar`,
        description:stripHtmlTags(page.content),
        siteName: 'KampanyaRadar',
      }}
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
      }}
    />
  
  <PageHeader page={page}></PageHeader>
  <PageContent ads={ads} page={page}></PageContent>
  </Layout>);
}
