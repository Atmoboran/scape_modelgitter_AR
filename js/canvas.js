// Shared helpers for the canvas steps (Messen, Kästchen, Mischen,
// Vorausrechnen): a crisp canvas that follows the size of its stage frame,
// a seeded random generator, number formatting and a few drawing helpers.
// Load after js/kit.js and before the chapter scripts.
(() => {
  const S = (window.SCAPE = window.SCAPE || {});
  const C = (window.THEME && window.THEME.modellgitter) || {};
  S.chapter = S.chapter || {};

  // ---- canvas inside a .stage-frame -------------------------------------------
  // const view = SCAPE.canvas(frame, (ctx, w, h) => { … });  view.redraw();
  // Drawing uses CSS pixels; the device pixel ratio is handled here.
  S.canvas = (frame, draw) => {
    const canvas = document.createElement('canvas');
    frame.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const view = { canvas, ctx, w: 0, h: 0 };
    let queued = false;
    view.redraw = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; paint(); });
    };
    const paint = () => {
      if (!view.w || !view.h) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dpr = canvas.width / view.w;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, view.w, view.h);
      draw(ctx, view.w, view.h);
    };
    view.paintNow = paint;
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      view.w = w; view.h = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      paint();
    };
    new ResizeObserver(resize).observe(canvas);
    // position of a pointer event in CSS pixels of the canvas
    view.at = ev => {
      const r = canvas.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    };
    return view;
  };

  // ---- a square board centred in w × h (maps keep their shape in full screen) --
  S.board = (w, h, pad = 0) => {
    const s = Math.min(w, h) - 2 * pad;
    return { x: (w - s) / 2, y: (h - s) / 2, s };
  };

  // ---- seeded random numbers (the same "synthetic weather" on every visit) ----
  S.rng = seed => {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.normal = () => {
      const u = Math.max(next(), 1e-12), v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    return next;
  };

  // ---- numbers in German notation ---------------------------------------------
  S.num = (v, digits = 1) => v.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });

  // ---- drawing helpers --------------------------------------------------------
  const FONT = (window.THEME && window.THEME.font) || 'sans-serif';
  S.font = (px, weight = 500) => weight + ' ' + Math.max(12, px) + 'px ' + FONT;

  // a label with a paper backdrop, so it stays readable on any colour
  S.label = (ctx, text, x, y, { align = 'left', base = 'middle', px = 13, weight = 500, ink = C.ink, bg = C.paper, pad = 3 } = {}) => {
    ctx.font = S.font(px, weight);
    ctx.textAlign = align;
    ctx.textBaseline = base;
    const m = ctx.measureText(text);
    const tw = m.width, th = Math.max(12, px);
    let bx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    let by = base === 'middle' ? y - th / 2 : base === 'bottom' ? y - th : y;
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(bx - pad, by - pad + 1, tw + 2 * pad, th + 2 * pad - 2); }
    ctx.fillStyle = ink;
    ctx.fillText(text, x, y);
  };

  // temperature colour for a value inside [lo, hi]
  S.tempColor = (v, lo, hi) => window.THEME.tempColor(Math.max(0, Math.min(1, (v - lo) / (hi - lo))));

  // a horizontal colour bar with end labels (legend for a map)
  S.colorBar = (ctx, x, y, w, h, lo, hi, unit = '°C') => {
    const n = 40;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = S.tempColor(lo + (hi - lo) * (i + 0.5) / n, lo, hi);
      ctx.fillRect(x + w * i / n, y, w / n + 0.5, h);
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    S.label(ctx, S.num(lo, 0) + unit, x - 4, y + h / 2, { align: 'right', px: 12 });
    S.label(ctx, S.num(hi, 0) + unit, x + w + 4, y + h / 2, { px: 12 });
  };

  S.gauss = (d2, s) => Math.exp(-d2 / (2 * s * s));

  // solve A x = b (small dense system, Gaussian elimination with pivoting)
  S.solve = (A, b) => {
    const n = b.length, M = A.map((row, i) => [...row, b[i]]);
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      const d = M[c][c] || 1e-12;
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = M[r][c] / d;
        if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
    }
    return M.map((row, i) => row[n] / (row[i] || 1e-12));
  };

  // a <input type=range> with an <output> next to it
  S.range = (input, out, fmt) => {
    const show = () => { out.textContent = fmt(+input.value); };
    input.addEventListener('input', show);
    show();
  };
})();
