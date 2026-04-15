const STORAGE_KEY = 'kr:price-alerts:v1';

function read() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function write(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('kr:price-alerts:changed'));
}

/**
 * Set a target price alert for a product slug.
 * data: { slug, title, image, currentPrice, targetPrice }
 */
export function setPriceAlert(slug, alertData) {
  const all = read();
  all[slug] = { ...alertData, createdAt: Date.now() };
  write(all);
}

export function removePriceAlert(slug) {
  const all = read();
  delete all[slug];
  write(all);
}

export function getPriceAlert(slug) {
  return read()[slug] || null;
}

export function getAllPriceAlerts() {
  return Object.values(read());
}

export function subscribePriceAlertsChanged(cb) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('kr:price-alerts:changed', cb);
  return () => window.removeEventListener('kr:price-alerts:changed', cb);
}
