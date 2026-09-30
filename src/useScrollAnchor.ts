import { useLayoutEffect, useRef } from 'react';

type Anchor = { el: HTMLElement; top: number };

// Keep the tapped row in place where possible. Near the bottom, let the browser
// clamp to the actual content height instead of adding space below the footer.
export function useScrollAnchor(key: unknown) {
  const anchor = useRef<Anchor | null>(null);

  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (!a) return;

    const desired = window.scrollY + a.el.getBoundingClientRect().top - a.top;
    const scroller = document.scrollingElement ?? document.documentElement;
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    const top = Math.max(0, Math.min(desired, maxScroll));
    if (Math.abs(top - window.scrollY) > 0.5) {
      window.scrollTo({ top, behavior: 'instant' });
    }
  }, [key]);

  return (el: HTMLElement) => {
    anchor.current = {
      el,
      top: el.getBoundingClientRect().top,
    };
  };
}
