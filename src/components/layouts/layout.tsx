import { Inter as FontSans } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "../ui/toaster";
import Footer from "./footer";
import { Header } from "./header";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

interface LayoutProps {
	children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
	return (
		<main
			className={cn(
				"min-h-screen bg-[#FFFAF4] font-sans antialiased",
				fontSans.variable,
			)}
		>
			<Toaster />
			<div>
				<Header />
				<div>{children}</div>
				<Footer />
			</div>
		</main>
	);
};
