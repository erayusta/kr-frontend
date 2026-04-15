import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Gallery campaign type component.
 *
 * Displays campaign.gallery (array of { url, caption, link }) in a responsive
 * masonry-style grid with a lightbox overlay on click.
 */
export default function CampaignGalleryType({ campaign }) {
  const gallery = campaign?.gallery || [];
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (gallery.length === 0) return null;

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setLightboxIdx((i) => (i + 1) % gallery.length);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  const currentItem = lightboxIdx !== null ? gallery[lightboxIdx] : null;

  return (
    <div className="mb-8">
      {/* Grid layout — 2 cols mobile, 3 md, 4 lg */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {gallery.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => openLightbox(idx)}
            className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {/* biome-ignore lint/performance/noImgElement: gallery image */}
            <img
              src={item.url}
              alt={item.caption || `Galeri görseli ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            {/* Caption badge */}
            {item.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs font-medium line-clamp-2 text-left">{item.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && currentItem && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: lightbox overlay
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: lightbox focus trap
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Next */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Image container */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-12 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* biome-ignore lint/performance/noImgElement: lightbox image */}
            <img
              src={currentItem.url}
              alt={currentItem.caption || `Görsel ${lightboxIdx + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {/* Caption + link */}
            {(currentItem.caption || currentItem.link) && (
              <div className="mt-3 flex items-center gap-3">
                {currentItem.caption && (
                  <p className="text-white/90 text-sm text-center">{currentItem.caption}</p>
                )}
                {currentItem.link && (
                  <a
                    href={currentItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Gitme bağlantısı
                  </a>
                )}
              </div>
            )}

            {/* Counter */}
            {gallery.length > 1 && (
              <p className="mt-2 text-white/40 text-xs">
                {lightboxIdx + 1} / {gallery.length}
              </p>
            )}
          </div>

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 overflow-x-auto">
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(idx); }}
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border-2 transition-all',
                    idx === lightboxIdx ? 'border-orange-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80',
                  )}
                >
                  {/* biome-ignore lint/performance/noImgElement: thumbnail */}
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
