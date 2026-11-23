// Chapter 2 "Kästchen": the computer keeps one number per box. The visitor
// makes the boxes coarse or fine: coarse boxes lose the mountain and the city,
// fine boxes keep them – but cost much more computing time.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter, L = S.land;
  const $ = id => document.getElementById(id);

  const SIZES = [4, 8, 16, 32];
  let N = 8, showReal = false;
  const seen = new Set([1]);

  // one number per box: the average over the box
  const boxes = () => {
    const v = new Float64Array(N * N), k = 4;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let s = 0;
      for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) s += L.temp((i + (a + 0.5) / k) / N, (j + (b + 0.5) / k) / N);
      v[j * N + i] = s / (k * k);
    }
    return v;
  };

  const off = document.createElement('canvas');
  off.width = off.height = 96;
  {
    const c = off.getContext('2d'), img = c.createImageData(96, 96);
    for (let j = 0; j < 96; j++) for (let i = 0; i < 96; i++) {
      const m = S.tempColor(L.temp((i + 0.5) / 96, (j + 0.5) / 96), L.LO, L.HI).match(/\d+/g), o = (j * 96 + i) * 4;
      img.data[o] = +m[0]; img.data[o + 1] = +m[1]; img.data[o + 2] = +m[2]; img.data[o + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  }

  const draw = (ctx, w, h) => {
    const B = S.board(w, h, 12), s = B.s - 34, b = { x: B.x + (B.s - s) / 2, y: B.y, s };
    if (showReal) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, b.x, b.y, s, s);
    } else {
      const v = boxes(), cell = s / N;
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        ctx.fillStyle = S.tempColor(v[j * N + i], L.LO, L.HI);
        ctx.fillRect(b.x + i * cell, b.y + j * cell, cell + 0.6, cell + 0.6);
      }
      ctx.strokeStyle = C.gridLine; ctx.lineWidth = N >= 32 ? 0.5 : 1;
      ctx.beginPath();
      for (let k = 1; k < N; k++) {
        ctx.moveTo(b.x + k * cell, b.y); ctx.lineTo(b.x + k * cell, b.y + s);
        ctx.moveTo(b.x, b.y + k * cell); ctx.lineTo(b.x + s, b.y + k * cell);
      }
      ctx.stroke();
      // the values in coarse boxes
      if (N <= 8) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        S.label(ctx, Math.round(v[j * N + i]) + '°', b.x + (i + 0.5) * cell, b.y + (j + 0.5) * cell, { align: 'center', px: N === 4 ? 20 : 14, weight: 400, bg: null });
      }
    }
    // where the mountain and the city are
    const mark = (pt, txt) => S.label(ctx, txt, b.x + pt[0] * s, b.y + pt[1] * s - (N <= 8 && !showReal ? 0 : 0), { align: 'center', px: 13, bg: 'rgba(255,255,255,0.8)' });
    if (showReal || N > 8) { mark(L.MOUNTAIN, t('kaestchen.mountain')); mark(L.CITY, t('kaestchen.city')); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, s, s);
    S.colorBar(ctx, b.x + s * 0.22, b.y + s + 12, s * 0.56, 10, L.LO, L.HI);
  };

  const frame = $('k-stage');
  const view = S.canvas(frame, draw);
  const tasks = S.tasks($('k-tasks'));

  const res = $('k-res');
  res.max = SIZES.length - 1;
  res.value = SIZES.indexOf(N);
  const update = () => {
    N = SIZES[+res.value];
    $('k-res-out').textContent = t('kaestchen.sizeName.' + res.value);
    $('k-count').textContent = (N * N).toLocaleString('de-DE');
    $('k-time').textContent = t('kaestchen.time.' + res.value);
    $('k-bar').style.width = [2, 10, 35, 100][+res.value] + '%';
    $('k-say').textContent = t('kaestchen.say.' + res.value);
    seen.add(+res.value);
    if (seen.has(0)) tasks.done('coarse');
    if (seen.has(SIZES.length - 1)) tasks.done('fine');
    view.redraw();
  };
  res.addEventListener('input', update);
  const realBtn = $('k-real');
  realBtn.addEventListener('click', () => {
    showReal = !showReal;
    realBtn.setAttribute('aria-pressed', String(showReal));
    if (showReal) tasks.done('real');
    view.redraw();
  });

  update();
  S.chapter.kaestchen = { enter() { view.redraw(); } };
})();
