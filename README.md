# Andrew Young — personal site

React 19 + TypeScript, using the Next.js App Router API with Vinext/Vite. Semantic HTML and custom CSS; no UI framework is required by the page.

## Develop

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal. To check types, run `npx tsc --noEmit`. To build, run `npm run build`.

## Edit

- `app/page.tsx`: résumé content, links, expandable experience, sky controls.
- `app/sky.tsx`: animated sky adapted from the supplied SF Sky concept.
- `app/globals.css`: responsive layout and locally hosted Instrument Serif / DM Sans fonts.
- `public/`: company logos, fonts, favicon, and résumé PDF.

The default sky follows `America/Los_Angeles` time, including daylight saving. The slider previews any time of day; Live restores the current time. Fog is a visual simulation, not live weather. Reduced-motion preferences stop cloud movement.

Company logo sources: https://notability.com/static/nb-logo-full.svg ; https://strella.io ; https://linktr.ee/lola_dates . Résumé facts come from the supplied Andrew_Young_Resume.pdf.
