import { useEffect, useLayoutEffect, useRef } from 'react';

type Anchor = { el: HTMLElement; top: number };

// A collapse can leave too little document height to retain the current scroll.
// Reserve only the missing room below the footer, releasing it as we scroll up.
export function useScrollAnchor(key: unknown) {
  const anchor = useRef<Anchor | null>(null);
  const reserve = useRef(0);

  useEffect(() => {
    let frame = 0;
    const release = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scroller = document.scrollingElement ?? document.documentElement;
        const naturalHeight = scroller.scrollHeight - reserve.current;
        const needed = Math.max(
          0,
          Math.ceil(window.scrollY + scroller.clientHeight - naturalHeight),
        );
        if (needed < reserve.current) {
          reserve.current = needed;
          document.body.style.setProperty('--scroll-reserve', `${needed}px`);
        }
      });
    };
    window.addEventListener('scroll', release, { passive: true });
    window.addEventListener('resize', release);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', release);
      window.removeEventListener('resize', release);
      document.body.style.removeProperty('--scroll-reserve');
    };
  }, []);

  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (!a) return;

    const desired = Math.max(0, window.scrollY + a.el.getBoundingClientRect().top - a.top);
    const scroller = document.scrollingElement ?? document.documentElement;
    const naturalHeight = scroller.scrollHeight - reserve.current;
    const needed = Math.max(0, Math.ceil(desired + scroller.clientHeight - naturalHeight));
    reserve.current = needed;
    document.body.style.setProperty('--scroll-reserve', `${needed}px`);
    if (Math.abs(desired - window.scrollY) > 0.5) {
      window.scrollTo({ top: desired, behavior: 'instant' });
    }
  }, [key]);

  return (el: HTMLElement) => {
    anchor.current = {
      el,
      top: el.getBoundingClientRect().top,
    };
  };
}
