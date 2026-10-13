# SCAPE° — Modellgitter ("Modellgitter in AR")

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

- `#latlon`, `#yinyang`, … – open with that grid selected (the address
  follows the selection, so a grid can be linked directly).
- `?kiosk` – exhibit mode: back to the start (ICON grid) after 3 minutes
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
js/app.js                grid choice (strip, pager, #hash), 3D model, AR button, tasks
js/vendor/               <model-viewer> 4.3.1 (UMD build) + licence
content/texts.de.js      every visible text, incl. the fact sheets of all nine grids
theme/                   the design: font, palette, logo, colours (see theme/README.md)
*_grid_3D_cutaway.glb    3D models for the page, Android and WebXR
*_grid_3D_cutaway.usdz   the same models for AR Quick Look (iOS)
colored/                 coloured HEALPix/ICON variants (not used by the page)
```

## Layout

Poster header, then a scrollable strip with the nine grids. Phone: grid name,
the square 3D model, hint, AR button, fact sheet, tasks, Merke box, topics,
previous/next buttons. Desktop (automatic from 1000 px, or via the
"Desktop-/Handy-Ansicht" toggle, remembered for this app only): the model on
the left, sized to the screen; name, hint, fact sheet and tasks on the right.
Where AR is not available (desktop), a note replaces the AR button.

## Adapting

Design: `theme/` only (signature colours, grid chip colours, viewer
background in the Modellgitter block of `theme.css`). Texts:
`content/texts.de.js` only. New grid: add the model files, an entry in
`GRIDS` in `js/app.js`, a chip in the strip in `index.html` and its texts
under `grids` in the texts file. Founders Grotesk is used when installed,
otherwise the system fallback.
