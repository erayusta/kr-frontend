
import Ad from "../ads/Ad";

export default function PageContent({page, ads }) {


 return (<section className="w-full pb-20 ">
  <div className="container px-4 md:px-6">
   <div className="grid gap-8">
    <div className="mt-5">
     <div className="mt-4 max-w-5xl grid gap-4 text-sm/relaxed">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
       <Ad position="center" ad={ads?.find(item => item.position == 'post_content_one')}></Ad>
       <Ad position="center" ad={ads?.find(item => item.position == 'post_content_two')}></Ad>
       <Ad position="right" ad={ads?.find(item => item.position == 'post_right')}></Ad>
       <Ad position="left" ad={ads?.find(item => item.position == 'post_left')}></Ad>

      </div>
      <div className="mt-5" dangerouslySetInnerHTML={{ __html: page.content }}></div>
     

     </div>
    </div>

   </div>
  </div>
 </section>)
}

