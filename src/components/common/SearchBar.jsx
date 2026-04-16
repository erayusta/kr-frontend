import { Clock, Loader2, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import apiRequest from "@/lib/apiRequest";
import { remainingDay } from "@/utils/campaign";

export const SearchBar = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const router = useRouter();
	const debounceRef = useRef(null);
	const wrapperRef = useRef(null);
	const inputRef = useRef(null);

	// Cmd/Ctrl+K keyboard shortcut — focus input
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Click outside to close results
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setShowResults(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close results on route change
	useEffect(() => {
		const handleRouteChange = () => {
			setShowResults(false);
			setQuery("");
			setResults([]);
		};
		router.events.on("routeChangeStart", handleRouteChange);
		return () => router.events.off("routeChangeStart", handleRouteChange);
	}, [router.events]);

	const searchCampaigns = useCallback((searchQuery) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (searchQuery.length < 2) {
			setResults([]);
			setLoading(false);
			setShowResults(false);
			return;
		}

		setLoading(true);
		setShowResults(true);
		debounceRef.current = setTimeout(async () => {
			try {
				const response = await apiRequest(
					`/campaigns?search=${encodeURIComponent(searchQuery)}&per_page=8`,
					"get",
				);
				setResults(response.data || []);
			} catch {
				setResults([]);
			} finally {
				setLoading(false);
			}
		}, 300);
	}, []);

	const handleChange = (e) => {
		const value = e.target.value;
		setQuery(value);
		searchCampaigns(value);
	};

	const handleFocus = () => {
		if (query.length >= 2) {
			setShowResults(true);
		}
	};

	const handleSelect = (slug) => {
		setShowResults(false);
		setQuery("");
		setResults([]);
		router.push(`/kampanya/${slug}`);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Escape") {
			setShowResults(false);
			inputRef.current?.blur();
		}
	};

	const getRemainingBadge = (endDate) => {
		const remaining = remainingDay(endDate);
		if (remaining < 0) {
			return (
				<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
					<Clock size={10} />
					Süresi Doldu
				</span>
			);
		}
		return (
			<span
				className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
					remaining < 5
						? "bg-red-100 text-red-700"
						: "bg-primary/10 text-primary"
				}`}
			>
				<Clock size={10} />
				{remaining} gün kaldı
			</span>
		);
	};

	return (
		<div ref={wrapperRef} className="relative w-full">
			<div className="relative">
				<Search
					size={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
				/>
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={handleChange}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
					placeholder="Kampanya ara..."
					className="w-full rounded-lg border border-border/60 bg-muted/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/40 focus:bg-background focus:ring-1 focus:ring-primary/20"
				/>
			</div>

			{showResults && (
				<div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
					{loading && (
						<div className="flex items-center justify-center py-6">
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					)}

					{!loading && query.length >= 2 && results.length === 0 && (
						<div className="py-6 text-center text-sm text-muted-foreground">
							Sonuç bulunamadı.
						</div>
					)}

					{!loading && results.length > 0 && (
						<ul className="max-h-[360px] overflow-y-auto py-1">
							{results.map((campaign) => {
								const brand = campaign.brands?.[0];
								return (
									<li key={campaign.id}>
										<button
											type="button"
											onClick={() => handleSelect(campaign.slug)}
											className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent cursor-pointer"
										>
											{/* biome-ignore lint/a11y/useAltText: search result thumbnail */}
											<img
												src={campaign.image}
												alt=""
												className="h-10 w-10 shrink-0 rounded-md object-cover bg-muted"
												onError={(e) => {
													e.currentTarget.style.display = "none";
												}}
											/>
											<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
												<span className="truncate text-sm font-medium">
													{campaign.title}
												</span>
												<div className="flex items-center gap-2">
													{brand && (
														<span className="text-xs text-muted-foreground truncate">
															{brand.name}
														</span>
													)}
													{getRemainingBadge(
														campaign.end_date || campaign.endDate,
													)}
												</div>
											</div>
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};
