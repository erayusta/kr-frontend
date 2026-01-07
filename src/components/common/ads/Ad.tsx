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
): { width: number; height: number } => {
  if (!dimensions) return { width: 300, height: 250 };
  const [w, h] = dimensions.split("x").map(Number);
  return { width: w || 300, height: h || 250 };
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
    if (isGptAd) {
      return (
        <div
          id={`ad-container-${uniqueId}`}
          className={isGptAdLoaded ? "block" : "hidden"}
          dangerouslySetInnerHTML={{ __html: ad.code }}
        />
      );
    }

    return (
      <div
        id={`ad-container-${uniqueId}`}
        dangerouslySetInnerHTML={{ __html: ad.code }}
      />
    );
  }

  if (ad.type === "image" && ad.image) {
    const { width, height } = parseDimensions(ad.dimensions);
    const finalWidth = maxWidth ? Math.min(width, maxWidth) : width;
    const aspectRatio = width / height;
    const finalHeight = Math.round(finalWidth / aspectRatio);

    return (
      <a
        href={ad.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src={ad.image}
          alt={ad.name}
          width={finalWidth}
          height={finalHeight}
          style={{
            width: finalWidth,
            height: finalHeight,
            objectFit: "contain",
          }}
          unoptimized
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

const SIDEBAR_MAX_WIDTH = 120;

/**
 * Sidebar positioning (MVP):
 * - Container varsayımı: 1280px
 * - Gutter: (100vw - containerWidth)/2
 * - Content ile araya GUTTER_GAP koy
 * - Ekran kenarına yapışmasın diye MIN_EDGE_GAP clamp
 *
 * TOP için inline style (tailwind override/bundle sorunlarına karşı kesin çözüm)
 */
const CONTAINER_WIDTH = 1280;
const GUTTER_GAP = 24;
const MIN_EDGE_GAP = 16;

// Yukarıdan boşluk (px)
const TOP_OFFSET_PX = 140;

const calcGutterOffset = (w: number) =>
  `max(${MIN_EDGE_GAP}px, calc((100vw - ${CONTAINER_WIDTH}px) / 2 - ${w}px - ${GUTTER_GAP}px))`;

const variantStyles: Record<AdVariant, string> = {
  "sidebar-left":
    "block fixed z-[9999] p-2 border border-gray-200/50 rounded-lg bg-[#fffaf4]/80 backdrop-blur-sm shadow-lg",
  "sidebar-right":
    "block fixed z-[9999] p-2 border border-gray-200/50 rounded-lg bg-[#fffaf4]/80 backdrop-blur-sm shadow-lg",
  sidebar:
    "block fixed z-[9999] p-2 border border-gray-200/50 rounded-lg bg-[#fffaf4]/80 backdrop-blur-sm shadow-lg",

  banner: "flex justify-center my-4 p-3 bg-[#fffaf4]",
  inline: "p-2 border border-gray-200/50 rounded bg-white/50",
  footer:
    "flex justify-center my-6 py-4 px-3 border border-gray-200 rounded-lg bg-[#fffaf4]",
  "content-middle":
    "flex justify-center my-8 p-4 border border-gray-200 rounded-lg bg-[#fffaf4]",
};

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

  const isFixedSidebar =
    variant === "sidebar-left" ||
    variant === "sidebar-right" ||
    variant === "sidebar";

  const { width } = parseDimensions(ad.dimensions);
  const sidebarWidth = isFixedSidebar
    ? Math.min(width, SIDEBAR_MAX_WIDTH)
    : undefined;

  const baseStyle = variantStyles[variant];

  if (isFixedSidebar) {
    const w = sidebarWidth ?? SIDEBAR_MAX_WIDTH;

    // sidebar-left => left gutter
    // sidebar-right & sidebar => right gutter
    const sideStyle =
      variant === "sidebar-left"
        ? ({ left: calcGutterOffset(w) } as const)
        : ({ right: calcGutterOffset(w) } as const);

    return (
      <aside
        className={`${baseStyle} ${className}`.trim()}
        style={{
          top: TOP_OFFSET_PX,
          width: w,
          minWidth: w,
          minHeight: "100px",
          ...sideStyle,
        }}
      >
        <AdItem ad={ad} maxWidth={w} />
      </aside>
    );
  }

  return (
    <div className={`${baseStyle} ${className}`.trim()}>
      <AdItem ad={ad} />
    </div>
  );
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
