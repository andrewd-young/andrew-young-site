// Sunrise and sunset for San Francisco, from the standard sunrise equation.
// Used for the footer and seasonal timing of the sky's existing palette.
const LAT = 37.7749;
const LON = -122.4194;
const rad = Math.PI / 180;

const toJulian = (ms: number) => ms / 86400000 + 2440587.5;
const fromJulian = (j: number) => (j - 2440587.5) * 86400000;

function riseAndSet(day: number, altitude = -0.833): [number, number] {
  const jStar = day - LON / 360;
  const m = (357.5291 + 0.98560028 * jStar) % 360;
  const c =
    1.9148 * Math.sin(m * rad) + 0.02 * Math.sin(2 * m * rad) + 0.0003 * Math.sin(3 * m * rad);
  const lambda = (m + c + 180 + 102.9372) % 360;
  const transit =
    2451545 + jStar + 0.0053 * Math.sin(m * rad) - 0.0069 * Math.sin(2 * lambda * rad);
  const sinDec = Math.sin(lambda * rad) * Math.sin(23.4397 * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosHour =
    (Math.sin(altitude * rad) - Math.sin(LAT * rad) * sinDec) / (Math.cos(LAT * rad) * cosDec);
  const hour = Math.acos(cosHour) / rad / 360;
  return [fromJulian(transit - hour), fromJulian(transit + hour)];
}

const sfDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const sfClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function solarPaletteHour(minutes: number, date = new Date()) {
  // Select the SF calendar day even when the visitor is in another time zone.
  const parts = sfDate.formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const noon = Date.UTC(get('year'), get('month') - 1, get('day'), 12);
  const day = Math.floor(toJulian(noon) - 2451545 + 0.0008);
  const clockHour = (ms: number) => {
    const parts = sfClock.formatToParts(ms);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    return get('hour') + get('minute') / 60 + get('second') / 3600;
  };
  const [rise, set] = riseAndSet(day).map(clockHour);
  const [dawn, dusk] = riseAndSet(day, -12).map(clockHour);
  // Retain every color and the renderer's easing. Only warp the palette clock:
  // twilight, sunrise, solar noon, sunset, twilight, with a continuous midnight.
  const anchors = [
    [0, 0],
    [dawn, 5],
    [rise, 6.5],
    [(rise + set) / 2, 12],
    [set, 19],
    [dusk, 20.5],
    [24, 24],
  ];
  const hour = minutes / 60;
  const index = anchors.findIndex((anchor, i) => i > 0 && hour <= anchor[0]);
  const [start, from] = anchors[Math.max(1, index) - 1];
  const [end, to] = anchors[Math.max(1, index)];
  return from + ((hour - start) / (end - start)) * (to - from);
}

export function nextSunEvent(now = Date.now()) {
  const today = Math.floor(toJulian(now) - 2451545 + 0.0008);
  const events = [-1, 0, 1].flatMap((offset) => {
    const [rise, set] = riseAndSet(today + offset);
    return [
      { kind: 'Sunrise', at: rise },
      { kind: 'Sunset', at: set },
    ];
  });
  const next = events.filter((e) => e.at > now).sort((a, b) => a.at - b.at)[0];
  return { kind: next.kind, minutesAway: Math.round((next.at - now) / 60000) };
}
