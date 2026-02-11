import Loading from "@/components/layouts/loading";
import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SettingsInjector from "@/components/SettingsInjector";
import { MenuProvider } from "@/context/menuContext";
import dynamic from "next/dynamic";

const FavoritesSync = dynamic(() => import("@/components/FavoritesSync"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const urlPath = router.asPath !== "/" ? router.asPath : "";

	useEffect(() => {
		const handleStart = () => setLoading(true);
		const handleComplete = () => setLoading(false);
		const handleError = (err: Error & { cancelled?: boolean }, url: string) => {
			setLoading(false);
			if (err.cancelled) return;
			// Stale build ID recovery: if _next/data fetch fails, do a full page reload
			const isStaleError =
				err.message?.includes("Failed to load") ||
				err.message?.includes("Loading chunk") ||
				err.message?.includes("404");
			if (isStaleError && typeof window !== "undefined") {
				const key = `__stale_reload_${url}`;
				if (!sessionStorage.getItem(key)) {
					sessionStorage.setItem(key, "1");
					window.location.href = url;
				}
			}
		};

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleError);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleError);
		};
	}, [router]);
	return (
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
					<FavoritesSync />
					<Component {...pageProps} />
				</div>
			</MenuProvider>
	);
}
