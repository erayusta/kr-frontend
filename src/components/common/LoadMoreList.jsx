import { useEffect, useState } from "react";
import apiRequest from "@/lib/apiRequest";
import CampaignCard from "./CampaignCard";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

export default function LoadMoreList({ initialItems = [], url, type = "campaigns", pageSize = 12 }) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(2); // SSR ilk sayfayı getiriyor
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // initialItems değişirse state'i senkronla (nadir)
    setItems(initialItems);
  }, [initialItems]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await apiRequest(`${url}&page=${page}&limit=${pageSize}`, "get");
      const newItems = response?.campaigns || response?.data || response?.items || [];
      const safeArr = Array.isArray(newItems) ? newItems : [];
      setItems((prev) => [...prev, ...safeArr]);
      setPage((p) => p + 1);
      if (safeArr.length < pageSize) setHasMore(false);
    } catch (err) {
      // Hata durumunda bir sonraki tıklamada tekrar denenebilir
      console.error("LoadMoreList: failed to load items", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-auto gap-5 md:grid-cols-4">
        {items?.map((item, index) => {
          switch (type) {
            case "campaigns":
              return <CampaignCard key={item.id || index} {...item} />;
            case "posts":
              return <PostCard key={item.id || index} {...item} />;
            default:
              return null;
          }
        })}
      </div>

      {hasMore && (
        <div className="flex items-center justify-center mt-6">
          <Button onClick={loadMore} disabled={loading} className="min-w-[220px]">
            {loading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...
              </>
            ) : (
              "Daha Fazla Yükle"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

