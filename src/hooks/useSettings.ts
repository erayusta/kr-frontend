import { useEffect, useRef, useState } from "react";
import { fetchSettings } from "@/lib/apiRequest";

type Settings = Record<string, unknown> & {
	footer_text?: string;
	facebook_url?: string;
	twitter_url?: string;
	instagram_url?: string;
	youtube_url?: string;
	contact_email?: string;
	contact_phone?: string;
	contact_address?: string;
	head_after_code?: string;
	body_after_code?: string;
	body_end_code?: string;
};

const CACHE_KEY = "kr:settings:v1";
const CACHE_TTL_MS = 60 * 1000;

function readCache(): { data: Settings; fetchedAt: number } | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { data?: Settings; fetchedAt?: number };
		if (!parsed?.data || !parsed?.fetchedAt) return null;
		return { data: parsed.data, fetchedAt: parsed.fetchedAt };
	} catch {
		return null;
	}
}

function writeCache(data: Settings) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(
			CACHE_KEY,
			JSON.stringify({ data, fetchedAt: Date.now() }),
		);
	} catch {
		// ignore storage errors (quota, privacy mode, etc.)
	}
}

export function useSettings(options?: { revalidateIfStale?: boolean }) {
	const revalidateIfStale = options?.revalidateIfStale ?? true;

	const [settings, setSettings] = useState<Settings>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<unknown>(null);

	const didFetchRef = useRef(false);

	useEffect(() => {
		if (didFetchRef.current) return;
		didFetchRef.current = true;

		const cachedNow = readCache();
		const isFresh =
			!!cachedNow?.fetchedAt && Date.now() - cachedNow.fetchedAt < CACHE_TTL_MS;

		if (cachedNow?.data) {
			setSettings(cachedNow.data);
			setIsLoading(false);
		}

		if (!revalidateIfStale && cachedNow?.data) {
			return;
		}

		if (cachedNow?.data && isFresh) {
			return;
		}

		setIsLoading(true);
		fetchSettings()
			.then((data: any) => {
				const next = (data || {}) as Settings;
				setSettings(next);
				writeCache(next);
				setError(null);
			})
			.catch((err: unknown) => {
				setError(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [revalidateIfStale]);

	return { settings, isLoading, error };
}
