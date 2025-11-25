// components/layout/CategoryAccordion.tsx
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/utils";

interface CategoryAccordionProps {
	menuItems: any;
}

export const CategoryAccordion = ({
	menuItems = [],
}: CategoryAccordionProps) => {
	if (!Array.isArray(menuItems) || menuItems.length === 0) return null;

	return (
		<div className="w-full grid items-center">
			{menuItems.map((category) => (
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
										dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
									/>
									{category.name}
								</Link>
							</Button>
							{category.children && category.children.length > 0 && (
								<AccordionTrigger />
							)}
						</div>
						{category.children && category.children.length > 0 && (
							<AccordionContent>
								<div className="grid gap-y-2">
									{category.children.map((child) => (
										<Button
											key={child.slug}
											asChild
											className="justify-between items-center w-full"
											variant="ghost"
										>
											<Link href={`/kategori/${child.slug}`}>{child.name}</Link>
										</Button>
									))}
								</div>
							</AccordionContent>
						)}
					</AccordionItem>
				</Accordion>
			))}
		</div>
	);
};
