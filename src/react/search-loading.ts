import { useEffect, useRef, useState } from 'react';

/** Delay brief work, and retain a shown indicator across consecutive requests. */
export function useSearchLoading(busy: boolean) {
  const [visible, setVisible] = useState(false);
  const since = useRef(0);
  useEffect(() => {
    if (busy && !visible) {
      const timer = setTimeout(() => { since.current = performance.now(); setVisible(true); }, 180);
      return () => clearTimeout(timer);
    }
    if (!busy && visible) {
      const timer = setTimeout(() => setVisible(false), Math.max(0, 1000 - (performance.now() - since.current)));
      return () => clearTimeout(timer);
    }
  }, [busy, visible]);
  return visible;
}
