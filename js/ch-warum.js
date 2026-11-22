// Chapter 1 "Warum ein Gitter?": a smooth (synthetic) temperature field,
// stored on a grid of N × N cells. The wind moves it with the simplest
// finite-difference scheme ("upwind"): every cell only looks at its
// neighbours upwind. Coarse grids lose small features and smear the rest.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const $ = id => document.getElementById(id);

  const SIZES = [4, 8, 16, 32, 64];
  const DOMAIN_KM = 1000;
  const U = 0.04, V = 0.015;      // wind in domain widths per model hour (≈ 40 km/h)
  const HOURS_PER_S = 2;          // model hours per real second
  const LO = 4, HI = 20;          // colour scale (°C)
  const BASE = 10;
  // warm and cold spots of different size (x, y in 0…1, s = width, a = °C)
  const BLOBS = [
    { x: 0.30, y: 0.40, s: 0.12, a: 8.5 },
    { x: 0.64, y: 0.64, s: 0.06, a: -6 },
    { x: 0.72, y: 0.22, s: 0.032, a: 7 },
    { x: 0.20, y: 0.80, s: 0.05, a: 5 }
  ];

  const wrap = d => d - Math.round(d);   // periodic distance in a 1 × 1 domain
  const truth = (x, y, t) => {
    let v = BASE;
    for (const b of BLOBS) {
      const dx = wrap(x - b.x - U * t), dy = wrap(y - b.y - V * t);
      v += b.a * Math.exp(-(dx * dx + dy * dy) / (2 * b.s * b.s));
    }
    return v;
  };

  let N = 16, q = new Float64Array(N * N), time = 0;
  let playing = false, active = false, raf = 0, last = 0;
  let showTruth = false, sel = null;
  const visited = new Set();

  const sample = () => {
    q = new Float64Array(N * N);
    const k = 3;   // 3 × 3 samples per cell ≈ cell average
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let s = 0;
      for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) s += truth((i + (a + 0.5) / k) / N, (j + (b + 0.5) / k) / N, time);
      q[j * N + i] = s / (k * k);
    }
  };

  const step = hours => {
    // keep the Courant number below 0.5 for stability
    const n = Math.max(1, Math.ceil((U + V) * N * hours / 0.5));
    const dt = hours / n, cx = U * dt * N, cy = V * dt * N;
    for (let s = 0; s < n; s++) {
      const r = new Float64Array(N * N);
      for (let j = 0; j < N; j++) {
        const jm = (j - 1 + N) % N;
        for (let i = 0; i < N; i++) {
          const im = (i - 1 + N) % N, c = q[j * N + i];
          r[j * N + i] = c - cx * (c - q[j * N + im]) - cy * (c - q[jm * N + i]);
        }
      }
      q = r;
    }
    time += hours;
  };

  // ---- drawing ------------------------------------------------------------------
  const off = document.createElement('canvas');
  off.width = off.height = 128;
  const offCtx = off.getContext('2d');
  const drawTruth = () => {
    const img = offCtx.createImageData(128, 128);
    for (let j = 0; j < 128; j++) for (let i = 0; i < 128; i++) {
      const m = window.THEME.tempColor(Math.max(0, Math.min(1, (truth((i + 0.5) / 128, (j + 0.5) / 128, time) - LO) / (HI - LO)))).match(/\d+/g);
      const o = (j * 128 + i) * 4;
      img.data[o] = +m[0]; img.data[o + 1] = +m[1]; img.data[o + 2] = +m[2]; img.data[o + 3] = 255;
    }
    offCtx.putImageData(img, 0, 0);
  };

  const draw = (ctx, w, h) => {
    const B = S.board(w, h, 14);
    const top = B.y, left = B.x, s = B.s - 30;   // room for the colour bar
    const ox = left + (B.s - s) / 2;
    const cell = s / N;
    ctx.save();
    ctx.beginPath(); ctx.rect(ox, top, s, s); ctx.clip();
    if (showTruth) {
      drawTruth();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, ox, top, s, s);
    } else {
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        ctx.fillStyle = S.tempColor(q[j * N + i], LO, HI);
        ctx.fillRect(ox + i * cell, top + j * cell, cell + 0.6, cell + 0.6);
      }
      if (N <= 32) {
        ctx.strokeStyle = C.gridLine; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 1; k < N; k++) {
          ctx.moveTo(ox + k * cell, top); ctx.lineTo(ox + k * cell, top + s);
          ctx.moveTo(ox, top + k * cell); ctx.lineTo(ox + s, top + k * cell);
        }
        ctx.stroke();
      }
    }
    // where the warm and cold spots really are (dashed outlines)
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeStyle = C.truth;
    for (const b of BLOBS) {
      const bx = ((b.x + U * time) % 1 + 1) % 1, by = ((b.y + V * time) % 1 + 1) % 1;
      for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) {
        ctx.beginPath();
        ctx.arc(ox + (bx + sx) * s, top + (by + sy) * s, b.s * 1.6 * s, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    // the tapped cell, its upwind neighbours and the wind arrows
    if (sel && !showTruth) {
      const [i, j] = sel;
      const box = (ci, cj, lw) => { ctx.lineWidth = lw; ctx.strokeRect(ox + ci * cell + lw / 2, top + cj * cell + lw / 2, cell - lw, cell - lw); };
      ctx.strokeStyle = C.select;
      box((i - 1 + N) % N, j, 2); box(i, (j - 1 + N) % N, 2);
      box((i + 1) % N, j, 1); box(i, (j + 1) % N, 1);
      ctx.strokeStyle = C.ink; box(i, j, 3);
    }
    ctx.restore();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(ox, top, s, s);
    // wind arrow
    const ax = ox + 10, ay = top + 14;
    S.label(ctx, t('warum.wind'), ax + 40, ay, { px: 12 });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax, ay - 4); ctx.lineTo(ax + 30, ay + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax + 30, ay + 4); ctx.lineTo(ax + 22, ay + 6); ctx.lineTo(ax + 25, ay - 1); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
    S.colorBar(ctx, ox + s * 0.22, top + s + 10, s * 0.56, 10, LO, HI);
  };

  const frame = $('w-stage');
  const view = S.canvas(frame, draw);
  const hint = S.badge(frame);
  hint.show(t('warum.badge'));
  const tasks = S.tasks($('w-tasks'));

  // ---- readouts ------------------------------------------------------------------
  const readouts = () => {
    $('w-cells').textContent = N + ' × ' + N + ' = ' + (N * N).toLocaleString('de-DE');
    $('w-dx').textContent = '≈ ' + Math.round(DOMAIN_KM / N) + ' km';
    $('w-cost').textContent = (Math.pow(N / 4, 3)).toLocaleString('de-DE') + ' ×';
    $('w-time').textContent = t('warum.hours', Math.round(time));
    const out = $('w-cell');
    if (!sel) { out.textContent = t('warum.cellNone'); return; }
    const [i, j] = sel, c = q[j * N + i], l = q[j * N + (i - 1 + N) % N], o = q[((j - 1 + N) % N) * N + i];
    const dt = Math.min(1, 0.8 / ((U + V) * N));
    const cx = U * dt * N, cy = V * dt * N;
    const nxt = c - cx * (c - l) - cy * (c - o);
    out.innerHTML = t('warum.cell', S.num(c), S.num(l), S.num(o)) + '<br>' +
      t('warum.cellNext', S.num(c), S.num(cx, 2), S.num(l), S.num(cy, 2), S.num(o), S.num(nxt), dt >= 1 ? '1 h' : Math.round(dt * 60) + ' min');
  };

  // ---- controls ------------------------------------------------------------------
  const res = $('w-res');
  res.max = SIZES.length - 1;
  res.value = SIZES.indexOf(N);
  const setRes = () => {
    N = SIZES[+res.value];
    $('w-res-out').textContent = N + ' × ' + N;
    visited.add(+res.value);
    if (visited.has(0) && visited.has(SIZES.length - 1)) tasks.done('res');
    sel = null;
    sample(); readouts(); view.redraw();
  };
  res.addEventListener('input', () => { hint.hide(); setRes(); });

  const wind = $('w-wind');
  const loop = now => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    step(dt * HOURS_PER_S);
    readouts(); view.paintNow();
    raf = requestAnimationFrame(loop);
  };
  const play = on => {
    playing = on;
    wind.setAttribute('aria-pressed', String(on));
    wind.textContent = on ? t('warum.windStop') : t('warum.windStart');
    cancelAnimationFrame(raf);
    if (on && active) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  wind.addEventListener('click', () => { hint.hide(); tasks.done('wind'); play(!playing); });
  $('w-reset').addEventListener('click', () => { time = 0; sample(); readouts(); view.redraw(); });
  const truthBtn = $('w-truth');
  truthBtn.addEventListener('click', () => {
    showTruth = !showTruth;
    truthBtn.setAttribute('aria-pressed', String(showTruth));
    view.redraw();
  });

  view.canvas.addEventListener('click', ev => {
    const p = view.at(ev);
    const B = S.board(view.w, view.h, 14), s = B.s - 30, ox = B.x + (B.s - s) / 2;
    const i = Math.floor((p.x - ox) / s * N), j = Math.floor((p.y - B.y) / s * N);
    if (i < 0 || j < 0 || i >= N || j >= N) return;
    hint.hide();
    sel = sel && sel[0] === i && sel[1] === j ? null : [i, j];
    if (sel) tasks.done('cell');
    readouts(); view.redraw();
  });

  visited.add(SIZES.indexOf(N));
  $('w-res-out').textContent = N + ' × ' + N;
  sample(); readouts();
  wind.textContent = t('warum.windStart');

  S.chapter.warum = {
    enter() { active = true; if (playing) play(true); view.redraw(); },
    leave() { active = false; cancelAnimationFrame(raf); }
  };
})();
