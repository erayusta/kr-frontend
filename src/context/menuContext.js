import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "@/lib/apiRequest";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
	const [menuItems, setMenuItems] = useState([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const getMenuItems = async () => {
			try {
				const data = await apiRequest("/categories", "get");
				// Ensure data is an array
				if (Array.isArray(data)) {
					setMenuItems(data);
				} else {
					console.error(
						"[MenuContext] Categories response is not an array:",
						data,
					);
					setMenuItems([]);
				}
			} catch (error) {
				console.error("[MenuContext] Failed to fetch categories:", error);
				setMenuItems([]);
			}
		};
		getMenuItems();
	}, [mounted]);

	return (
		<MenuContext.Provider value={menuItems}>{children}</MenuContext.Provider>
	);
};

export const useMenu = () => {
	const context = useContext(MenuContext);
	// Always return an array even if context is undefined
	return context || [];
};
