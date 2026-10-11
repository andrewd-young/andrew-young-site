import type { ReactNode } from 'react';

type IconName = 'sun' | 'moon' | 'tool' | 'sunrise' | 'sunset';
type SkyScene = 'night' | 'dawn' | 'day' | 'dusk';

export function skyScene(hour: number): SkyScene {
  if (hour < 5 || hour >= 20.5) return 'night';
  if (hour < 7.5) return 'dawn';
  if (hour < 18) return 'day';
  return 'dusk';
}

export function skyIcon(hour: number): IconName {
  const scene = skyScene(hour);
  return { night: 'moon', dawn: 'sunrise', day: 'sun', dusk: 'sunset' }[scene] as IconName;
}

// All outline artwork shares its color, rendered stroke width, and rounded ends.
function Outline({
  children,
  className = '',
  width = 16,
  height = 16,
  viewBox = '0 0 24 24',
}: {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function Sun() {
  return (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  );
}

function Moon() {
  return <path d="M21 13A9 9 0 0 1 11 3a7 7 0 0 0 10 10Z" />;
}

export function Icon({ name }: { name: IconName }) {
  return (
    <Outline>
      {name === 'sun' && <Sun />}
      {name === 'moon' && <Moon />}
      {(name === 'sunrise' || name === 'sunset') && (
        <>
          <path d="M2 19h20M6 19a6 6 0 0 1 12 0M3 10l2 2m14 0 2-2" />
          {name === 'sunrise' ? (
            <path d="M12 9V2m-3 3 3-3 3 3" />
          ) : (
            <path d="M12 2v7m-3-3 3 3 3-3" />
          )}
        </>
      )}
      {name === 'tool' && (
        <path d="M15 3a6 6 0 0 0-5.3 8.8l-6.1 6.1a2.1 2.1 0 0 0 3 3l6.1-6.1A6 6 0 0 0 21 9l-3 3-4-1-1-4 3-3Z" />
      )}
    </Outline>
  );
}

export function SkyIllustration({ hour }: { hour: number }) {
  const scene = skyScene(hour);
  return (
    <Outline className="sun-horizon" width={48} height={40} viewBox="0 0 48 40">
      <path d="M3 33h42" />
      <g className={`sky-scene ${scene === 'night' ? 'visible' : ''}`}>
        <g transform="translate(10 1)">
          <Moon />
        </g>
        <path d="M36 7v4m-2-2h4" />
      </g>
      <g className={`sky-scene ${scene === 'day' ? 'visible' : ''}`}>
        <g transform="translate(12 3)">
          <Sun />
        </g>
      </g>
      <g className={`sky-scene ${scene === 'dawn' ? 'visible' : ''}`}>
        <path d="M15 33a9 9 0 0 1 18 0M24 13v4M9.9 18.9l2.8 2.8m22.6 0 2.8-2.8M4 29h4m32 0h4" />
      </g>
      <g className={`sky-scene ${scene === 'dusk' ? 'visible' : ''}`}>
        <path d="M16 33a8.5 8.5 0 0 1 16 0M24 18v3M10 24l3 2m22 0 3-2" />
      </g>
    </Outline>
  );
}
