// components/layout/MobileMenu.tsx
import { AlignRight, Newspaper, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavbarAvatar from "@/components/common/auth/NavbarAvatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { getIcon } from "@/lib/utils";
import { CategoryAccordion } from "./CategoryAcrodion";
import { LOAN_TYPES } from "./LoanDialog";

const AuthDialog = dynamic(
	() => import("@/components/common/auth/AuthDialog"),
	{
		ssr: false,
	},
);

interface MobileMenuProps {
	menuItems: any;
	isLoggedIn: boolean;
	profile: any;
}

export const MobileMenu = ({
	menuItems,
	isLoggedIn,
	profile,
}: MobileMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const handleRouteChange = () => setIsOpen(false);
		router.events.on("routeChangeStart", handleRouteChange);
		return () => router.events.off("routeChangeStart", handleRouteChange);
	}, [router.events]);

	const handleCreateCampaign = () => {
		toast({
			title: "Yakında!",
			description: "Bu İşlev Yakında Hizmetinizde",
		});
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button size="icon" variant="ghost">
					<AlignRight className="h-6 w-6" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>

			{!isLoggedIn ? (
				<GuestMenu
					menuItems={menuItems}
					onCreateCampaign={handleCreateCampaign}
				/>
			) : (
				<UserMenu
					menuItems={menuItems}
					profile={profile}
					onCreateCampaign={handleCreateCampaign}
				/>
			)}
		</Sheet>
	);
};

const GuestMenu = ({
	menuItems,
	onCreateCampaign,
}: {
	menuItems: any;
	onCreateCampaign: () => void;
}) => (
	<SheetContent className="max-w-md rounded-t-md px-5" side="bottom">
		<LoanGrid />

		<div className="flex flex-col mt-10 overflow-x-scroll h-[450px] px-4">
			<div className="text-md font-semibold mb-2">Kategoriler</div>
			<CategoryAccordion menuItems={menuItems} />
		</div>

		<div className="grid grid-cols-2 gap-x-3 mt-5">
			<Button onClick={onCreateCampaign} variant="outline">
				<Newspaper className="mr-2" size={20} />
				Kampanya Oluştur
			</Button>
			<AuthDialog />
		</div>
	</SheetContent>
);

const UserMenu = ({
	menuItems,
	profile,
	onCreateCampaign,
}: {
	menuItems: any;
	profile: any;
	onCreateCampaign: () => void;
}) => (
	<SheetContent className="w-full max-w-full" side="right">
		<div className="flex h-24 items-center justify-center px-4">
			<Link className="flex flex-col items-center gap-2 font-semibold" href="#">
				<NavbarAvatar size="65" profile={profile} />@{profile?.firstName}
			</Link>
		</div>

		<div className="flex flex-row items-center justify-between gap-x-2 px-4 py-2">
			<Button variant="outline" className="w-full">
				<Settings className="mr-2" size={20} /> Hesabım
			</Button>
			<Button onClick={onCreateCampaign} className="w-full">
				<Newspaper className="mr-2" size={20} /> Kampanya Oluştur
			</Button>
		</div>

		<hr className="my-2" />
		<LoanGrid />
		<hr className="my-2" />

		<div className="flex mt-10 flex-col px-0">
			<div className="text-md font-semibold mb-2">Kategoriler</div>
			<CategoryAccordion menuItems={menuItems} />
		</div>
	</SheetContent>
);

const LoanGrid = () => (
	<div className="grid grid-cols-3 gap-y-2">
		{LOAN_TYPES.map((loan, index) => (
			<Button
				key={`mobile-loan-${index}`}
				asChild
				className="flex w-full flex-col justify-between items-center gap-2"
				variant="ghost"
			>
				<Link href={loan.href}>
					<div
						className="product-des"
						dangerouslySetInnerHTML={{ __html: getIcon(loan.iconKey) }}
					/>
					{loan.name}
				</Link>
			</Button>
		))}
	</div>
);
