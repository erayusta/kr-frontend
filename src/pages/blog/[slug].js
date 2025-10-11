
import Layout from "@/components/layouts/layout";
import serverApiRequest from "@/lib/serverApiRequest";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { stripHtmlTags } from "@/lib/utils";
import BlogHeader from "@/components/common/blog/BlogHeader";
import BlogContent from "@/components/common/blog/BlogContent";
export async function getServerSideProps(context) {

try {
 
  const data = await serverApiRequest(`/posts/${context.params.slug}`,'get');

 return {
  props: {
   post: data?.data || null,
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


export default function Post({ post,ads }) {

 const router = useRouter()
   const canonical = `http://localhost:3000${router.asPath}`

 // Handle missing post data
 if (!post) {
   return (
     <Layout>
       <div className="container py-10">
         <h1>Yazı bulunamadı</h1>
       </div>
     </Layout>
   );
 }

 return (
  <Layout>
   <NextSeo
      title={`${post?.title || 'Blog'} | Kampanya Radar`}
      description={stripHtmlTags(post?.content || '')}
      canonical={canonical}
      openGraph={{
        url:canonical,
        title:`${post?.title || 'Blog'} | Kampanya Radar`,
        description:stripHtmlTags(post?.content || ''),
        images: [
          {
            url: post?.image ? `https://kampanyaradar.s3.us-east-1.amazonaws.com/kampanyaradar/posts/${post.image}` : '',
            width: 800,
            height: 600,
            alt:post?.title || 'Blog',
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
  
  <BlogHeader post={post}></BlogHeader>
  <BlogContent ads={ads} post={post}></BlogContent>
   <section className="container">
 
   </section>
  </Layout>);
}
