import { useEffect, useState } from 'react';
import { sfMinutes, phaseFor } from '../time';

export function useSkyTime() {
  const [now, setNow] = useState(sfMinutes);
  const [manual, setManual] = useState<number | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const sync = () => {
      clearTimeout(timer);
      setNow(sfMinutes());
      // Recalculate the delay each time so updates stay on the wall-clock minute.
      timer = setTimeout(sync, 60000 - (Date.now() % 60000));
    };
    sync();
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const minutes = manual ?? now;
  const hour = minutes / 60;
  return {
    minutes,
    hour,
    light: hour >= 7.5 && hour < 18,
    phase: phaseFor(hour),
    isLive: manual === null,
    setManual,
    reset: () => {
      setNow(sfMinutes());
      setManual(null);
    },
  };
}
