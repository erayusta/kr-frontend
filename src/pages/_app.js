import Loading from "@/components/layouts/loading";
import "@/styles/globals.css";
import { LoaderIcon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Inter } from '@next/font/google';
import { MenuProvider } from "@/context/menuContext";
import NoSSR from "@/components/NoSSR";

const inter = Inter({ subsets: ['latin'] });


export default function App({ Component, pageProps }) {

   const [loading, setLoading] = useState(false);
  const router = useRouter();
  const urlPath = router.asPath !== '/' ? router.asPath : '';
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
  <NoSSR>
    <MenuProvider>
      <Head>
        <link
              rel="alternate"
              href={`${process.env.NEXT_PUBLIC_BASE_URL}${urlPath}`}
              hreflang="tr"
            />
            <link
              rel="canonical"
              href={`${process.env.NEXT_PUBLIC_BASE_URL}${urlPath}`}
            />
            <meta name="google-site-verification" content="1uewPo15Vsrn3MpvrqeAPyC6ZIjmDl5QO5tU6GnXRhM" />
            <script async src="https://cdn-native.pigeoon.com/common/pgn-native-manager.js"></script>
          </Head>
      {loading && <Loading></Loading>}
      <div className={inter.className}><Component {...pageProps} /></div> 
    </MenuProvider>
  </NoSSR>
)
     
    
}