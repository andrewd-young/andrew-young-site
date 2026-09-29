import { useLayoutEffect, useRef } from 'react';

type Anchor = { el: HTMLElement; top: number; pageHeight: number };

// Keeps a tapped element at the same screen position when `key` changes the layout.
// Call the returned function with the element just before the state change.
export function useScrollAnchor(key: unknown) {
  const anchor = useRef<Anchor | null>(null);
  const releaseHold = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (!a) return;

    releaseHold.current?.();
    const natural = document.documentElement.scrollHeight;

    // If the page got shorter, the browser would clamp the scroll and move the element.
    // Hold the old height until the reader scrolls back into the real content.
    if (natural < a.pageHeight) {
      document.body.style.minHeight = `${a.pageHeight}px`;
      const onScroll = () => {
        if (window.scrollY + window.innerHeight <= natural) release();
      };
      const release = () => {
        document.body.style.minHeight = '';
        window.removeEventListener('scroll', onScroll);
        releaseHold.current = null;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      releaseHold.current = release;
    }

    const shift = a.el.getBoundingClientRect().top - a.top;
    if (shift) window.scrollBy({ top: shift, behavior: 'instant' });
  }, [key]);

  return (el: HTMLElement) => {
    anchor.current = {
      el,
      top: el.getBoundingClientRect().top,
      pageHeight: document.documentElement.scrollHeight,
    };
  };
}
