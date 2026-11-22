# SCAPE° — Modellgitter

From single measurements to a weather forecast, in five chapters:

1. **Warum ein Gitter?** (`#warum`) – a temperature field on a grid of
   4 × 4 to 64 × 64 cells, moved by the wind with the simplest finite-difference
   scheme. Tap a cell to see its calculation with its neighbours; coarse grids
   lose small features and smear the rest; cost grows with N³.
2. **Von Stationen zum Gitter** (`#stationen`) – 19 stations in an invented
   landscape (mountains, valley, city). Fill the grid by nearest station
   (Voronoi) or inverse distance weighting, switch stations off, compare with
   the real field and the error map.
3. **Messung trifft Modell** (`#assimilation`) – data assimilation in three
   steps: one point (model and measurement weighed by their uncertainty),
   a line (optimal interpolation with an influence radius; tap to add
   measurements), the cycle (forecast → measurements → analysis, against a
   forecast without new measurements, with the error over ten days).
4. **Die Vorhersage** (`#vorhersage`) – a 30-member ensemble of the Lorenz
   (1963) toy weather: start uncertainty against the limit of predictability.
5. **Die Gitter der Welt** (`#gitter`) – the 3D/AR grid gallery below.

All weather data in chapters 1–4 are synthetic (seeded, the same on every
visit). Every chapter has a stage, controls, tasks that unlock a Merke box and
collapsible topics with light formulas. The previous version of the app (only
the grid gallery) is kept on the branch `v1`.

## Chapter 5: the grid gallery

The computational grids of nine global weather models (ICON, cubed sphere,
Gaussian, latitude/longitude, adaptive Voronoi, hexagonal icosahedral,
reduced Gaussian, stretched/rotated, Yin-Yang) as 3D cut-away models that
show the vertical model layers. Visitors pick a grid, turn and zoom it on the
page, and on a phone or tablet place it in their room with Augmented Reality
(Scene Viewer on Android, AR Quick Look on iPhone/iPad, WebXR).

Each grid has a short fact sheet (who uses it, grid type, cell shape,
resolution) and a one-paragraph explanation. Three tasks (turn a grid; zoom in
until the layers are visible; look at three different grids) unlock the
"Merke" box. Longer explanations sit in collapsible topics below.

## Run

Serve the folder over HTTPS (e.g. GitHub Pages) or any static file server.
AR (camera) only works on a phone or tablet over real HTTPS. The 3D view works
on any browser with WebGL. Opening `index.html` by double-click (`file://`)
loads the page, but browsers refuse to load the `.glb` models from `file://`,
so for the 3D models use a local server (e.g. `python3 -m http.server`).

`<model-viewer>` 4.3.1 is self-hosted in `js/vendor/` (classic UMD build,
Apache 2.0, licence in `js/vendor/model-viewer.LICENSE`) – no third-party
requests at runtime, the exhibit works offline.

URL switches:

- `#warum`, `#stationen`, `#assimilation`, `#vorhersage`, `#gitter` – open
  that chapter.
- `#latlon`, `#yinyang`, … – open the grid chapter with that grid selected
  (the address follows the selection, so a grid can be linked directly).
- `?kiosk` – exhibit mode: back to the start (chapter 1) after 3 minutes
  without touch.

Zoom: two fingers on touch screens, Ctrl + mouse wheel on desktop (a plain
mouse wheel scrolls the page). Fullscreen button at the bottom right of the
model.

## Files

```
index.html               structure only (data-t placeholders for every text)
css/kit.css              shared SCAPE° components (same in every app)
css/app.css              layout of this app
js/view.js               phone/desktop layout switch (loaded in <head>)
js/texts.js              fills the texts from content/
js/brand.js              fills logo and footer line from the theme
js/kit.js                fullscreen button, hint badge, info notes, tasks/Merke, kiosk mode
js/app.js                chapter 5: grid choice (strip, pager, #hash), 3D model, AR button, tasks
js/canvas.js             shared canvas helpers (crisp canvas, seeded random, labels, colour bar, solver)
js/ch-warum.js           chapter 1: grid, wind, neighbours, resolution
js/ch-stationen.js       chapter 2: stations, interpolation, error map
js/ch-assimilation.js    chapter 3: point, line (optimal interpolation), assimilation cycle
js/ch-vorhersage.js      chapter 4: Lorenz ensemble
js/chapters.js           chapter navigation (header, #hash, pager), loaded last
js/vendor/               <model-viewer> 4.3.1 (UMD build) + licence
content/texts.de.js      every visible text: chapters, topics with formulas, fact sheets of all nine grids
theme/                   the design: font, palette, logo, colours (see theme/README.md)
*_grid_3D_cutaway.glb    3D models for the page, Android and WebXR
*_grid_3D_cutaway.usdz   the same models for AR Quick Look (iOS)
colored/                 coloured HEALPix/ICON variants (not used by the page)
```

## Layout

Header with the five chapters, poster header, then the chapter: on the phone
title and intro, the square stage, controls, readouts, tasks, Merke box and
topics; on the desktop the stage on the left, everything else on the right.
A chapter pager (previous / next) sits at the foot of every chapter.

Grid chapter: below the chapter intro a scrollable strip with the nine grids. Phone: grid name,
the square 3D model, hint, AR button, fact sheet, tasks, Merke box, topics,
previous/next buttons. Desktop (automatic from 1000 px, or via the
"Desktop-/Handy-Ansicht" toggle, remembered for this app only): the model on
the left, sized to the screen; name, hint, fact sheet and tasks on the right.
Where AR is not available (desktop), a note replaces the AR button.

## Adapting

Design: `theme/` only (signature colours, grid chip colours, viewer
background in the Modellgitter block of `theme.css`; the colours of the
canvas chapters in `THEME.modellgitter` in `theme.js`). Texts:
`content/texts.de.js` only. New grid: add the model files, an entry in
`GRIDS` in `js/app.js`, a chip in the strip in `index.html` and its texts
under `grids` in the texts file. Founders Grotesk is used when installed,
otherwise the system fallback.
