import { Newspaper } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import NavbarAvatar from "@/components/common/auth/NavbarAvatar";
import { SearchBar } from "@/components/common/SearchBar";
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
		<header className="w-full border-b border-border/40 bg-background">
			<div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
					<div className="flex items-center gap-x-1 ml-14 md:ml-20 lg:ml-24">
						<CategoryDialog menuItems={menuItems} />
						<LoanDialog />
						<Link
							href="/fiyat-karsilastir"
							className="h-10 px-4 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center rounded-md hover:bg-orange-50"
						>
							Fiyat Karşılaştır
						</Link>
						<Link
							href="/kampanyalar"
							className="h-10 px-4 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center rounded-md hover:bg-orange-50"
						>
							Kampanyalar
						</Link>
						<Link
							href="/gunun-firsatlari"
							className="h-10 px-4 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center rounded-md hover:bg-orange-50 gap-1"
						>
							⚡ Günün Fırsatları
						</Link>
						<Link
							href="/fiyat-dusus"
							className="h-10 px-4 text-sm font-medium text-green-600 hover:text-green-700 transition-colors flex items-center rounded-md hover:bg-green-50 gap-1"
						>
							📉 Fiyat Düşüşleri
						</Link>
						<Link
							href="/yeni-urunler"
							className="h-10 px-4 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center rounded-md hover:bg-violet-50 gap-1"
						>
							✨ Yeni
						</Link>
					</div>

					<div className="flex-1 flex justify-center px-4 max-w-sm">
						<SearchBar />
					</div>

					<div className="flex items-center gap-3">
						<Button
							onClick={handleCreateCampaign}
							className="h-10 gap-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-orange-500 hover:text-white hover:border-orange-500"
							variant="outline"
						>
							<Newspaper size={18} />
							<span>Kampanya Oluştur</span>
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
