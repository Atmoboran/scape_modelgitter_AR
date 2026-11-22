// Chapter 2 "Von Stationen zum Gitter": a synthetic land with mountains, a
// valley and a city. 19 stations measure the (hidden) real temperature; the
// visitor fills the grid cells by interpolation – nearest station (Voronoi)
// or inverse distance weighting – and compares with the real field.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const $ = id => document.getElementById(id);

  const SIZES = [8, 12, 16, 24, 32];
  const DOMAIN_KM = 400;
  const LO = -2, HI = 16, DIFF = 4;
  const g2 = (x, y, cx, cy, s) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
  // the "real" temperature (°C); y = 0 is the north edge
  const FEATURES = { mountain: [0.73, 0.27], city: [0.34, 0.62], valley: [0.12, 0.47] };
  const truth = (x, y) =>
    5 + 8 * y
    - 9.5 * g2(x, y, 0.73, 0.27, 0.13)
    + 3.2 * g2(x, y, 0.34, 0.62, 0.035)
    + 2.0 * Math.exp(-((y - 0.47 - 0.12 * Math.sin(5 * x)) ** 2) / (2 * 0.035 * 0.035))
    + 0.9 * Math.sin(7 * x + 1) * Math.cos(6 * y);

  // stations: many in the lowlands, one on the mountain, few in the north-east
  const POS = [
    [0.10, 0.14], [0.27, 0.09], [0.43, 0.19], [0.15, 0.34], [0.31, 0.29], [0.49, 0.40],
    [0.37, 0.57], [0.29, 0.67], [0.21, 0.52], [0.10, 0.71], [0.19, 0.89], [0.41, 0.83],
    [0.56, 0.70], [0.63, 0.89], [0.80, 0.76], [0.91, 0.92], [0.71, 0.31], [0.59, 0.53],
    [0.89, 0.56]
  ];
  const rnd = S.rng(7);
  const stations = POS.map(([x, y], i) => ({ i, x, y, on: true, v: truth(x, y) + 0.3 * rnd.normal() }));

  let N = 16, method = 'nearest', viewMode = 'interp', power = 2, sel = null;
  let grid = new Float64Array(N * N), real = new Float64Array(N * N);

  const weights = (x, y) => {
    const on = stations.filter(s => s.on);
    if (!on.length) return [];
    if (method === 'nearest') {
      let best = on[0], bd = Infinity;
      for (const s of on) { const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = s; } }
      return [{ s: best, w: 1 }];
    }
    const ws = on.map(s => ({ s, w: 1 / Math.pow(Math.max(1e-4, Math.hypot(s.x - x, s.y - y)), power) }));
    const sum = ws.reduce((a, b) => a + b.w, 0);
    ws.forEach(o => { o.w /= sum; });
    return ws.sort((a, b) => b.w - a.w);
  };
  const interp = (x, y) => weights(x, y).reduce((a, o) => a + o.w * o.s.v, 0);

  let rms = 0, maxErr = 0;
  const compute = () => {
    grid = new Float64Array(N * N); real = new Float64Array(N * N);
    let e2 = 0; maxErr = 0;
    const any = stations.some(s => s.on);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = (i + 0.5) / N, y = (j + 0.5) / N, k = j * N + i;
      real[k] = truth(x, y);
      grid[k] = any ? interp(x, y) : NaN;
      const e = grid[k] - real[k];
      e2 += e * e; maxErr = Math.max(maxErr, Math.abs(e));
    }
    rms = Math.sqrt(e2 / (N * N));
  };

  // ---- drawing ------------------------------------------------------------------
  const layout = (w, h) => {
    const B = S.board(w, h, 12), s = B.s - 32;
    return { ox: B.x + (B.s - s) / 2, oy: B.y, s };
  };
  const draw = (ctx, w, h) => {
    const { ox, oy, s } = layout(w, h), cell = s / N;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i;
      let col;
      if (viewMode === 'truth') col = S.tempColor(real[k], LO, HI);
      else if (isNaN(grid[k])) col = C.paper;
      else if (viewMode === 'diff') col = S.tempColor(grid[k] - real[k], -DIFF, DIFF);
      else col = S.tempColor(grid[k], LO, HI);
      ctx.fillStyle = col;
      ctx.fillRect(ox + i * cell, oy + j * cell, cell + 0.6, cell + 0.6);
    }
    ctx.strokeStyle = C.gridLine; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 1; k < N; k++) {
      ctx.moveTo(ox + k * cell, oy); ctx.lineTo(ox + k * cell, oy + s);
      ctx.moveTo(ox, oy + k * cell); ctx.lineTo(ox + s, oy + k * cell);
    }
    ctx.stroke();

    // landmarks
    for (const [key, [fx, fy]] of Object.entries(FEATURES)) {
      S.label(ctx, t('stationen.place.' + key), ox + fx * s, oy + fy * s + (key === 'mountain' ? -34 : 22), { align: 'center', px: 12, weight: 400, bg: 'rgba(255,255,255,0.75)' });
    }

    // the selected cell and where its value comes from
    if (sel) {
      const [i, j] = sel, cx = ox + (i + 0.5) * cell, cy = oy + (j + 0.5) * cell;
      const ws = weights((i + 0.5) / N, (j + 0.5) / N);
      ctx.strokeStyle = C.select;
      for (const o of ws) {
        if (o.w < 0.02) continue;
        ctx.lineWidth = 1 + 9 * o.w;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ox + o.s.x * s, oy + o.s.y * s); ctx.stroke();
      }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
      ctx.strokeRect(ox + i * cell + 1.5, oy + j * cell + 1.5, cell - 3, cell - 3);
    }

    // stations with their measurement
    for (const st of stations) {
      const x = ox + st.x * s, y = oy + st.y * s;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = st.on ? C.station : C.paper; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = st.on ? C.paper : C.stationOff; ctx.stroke();
      if (!st.on) {
        ctx.strokeStyle = C.stationOff;
        ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
      }
      S.label(ctx, S.num(st.v, 0) + '°', x, y - 16, { align: 'center', px: 12, ink: st.on ? C.ink : C.muted });
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, s, s);

    if (viewMode === 'diff') S.colorBar(ctx, ox + s * 0.22, oy + s + 12, s * 0.56, 10, -DIFF, DIFF);
    else S.colorBar(ctx, ox + s * 0.22, oy + s + 12, s * 0.56, 10, LO, HI);
    // scale bar
    const km = 100, px = s * km / DOMAIN_KM;
    ctx.fillStyle = C.ink;
    ctx.fillRect(ox + 8, oy + s - 12, px, 3);
    S.label(ctx, km + ' km', ox + 8 + px + 6, oy + s - 11, { px: 12, bg: 'rgba(255,255,255,0.75)' });
  };

  const frame = $('s-stage');
  const view = S.canvas(frame, draw);
  const hint = S.badge(frame);
  hint.show(t('stationen.badge'));
  const tasks = S.tasks($('s-tasks'));

  const readouts = () => {
    const on = stations.filter(s => s.on).length;
    $('s-active').textContent = t('stationen.activeOf', on, stations.length);
    $('s-rms').textContent = on ? S.num(rms) + ' °C' : '–';
    $('s-max').textContent = on ? S.num(maxErr) + ' °C' : '–';
    const out = $('s-cell');
    if (!sel || !on) { out.textContent = on ? t('stationen.cellNone') : t('stationen.noStation'); return; }
    const [i, j] = sel, k = j * N + i;
    const ws = weights((i + 0.5) / N, (j + 0.5) / N);
    const parts = ws.slice(0, 3).map(o => t('stationen.share', o.s.i + 1, Math.round(o.w * 100)));
    out.innerHTML = t('stationen.cell', S.num(grid[k]), S.num(real[k])) + '<br>' + t('stationen.from', parts.join(', '));
  };
  const update = () => { compute(); readouts(); view.redraw(); };

  // ---- controls ------------------------------------------------------------------
  const res = $('s-res');
  res.max = SIZES.length - 1;
  res.value = SIZES.indexOf(N);
  S.range(res, $('s-res-out'), v => SIZES[v] + ' × ' + SIZES[v]);
  res.addEventListener('input', () => { N = SIZES[+res.value]; sel = null; update(); });

  const pw = $('s-power');
  S.range(pw, $('s-power-out'), v => 'p = ' + S.num(v));
  pw.addEventListener('input', () => { power = +pw.value; update(); });

  const seg = (sel_, attr, set) => {
    const btns = [...document.querySelectorAll(sel_)];
    const mark = v => btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset[attr] === v)));
    btns.forEach(b => b.addEventListener('click', () => { set(b.dataset[attr]); mark(b.dataset[attr]); }));
    return mark;
  };
  const markMethod = seg('[data-s-method]', 'sMethod', v => {
    method = v; hint.hide();
    $('s-power-row').hidden = v !== 'idw';
    if (v === 'idw') tasks.done('idw');
    update();
  });
  const markView = seg('[data-s-view]', 'sView', v => {
    viewMode = v;
    if (v === 'diff') tasks.done('diff');
    view.redraw();
  });
  markMethod(method); markView(viewMode);
  $('s-power-row').hidden = true;

  $('s-reset').addEventListener('click', () => { stations.forEach(s => { s.on = true; }); sel = null; update(); });

  view.canvas.addEventListener('click', ev => {
    const p = view.at(ev), { ox, oy, s } = layout(view.w, view.h);
    hint.hide();
    let hit = null, hd = 16;
    for (const st of stations) {
      const d = Math.hypot(ox + st.x * s - p.x, oy + st.y * s - p.y);
      if (d < hd) { hd = d; hit = st; }
    }
    if (hit) {
      hit.on = !hit.on;
      if (!hit.on) tasks.done('off');
      update();
      return;
    }
    const i = Math.floor((p.x - ox) / s * N), j = Math.floor((p.y - oy) / s * N);
    if (i < 0 || j < 0 || i >= N || j >= N) return;
    sel = sel && sel[0] === i && sel[1] === j ? null : [i, j];
    if (sel) tasks.done('cell');
    readouts(); view.redraw();
  });

  compute(); readouts();
  S.chapter.stationen = { enter() { view.redraw(); } };
})();
