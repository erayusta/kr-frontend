import Image from "next/image";
import { useEffect, useId, useState } from "react";
import type { AdPosition, Ad as AdType } from "@/types/ad";

declare global {
  interface Window {
    pigeon?: {
      ads?: unknown[];
    };
  }
}

const parseDimensions = (
  dimensions: string | null,
): { width: number; height: number } | null => {
  if (!dimensions) return null;
  if (dimensions.toLowerCase() === "custom") return null;
  const [wRaw, hRaw] = dimensions.split("x");
  const w = Number(wRaw);
  const h = Number(hRaw);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return { width: w, height: h };
};

// Device detection hook
const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < 1024; // lg breakpoint
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return isMobile;
};

interface AdItemProps {
  ad: AdType;
  maxWidth?: number;
}

const AdItem = ({ ad, maxWidth }: AdItemProps) => {
  const [isGptAdLoaded, setIsGptAdLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const uniqueId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isGptAd = ad.type === "html" && ad.code?.includes("googletag");

  useEffect(() => {
    if (!mounted || !isGptAd) return;

    const checkAdLoad = () => {
      setIsGptAdLoaded(!!window.pigeon?.ads?.length);
    };

    const handleAdLoaded = () => setIsGptAdLoaded(true);

    if (window.pigeon) {
      checkAdLoad();
    } else {
      window.addEventListener("pigeonLoaded", checkAdLoad);
    }

    document.addEventListener("pigeonAdLoaded", handleAdLoaded);
    const timeout = setTimeout(checkAdLoad, 3000);

    return () => {
      window.removeEventListener("pigeonLoaded", checkAdLoad);
      document.removeEventListener("pigeonAdLoaded", handleAdLoaded);
      clearTimeout(timeout);
    };
  }, [mounted, isGptAd]);

  if (!mounted) return null;

  if (ad.type === "html" && ad.code) {
    const dims = parseDimensions(ad.dimensions);
    const style = dims
      ? ({ width: dims.width, height: dims.height, overflow: "hidden" } as const)
      : ({} as const);

    if (isGptAd) {
      return (
        <div
          id={`ad-container-${uniqueId}`}
          className={isGptAdLoaded ? "block" : "hidden"}
          style={style}
          dangerouslySetInnerHTML={{ __html: ad.code }}
        />
      );
    }

    return (
      <div
        id={`ad-container-${uniqueId}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: ad.code }}
      />
    );
  }

  if (ad.type === "image" && ad.image) {
    const dims = parseDimensions(ad.dimensions);
    const width = dims?.width;
    const height = dims?.height;
    return (
      <a
        href={ad.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={ad.image}
          alt={ad.name}
          width={width}
          height={height}
          style={{
            maxWidth: width ? undefined : "100%",
            width: width ?? "auto",
            height: height ?? "auto",
            display: "block",
          }}
        />
      </a>
    );
  }

  return null;
};

export type AdVariant =
  | "sidebar-left"
  | "sidebar-right"
  | "sidebar"
  | "banner"
  | "inline"
  | "footer"
  | "content-middle";

interface AdProps {
  ad?: AdType;
  variant?: AdVariant;
  className?: string;
}

export default function Ad({
  ad,
  variant = "inline",
  className = "",
}: AdProps) {
  const isMobile = useDeviceType();

  if (!ad) return null;

  // Device filtering
  if (ad.device === "mobile" && !isMobile) return null;
  if (ad.device === "desktop" && isMobile) return null;

  // Render without FE-imposed frame or sizing; let backend/Filament control appearance
  return <AdItem ad={ad} />;
}

// Position'dan variant'a otomatik mapping
const positionToVariant: Record<AdPosition, AdVariant> = {
  home_header: "banner",
  home_left: "sidebar-left",
  home_right: "sidebar-right",
  category_header: "banner",
  brand_header: "banner",
  campaign_header: "banner",
  content_middle: "content-middle",
  footer: "footer",
  sidebar: "sidebar",
  post_content_one: "inline",
  post_content_two: "inline",
  post_right: "inline",
  post_left: "inline",
};

interface AdsProps {
  ads: AdType[];
  positions?: AdPosition[];
  itemType?: "general" | "brand" | "category" | "campaign" | string;
  className?: string;
}

// Otomatik position-based rendering
export function Ads({ ads, positions, itemType, className }: AdsProps) {
  if (!ads?.length) return null;

  let filteredAds = ads;

  // Position filtreleme
  if (positions && positions.length > 0) {
    filteredAds = filteredAds.filter((ad) =>
      positions.includes(ad.position as AdPosition),
    );
  }

  // Item type filtreleme
  if (itemType) {
    filteredAds = filteredAds.filter(
      (ad) => ad.item_type === "general" || ad.item_type === itemType,
    );
  }

  return (
    <>
      {filteredAds.flatMap((ad) => {
        const position = ad.position as AdPosition;
        const variant = positionToVariant[position];
        if (!variant) return [];
  
        // sidebar => aynı reklamı sol + sağ bas
        if (position === "sidebar") {
          return [
            <Ad
              key={`${ad.id}-left`}
              ad={ad}
              variant="sidebar-left"
              className={className}
            />,
            <Ad
              key={`${ad.id}-right`}
              ad={ad}
              variant="sidebar-right"
              className={className}
            />,
          ];
        }
  
        return [
          <Ad key={`${ad.id}-${variant}`} ad={ad} variant={variant} className={className} />,
        ];
      })}
    </>
  );
}

// Helper: Belirli position'daki reklamı bul
export function getAdByPosition(
  ads: AdType[],
  position: AdPosition,
  itemType?: "general" | "brand" | "category" | "campaign" | string,
): AdType | undefined {
  if (!ads?.length) return undefined;

  let filteredAds = ads.filter((ad) => ad.position === position);

  if (itemType && filteredAds.length > 0) {
    const typeFiltered = filteredAds.filter(
      (ad) => ad.item_type === "general" || ad.item_type === itemType,
    );

    if (typeFiltered.length > 0) {
      return typeFiltered[0];
    }

    const generalAd = filteredAds.find((ad) => ad.item_type === "general");
    if (generalAd) return generalAd;
  }

  return filteredAds[0];
}
