// components/layout/CategoryDialog.tsx
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

interface CategoryDialogProps {
	menuItems: any;
}

export const CategoryDialog = ({ menuItems }: CategoryDialogProps) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleRoute = () => {
			setIsOpen(false);
			setActiveCategory(null);
		};
		router.events.on("routeChangeStart", handleRoute);
		return () => router.events.off("routeChangeStart", handleRoute);
	}, [router.events]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsOpen(false);
			setActiveCategory(null);
		}, 200);
	};

	const handleCategoryEnter = (slug: string) => {
		setActiveCategory(slug);
	};

	const handleCategoryLeave = () => {
		// Don't clear activeCategory here, let the main container handle it
	};

	if (!Array.isArray(menuItems) || menuItems.length === 0) return null;

	return (
		<>
			{/* Blur Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
					style={{ top: '64px' }}
					onMouseEnter={handleMouseLeave}
				/>
			)}

			<div
				ref={containerRef}
				className="relative"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Button
					className={`flex items-center gap-3 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
						isOpen
							? "bg-orange-500 text-white"
							: "text-foreground hover:bg-orange-500 hover:text-white"
					}`}
					variant="ghost"
				>
					Kategoriler
					<ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
				</Button>

				{/* Dropdown Menu */}
				{isOpen && (
					<div className="absolute top-full left-0 mt-2 z-50 flex">
						{/* Main Categories */}
						<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
							<div className="p-2">
								{menuItems.map((category: any) => {
									const hasChildren = category.children && category.children.length > 0;
									const isActive = activeCategory === category.slug;

									return (
										<div
											key={category.slug}
											onMouseEnter={() => handleCategoryEnter(category.slug)}
											onMouseLeave={handleCategoryLeave}
										>
											<Link
												href={`/kategori/${category.slug}`}
												className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
													isActive
														? "bg-orange-500 text-white"
														: "text-gray-700 hover:bg-orange-500 hover:text-white"
												}`}
											>
												<div className="flex items-center gap-3">
													<div
														className={`product-des w-5 h-5 flex items-center justify-center ${isActive ? "text-white" : "text-gray-600"}`}
														dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
													/>
													<span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
												</div>
												{hasChildren && (
													<ChevronRight className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
												)}
											</Link>
										</div>
									);
								})}
							</div>
						</div>

						{/* Subcategories Panel - Opens to the Right */}
						{activeCategory && menuItems.find((c: any) => c.slug === activeCategory)?.children?.length > 0 && (
							<div
								className="ml-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
								onMouseEnter={() => setActiveCategory(activeCategory)}
							>
								<div className="p-2">
									<div className="px-4 py-2 border-b border-gray-100 mb-1">
										<span className="text-xs font-semibold text-orange-500 uppercase tracking-wide whitespace-nowrap">
											{menuItems.find((c: any) => c.slug === activeCategory)?.name}
										</span>
									</div>
									{menuItems.find((c: any) => c.slug === activeCategory)?.children.map((child: any) => (
										<Link
											key={child.slug}
											href={`/kategori/${child.slug}`}
											className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-500 hover:text-white transition-all duration-150 whitespace-nowrap"
										>
											{child.name}
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};
