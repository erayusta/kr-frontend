const STORAGE_KEY = 'kr:recently-viewed:v1';
const MAX_ITEMS = 12;

function read() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function write(items) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('kr:recently-viewed:changed'));
}

/**
 * Record a product view.
 * data: { slug, title, image, latest_price, brand }
 */
export function recordView(data) {
  if (!data?.slug) return;
  const current = read().filter((p) => p.slug !== data.slug);
  const updated = [{ ...data, viewedAt: Date.now() }, ...current].slice(0, MAX_ITEMS);
  write(updated);
}

export function getRecentlyViewed() {
  return read();
}

export function clearRecentlyViewed() {
  write([]);
}

export function subscribeRecentlyViewedChanged(cb) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('kr:recently-viewed:changed', cb);
  return () => window.removeEventListener('kr:recently-viewed:changed', cb);
}
