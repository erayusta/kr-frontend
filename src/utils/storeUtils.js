export const STORE_CONFIG = {
  migros:    { name: 'Migros',     color: '#e31e24', logo: '/images/stores/migros.png' },
  sok:       { name: 'Şok',       color: '#f5a623', logo: '/images/stores/sok.png' },
  a101:      { name: 'A101',      color: '#e7372f', logo: '/images/stores/a101.png' },
  carrefour: { name: 'Carrefour', color: '#004A97', logo: '/images/stores/carrefour.png' },
};

export function getStoreName(storeKey) {
  return STORE_CONFIG[storeKey]?.name ?? storeKey;
}

export function formatPrice(price) {
  if (price == null) return null;
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function getCdnImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://kampanyaradar-static.b-cdn.net/kampanyaradar/${path}`;
}
