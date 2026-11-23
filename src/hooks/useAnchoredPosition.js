import { useLayoutEffect, useState } from 'react';

export default function useAnchoredPosition(open, anchorRef, panelWidth, panelHeight, minimumWidth = 0) {
  const [position, setPosition] = useState(null);
  useLayoutEffect(() => {
    if (!open) return undefined;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(panelWidth || Math.max(rect.width, minimumWidth), window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const top = rect.bottom + panelHeight + 8 < window.innerHeight
        ? rect.bottom + 6
        : Math.max(12, rect.top - panelHeight - 6);
      setPosition({ top, left, width, maxHeight: Math.min(panelHeight, window.innerHeight - 24) });
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, panelWidth, panelHeight, minimumWidth]);
  return position;
}
