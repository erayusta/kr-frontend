const STORAGE_KEY = "kr:favorites:v1";
const EVENT_NAME = "kr:favorites:changed";

const DEFAULT_STATE = {
	campaign: [],
	post: [],
	brand: [],
	category: [],
};

function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(json) {
	if (!json) return null;
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

function normalizeId(id) {
	if (id === null || id === undefined) return null;
	const str = String(id).trim();
	return str.length ? str : null;
}

function readState() {
	if (!canUseStorage()) return { ...DEFAULT_STATE };

	const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
	if (!parsed || typeof parsed !== "object") return { ...DEFAULT_STATE };

	return {
		...DEFAULT_STATE,
		...parsed,
	};
}

function writeState(state) {
	if (!canUseStorage()) return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	window.dispatchEvent(new Event(EVENT_NAME));
}

export function isFavorited(type, id) {
	const normalizedId = normalizeId(id);
	if (!normalizedId) return false;

	const state = readState();
	const list = Array.isArray(state[type]) ? state[type] : [];
	return list.includes(normalizedId);
}

export function setFavorited(type, id, value) {
	const normalizedId = normalizeId(id);
	if (!normalizedId) return false;

	const state = readState();
	const current = Array.isArray(state[type]) ? state[type] : [];
	const set = new Set(current.map((v) => String(v)));

	if (value) set.add(normalizedId);
	else set.delete(normalizedId);

	writeState({ ...state, [type]: Array.from(set) });
	return value;
}

export function toggleFavorited(type, id) {
	const next = !isFavorited(type, id);
	setFavorited(type, id, next);
	return next;
}

export function subscribeFavoritesChanged(callback) {
	if (typeof window === "undefined") return () => {};

	const onCustom = () => callback();
	const onStorage = (event) => {
		if (event?.key === STORAGE_KEY) callback();
	};

	window.addEventListener(EVENT_NAME, onCustom);
	window.addEventListener("storage", onStorage);

	return () => {
		window.removeEventListener(EVENT_NAME, onCustom);
		window.removeEventListener("storage", onStorage);
	};
}

export function getFavoritesState() {
	return readState();
}

export function setFavoritesState(nextState) {
    const base = { ...DEFAULT_STATE };
    const merged = {
        ...base,
        ...(nextState && typeof nextState === "object" ? nextState : {}),
    };
    writeState(merged);
}

export function clearFavorites(type) {
	const state = readState();

	if (type) {
		writeState({ ...state, [type]: [] });
		return;
	}

	writeState({ ...DEFAULT_STATE });
}
