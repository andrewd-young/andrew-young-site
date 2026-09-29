import { useEffect, useRef } from 'react';

// [hour, sky top, horizon, lit cloud, shaded cloud, fog amount]
type Key = [number, string, string, string, string, number];
const keys: Key[] = [
  [0, '#03060c', '#0c1626', '#27303f', '#080c14', 0.45],
  [5, '#070c1a', '#232a40', '#3a3f55', '#10141f', 0.55],
  [6.5, '#3b4c6e', '#e6a88c', '#f4c8ae', '#6b6a82', 0.75],
  [8.5, '#86a7c4', '#d6dfe4', '#f3f5f6', '#98a6b2', 0.9],
  [12, '#4f88bf', '#b9d2e6', '#ffffff', '#b1c0cd', 0.3],
  [16.5, '#6d93bd', '#e6d5ba', '#fff0da', '#a9a4aa', 0.45],
  [19, '#2b3a63', '#e07c55', '#f2a67e', '#4a3e5a', 0.8],
  [20.5, '#0d1428', '#3a3353', '#5a5272', '#141a2a', 0.6],
  [24, '#03060c', '#0c1626', '#27303f', '#080c14', 0.45],
];

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

function palette(h: number) {
  let i = 0;
  while (i < keys.length - 2 && h >= keys[i + 1][0]) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = (h - a[0]) / (b[0] - a[0]);
  const mix = (j: 1 | 2 | 3 | 4) => rgb(a[j]).map((v, n) => v + (rgb(b[j])[n] - v) * t);
  return { top: mix(1), hor: mix(2), lit: mix(3), sh: mix(4), fog: a[5] + (b[5] - a[5]) * t };
}

const vertex = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Drifting value-noise clouds over a vertical sky gradient, with fog near the horizon.
const fragment = `
precision mediump float;
uniform vec2 res;
uniform float time;
uniform vec3 top, hor, lit, sh;
uniform float fog;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int o = 0; o < 5; o++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / res;
  float yn = 1.0 - uv.y;
  vec2 q = vec2(uv.x * res.x / res.y * 4.7, yn * 7.3) + vec2(time * 0.035, time * 0.006);
  float fogBand = fog * max(0.0, (yn - 0.45) / 0.55) * 0.55;
  float n = fbm(q) + fogBand * (0.7 + 0.3 * noise(q * 1.8 - vec2(time * 0.05, 0.0)));
  float d = smoothstep(0.0, 1.0, clamp((n - (0.6 - fog * 0.12)) / 0.26, 0.0, 1.0));
  float shade = clamp((fbm(q + vec2(0.35, 0.5)) - 0.35) * 1.6 + yn * 0.3, 0.0, 1.0);
  vec3 sky = mix(top, hor, pow(yn, 0.85));
  vec3 cloud = mix(lit, sh, shade);
  gl_FragColor = vec4(mix(sky, cloud, d * 0.96), 1.0);
}`;

export function Sky({ hour }: { hour: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef(hour);
  target.current = hour;

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.bindAttribLocation(program, 0, 'p');
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const [uRes, uTime, uTop, uHor, uLit, uSh, uFog] =
      ['res', 'time', 'top', 'hor', 'lit', 'sh', 'fog'].map(u);

    // The sky is blurred, so a low-resolution buffer looks the same and costs little.
    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / 4);
      canvas.height = Math.ceil(window.innerHeight / 4);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let shown = target.current;
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      // Ease toward the selected hour along the shorter way around the clock.
      const diff = ((target.current - shown + 36) % 24) - 12;
      shown = reduced.matches ? target.current : (shown + diff * Math.min(1, dt * 8) + 24) % 24;

      const p = palette(shown);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced.matches ? 0 : now / 1000);
      gl.uniform3fv(uTop, p.top);
      gl.uniform3fv(uHor, p.hor);
      gl.uniform3fv(uLit, p.lit);
      gl.uniform3fv(uSh, p.sh);
      gl.uniform1f(uFog, p.fog);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="sky" ref={ref} aria-hidden="true" />;
}
