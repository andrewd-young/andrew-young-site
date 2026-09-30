type IconName = 'sun' | 'moon' | 'tool';

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'sun' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>
      )}
      {name === 'moon' && <path d="M21 13A9 9 0 0 1 11 3a7 7 0 0 0 10 10Z" />}
      {name === 'tool' && (
        <path d="M15 3a6 6 0 0 0-5.3 8.8l-6.1 6.1a2.1 2.1 0 0 0 3 3l6.1-6.1A6 6 0 0 0 21 9l-3 3-4-1-1-4 3-3Z" />
      )}
    </svg>
  );
}
