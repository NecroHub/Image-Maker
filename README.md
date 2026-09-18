# Image Editor — standalone download

A self-contained image editor you can host anywhere (or just open `index.html` in a
browser). It is the exact editor that runs inside the Perchance generator, extracted so
it needs no Perchance runtime at all.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The standalone page: title, "Open Image Editor" button, file picker, drop zone, paste support. |
| `style.css` | All editor styling (the Art Deco gold/obsidian theme) plus the small page shell styling. |
| `app.js` | The whole editor — a single self-contained IIFE that injects its UI and exposes `window.t2iEditor`. |
| `perchance-generator/` | The original Perchance generator sources, for reference (see below). |

Open `index.html` directly from disk and it works. No build step, no dependencies
(the only network request is the optional Google Fonts link; remove it and it still
looks fine, just with fallback serif fonts).

## How to use it

- Click **Open Image Editor** (or drag a file onto the drop zone, or paste an image with
  Ctrl+V / ⌘V).
- **Adjust** — brightness, contrast, saturation, exposure, warmth, hue, blur, fade,
  vignette, grain, sepia, black & white. Double-click a slider to reset it.
- **Looks** — 12 one-click presets with live thumbnails of *your* image.
- **Reshape** — rotate 90°, flip H/V, crop (free or 1:1 / 4:3 / 3:4 / 16:9 / 9:16) with
  8 drag handles, and resize with an aspect-lock toggle.
- **Save** — PNG / JPEG / WebP, quality slider for the lossy formats, download or copy to
  clipboard.
- Undo / redo (40 steps) and reset are in the header. Esc closes the editor.

Everything is done with the Canvas 2D API in the browser — no uploads, no server.

## Programmatic API

```js
window.t2iEditor.open();                 // open with the image picker
window.t2iEditor.open(loaderFn);         // open with a loader returning an <img>
window.t2iEditor.loadFile(fileOrBlob);   // load a File/Blob
window.t2iEditor.loadSrc(url, "name");   // load a URL / data URL
window.t2iEditor.state;                  // { base, adj, crop, name, preset, aspect }
window.t2iEditor.exportCanvas();         // -> HTMLCanvasElement at full resolution
await window.t2iEditor.exportBlob();     // -> { blob, canvas }
```

## perchance-generator/

The same editor as it ships inside the Perchance generator:

- `index.html` — the generator's page markup (Perchance body contents only).
- `main.pjs` — Perchance lists/config plus `$meta`.
- `src/theme.js` — the site theme + emoji→SVG icon replacement.
- `src/editor.js` — the editor source (identical logic to `app.js`, except it also
  injects an **edit image** button next to the generator's generate button, adds an
  "edit" button under every generated image, adds an "edit image" entry to each image's
  menu, and can pull images from the generator's private gallery).

Keep `src/editor.js` as the source of truth. To rebuild the standalone `app.js`:

1. Take `src/editor.js`.
2. Replace the body of `editorCss()` with `return "";`.
3. Replace `boot()` with the standalone version that binds `[data-t2ie-open]`.
4. Move the extracted CSS (everything the old `editorCss()` returned) into `style.css`.
