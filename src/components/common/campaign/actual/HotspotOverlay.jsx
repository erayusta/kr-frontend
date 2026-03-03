import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import HotspotPopover from "./HotspotPopover";

export default function HotspotOverlay({ hotspots = [] }) {
	const [openId, setOpenId] = useState(null);

	if (!hotspots || hotspots.length === 0) return null;

	return (
		<div className="absolute inset-0 pointer-events-none">
			{hotspots.map((hs) => (
				<div
					key={hs.id}
					className="absolute pointer-events-auto"
					style={{
						left: `${hs.x}%`,
						top: `${hs.y}%`,
						width: `${hs.width}%`,
						height: `${hs.height}%`,
					}}
				>
					<Popover
						open={openId === hs.id}
						onOpenChange={(open) => setOpenId(open ? hs.id : null)}
					>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="w-full h-full border-2 border-orange-400/70 bg-orange-400/5 hover:bg-orange-400/15 rounded-sm cursor-pointer transition-all duration-200 group relative"
								aria-label={hs.title || "Ürün bilgisi"}
							>
								{/* Pulse dot */}
								<span className="absolute -top-1 -right-1 flex h-3 w-3">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
									<span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
								</span>
							</button>
						</PopoverTrigger>
						<PopoverContent
							side="top"
							align="center"
							sideOffset={8}
							className="p-0 w-auto rounded-lg shadow-xl border border-gray-200"
						>
							<HotspotPopover hotspot={hs} />
						</PopoverContent>
					</Popover>
				</div>
			))}
		</div>
	);
}
