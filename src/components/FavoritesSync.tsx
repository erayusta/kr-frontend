"use client";
import { useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { getFavoritesState, setFavoritesState } from "@/lib/favorites";
import { fetchFavorites, syncFavorites } from "@/lib/favoritesApi";

export default function FavoritesSync() {
  const { isLoggedIn, loading } = useAuth();
  const doneRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      doneRef.current = false;
      return;
    }
    if (doneRef.current) return;

    (async () => {
      try {
        // 1) Push local pending favorites to server
        const local = getFavoritesState();
        await syncFavorites(local);
        // 2) Pull merged state and set locally
        const merged = await fetchFavorites();
        setFavoritesState(merged);
      } catch (e) {
        // Ignore sync errors to avoid blocking UI
        console.warn("[FavoritesSync] sync failed", e);
      } finally {
        doneRef.current = true;
      }
    })();
  }, [isLoggedIn, loading]);

  return null;
}

