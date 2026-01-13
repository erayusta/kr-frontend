import { useEffect, useState } from "react";
import { getFavoritesState, subscribeFavoritesChanged } from "@/lib/favorites";

export type FavoritesState = {
	campaign: string[];
	post: string[];
	brand: string[];
	category: string[];
};

const EMPTY: FavoritesState = {
	campaign: [],
	post: [],
	brand: [],
	category: [],
};

function normalizeState(input: any): FavoritesState {
	const state = input && typeof input === "object" ? input : {};
	return {
		campaign: Array.isArray(state.campaign) ? state.campaign.map(String) : [],
		post: Array.isArray(state.post) ? state.post.map(String) : [],
		brand: Array.isArray(state.brand) ? state.brand.map(String) : [],
		category: Array.isArray(state.category) ? state.category.map(String) : [],
	};
}

export function useFavoritesState() {
	const [favorites, setFavorites] = useState<FavoritesState>(EMPTY);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const sync = () => {
			setFavorites(normalizeState(getFavoritesState()));
			setIsReady(true);
		};

		sync();
		return subscribeFavoritesChanged(sync);
	}, []);

	return { favorites, isReady };
}

