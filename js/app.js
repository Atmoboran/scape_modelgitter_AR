// Modellgitter: grid choice (strip, pager, #hash), the 3D model in
// <model-viewer>, the AR button, tasks and the first-hint badge.
(() => {
  'use strict';

  // The 3D models next to index.html: .glb for the page and Android,
  // .usdz for AR Quick Look on iPhone/iPad. Texts live in content/ (grids.*).
  const GRIDS = {
    icon:            { src: 'ICON_icosahedral_grid_3D_cutaway.glb',  ios: 'ICON_icosahedral_grid_3D_cutaway.usdz' },
    cubedsphere:     { src: 'CubedSphere_grid_3D_cutaway.glb',       ios: 'CubedSphere_grid_3D_cutaway.usdz' },
    gaussian:        { src: 'Gaussian_grid_3D_cutaway.glb',          ios: 'Gaussian_grid_3D_cutaway.usdz' },
    latlon:          { src: 'LatLon_grid_3D_cutaway.glb',            ios: 'LatLon_grid_3D_cutaway.usdz' },
    voronoi:         { src: 'AdaptiveVoronoi_grid_3D_cutaway.glb',   ios: 'AdaptiveVoronoi_grid_3D_cutaway.usdz' },
    hexicosahedral:  { src: 'HexIcosahedral_grid_3D_cutaway.glb',    ios: 'HexIcosahedral_grid_3D_cutaway.usdz' },
    reducedgaussian: { src: 'ReducedGaussian_grid_3D_cutaway.glb',   ios: 'ReducedGaussian_grid_3D_cutaway.usdz' },
    stretched:       { src: 'StretchedRotated_grid_3D_cutaway.glb',  ios: 'StretchedRotated_grid_3D_cutaway.usdz' },
    yinyang:         { src: 'YinYang_grid_3D_cutaway.glb',           ios: 'YinYang_grid_3D_cutaway.usdz' }
  };
  const KEYS = Object.keys(GRIDS);
  const SCALE = '1 1 1';
  const ZOOM_TASK = 0.6;   // "zoomed in" = camera distance below 60 % of the start

  const $ = id => document.getElementById(id);
  const viewer = $('viewer');
  const strip = $('strip');
  const chips = [...strip.querySelectorAll('[data-grid]')];
  const arLaunch = $('ar-launch');
  const g = key => window.t('grids.' + key);

  const FILE = location.protocol === 'file:';
  const showError = key => { const el = $('model-error'); el.textContent = t(key); el.hidden = false; hint.hide(); };
  let current = null;
  let baseRadius = 0;
  const seen = new Set();

  // ---- first hint + tasks ---------------------------------------------------
  const hint = SCAPE.badge($('stage'));
  hint.show(t('stage.badge'));
  const tasks = SCAPE.tasks($('mg-tasks'));
  const status = $('task-status');
  const showProgress = () => {
    status.textContent = tasks.isDone('three') ? '' : t('tasks.progress', Math.min(seen.size, 3), 3);
  };

  // ---- choose a grid ----------------------------------------------------------
  const select = (key, { scroll = false } = {}) => {
    if (!GRIDS[key] || key === current) return;
    current = key;
    const i = KEYS.indexOf(key);
    const txt = g(key);

    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.grid === key)));
    const chip = chips[i];
    if (scroll && chip) chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });

    $('grid-count').textContent = t('count', i + 1, KEYS.length);
    $('grid-name').textContent = txt.name;
    $('ar-label').textContent = txt.ar;
    $('f-institution').textContent = txt.institution;
    $('f-type').textContent = txt.type;
    $('f-cells').textContent = txt.cells;
    $('f-resolution').textContent = txt.resolution;
    $('f-explain').textContent = txt.explain;
    $('ar-failed').hidden = true;
    $('model-error').hidden = true;

    // pager: previous / next grid
    const prev = KEYS[i - 1], next = KEYS[i + 1];
    $('pager-prev').disabled = !prev;
    $('pager-next').disabled = !next;
    $('pager-prev-name').textContent = prev ? g(prev).name : '';
    $('pager-next-name').textContent = next ? g(next).name : '';
    $('pager-prev').setAttribute('aria-label', prev ? t('pager.prevAria', g(prev).name) : '');
    $('pager-next').setAttribute('aria-label', next ? t('pager.nextAria', g(next).name) : '');
    $('pager-count').textContent = (i + 1) + ' / ' + KEYS.length;

    if (location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);

    // the model
    arLaunch.disabled = true;
    baseRadius = 0;
    viewer.alt = t('stage.alt', txt.name);
    viewer.setAttribute('ios-src', GRIDS[key].ios);
    viewer.setAttribute('scale', SCALE);
    if (FILE) showError('stage.fileError');   // browsers block loading models from file://
    else viewer.setAttribute('src', GRIDS[key].src);

    seen.add(key);
    if (seen.size >= 3) tasks.done('three');
    showProgress();
  };

  strip.addEventListener('click', ev => {
    const chip = ev.target.closest('[data-grid]');
    if (chip) select(chip.dataset.grid);
  });
  const step = d => {
    const key = KEYS[KEYS.indexOf(current) + d];
    if (!key) return;
    select(key, { scroll: true });
    strip.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  $('pager-prev').addEventListener('click', () => step(-1));
  $('pager-next').addEventListener('click', () => step(1));
  window.addEventListener('hashchange', () => select(location.hash.slice(1), { scroll: true }));

  // ---- the model: loaded, turned, zoomed ----------------------------------------
  const updateAr = () => {
    const can = !!viewer.canActivateAR;
    $('ar-row').hidden = !can;
    $('ar-desk').hidden = can;
    if (!can) $('ar-help').hidden = true;
  };
  viewer.addEventListener('load', () => {
    arLaunch.disabled = false;
    updateAr();
    // the starting distance of the camera, measured once it has settled
    requestAnimationFrame(() => { baseRadius = viewer.getCameraOrbit().radius; });
  });
  viewer.addEventListener('error', () => showError('stage.error'));
  viewer.addEventListener('camera-change', ev => {
    if (ev.detail.source !== 'user-interaction') return;
    hint.hide();
    tasks.done('turn');
    if (baseRadius && viewer.getCameraOrbit().radius < baseRadius * ZOOM_TASK) tasks.done('zoom');
  });

  // Zoom only by pinch and Ctrl + mouse wheel: a plain wheel scrolls the page.
  $('stage').addEventListener('wheel', ev => { if (!ev.ctrlKey) ev.stopPropagation(); }, { capture: true });

  // ---- AR -----------------------------------------------------------------------
  arLaunch.addEventListener('click', () => {
    hint.hide();
    viewer.activateAR();
  });
  viewer.addEventListener('ar-status', ev => {
    if (ev.detail.status === 'failed') $('ar-failed').hidden = false;
  });

  updateAr();
  const start = location.hash.slice(1);
  select(GRIDS[start] ? start : KEYS[0], { scroll: !!GRIDS[start] });
})();
