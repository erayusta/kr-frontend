import { useEffect, useId } from "react";

interface GoogleAdSlotProps {
	slotId: string;
	width: number;
	height: number;
	className?: string;
}

export default function GoogleAdSlot({
	slotId,
	width,
	height,
	className,
}: GoogleAdSlotProps) {
	const uniqueId = useId();
	const divId = `${slotId}-${uniqueId}`;

	useEffect(() => {
		if (typeof window !== "undefined" && window.googletag) {
			window.googletag.cmd.push(() => {
				window.googletag?.display(divId);
			});
		}
	}, [divId]);

	return (
		<div
			id={divId}
			className={className}
			style={{ width: `${width}px`, height: `${height}px` }}
		/>
	);
}
