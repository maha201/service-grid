import { useCallback, useEffect, useState } from 'react';
import { loadData, persistData } from '../utils/demoData';

export function useDemoData() {
  const [data, setData] = useState(loadData);
  useEffect(() => {
    const refresh = () => setData(loadData());
    window.addEventListener('servicegrid-data-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('servicegrid-data-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const updateData = useCallback((updater) => {
    setData((current) => {
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      persistData(next);
      return next;
    });
  }, []);
  return [data, updateData];
}
