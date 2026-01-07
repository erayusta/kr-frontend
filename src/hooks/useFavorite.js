import { useCallback, useEffect, useMemo, useState } from "react";
import { isFavorited, subscribeFavoritesChanged, toggleFavorited } from "@/lib/favorites";

export function useFavorite(type, id) {
	const normalizedId = useMemo(() => {
		if (id === null || id === undefined) return null;
		const str = String(id).trim();
		return str.length ? str : null;
	}, [id]);

	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		if (!normalizedId) return;

		const sync = () => setIsFavorite(isFavorited(type, normalizedId));
		sync();

		return subscribeFavoritesChanged(sync);
	}, [type, normalizedId]);

	const toggle = useCallback(
		(event) => {
			if (event?.preventDefault) event.preventDefault();
			if (event?.stopPropagation) event.stopPropagation();
			if (!normalizedId) return;

			const next = toggleFavorited(type, normalizedId);
			setIsFavorite(next);
		},
		[type, normalizedId],
	);

	return { isFavorite, toggle, canToggle: Boolean(normalizedId) };
}

