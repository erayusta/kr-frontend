import { Newspaper } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
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

	const handleCreateCampaign = () => {
		toast({
			title: "Yakında!",
			description: "Bu İşlev Yakında Hizmetinizde",
		});
	};
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40">
			<div className="absolute inset-0 bg-background backdrop-blur-xl" />

			<div className="relative container flex h-16 items-center justify-between">
				<Link className="flex items-center gap-2 font-semibold" href="/">
					<Image src="/logo.png" alt="KampanyaRadar" width={80} height={80} />
				</Link>

				<nav className="hidden w-full ml-auto justify-between items-center md:flex">
					<div className="flex items-center gap-1 ml-3">
						<CategoryDialog menuItems={menuItems} />
						<LoanDialog />
					</div>

					<div className="flex items-center gap-2">
						<Button
							onClick={handleCreateCampaign}
							className="h-9 gap-2 px-4 text-sm font-medium"
							variant="outline"
						>
							<Newspaper size={18} />
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
