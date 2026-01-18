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
        // Snapshot local at start
        const startLocal = getFavoritesState();

        // 1) Push local pending favorites to server
        await syncFavorites(startLocal);

        // 2) Pull server-merged state
        const serverMerged = await fetchFavorites();

        // 3) Union with any local changes that happened during sync
        const currentLocal = getFavoritesState();

        const toArr = (v: any) => (Array.isArray(v) ? v.map(String) : []);
        const union = (a: any[], b: any[]) => Array.from(new Set([...(a || []).map(String), ...(b || []).map(String)]));

        const finalState = {
          campaign: union(toArr(serverMerged.campaign), toArr(currentLocal.campaign)),
          post: union(toArr(serverMerged.post), toArr(currentLocal.post)),
          brand: union(toArr(serverMerged.brand), toArr(currentLocal.brand)),
          category: union(toArr(serverMerged.category), toArr(currentLocal.category)),
        };

        setFavoritesState(finalState);
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

