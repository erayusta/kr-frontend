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
		}, 150);
	};

	const handleCategoryHover = (slug: string) => {
		setActiveCategory(slug);
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
					className={`flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
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
					<div className="absolute top-full left-0 mt-2 z-50">
						<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[280px]">
							<div className="p-2">
								{menuItems.map((category: any) => (
									<div
										key={category.slug}
										className="relative"
										onMouseEnter={() => handleCategoryHover(category.slug)}
									>
										<Link
											href={`/kategori/${category.slug}`}
											className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
												activeCategory === category.slug
													? "bg-orange-50 text-orange-600"
													: "hover:bg-gray-50"
											}`}
										>
											<div className="flex items-center gap-3">
												<div
													className="product-des w-5 h-5 flex items-center justify-center text-gray-600"
													dangerouslySetInnerHTML={{ __html: getIcon(category.name) }}
												/>
												<span className="font-medium text-sm">{category.name}</span>
											</div>
											{category.children && category.children.length > 0 && (
												<ChevronRight className="h-4 w-4 text-gray-400" />
											)}
										</Link>

										{/* Subcategories - Expand to Right */}
										{category.children && category.children.length > 0 && activeCategory === category.slug && (
											<div
												className="absolute left-full top-0 ml-1 z-50"
												onMouseEnter={() => handleCategoryHover(category.slug)}
											>
												<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[240px]">
													<div className="p-2">
														<div className="px-4 py-2 border-b border-gray-100 mb-1">
															<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
																{category.name}
															</span>
														</div>
														{category.children.map((child: any) => (
															<Link
																key={child.slug}
																href={`/kategori/${child.slug}`}
																className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-150"
															>
																{child.name}
															</Link>
														))}
													</div>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
