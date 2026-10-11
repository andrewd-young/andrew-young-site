import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '../icons';
import { timeLabel } from '../time';
import type { useSkyTime } from '../hooks/useSkyTime';

type SkyControlProps = Omit<ReturnType<typeof useSkyTime>, 'hour'>;

export function SkyControl({ minutes, light, phase, isLive, setManual, reset }: SkyControlProps) {
  const [controlOpen, setControlOpen] = useState(false);
  const controlRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!controlOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) setControlOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setControlOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [controlOpen]);

  return (
    <aside
      className={`sky-control ${controlOpen ? 'open' : ''}`}
      ref={controlRef}
      aria-label="Sky time"
    >
      {controlOpen && (
        <div id="sky-panel" className="range-row">
          <input
            id="sky-hour"
            type="range"
            min="0"
            max="1439"
            step="1"
            value={minutes}
            // Follow the thumb center, including its larger invisible touch area.
            style={
              {
                '--fill': `calc(var(--thumb-size) / 2 + (100% - var(--thumb-size)) * ${minutes / 1439})`,
              } as CSSProperties
            }
            onChange={(e) => setManual(Number(e.target.value))}
            aria-label="Time of day"
            aria-valuetext={`${timeLabel(minutes)}, ${phase}`}
          />
          <button className={isLive ? 'live active' : 'live'} onClick={reset} aria-pressed={isLive}>
            <span />
            Live
          </button>
        </div>
      )}
      <button
        ref={toggleRef}
        className="sky-toggle"
        onClick={() => setControlOpen((open) => !open)}
        aria-expanded={controlOpen}
        aria-controls="sky-panel"
        aria-label={controlOpen ? 'Close sky time control' : 'Change sky time'}
      >
        <Icon name={light ? 'sun' : 'moon'} />
        <output htmlFor="sky-hour">{timeLabel(minutes)} PT</output>
      </button>
    </aside>
  );
}
