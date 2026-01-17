import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { isFavorited, subscribeFavoritesChanged, toggleFavorited, setFavorited } from "@/lib/favorites";
import { addFavorite, removeFavorite } from "@/lib/favoritesApi";

export function useFavorite(type, id) {
    const { isLoggedIn } = useAuth();
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
        async (event) => {
            if (event?.preventDefault) event.preventDefault();
            if (event?.stopPropagation) event.stopPropagation();
            if (!normalizedId) return;

            // Block guests
            if (!isLoggedIn) return;

            // Optimistic toggle locally
            const next = toggleFavorited(type, normalizedId);
            setIsFavorite(next);

            try {
                if (next) await addFavorite(type, normalizedId);
                else await removeFavorite(type, normalizedId);
            } catch (e) {
                // Revert on failure
                setFavorited(type, normalizedId, !next);
                setIsFavorite(!next);
            }
        },
        [type, normalizedId, isLoggedIn],
    );

    return { isFavorite, toggle, canToggle: Boolean(normalizedId && isLoggedIn) };
}
