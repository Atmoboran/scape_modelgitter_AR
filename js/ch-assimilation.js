// Chapter 3 "Datenassimilation", three steps on one stage:
//   punkt     – one value: model (first guess) and measurement are weighed
//               by their uncertainty → analysis (scalar Kalman update)
//   linie     – a line across the land: a few measurements correct the
//               model curve around them (optimal interpolation, radius L)
//   kreislauf – forecast → measure → analysis → forecast …, compared with a
//               forecast that never gets new measurements
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const $ = id => document.getElementById(id);
  const STEPS = ['punkt', 'linie', 'kreislauf'];
  let stepKey = 'punkt', active = false;
  const frame = $('a-stage');
  const hint = S.badge(frame);
  hint.show(t('assim.badge.punkt'));
  const tasks = S.tasks($('a-tasks'));

  // shared chart frame: plot area inside w × h with axes
  // (right margin keeps the last tick label clear of the fullscreen button)
  const plotArea = (x, y, w, h) => ({ x: x + 46, y: y + 10, w: w - 46 - 80, h: h - 40 });
  const axes = (ctx, P, x0, x1, y0, y1, { xTicks = [], yTicks = [], xFmt = v => v, yFmt = v => v, xTitle = '', yTitle = '' } = {}) => {
    const X = v => P.x + (v - x0) / (x1 - x0) * P.w, Y = v => P.y + P.h - (v - y0) / (y1 - y0) * P.h;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const v of yTicks) { ctx.moveTo(P.x, Y(v)); ctx.lineTo(P.x + P.w, Y(v)); }
    ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x, P.y + P.h); ctx.lineTo(P.x + P.w, P.y + P.h); ctx.stroke();
    for (const v of xTicks) S.label(ctx, xFmt(v), X(v), P.y + P.h + 4, { align: 'center', base: 'top', px: 12, weight: 400, bg: null });
    for (const v of yTicks) S.label(ctx, yFmt(v), P.x - 6, Y(v), { align: 'right', px: 12, weight: 400, bg: null });
    if (xTitle) S.label(ctx, xTitle, P.x + P.w, P.y + P.h + 20, { align: 'right', base: 'top', px: 12, bg: null });
    if (yTitle) S.label(ctx, yTitle, P.x + 4, P.y + 2, { base: 'top', px: 12 });
    return { X, Y };
  };
  const curve = (ctx, n, fx, fy) => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const px = fx(i), py = fy(i); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  };

  // ============ step 1: one point ============================================
  const P1 = { xb: 14, y: 17, sb: 2, so: 1 };
  const update1 = () => {
    const K = P1.sb ** 2 / (P1.sb ** 2 + P1.so ** 2);
    const xa = P1.xb + K * (P1.y - P1.xb), sa = Math.sqrt(P1.sb ** 2 * P1.so ** 2 / (P1.sb ** 2 + P1.so ** 2));
    return { K, xa, sa };
  };
  const draw1 = (ctx, w, h) => {
    const { K, xa, sa } = update1();
    const P = plotArea(0, 30, w, h - 30);
    const lo = 4, hi = 28;
    const pdf = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
    const top = pdf(xa, xa, sa) * 1.15;
    const { X, Y } = axes(ctx, P, lo, hi, 0, top, { xTicks: [5, 10, 15, 20, 25], xFmt: v => v + ' °C' });
    const n = 200, xs = i => lo + (hi - lo) * i / (n - 1);
    const dist = (m, s, line, fill, lw) => {
      curve(ctx, n, i => X(xs(i)), i => Y(pdf(xs(i), m, s)));
      ctx.lineTo(X(hi), Y(0)); ctx.lineTo(X(lo), Y(0)); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      curve(ctx, n, i => X(xs(i)), i => Y(pdf(xs(i), m, s)));
      ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(X(m), Y(0)); ctx.lineTo(X(m), Y(pdf(m, m, s))); ctx.stroke();
      ctx.setLineDash([]);
    };
    dist(P1.xb, P1.sb, C.model, C.modelFill, 2.5);
    dist(P1.y, P1.so, C.obs, C.obsFill, 2.5);
    dist(xa, sa, C.analysis, C.analysisFill, 4);
    // labels above the peaks, kept apart
    const labs = [
      { x: X(P1.xb), y: Y(pdf(P1.xb, P1.xb, P1.sb)), txt: t('assim.p.model', S.num(P1.xb)), ink: C.model },
      { x: X(P1.y), y: Y(pdf(P1.y, P1.y, P1.so)), txt: t('assim.p.obs', S.num(P1.y)), ink: C.obs },
      { x: X(xa), y: Y(pdf(xa, xa, sa)), txt: t('assim.p.analysis', S.num(xa)), ink: C.analysis }
    ].sort((a, b) => a.y - b.y);
    const used = [];
    for (const l of labs) {
      let y = l.y - 12;
      while (used.some(u => Math.abs(u - y) < 18)) y += 18;
      used.push(y);
      S.label(ctx, l.txt, Math.max(P.x + 60, Math.min(P.x + P.w - 60, l.x)), Math.max(P.y + 8, y), { align: 'center', px: 13, ink: l.ink });
    }
    $('a-k').textContent = Math.round(K * 100) + ' %';
    $('a-xa').textContent = S.num(xa) + ' °C';
    $('a-sa').textContent = '± ' + S.num(sa) + ' °C';
    $('a-formula').textContent = t('assim.p.formula', S.num(P1.xb), S.num(K, 2), S.num(P1.y), S.num(xa));
  };
  const tap1 = p => {
    const P = plotArea(0, 30, view.w, view.h - 30);
    const v = 4 + (p.x - P.x) / P.w * 24;
    if (v < 5 || v > 27) return;
    P1.y = Math.round(v * 2) / 2;
    view.redraw();
  };
  const sb = $('a-sb'), so = $('a-so');
  S.range(sb, $('a-sb-out'), v => '± ' + S.num(v) + ' °C');
  S.range(so, $('a-so-out'), v => '± ' + S.num(v) + ' °C');
  const onSigma = () => {
    P1.sb = +sb.value; P1.so = +so.value; hint.hide();
    if (P1.so > P1.sb) tasks.done('trust');
    view.redraw();
  };
  sb.addEventListener('input', onSigma);
  so.addEventListener('input', onSigma);

  // ============ step 2: a line ===============================================
  const M2 = 201, KM2 = 1000, SB2 = 1.5;
  const g = (x, c, s) => Math.exp(-((x - c) ** 2) / (2 * s * s));
  const truth2 = x => 12 + 3.5 * Math.sin(2 * Math.PI * 1.2 * x + 0.5) + 2.6 * g(x, 0.62, 0.04) - 1.2 * Math.sin(2 * Math.PI * 3.1 * x);
  const back2 = x => truth2(x) + 1.4 * Math.sin(2 * Math.PI * 1.05 * x + 2) + 0.9 * Math.cos(2 * Math.PI * 2.2 * x) - 2.2 * g(x, 0.62, 0.05);
  const rnd2 = S.rng(11);
  const obs2 = [0.12, 0.38, 0.83].map(x => ({ x, y: truth2(x) + 0.3 * rnd2.normal() }));
  const P2 = { so: 0.5, L: 100, showTruth: true };
  const analysis2 = () => {
    const xs = Array.from({ length: M2 }, (_, i) => i / (M2 - 1));
    const xb = xs.map(back2);
    if (!obs2.length) return { xs, xb, xa: xb.slice() };
    const L = P2.L / KM2;
    const Bf = (a, b) => SB2 * SB2 * g(a, b, L);
    const A = obs2.map(o => obs2.map(p => Bf(o.x, p.x) + (o === p ? P2.so * P2.so : 0)));
    const d = obs2.map(o => o.y - back2(o.x));
    const wv = S.solve(A, d);
    const xa = xs.map((x, i) => xb[i] + obs2.reduce((s, o, k) => s + Bf(x, o.x) * wv[k], 0));
    return { xs, xb, xa };
  };
  const draw2 = (ctx, w, h) => {
    const { xs, xb, xa } = analysis2();
    const P = plotArea(0, 30, w, h - 30);
    const lo = 4, hi = 20;
    const { X, Y } = axes(ctx, P, 0, 1, lo, hi, {
      xTicks: [0, 0.25, 0.5, 0.75, 1], xFmt: v => Math.round(v * KM2) + ' km',
      yTicks: [6, 10, 14, 18], yFmt: v => v + '°', yTitle: '°C'
    });
    // influence radius around each measurement
    ctx.fillStyle = C.influence;
    for (const o of obs2) { const r = P2.L / KM2 * P.w; ctx.fillRect(X(o.x) - r, P.y, 2 * r, P.h); }
    if (P2.showTruth) {
      curve(ctx, M2, i => X(xs[i]), i => Y(truth2(xs[i])));
      ctx.setLineDash([6, 4]); ctx.strokeStyle = C.truth; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
    }
    curve(ctx, M2, i => X(xs[i]), i => Y(xb[i]));
    ctx.strokeStyle = C.model; ctx.lineWidth = 2.5; ctx.stroke();
    curve(ctx, M2, i => X(xs[i]), i => Y(xa[i]));
    ctx.strokeStyle = C.analysis; ctx.lineWidth = 4; ctx.stroke();
    for (const o of obs2) {
      const px = X(o.x), py = Y(o.y), e = Y(o.y - P2.so) - py;
      ctx.strokeStyle = C.obs; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py - e); ctx.lineTo(px, py + e); ctx.moveTo(px - 5, py - e); ctx.lineTo(px + 5, py - e); ctx.moveTo(px - 5, py + e); ctx.lineTo(px + 5, py + e); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fillStyle = C.obs; ctx.fill();
      ctx.strokeStyle = C.paper; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // legend
    const items = [[C.model, t('assim.l.model')], [C.obs, t('assim.l.obs')], [C.analysis, t('assim.l.analysis')]];
    if (P2.showTruth) items.push([C.truth, t('assim.l.truth')]);
    let lx = P.x;
    ctx.font = S.font(12);
    for (const [col, txt] of items) {
      ctx.fillStyle = col; ctx.fillRect(lx, 8, 14, 4);
      S.label(ctx, txt, lx + 18, 10, { px: 12, bg: null });
      lx += 18 + ctx.measureText(txt).width + 16;
    }
    const rms = arr => Math.sqrt(arr.reduce((s, v, i) => s + (v - truth2(xs[i])) ** 2, 0) / arr.length);
    $('a-l-model').textContent = S.num(rms(xb)) + ' °C';
    $('a-l-ana').textContent = S.num(rms(xa)) + ' °C';
    $('a-l-n').textContent = String(obs2.length);
  };
  const tap2 = p => {
    const P = plotArea(0, 30, view.w, view.h - 30);
    const x = (p.x - P.x) / P.w;
    if (x < 0 || x > 1) return;
    const near = obs2.findIndex(o => Math.abs((o.x - x) * P.w) < 16);
    if (near >= 0) obs2.splice(near, 1);
    else if (obs2.length < 12) { obs2.push({ x, y: truth2(x) + 0.3 * rnd2.normal() }); tasks.done('add'); }
    view.redraw();
  };
  const so2 = $('a-so2'), L2 = $('a-L');
  S.range(so2, $('a-so2-out'), v => '± ' + S.num(v) + ' °C');
  S.range(L2, $('a-L-out'), v => v + ' km');
  so2.addEventListener('input', () => { P2.so = +so2.value; view.redraw(); });
  L2.addEventListener('input', () => { P2.L = +L2.value; view.redraw(); });
  const tr2 = $('a-truth');
  tr2.addEventListener('click', () => { P2.showTruth = !P2.showTruth; tr2.setAttribute('aria-pressed', String(P2.showTruth)); view.redraw(); });

  // ============ step 3: the cycle ============================================
  const M3 = 120, END = 240, H_PER_S = 6;
  const CT = 0.008, CM = 0.0065;             // real and (slightly wrong) model wind
  const SB3 = 1.2, SO3 = 0.4, L3 = 0.05;
  const WAVES = [[1, 2.8, 0.3, 0.004], [2, 1.6, 1.7, -0.01], [3, 1.0, 4.0, 0.018], [5, 0.6, 2.2, -0.025]];
  const rnd3 = S.rng(23);
  const BUMPS = [];
  for (let tt = 0; tt < END + 60; tt += 6 + rnd3() * 8) {
    BUMPS.push({ t0: tt - 20, x: rnd3(), a: (rnd3() < 0.5 ? -1 : 1) * (1.5 + 2 * rnd3()), s: 0.03 + 0.03 * rnd3(), life: 40 + 30 * rnd3() });
  }
  const pd = d => d - Math.round(d);
  const truth3 = (x, tt) => {
    let v = 12;
    for (const [k, a, ph, om] of WAVES) v += a * Math.sin(2 * Math.PI * k * (x - CT * tt) + ph + om * tt);
    for (const b of BUMPS) {
      const age = tt - b.t0;
      if (age <= 0 || age >= b.life) continue;
      const d = pd(x - b.x - CT * tt);
      v += b.a * Math.sin(Math.PI * age / b.life) * Math.exp(-d * d / (2 * b.s * b.s));
    }
    return v;
  };
  const xs3 = Array.from({ length: M3 }, (_, i) => i / M3);
  const P3 = { period: 6, n: 8 };
  let time3 = 0, da, free, errDA = [], errFree = [], lastObs = [], flash = 0, playing3 = false, raf3 = 0, last3 = 0, nextObs = 0;
  const reset3 = () => {
    time3 = 0;
    da = xs3.map(x => truth3(x, 0));
    free = da.slice();
    errDA = [[0, 0]]; errFree = [[0, 0]]; lastObs = [];
    nextObs = P3.period;
  };
  const advect = (arr, hours) => {
    const sh = CM * hours * M3;  // shift in cells
    return arr.map((_, i) => {
      const src = i - sh, i0 = Math.floor(src), f = src - i0;
      const a = arr[((i0 % M3) + M3) % M3], b = arr[(((i0 + 1) % M3) + M3) % M3];
      return a + (b - a) * f;
    });
  };
  const assimilate = () => {
    const obs = Array.from({ length: P3.n }, (_, k) => {
      const x = (k + 0.5) / P3.n;
      return { x, y: truth3(x, time3) + SO3 * rnd3.normal() };
    });
    const at = (arr, x) => { const s = x * M3, i0 = Math.floor(s), f = s - i0; return arr[i0 % M3] + (arr[(i0 + 1) % M3] - arr[i0 % M3]) * f; };
    const Bf = (a, b) => SB3 * SB3 * Math.exp(-(pd(a - b) ** 2) / (2 * L3 * L3));
    const A = obs.map(o => obs.map(p => Bf(o.x, p.x) + (o === p ? SO3 * SO3 : 0)));
    const wv = S.solve(A, obs.map(o => o.y - at(da, o.x)));
    da = da.map((v, i) => v + obs.reduce((s, o, k) => s + Bf(xs3[i], o.x) * wv[k], 0));
    lastObs = obs; flash = 1;
  };
  const rms3 = arr => Math.sqrt(arr.reduce((s, v, i) => s + (v - truth3(xs3[i], time3)) ** 2, 0) / M3);
  const step3 = hours => {
    let left = hours;
    while (left > 1e-9 && time3 < END) {
      const h = Math.min(left, 0.5, nextObs - time3);
      da = advect(da, h); free = advect(free, h);
      time3 += h; left -= h;
      if (time3 >= nextObs - 1e-9) {
        errDA.push([time3, rms3(da)]);   // the forecast error just before the analysis
        assimilate();
        nextObs += P3.period;
      }
      errDA.push([time3, rms3(da)]); errFree.push([time3, rms3(free)]);
    }
    if (time3 >= 120) tasks.done('cycle');
    if (time3 >= END) play3(false);
  };
  const draw3 = (ctx, w, h) => {
    const hTop = Math.round(h * 0.56);
    const P = plotArea(0, 24, w, hTop - 24);
    const { X, Y } = axes(ctx, P, 0, 1, 2, 22, { yTicks: [6, 12, 18], yFmt: v => v + '°' });
    curve(ctx, M3 + 1, i => X(i / M3), i => Y(truth3((i % M3) / M3, time3)));
    ctx.strokeStyle = C.truth; ctx.lineWidth = 2.5; ctx.stroke();
    curve(ctx, M3 + 1, i => X(i / M3), i => Y(free[i % M3]));
    ctx.setLineDash([6, 4]); ctx.strokeStyle = C.free; ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
    curve(ctx, M3 + 1, i => X(i / M3), i => Y(da[i % M3]));
    ctx.strokeStyle = C.analysis; ctx.lineWidth = 3; ctx.stroke();
    for (const o of lastObs) {
      ctx.beginPath(); ctx.arc(X(o.x), Y(o.y), 4 + 4 * flash, 0, 2 * Math.PI);
      ctx.fillStyle = C.obs; ctx.fill();
    }
    // stations along the axis
    ctx.fillStyle = C.ink;
    for (let k = 0; k < P3.n; k++) {
      const px = X((k + 0.5) / P3.n), py = P.y + P.h;
      ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(px - 5, py); ctx.lineTo(px + 5, py); ctx.closePath(); ctx.fill();
    }
    const items = [[C.truth, t('assim.l.truth')], [C.analysis, t('assim.l.withDA')], [C.free, t('assim.l.free')], [C.obs, t('assim.l.obs')]];
    let lx = P.x;
    ctx.font = S.font(12);
    for (const [col, txt] of items) {
      ctx.fillStyle = col; ctx.fillRect(lx, 6, 14, 4);
      S.label(ctx, txt, lx + 18, 8, { px: 12, bg: null });
      lx += 18 + ctx.measureText(txt).width + 14;
      if (lx > P.x + P.w - 60) break;
    }
    // error over time
    const Q = plotArea(0, hTop + 16, w, h - hTop - 16);
    const ex = axes(ctx, Q, 0, END, 0, 5, {
      xTicks: [0, 48, 96, 144, 192, 240], xFmt: v => t('assim.c.day', v / 24),
      yTicks: [0, 2, 4], yFmt: v => v + '°', yTitle: t('assim.c.error')
    });
    const line = (pts, col, dash) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      pts.forEach(([a, b], i) => { const px = ex.X(a), py = ex.Y(Math.min(5, b)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
    };
    line(errFree, C.free, [6, 4]);
    line(errDA, C.analysis);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ex.X(time3), Q.y); ctx.lineTo(ex.X(time3), Q.y + Q.h); ctx.stroke();

    const d = Math.floor(time3 / 24), hh = Math.floor(time3 % 24);
    $('a-c-time').textContent = t('assim.c.time', d + 1, hh);
    $('a-c-da').textContent = S.num(rms3(da)) + ' °C';
    $('a-c-free').textContent = S.num(rms3(free)) + ' °C';
  };
  const loop3 = now => {
    const dt = Math.min(0.1, (now - last3) / 1000);
    last3 = now;
    flash = Math.max(0, flash - dt * 2.5);
    step3(dt * H_PER_S);
    view.paintNow();
    if (playing3) raf3 = requestAnimationFrame(loop3);
  };
  const playBtn = $('a-play');
  const play3 = on => {
    playing3 = on;
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.textContent = on ? t('assim.c.pause') : time3 >= END ? t('assim.c.again') : t('assim.c.start');
    cancelAnimationFrame(raf3);
    if (on && active && stepKey === 'kreislauf') { last3 = performance.now(); raf3 = requestAnimationFrame(loop3); }
  };
  playBtn.addEventListener('click', () => {
    hint.hide();
    if (!playing3 && time3 >= END) reset3();
    play3(!playing3);
  });
  $('a-restart').addEventListener('click', () => { reset3(); view.redraw(); });
  const per = $('a-period'), PERIODS = [3, 6, 12, 24];
  per.max = PERIODS.length - 1; per.value = 1;
  S.range(per, $('a-period-out'), v => t('assim.c.every', PERIODS[v]));
  per.addEventListener('input', () => { P3.period = PERIODS[+per.value]; nextObs = Math.ceil((time3 + 1e-6) / P3.period) * P3.period; });
  const nst = $('a-n');
  S.range(nst, $('a-n-out'), v => String(v));
  nst.addEventListener('input', () => { P3.n = +nst.value; view.redraw(); });
  reset3();

  // ============ stage + stepper ==============================================
  const view = S.canvas(frame, (ctx, w, h) => {
    if (stepKey === 'punkt') draw1(ctx, w, h);
    else if (stepKey === 'linie') draw2(ctx, w, h);
    else draw3(ctx, w, h);
  });
  let touched = false;
  view.canvas.addEventListener('click', ev => {
    const p = view.at(ev);
    hint.hide(); touched = true;
    if (stepKey === 'punkt') tap1(p);
    else if (stepKey === 'linie') tap2(p);
  });
  const stepBtns = [...document.querySelectorAll('[data-a-step]')];
  const setStep = key => {
    stepKey = key;
    stepBtns.forEach(b => {
      if (b.dataset.aStep === key) { b.setAttribute('aria-current', 'step'); b.classList.add('done'); }
      else b.removeAttribute('aria-current');
    });
    STEPS.forEach(k => { $('a-panel-' + k).hidden = k !== key; });
    if (key === 'punkt' && !touched) hint.show(t('assim.badge.punkt')); else hint.hide();
    if (key !== 'kreislauf') play3(false);
    else play3(playing3);
    view.redraw();
  };
  stepBtns.forEach(b => b.addEventListener('click', () => setStep(b.dataset.aStep)));
  setStep('punkt');
  playBtn.textContent = t('assim.c.start');

  S.chapter.assimilation = {
    enter() { active = true; view.redraw(); },
    leave() { active = false; play3(false); }
  };
})();
