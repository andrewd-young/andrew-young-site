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

// Two lit cloud banks and a low mist layer, composited back to front in one pass.
// Noise layering / domain warping: https://thebookofshaders.com/13/
const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 res;
uniform float time;
uniform vec3 top, hor, lit, sh;
uniform float fog;
uniform vec2 lightDir;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int o = 0; o < 4; o++) {
    v += a * noise(p);
    p = mat2(0.8, -0.6, 0.6, 0.8) * p * 2.03 + 7.3;
    a *= 0.5;
  }
  return v;
}
vec4 cloud(vec2 p, float threshold, float distanceFade) {
  // Slowly changing distortion lets a cloud curl and evolve as it drifts.
  vec2 warp = vec2(noise(p * 0.65 + time * 0.008),
                   noise(p * 0.65 + vec2(8.3, -time * 0.011)));
  p += (warp - 0.5) * 0.85;
  float n = fbm(p);
  float thickness = max(0.0, n - threshold);
  float alpha = 1.0 - exp(-thickness * 9.0);
  // A sample toward the light approximates self-shadowing without a ray march.
  float towardLight = fbm(p + lightDir * 0.22);
  float edgeLight = clamp((n - towardLight) * 5.0 + 0.5, 0.0, 1.0);
  float interior = smoothstep(0.02, 0.28, thickness);
  float illumination = clamp(0.58 + edgeLight * 0.46 - interior * 0.42, 0.0, 1.0);
  vec3 color = mix(sh, lit, illumination);
  color = mix(color, hor, distanceFade);
  return vec4(color, alpha);
}
void main() {
  vec2 uv = gl_FragCoord.xy / res;
  float yn = 1.0 - uv.y;
  vec2 q = vec2((uv.x - 0.5) * res.x / res.y * 4.7, yn * 6.0);
  vec3 sky = mix(top, hor, pow(yn, 0.85));
  float bank = smoothstep(0.38, 1.0, yn) * fog;

  vec4 farCloud = cloud(q * vec2(0.85, 1.1) + vec2(time * 0.018, 14.2),
                        0.53 - fog * 0.12 - bank * 0.08, 0.3);
  sky = mix(sky, farCloud.rgb, farCloud.a * 0.8);

  vec4 nearCloud = cloud(q * vec2(1.15, 0.85) + vec2(time * 0.038, -time * 0.006),
                         0.57 - fog * 0.1 - bank * 0.1, 0.0);
  sky = mix(sky, nearCloud.rgb, nearCloud.a * 0.96);

  float mist = noise(q * vec2(0.65, 1.6) + vec2(-time * 0.025, 6.1));
  float veil = bank * (0.12 + mist * 0.3);
  sky = mix(sky, mix(hor, lit, 0.35), veil);
  gl_FragColor = vec4(sky, 1.0);
}`;

export function Sky({ hour }: { hour: number }) {
  useEffect(() => {
    // Match the browser chrome and overscroll area to the sky's horizon.
    const color = `rgb(${palette(hour)
      .hor.map((v) => Math.round(v * 255))
      .join(' ')})`;
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, [hour]);
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef(hour);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    target.current = hour;
    wake.current();
  }, [hour]);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};

    const initialize = () => {
      const shaders: WebGLShader[] = [];
      const program = gl.createProgram();
      const buffer = gl.createBuffer();
      const release = () => {
        shaders.forEach((s) => gl.deleteShader(s));
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      };
      if (!program || !buffer) {
        release();
        return;
      }
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
      ] as const) {
        const shader = gl.createShader(type);
        if (!shader) {
          release();
          return;
        }
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
      }
      gl.bindAttribLocation(program, 0, 'p');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Sky shader unavailable:', gl.getProgramInfoLog(program));
        release();
        return;
      }
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const [uRes, uTime, uTop, uHor, uLit, uSh, uFog, uLight] = [
        'res',
        'time',
        'top',
        'hor',
        'lit',
        'sh',
        'fog',
        'lightDir',
      ].map((name) => gl.getUniformLocation(program, name));

      let shown = target.current;
      let last = 0;
      let elapsed = 0;
      let frame = 0;
      let dirty = true;
      // 30 fps is sufficient for this slow drift. Cap the buffer independently of DPR.
      const draw = (now: number) => {
        frame = 0;
        if (document.hidden || gl.isContextLost()) return;
        if (!reduced.matches) frame = requestAnimationFrame(draw);
        if (!dirty && now - last < 1000 / 30 - 1) return;
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
        last = now;
        dirty = false;
        if (!reduced.matches) elapsed += dt;
        const diff = ((target.current - shown + 36) % 24) - 12;
        shown = reduced.matches ? target.current : (shown + diff * Math.min(1, dt * 8) + 24) % 24;
        const p = palette(shown);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform3fv(uTop, p.top);
        gl.uniform3fv(uHor, p.hor);
        gl.uniform3fv(uLit, p.lit);
        gl.uniform3fv(uSh, p.sh);
        gl.uniform1f(uFog, p.fog);
        const angle = ((shown - 6) / 12) * Math.PI;
        gl.uniform2f(uLight, Math.cos(angle), -0.5 - Math.max(0, Math.sin(angle)) * 0.5);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const requestDraw = () => {
        dirty = true;
        if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
      };
      wake.current = requestDraw;
      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scale = Math.min(0.25, Math.sqrt(160000 / (width * height)));
        canvas.width = Math.max(1, Math.ceil(width * scale));
        canvas.height = Math.max(1, Math.ceil(height * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
        requestDraw();
      };
      const visibility = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        requestDraw();
      };
      resize();
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', visibility);
      reduced.addEventListener('change', requestDraw);
      dispose = () => {
        cancelAnimationFrame(frame);
        wake.current = () => {};
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', visibility);
        reduced.removeEventListener('change', requestDraw);
        release();
      };
    };
    const lost = (event: Event) => {
      event.preventDefault();
      dispose();
    };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', initialize);
    initialize();
    return () => {
      dispose();
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', initialize);
    };
  }, []);

  // Immediate palette-matched paint, also used when WebGL is unavailable.
  const p = palette(hour);
  const css = (rgb: number[]) => `rgb(${rgb.map((v) => Math.round(v * 255)).join(' ')})`;
  return (
    <canvas
      className="sky"
      ref={ref}
      aria-hidden="true"
      style={{ background: `linear-gradient(${css(p.top)}, ${css(p.hor)})` }}
    />
  );
}
