// components/layout/CategoryDialog.tsx
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/utils";

interface CategoryDialogProps {
	menuItems: any;
}

export const CategoryDialog = ({ menuItems }: CategoryDialogProps) => {
	if (!Array.isArray(menuItems) || menuItems.length === 0) return null;

	return (
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
					{menuItems.map((category) => (
						<CategoryItem key={category.slug} category={category} />
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const CategoryItem = ({ category }: { category: MenuItem }) => {
	return (
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
							dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
						/>
						{category.name}
					</Link>
				</Button>
				{category.children && category.children.length > 0 && (
					<DialogTrigger asChild>
						<Button variant="outline" className="w-[50px]">
							<ChevronDownIcon className="h-4 w-4" />
						</Button>
					</DialogTrigger>
				)}
			</div>

			{category.children && category.children.length > 0 && (
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>
							<div
								className="product-des mb-2"
								dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
							/>
							{category.name}
						</DialogTitle>
						<DialogDescription>
							{category.name} Geniş Kampanya Seçeneklerimizi Keşfedin.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-y-2">
						{category.children.map((child) => (
							<Button
								key={child.slug}
								asChild
								className="justify-between items-center w-full"
								variant="ghost"
							>
								<Link href={`/kategori/${child.slug}`}>
									{child.name}
									<ChevronRight className="h-4 w-4" />
								</Link>
							</Button>
						))}
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
};
