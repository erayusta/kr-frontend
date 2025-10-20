

import CategoryCampaginCarousel from "@/components/common/home/CategoryCampaignCarousel";
import HeroCarousel from "@/components/common/home/HeroCarousel";
import HeroLp from "@/components/common/home/HeroLp";
import Layout from "@/components/layouts/layout";
import BrandCarousel from "@/components/common/home/BrandCarousel";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";
import Ad from "@/components/common/ads/Ad";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import LatestPost from "@/components/common/home/LatestPost";
import InfoBox from "@/components/common/home/InfoBox";

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/','get');
    
    return {
      props: {
        categories: data?.categories || [],
        carousels: data?.sliders || [],
        brands: data?.brands || [],
        ads: data?.ads || [],
        posts: data?.posts || []
      }
    }
  } catch (error) {
    console.error('[HomePage SSR Error]', error.message);
    
    // Return empty arrays to prevent client errors
    return {
      props: {
        categories: [],
        carousels: [],
        brands: [],
        ads: [],
        posts: []
      }
    }
  }
}


export default function Home({ categories, carousels, brands, ads, posts }) {
  const router = useRouter();
  const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/`

 return (
  <Layout>
     <NextSeo
      title="Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar"
      description="Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir. A101 ve Bim gibi marketlerin güncel kampanyaları burada!"
      canonical={canonical}
      openGraph={{
        url: process.env.NEXT_PUBLIC_BASE_URL,
        title: 'Güncel İndirim Kampanyaları ve Kredi Fırsatları | Kampanya Radar',
        description:"Kampanya Radar, Türkiye'deki tüm indirimler ve kredi fırsatlarını bir araya getirir. A101 ve Bim gibi marketlerin güncel kampanyaları burada!",
        images: [
          {
            url: "https://kampanyaradar.s3.us-east-1.amazonaws.com/kampanyaradar/general/Mlk7WBxx36Op0Ej.png",
            width: 800,
            height: 600,
            alt: 'KampanyaRadar',
            type: 'image/jpeg',
          },
        ],
        siteName: 'KampanyaRadar',
      }}
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
      }}
    />
   <section className="flex-1 p-4 md:container  mx-auto min-h-screen antialiased">
     <Ad position="right" ad={ads?.find(item => item.position == 'home_right')}></Ad>
     <Ad position="left" ad={ads?.find(item => item.position == 'home_left')}></Ad>
     <Ad position="center" ad={ads?.find(item => item.position === 'home_header')}></Ad>
   
    <div className="grid  md:grid-cols-2 grid-cols-1 gap-5">
     <HeroCarousel data={carousels}>
      <BrandCarousel data={brands}></BrandCarousel>
     </HeroCarousel>
   <HeroLp></HeroLp>
    </div>
    
    <CategoryCampaginCarousel data={categories}></CategoryCampaginCarousel>
    <InfoBox></InfoBox>
<LatestPost posts={posts}></LatestPost>
   </section>
  </Layout>);
}
