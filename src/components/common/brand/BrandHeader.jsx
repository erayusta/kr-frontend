import {
	ArrowUpNarrowWide,
	Clock12Icon,
	HeartIcon,
	Share2Icon,
	SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IMAGE_BASE_URL } from "@/constants/site";
import { getIcon } from "@/lib/utils";
import CategoryFilterDialog from "./BrandFilterDialog";

export default function ({ brand }) {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<section className="w-full py-3  shadow  bg-white dark:bg-gray-800">
			<div className="md:container px-4">
				<div className="grid items-center gap-10 grid-cols-1 md:grid-cols-1">
					<div className="flex gap-x-3 items-center justify-between">
						<div className="flex flex-row gap-3 items-center">
							<div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">
								<img
									className="object-contain group-hover w-24 h-[40px]"
									src={brand.logo}
									alt="Image Description"
								/>
							</div>
							<h1 className="text-3xl w-[85%] font-bold tracking-tighter ">
								{brand.name}
							</h1>
						</div>
						<div className="flex md:flex-row flex-col items-center gap-3">
							<CategoryFilterDialog
								slug={brand.slug}
								open={open}
								onClose={handleClose}
							/>
							<Button
								onClick={handleOpen}
								variant="secondary"
								className="rounded-full  hover:bg-orange-500 hover:text-white py-3"
							>
								<SlidersHorizontal className="mr-2 h-5 w-5" />
								<span className="md:block hidden">Filtrele</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
