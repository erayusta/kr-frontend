import Loading from "@/components/layouts/loading";
import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NoSSR from "@/components/NoSSR";
import SettingsInjector from "@/components/SettingsInjector";
import { MenuProvider } from "@/context/menuContext";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const urlPath = router.asPath !== "/" ? router.asPath : "";

	useEffect(() => {
		const handleStart = () => setLoading(true);
		const handleComplete = () => setLoading(false);

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleComplete);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleComplete);
		};
	}, [router]);

	return (
		<NoSSR>
			<MenuProvider>
				<SettingsInjector />
				<Head>
					<link
						rel="alternate"
						href={`${process.env.NEXT_PUBLIC_BASE_URL}${urlPath}`}
						hrefLang="tr"
					/>
					<link
						rel="canonical"
						href={`${process.env.NEXT_PUBLIC_BASE_URL}${urlPath}`}
					/>
				</Head>
				{loading && <Loading></Loading>}
				<div className={inter.className}>
					<Component {...pageProps} />
				</div>
			</MenuProvider>
		</NoSSR>
	);
}
