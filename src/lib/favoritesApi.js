import apiRequest from "@/lib/apiRequest";

export async function fetchFavorites() {
  const res = await apiRequest("/favorites", "get", {}, true);
  return res?.data || { campaign: [], post: [], brand: [], category: [] };
}

export async function fetchFavoritesDetails() {
  const res = await apiRequest("/favorites/details", "get", {}, true);
  return res || { data: { campaigns: [], posts: [], brands: [], categories: [] }, counts: {} };
}

export async function addFavorite(target_type, target_id) {
  await apiRequest("/favorites", "post", { target_type, target_id }, true);
}

export async function removeFavorite(target_type, target_id) {
  await apiRequest("/favorites", "delete", { target_type, target_id }, true);
}

export async function syncFavorites(payload) {
  const res = await apiRequest("/favorites/sync", "post", payload || {}, true);
  return res?.data || { campaign: [], post: [], brand: [], category: [] };
}

