import { createContext, useCallback, useContext, useState } from 'react';

const CompareContext = createContext(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = useCallback((product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.slug === product.slug)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((slug) => {
    setCompareList((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const toggleCompare = useCallback((product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.slug === product.slug)) {
        return prev.filter((p) => p.slug !== product.slug);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isInCompare = useCallback(
    (slug) => compareList.some((p) => p.slug === slug),
    [compareList],
  );

  const canAdd = compareList.length < MAX_COMPARE;

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, toggleCompare, clearCompare, isInCompare, canAdd, max: MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
