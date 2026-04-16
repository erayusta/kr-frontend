import { STORE_CONFIG, getStoreName } from '@/utils/storeUtils';
import { cn } from '@/lib/utils';

/**
 * StoreLogoBadge
 * Small colored badge showing store name with brand color.
 *
 * Props:
 *   storeName — store key (e.g. 'migros', 'sok', 'a101', 'carrefour')
 *   size      — 'sm' | 'md'
 */
export default function StoreLogoBadge({ storeName, size = 'sm' }) {
  const config = STORE_CONFIG[storeName];
  const displayName = config?.name ?? getStoreName(storeName);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  if (!config) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-semibold bg-gray-100 text-gray-600',
          sizeClasses[size] ?? sizeClasses.sm,
        )}
      >
        {displayName}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold text-white',
        sizeClasses[size] ?? sizeClasses.sm,
      )}
      style={{ backgroundColor: config.color }}
      title={displayName}
    >
      {displayName}
    </span>
  );
}
