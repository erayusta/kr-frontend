
import GoodYearAdsModal  from "@/components/common/GoodYearAdsModal";
import { Html,Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
     
      <Head>
        
 <script async src="https://www.googletagmanager.com/gtag/js?id=G-5LM54ZC"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5LM54ZC');
            `,
          }}
        />
       </Head>
      <body className={`antialiased  bg-gradient-to-b from-[#FFFAF4]`}>
        
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LM54ZC"
height="0" width="0"   style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
