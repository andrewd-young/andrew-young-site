# Andrew Young — personal site

A single-page site built with React, TypeScript, and Vite.

## Develop

```sh
npm install
npm run dev
```

`npm run build` type-checks and writes a static site to `dist/`.

## Code quality

- `npm run format` formats all files with Prettier.
- `npm run lint` runs ESLint.
- `npm run check` runs the Prettier check, ESLint, and the TypeScript check.

`npm install` sets `core.hooksPath` to `.githooks`, so `npm run check` runs before every commit.

## Edit

- `src/App.tsx`: page content, links, experience rows, sky control.
- `src/sky.tsx`: animated San Francisco sky.
- `src/styles.css`: layout and fonts.
- `public/`: logos, fonts, favicon, and résumé PDF.
