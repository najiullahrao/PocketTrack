import { useState, useCallback } from 'react';

export default function useReload(onReload?: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(async () => {
    setRefreshing(true);
    if (onReload) {
      await onReload();
    } else {
      // Default: just simulate a delay
      await new Promise(res => setTimeout(res, 800));
    }
    setRefreshing(false);
  }, [onReload]);

  return { refreshing, reload };
} 