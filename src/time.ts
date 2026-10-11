export function sfMinutes() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return get('hour') * 60 + get('minute');
}

export function timeLabel(n: number) {
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

export function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function phaseFor(hour: number) {
  if (hour < 5) return 'Night';
  if (hour < 7.5) return 'Dawn';
  if (hour < 11) return 'Morning fog';
  if (hour < 16) return 'Clear skies';
  if (hour < 18) return 'Late light';
  if (hour < 20.5) return 'Dusk';
  return 'Night';
}
