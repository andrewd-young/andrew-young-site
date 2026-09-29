import {useEffect,useRef} from 'react';
const keys: [number,string,string,string,string,number][] = [
    [0, '#03060c', '#0c1626', '#27303f', '#080c14', .45],
    [5, '#070c1a', '#232a40', '#3a3f55', '#10141f', .55],
    [6.5, '#3b4c6e', '#e6a88c', '#f4c8ae', '#6b6a82', .75],
    [8.5, '#86a7c4', '#d6dfe4', '#f3f5f6', '#98a6b2', .9],
    [12, '#4f88bf', '#b9d2e6', '#ffffff', '#b1c0cd', .3],
    [16.5, '#6d93bd', '#e6d5ba', '#fff0da', '#a9a4aa', .45],
    [19, '#2b3a63', '#e07c55', '#f2a67e', '#4a3e5a', .8],
    [20.5, '#0d1428', '#3a3353', '#5a5272', '#141a2a', .6],
    [24, '#03060c', '#0c1626', '#27303f', '#080c14', .45]
  ];

const hex=(h:string)=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function palette(h:number){let i=0;while(i<keys.length-2&&h>=keys[i+1][0])i++;const a=keys[i],b=keys[i+1],t=(h-a[0])/(b[0]-a[0]);const m=(j:1|2|3|4)=>hex(a[j]).map((v,n)=>v+(hex(b[j])[n]-v)*t);return {top:m(1),hor:m(2),lit:m(3),sh:m(4),fog:a[5]+(b[5]-a[5])*t}}
export function Sky({hour}:{hour:number}){const ref=useRef<HTMLCanvasElement>(null);const hourRef=useRef(hour);hourRef.current=hour;
useEffect(()=>{
    const perm = new Uint8Array(512); const base = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = (i * 7919 + 13) % (i + 1); [base[i], base[j]] = [base[j], base[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
    const rnd = (x:number, y:number) => perm[(perm[x & 255] + y) & 511] / 255;
    const sm = (t:number) => t * t * (3 - 2 * t);
    const noise = (x:number, y:number) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const a = rnd(xi, yi), b = rnd(xi + 1, yi), c = rnd(xi, yi + 1), d = rnd(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };
    const fbm = (x:number, y:number) => { let v = 0, amp = .5, f = 1; for (let o = 0; o < 5; o++) { v += amp * noise(x * f, y * f); f *= 2.03; amp *= .5; } return v; };

let frame=0,last=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const draw=(ts:number)=>{frame=requestAnimationFrame(draw);if(ts-last<(reduced.matches?1000:80))return;last=ts;const cv=ref.current;if(!cv)return;
      const ctx = cv.getContext('2d')!; const W = cv.width, H = cv.height;
      const img = ctx.createImageData(W, H), px = img.data;
      const P = palette(hourRef.current), t = reduced.matches ? 0 : ts / 1000;
      const cover = .6 - P.fog * .12;
      for (let y = 0; y < H; y++) {
        const yn = y / H, skyT = Math.pow(yn, .85);
        const fogB = P.fog * Math.max(0, (yn - .45) / .55) * .55;
        for (let x = 0; x < W; x++) {
          const nx = x / 34 + t * .035, ny = y / 22 + t * .006;
          const n = fbm(nx, ny) + fogB * (.7 + .3 * noise(x / 18 - t * .05, y / 12));
          let d = (n - cover) / .26; d = d < 0 ? 0 : d > 1 ? 1 : d; d = d * d * (3 - 2 * d);
          const shade = Math.min(1, Math.max(0, (fbm(nx + .35, ny + .5) - .35) * 1.6 + yn * .3));
          const i = (y * W + x) * 4;
          for (let c = 0; c < 3; c++) {
            const sky = P.top[c] + (P.hor[c] - P.top[c]) * skyT;
            const cl = P.lit[c] + (P.sh[c] - P.lit[c]) * shade;
            px[i + c] = sky + (cl - sky) * d * .96;
          }
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
},[]);return <canvas className="sky" ref={ref} width={240} height={160} aria-hidden="true"/>}
