// Sunrise and sunset for San Francisco, from the standard sunrise equation.
// Accurate to about a minute, which is enough for a footer.
const LAT = 37.7749;
const LON = -122.4194;
const rad = Math.PI / 180;

const toJulian = (ms: number) => ms / 86400000 + 2440587.5;
const fromJulian = (j: number) => (j - 2440587.5) * 86400000;

function riseAndSet(day: number): [number, number] {
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
    (Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * sinDec) / (Math.cos(LAT * rad) * cosDec);
  const hour = Math.acos(cosHour) / rad / 360;
  return [fromJulian(transit - hour), fromJulian(transit + hour)];
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
