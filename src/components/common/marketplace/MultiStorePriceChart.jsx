import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STORE_CONFIG = [
  { key: 'migros', label: 'Migros', color: '#e31e24' },
  { key: 'sok', label: 'Şok', color: '#f5a623' },
  { key: 'a101', label: 'A101', color: '#c41e1e' },
  { key: 'carrefour', label: 'Carrefour', color: '#004A97' },
];

function formatDateLabel(dateStr) {
  try {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

function formatTRY(value) {
  if (value == null) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function MultiStoreTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm min-w-[160px]">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry) => {
        if (entry.value == null) return null;
        return (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}</span>
            </span>
            <span className="font-medium text-gray-900">{formatTRY(entry.value)}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * MultiStorePriceChart
 * Props:
 *   priceHistory — array of { date: 'YYYY-MM-DD', migros, sok, a101, carrefour }
 */
export default function MultiStorePriceChart({ priceHistory = [] }) {
  // Determine which stores have at least one non-null value
  const activeStores = useMemo(() => {
    return STORE_CONFIG.filter((store) =>
      priceHistory.some((entry) => entry[store.key] != null && Number(entry[store.key]) > 0),
    );
  }, [priceHistory]);

  // Build chart data: sort by date, format label
  const chartData = useMemo(() => {
    const sorted = [...priceHistory].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });

    return sorted.map((entry) => {
      const row = { dateLabel: formatDateLabel(entry.date), date: entry.date };
      for (const store of STORE_CONFIG) {
        const val = entry[store.key];
        row[store.key] = val != null && Number(val) > 0 ? Number(val) : null;
      }
      return row;
    });
  }, [priceHistory]);

  if (!priceHistory.length || !activeStores.length) return null;

  // Not enough data to draw a meaningful chart
  if (chartData.length <= 1) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          <h3 className="text-sm font-semibold text-gray-900">Mağazalara Göre Fiyat Trendi</h3>
        </div>
        <p className="text-sm text-gray-400 py-6 text-center">Yeterli fiyat geçmişi yok</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        <h3 className="text-sm font-semibold text-gray-900">
          Mağazalara Göre Fiyat Trendi
        </h3>
      </div>

      <div className="w-full" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tickFormatter={(value) => new Intl.NumberFormat('tr-TR').format(value)}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip content={<MultiStoreTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            {activeStores.map((store) => (
              <Line
                key={store.key}
                type="monotone"
                dataKey={store.key}
                name={store.label}
                stroke={store.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
