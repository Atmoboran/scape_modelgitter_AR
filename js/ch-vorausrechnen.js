// Chapter 4 "Vorausrechnen", two steps on one stage:
//   regen   – a rain cloud is passed on from box to box by the wind, one box
//             per hour, until it reaches the city
//   faecher – many forecasts for the city from almost the same start: the
//             first days agree, later they fan out. (Each line is a run of
//             the Lorenz-1963 toy model, shown as a temperature; half a
//             model time unit counts as one day.)
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter, L = S.land;
  const $ = id => document.getElementById(id);
  let stepKey = 'regen', active = false;
  const frame = $('r-stage');
  const hint = S.badge(frame);
  const tasks = S.tasks($('r-tasks'));

  // ============ step 1: rain moves with the wind ============================
  const N = 16, START_H = 12, END_H = 20, MS_PER_H = 650;
  const blobs = [[0, 0, 0.09, 1], [0.06, -0.05, 0.06, 0.8], [-0.05, 0.05, 0.05, 0.7], [0.03, 0.07, 0.045, 0.6]];
  const rain = (x, y, hour) => {
    const cx = -0.1 + hour / N, cy = L.CITY[1] - 0.02;
    let v = 0;
    for (const [dx, dy, s, a] of blobs) v += a * Math.exp(-((x - cx - dx) ** 2 + (y - cy - dy) ** 2) / (2 * s * s));
    return Math.min(1, v);
  };
  const cityCell = [Math.floor(L.CITY[0] * N), Math.floor(L.CITY[1] * N)];
  let hour = 0, playing = false, timer = 0, rainedAt = null;
  const cellRain = (i, j) => rain((i + 0.5) / N, (j + 0.5) / N, hour);

  const drawRain = (ctx, w, h) => {
    const b = S.board(w, h, 12), cell = b.s / N;
    ctx.fillStyle = C.ground; ctx.fillRect(b.x, b.y, b.s, b.s);
    L.drawLand(ctx, b, { faint: true });
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const r = cellRain(i, j);
      if (r < 0.08) continue;
      ctx.globalAlpha = 0.15 + 0.7 * r;
      ctx.fillStyle = C.rain;
      ctx.fillRect(b.x + i * cell, b.y + j * cell, cell + 0.5, cell + 0.5);
      ctx.globalAlpha = 1;
      // the box passes its rain on to the neighbour downwind
      if (r > 0.3 && cell > 14) {
        const cx = b.x + (i + 0.5) * cell, cy = b.y + (j + 0.5) * cell, a = cell * 0.25;
        ctx.strokeStyle = C.paper; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - a, cy); ctx.lineTo(cx + a, cy); ctx.lineTo(cx + a - 4, cy - 4); ctx.moveTo(cx + a, cy); ctx.lineTo(cx + a - 4, cy + 4); ctx.stroke();
      }
    }
    ctx.strokeStyle = C.gridLine; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 1; k < N; k++) {
      ctx.moveTo(b.x + k * cell, b.y); ctx.lineTo(b.x + k * cell, b.y + b.s);
      ctx.moveTo(b.x, b.y + k * cell); ctx.lineTo(b.x + b.s, b.y + k * cell);
    }
    ctx.stroke();
    // the city box
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.strokeRect(b.x + cityCell[0] * cell + 1.5, b.y + cityCell[1] * cell + 1.5, cell - 3, cell - 3);
    S.label(ctx, t('vorausrechnen.city'), b.x + (cityCell[0] + 0.5) * cell, b.y + (cityCell[1] + 1) * cell + 12, { align: 'center', px: 13 });
    // wind arrow and clock
    const ax = b.x + 12, ay = b.y + 18;
    ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 40, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax + 48, ay); ctx.lineTo(ax + 38, ay - 6); ctx.lineTo(ax + 38, ay + 6); ctx.closePath(); ctx.fill();
    S.label(ctx, t('vorausrechnen.wind'), ax + 56, ay, { px: 13 });
    S.label(ctx, t('vorausrechnen.clock', START_H + hour), b.x + b.s - 10, b.y + 18, { align: 'right', px: 16 });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.s, b.s);
  };
  const readRain = () => {
    const wet = cellRain(...cityCell) > 0.3;
    if (wet && rainedAt === null) { rainedAt = hour; tasks.done('rain'); }
    $('r-clock').textContent = t('vorausrechnen.clock', START_H + hour);
    $('r-city').textContent = wet ? t('vorausrechnen.wet') : t('vorausrechnen.dry');
    $('r-say').textContent = rainedAt !== null ? t('vorausrechnen.arrived', rainedAt) : t('vorausrechnen.waiting');
  };
  const playBtn = $('r-play');
  const play = on => {
    playing = on;
    clearInterval(timer);
    playBtn.textContent = on ? t('vorausrechnen.pause') : hour >= END_H ? t('vorausrechnen.again') : hour > 0 ? t('vorausrechnen.resume') : t('vorausrechnen.start');
    playBtn.setAttribute('aria-pressed', String(on));
    if (on && active && stepKey === 'regen') timer = setInterval(tick, MS_PER_H);
  };
  const tick = () => {
    hour++;
    readRain(); view.redraw();
    if (hour >= END_H) play(false);
  };
  playBtn.addEventListener('click', () => {
    hint.hide();
    if (!playing && hour >= END_H) { hour = 0; rainedAt = null; readRain(); }
    play(!playing);
  });
  $('r-step').addEventListener('click', () => { hint.hide(); play(false); if (hour < END_H) tick(); });
  $('r-reset').addEventListener('click', () => { play(false); hour = 0; rainedAt = null; readRain(); play(false); view.redraw(); });

  // ============ step 2: the fan of forecasts ================================
  const DAYS = 10, DAY = 0.5, DT = 0.005, EPS = 0.03, MAX_RUNS = 20, SURE = 1.5;
  const f = ([x, y, z]) => [10 * (y - x), x * (28 - z) - y, x * y - 8 / 3 * z];
  const rk4 = s => {
    const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
    const k1 = f(s), k2 = f(add(s, k1, DT / 2)), k3 = f(add(s, k2, DT / 2)), k4 = f(add(s, k3, DT));
    return s.map((v, i) => v + DT / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };
  let s0 = [1, 1, 1];
  for (let i = 0; i < 3600; i++) s0 = rk4(s0);   // a start where the runs agree for about 6 days
  const rnd = S.rng(3);
  const temp = x => 19 + 0.42 * x;
  const runs = [];   // each: array of [day, °C]
  let drawing = null, raf2 = 0;
  const addRun = () => {
    let s = runs.length ? s0.map(v => v + EPS * rnd.normal()) : s0.slice();
    const pts = [[0, temp(s[0])]];
    const n = Math.round(DAYS * DAY / DT);
    for (let i = 1; i <= n; i++) { s = rk4(s); if (i % 5 === 0) pts.push([i * DT / DAY, temp(s[0])]); }
    runs.push(pts);
    drawing = { run: runs.length - 1, t0: performance.now() };
    const anim = () => {
      view.paintNow();
      if (drawing && performance.now() - drawing.t0 < 900) raf2 = requestAnimationFrame(anim);
      else { drawing = null; view.paintNow(); }
    };
    cancelAnimationFrame(raf2);
    raf2 = requestAnimationFrame(anim);
  };
  // the day until which all runs stay within ± SURE °C of each other
  const sureUntil = () => {
    if (runs.length < 3) return null;
    const m = runs[0].length;
    for (let k = 0; k < m; k++) {
      const vs = runs.map(r => r[k][1]);
      if (Math.max(...vs) - Math.min(...vs) > 2 * SURE) return runs[0][k][0];
    }
    return DAYS;
  };
  const drawFan = (ctx, w, h) => {
    const P = { x: 50, y: 40, w: w - 50 - 84, h: h - 100 };
    const lo = 8, hi = 30;
    const X = d => P.x + d / DAYS * P.w, Y = v => P.y + P.h - (v - lo) / (hi - lo) * P.h;
    const until = sureUntil();
    if (until !== null) {
      ctx.fillStyle = C.sureFill; ctx.fillRect(P.x, P.y, X(until) - P.x, P.h);
      ctx.fillStyle = C.unsureFill; ctx.fillRect(X(until), P.y, P.x + P.w - X(until), P.h);
      S.label(ctx, t('vorausrechnen.sure'), (P.x + X(until)) / 2, P.y + 14, { align: 'center', px: 13 });
      if (until < DAYS - 1) S.label(ctx, t('vorausrechnen.unsure'), (X(until) + P.x + P.w) / 2, P.y + 14, { align: 'center', px: 13 });
    }
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const v of [10, 15, 20, 25, 30]) { ctx.moveTo(P.x, Y(v)); ctx.lineTo(P.x + P.w, Y(v)); }
    ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x, P.y + P.h); ctx.lineTo(P.x + P.w, P.y + P.h); ctx.stroke();
    for (const v of [10, 15, 20, 25, 30]) S.label(ctx, v + '°', P.x - 6, Y(v), { align: 'right', px: 13, weight: 400, bg: null });
    for (let d = 0; d <= DAYS; d += 2) S.label(ctx, d === 0 ? t('vorausrechnen.today') : t('vorausrechnen.dayN', d), X(d), P.y + P.h + 6, { align: 'center', base: 'top', px: 13, weight: 400, bg: null });
    S.label(ctx, t('vorausrechnen.fanTitle'), P.x, 16, { px: 14 });
    runs.forEach((pts, k) => {
      const limit = drawing && drawing.run === k ? DAYS * Math.min(1, (performance.now() - drawing.t0) / 900) : DAYS;
      ctx.beginPath();
      let first = true;
      for (const [d, v] of pts) { if (d > limit) break; first ? ctx.moveTo(X(d), Y(v)) : ctx.lineTo(X(d), Y(v)); first = false; }
      ctx.strokeStyle = k === runs.length - 1 ? C.ink : C.member;
      ctx.lineWidth = k === runs.length - 1 ? 2.5 : 1.8;
      ctx.stroke();
    });
    if (!runs.length) S.label(ctx, t('vorausrechnen.fanEmpty'), P.x + P.w / 2, P.y + P.h / 2, { align: 'center', px: 15 });
    $('f-runs').textContent = String(runs.length);
    $('f-sure').textContent = until === null ? '–' : until >= DAYS ? t('vorausrechnen.allDays') : t('vorausrechnen.untilDay', Math.floor(until));
  };
  $('f-add').addEventListener('click', () => {
    hint.hide();
    if (runs.length >= MAX_RUNS) return;
    addRun();
    if (runs.length >= 5) tasks.done('fan');
    $('f-add').disabled = runs.length >= MAX_RUNS;
  });
  $('f-clear').addEventListener('click', () => { runs.length = 0; $('f-add').disabled = false; view.redraw(); });

  // ============ stage + steps ================================================
  const view = S.canvas(frame, (ctx, w, h) => (stepKey === 'regen' ? drawRain : drawFan)(ctx, w, h));
  const stepBtns = [...document.querySelectorAll('[data-r-step]')];
  const setStep = key => {
    stepKey = key;
    stepBtns.forEach(b => {
      if (b.dataset.rStep === key) { b.setAttribute('aria-current', 'step'); b.classList.add('done'); }
      else b.removeAttribute('aria-current');
    });
    $('r-panel-regen').hidden = key !== 'regen';
    $('r-panel-faecher').hidden = key !== 'faecher';
    hint.show(t('vorausrechnen.badge.' + key));
    if (key !== 'regen') play(false);
    view.redraw();
  };
  stepBtns.forEach(b => b.addEventListener('click', () => setStep(b.dataset.rStep)));
  setStep('regen');
  readRain();
  play(false);

  S.chapter.vorausrechnen = {
    enter() { active = true; view.redraw(); },
    leave() { active = false; play(false); }
  };
})();
