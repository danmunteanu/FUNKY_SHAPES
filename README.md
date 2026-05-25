# Funky Shapes

Funky Shapes is a small Vue app for generating colorful geometric shapes from a polar formula. Users can adjust the shape parameters, animation speed, drawing precision, pen size, and color, then download the rendered shape as a PNG.

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- PrimeVue
- p5.js

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Vite will print a local URL, usually:

```txt
http://localhost:5173/
```

## Build

```bash
npm run build
```

The production files are generated in:

```txt
dist/
```

## Preview The Production Build

```bash
npm run preview
```

## Regenerate The Sprite Sheet

The shape option thumbnails use:

```txt
assets/funky-shapes-sprite-sheet.png
```

Regenerate it with:

```bash
npm run spritesheet
```

The script renders the sprite sheet through a headless Chromium canvas so the output keeps browser-quality anti-aliasing. It uses the shared shape math from:

```txt
src/shape-points.ts
```

After regenerating the sprite sheet, run a normal build to verify the app:

```bash
npm run build
```
