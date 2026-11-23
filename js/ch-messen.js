// Chapter 1 "Messen": eight stations measure the temperature. At three
// places there is no station – the visitor guesses, then sees the real value.
// Lesson: between stations one has to estimate; far from a station, the
// estimate gets unsure.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter, L = S.land;
  const $ = id => document.getElementById(id);

  // near a station · in the city · on the mountain
  const SPOTS = [
    { key: 'near', x: 0.47, y: 0.47 },
    { key: 'city', x: L.CITY[0] + 0.005, y: L.CITY[1] + 0.06 },
    { key: 'mountain', x: L.MOUNTAIN[0], y: L.MOUNTAIN[1] - 0.09 }
  ].map(s => ({ ...s, real: Math.round(L.temp(s.x, s.y)), guess: null }));
  let sel = 0;

  const board = (w, h) => S.board(w, h, 12);
  const draw = (ctx, w, h) => {
    const b = board(w, h);
    ctx.fillStyle = C.ground; ctx.fillRect(b.x, b.y, b.s, b.s);
    L.drawLand(ctx, b);
    S.label(ctx, t('messen.mountain'), b.x + L.MOUNTAIN[0] * b.s, b.y + (L.MOUNTAIN[1] + 0.12) * b.s, { align: 'center', px: 13, weight: 400 });
    S.label(ctx, t('messen.city'), b.x + (L.CITY[0] - 0.09) * b.s, b.y + (L.CITY[1] - 0.02) * b.s, { align: 'center', px: 13, weight: 400 });
    for (const st of L.STATIONS) L.drawStation(ctx, b, st);
    SPOTS.forEach((sp, i) => {
      const x = b.x + sp.x * b.s, y = b.y + sp.y * b.s, r = 17;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
      if (sp.guess !== null) {
        ctx.fillStyle = S.tempColor(sp.real, L.LO, L.HI); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
        S.label(ctx, sp.real + '°', x, y + 1, { align: 'center', px: 15, bg: null });
      } else {
        ctx.fillStyle = C.question; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
        S.label(ctx, '?', x, y + 1, { align: 'center', px: 20, bg: null });
      }
      if (i === sel) {
        ctx.beginPath(); ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
      }
    });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.s, b.s);
    S.label(ctx, t('messen.legend'), b.x + 10, b.y + b.s - 16, { px: 13, weight: 400 });
  };

  const frame = $('m-stage');
  const view = S.canvas(frame, draw);
  const hint = S.badge(frame);
  hint.show(t('messen.badge'));
  const tasks = S.tasks($('m-tasks'));

  const guess = $('m-guess'), out = $('m-guess-out'), solve = $('m-solve'), result = $('m-result');
  const showSel = () => {
    const sp = SPOTS[sel];
    $('m-which').textContent = t('messen.which.' + sp.key);
    const done = sp.guess !== null;
    guess.disabled = done; solve.disabled = done;
    if (done) {
      const d = Math.abs(sp.guess - sp.real);
      result.innerHTML = t('messen.result', sp.guess, sp.real, d) + ' ' + t('messen.lesson.' + sp.key);
    } else {
      result.textContent = t('messen.ask');
    }
    const n = SPOTS.filter(s => s.guess !== null).length;
    $('m-count').textContent = t('messen.count', n, SPOTS.length);
    view.redraw();
  };
  S.range(guess, out, v => v + ' °C');
  solve.addEventListener('click', () => {
    const sp = SPOTS[sel];
    sp.guess = +guess.value;
    hint.hide();
    tasks.done(sp.key);
    showSel();
  });
  $('m-next').addEventListener('click', () => {
    const next = SPOTS.findIndex((s, i) => i > sel && s.guess === null);
    const any = SPOTS.findIndex(s => s.guess === null);
    sel = next >= 0 ? next : any >= 0 ? any : (sel + 1) % SPOTS.length;
    showSel();
  });
  $('m-reset').addEventListener('click', () => { SPOTS.forEach(s => { s.guess = null; }); sel = 0; showSel(); });

  view.canvas.addEventListener('click', ev => {
    const p = view.at(ev), b = board(view.w, view.h);
    const i = SPOTS.findIndex(sp => Math.hypot(b.x + sp.x * b.s - p.x, b.y + sp.y * b.s - p.y) < 26);
    if (i < 0) return;
    hint.hide();
    sel = i; showSel();
  });

  showSel();
  S.chapter.messen = { enter() { view.redraw(); } };
})();
