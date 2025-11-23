import {
	AlignRight,
	ChevronDownIcon,
	ChevronRight,
	ChevronRightIcon,
	Newspaper,
	Settings,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMenu } from "@/context/menuContext";
import useAuth from "@/hooks/useAuth";
import { getIcon } from "@/lib/utils";
import NavbarAvatar from "../common/auth/NavbarAvatar";
import { useToast } from "../ui/use-toast";

const AuthDialog = dynamic(() => import("../common/auth/AuthDialog"), {
	ssr: false,
});

const loanTypes = [
	{ name: "İhtiyaç Kredisi", href: "/kredi/ihtiyac-kredisi", iconKey: "Lira" },
	{ name: "Taşıt Kredisi", href: "/kredi/tasit-kredisi", iconKey: "Otomotiv" },
	{
		name: "Konut Kredisi",
		href: "/kredi/konut-kredisi",
		iconKey: "Ev Yaşam & Ofis",
	},
];

export const Header = () => {
	const [mounted, setMounted] = useState(false);
	const menuItems = useMenu();
	const { isLoggedIn, profile } = useAuth();
	const { toast } = useToast();

	useEffect(() => {
		setMounted(true);
	}, []);

	const MobileMenu = () => {
		const [isOpen, setIsOpen] = useState(false);
		const router = useRouter();

		useEffect(() => {
			const handleRouteChange = () => {
				setIsOpen(false);
			};

			router.events.on("routeChangeStart", handleRouteChange);
			return () => {
				router.events.off("routeChangeStart", handleRouteChange);
			};
		}, [router.events]);

		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button className="" size="icon" variant="ghost">
						<AlignRight className="h-6 w-6" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				{mounted && !isLoggedIn ? (
					<SheetContent className=" max-w-md rounded-t-md px-5" side="bottom">
						<div className="grid grid-cols-3 gap-y-2">
							{loanTypes.map((loan, index) => (
								<div key={`mobile-loan-${index}`} className="space-y-1">
									<Button
										asChild
										className="flex w-full flex-col justify-between items-center gap-2"
										variant="ghost"
									>
										<Link href={loan.href}>
											<div
												className="product-des"
												dangerouslySetInnerHTML={{
													__html: getIcon(loan.iconKey),
												}}
											></div>
											{loan.name}
										</Link>
									</Button>
								</div>
							))}
						</div>

						<div className="flex flex-col mt-10 overflow-x-scroll h-[450px] px-4">
							<div className="text-md font-semibold mb-2">Kategoriler</div>
							<CategoryAccordion menuItems={menuItems} />
						</div>

						<div className="grid grid-cols-2 gap-x-3 mt-5">
							<Button
								className=""
								onClick={() => {
									toast({
										title: "Yakında!",
										description: "Bu İşlev Yakında Hizmetinizde",
									});
								}}
								variant="outline"
							>
								<Newspaper className="mr-2" size={20} />
								Kampanya Oluştur
							</Button>
							<AuthDialog></AuthDialog>
						</div>
					</SheetContent>
				) : (
					<SheetContent className="w-full max-w-full" side="right">
						<div className="flex h-24 items-center justify-center px-4">
							<Link
								className="flex flex-col items-center gap-2 font-semibold"
								href="#"
							>
								<NavbarAvatar size="65" profile={profile} />@
								{profile?.firstName}
							</Link>
						</div>
						<div className="flex flex-row items-center justify-between gap-x-2 px-4 py-2">
							<Button variant="outline" className="w-full">
								<Settings className="mr-2" size={20} /> Hesabım
							</Button>
							<Button
								onClick={() => {
									toast({
										title: "Yakında!",
										description: "Bu İşlev Yakında Hizmetinizde",
									});
								}}
								className="w-full"
							>
								<Newspaper className="mr-2" size={20} /> Kampanya Oluştur
							</Button>
						</div>
						<hr className="my-2" />
						<div className="grid grid-cols-3 gap-y-2">
							{loanTypes.map((loan, index) => (
								<div key={`mobile-loan-${index}`} className="space-y-1">
									<Button
										asChild
										className="flex w-full flex-col justify-between items-center gap-2"
										variant="ghost"
									>
										<Link href={loan.href}>
											<div
												className="product-des"
												dangerouslySetInnerHTML={{
													__html: getIcon(loan.iconKey),
												}}
											></div>
											{loan.name}
										</Link>
									</Button>
								</div>
							))}
						</div>
						<hr className="my-2" />
						<div className="flex mt-10 flex-col px-0">
							<div className="text-md font-semibold mb-2">Kategoriler</div>
							<CategoryAccordion menuItems={menuItems} />
						</div>
					</SheetContent>
				)}
			</Sheet>
		);
	};

	function CategoryAccordion({ menuItems = [] }) {
		return (
			<div className="w-full grid  items-center ">
				{Array.isArray(menuItems) &&
					menuItems.map((category) => (
						<Accordion key={category.slug} type="single" collapsible>
							<AccordionItem value={category.slug}>
								<div className="flex justify-between items-center">
									<Button
										asChild
										className="flex w-full justify-start pl-0 items-center gap-x-4"
										variant="ghost"
									>
										<Link href={`/kategori/${category.slug}`}>
											<div
												className="product-des"
												dangerouslySetInnerHTML={{
													__html: getIcon(category.name),
												}}
											></div>
											{category.name}
										</Link>
									</Button>
									<AccordionTrigger></AccordionTrigger>
								</div>
								<AccordionContent>
									<div className="grid gap-y-2">
										{category.children &&
											Array.isArray(category.children) &&
											category.children.map((children) => (
												<Link
													key={children.slug}
													href={`/kategori/${children.slug}`}
													className="space-y-1"
												>
													<Button
														className="justify-between items-center w-full"
														variant="ghost"
													>
														{children.name}
													</Button>
												</Link>
											))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}
			</div>
		);
	}

	function CategoryDialog() {
		return (
			<div className="w-auto flex items-center gap-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2" variant="ghost">
							<ChevronDownIcon className="h-4 w-4" />
							Kategoriler
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[400px]">
						<DialogHeader>
							<DialogTitle>Tüm Kategoriler</DialogTitle>
							<DialogDescription>
								Geniş Kampanya Seçeneklerimizi Keşfedin.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-y-2">
							{Array.isArray(menuItems) &&
								menuItems.map((category) => (
									<div key={category.slug} className="space-y-1">
										<Dialog>
											<div className="flex justify-between items-center">
												<Button
													asChild
													className="flex w-full justify-start items-center gap-x-4"
													variant="ghost"
												>
													<Link href={`/kategori/${category.slug}`}>
														<div
															className="product-des"
															dangerouslySetInnerHTML={{
																__html: getIcon(category.name),
															}}
														></div>
														{category.name}
													</Link>
												</Button>
												<DialogTrigger asChild>
													<Button variant="outline" className="w-[50px]">
														<ChevronDownIcon className="h-4 w-4" />
													</Button>
												</DialogTrigger>
											</div>

											<DialogContent className="sm:max-w-[400px]">
												<DialogHeader>
													<DialogTitle>
														<div
															className="product-des mb-2"
															dangerouslySetInnerHTML={{
																__html: getIcon(category.name),
															}}
														></div>
														{category.name}
													</DialogTitle>
													<DialogDescription>{`${category.name} Geniş Kampanya Seçeneklerimizi Keşfedin.`}</DialogDescription>
												</DialogHeader>
												<div className="grid gap-y-2">
													{category.children &&
														Array.isArray(category.children) &&
														category.children.map((children) => (
															<Link
																key={children.slug}
																asChild
																href={`/kategori/${children.slug}`}
																className="space-y-1"
															>
																<Button
																	className="justify-between items-center  w-full"
																	variant="ghost"
																>
																	{children.name}
																	<ChevronRight className="h-4 w-4 mr-2" />
																</Button>
															</Link>
														))}
												</div>
											</DialogContent>
										</Dialog>
									</div>
								))}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	function LoanDialog() {
		return (
			<div className="w-auto flex items-center gap-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2" variant="ghost">
							<ChevronDownIcon className="h-4 w-4" />
							Krediler
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[400px]">
						<DialogHeader>
							<DialogTitle>Tüm Kredi Türleri</DialogTitle>
							<DialogDescription>
								Hesaplama Yapmak İstediğiniz Kredi Türlerini Keşfedin.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-y-2">
							{loanTypes.map((loan, index) => (
								<div key={`loan-${index}`} className="space-y-1">
									<Button
										asChild
										className="flex w-full justify-between items-center gap-2"
										variant="ghost"
									>
										<Link href={loan.href}>
											<div
												className="product-des"
												dangerouslySetInnerHTML={{
													__html: getIcon(loan.iconKey),
												}}
											></div>
											{loan.name}
											<ChevronRightIcon className="h-4 w-4" />
										</Link>
									</Button>
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<header className={`bg-background py-2 md:py-2  dark:bg-gray-950 `}>
			<div className="container flex h-16 items-center justify-between">
				<Link className="flex items-center gap-2 font-semibold" href="/">
					<Image src="/logo.png" alt="KampanyaRadar" width={80} height={80} />
				</Link>
				<nav className="hidden w-full ml-auto justify-between items-center md:flex">
					<div className="grid grid-cols-2 items-center ml-3">
						<CategoryDialog></CategoryDialog>
						<LoanDialog></LoanDialog>
					</div>

					<div className="grid grid-cols-2 items-center">
						<Button
							onClick={() => {
								toast({
									title: "Yakında!",
									description: "Bu İşlev Yakında Hizmetinizde",
								});
							}}
							className="h-9 gap-x-5 px-4 text-sm font-medium border-none"
							variant="outline"
						>
							<Newspaper size={20}></Newspaper> Kampanya Oluştur
						</Button>
						{mounted ? (
							!isLoggedIn ? (
								<AuthDialog></AuthDialog>
							) : (
								<NavbarAvatar size={35} profile={profile}></NavbarAvatar>
							)
						) : null}
					</div>
				</nav>

				<div className="md:hidden ">
					<MobileMenu></MobileMenu>
				</div>
			</div>
		</header>
	);
};
