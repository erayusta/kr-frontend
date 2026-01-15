import { Newspaper } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavbarAvatar from "@/components/common/auth/NavbarAvatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMenu } from "@/context/menuContext";
import useAuth from "@/hooks/useAuth";
import { CategoryDialog } from "./CategoryDialog";
import { LoanDialog } from "./LoanDialog";
import { MobileMenu } from "./MobileMenu";

const AuthDialog = dynamic(
	() => import("@/components/common/auth/AuthDialog"),
	{
		ssr: false,
	},
);

export const Header = () => {
	const menuItems = useMenu();
	const { isLoggedIn, profile } = useAuth();
	const { toast } = useToast();

	// Subtle elevation on scroll for professional feel
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleCreateCampaign = () => {
		toast({
			title: "Yakında!",
			description: "Bu İşlev Yakında Hizmetinizde",
		});
	};
	return (
		<header className={`sticky top-0 z-50 w-full border-b border-border/30 transition-shadow ${scrolled ? "shadow-sm" : "shadow-none"}`}>
			<div className="absolute inset-0 bg-background backdrop-blur-xl pointer-events-none" />

			<div className="relative container flex h-16 items-center justify-between px-4 md:px-6">
				<Link
					className="flex items-center gap-2 font-semibold rounded-md -m-1 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
					href="/"
					aria-label="KampanyaRadar Anasayfa"
				>
					<Image
						src="/logo.png"
						alt="KampanyaRadar"
						width={80}
						height={80}
						priority
						className="w-[80px] md:w-[80px] h-auto"
					/>
				</Link>

				<nav className="header-nav hidden w-full ml-auto justify-between items-center md:flex">
					<div className="grid grid-cols-2 items-center gap-x-4 ml-6 md:ml-8 lg:ml-10">
						<CategoryDialog menuItems={menuItems?.filter((item) => item?.children?.length !== 0)} />
						<LoanDialog />
					</div>

					<div className="flex items-center gap-2">
						<Button
							onClick={handleCreateCampaign}
							className="h-9 gap-x-5 px-4 text-sm font-medium border-none text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
							variant="outline"
						>
							<Newspaper size={20} />
							Kampanya Oluştur
						</Button>
						{!isLoggedIn ? (
							<AuthDialog />
						) : (
							<NavbarAvatar size={35} profile={profile} />
						)}
					</div>
				</nav>

				<div className="md:hidden">
					<MobileMenu
						menuItems={menuItems}
						isLoggedIn={isLoggedIn}
						profile={profile}
					/>
				</div>
			</div>
		</header>
	);
};
