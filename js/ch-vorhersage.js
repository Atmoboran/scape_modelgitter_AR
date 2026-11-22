// Chapter 4 "Vorhersage": the model steps forward in time. A toy weather
// (Lorenz 1963, three numbers instead of millions) is run 30 times from
// slightly different starts – an ensemble. Half a Lorenz time unit counts
// as one (play) day. Tiny start errors grow until the
// runs no longer agree: the limit of predictability.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const $ = id => document.getElementById(id);

  const SIG = 10, RHO = 28, BETA = 8 / 3;
  const DT = 0.005, DAY = 0.5, END = 30, DAYS_PER_S = 1.5, MEMBERS = 30, LIMIT = 6;
  const EPS = [0.0001, 0.001, 0.01, 0.1, 1];

  const f = ([x, y, z]) => [SIG * (y - x), x * (RHO - z) - y, x * y - BETA * z];
  const rk4 = s => {
    const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
    const k1 = f(s), k2 = f(add(s, k1, DT / 2)), k3 = f(add(s, k2, DT / 2)), k4 = f(add(s, k3, DT));
    return s.map((v, i) => v + DT / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };

  // a point on the attractor as start, and the attractor's shape as backdrop
  let s0 = [1, 1, 1];
  for (let i = 0; i < 3000; i++) s0 = rk4(s0);
  const shape = [];
  { let s = s0; for (let i = 0; i < 12000; i++) { s = rk4(s); if (i % 3 === 0) shape.push([s[0], s[2]]); } }
  // start from a point in the "wing" where the runs soon have to decide
  for (let i = 0; i < 900; i++) s0 = rk4(s0);

  let eps = 0.01, members = [], hist = [], time = 0, limitAt = null, playing = false, active = false, raf = 0, last = 0;
  const rnd = S.rng(5);
  const reset = () => {
    time = 0; limitAt = null;
    members = Array.from({ length: MEMBERS }, (_, k) => k === 0 ? s0.slice() : s0.map(v => v + eps * rnd.normal()));
    hist = members.map(m => [[0, m[0]]]);
  };
  const spread = () => {
    const xs = members.map(m => m[0]), mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  };
  const tasks = S.tasks($('v-tasks'));
  const step = days => {
    const n = Math.round(days * DAY / DT);
    for (let i = 0; i < n && time < END; i++) {
      members = members.map(rk4);
      time += DT / DAY;
      if (i % 4 === 0) members.forEach((m, k) => hist[k].push([time, m[0]]));
      if (limitAt === null && spread() > LIMIT) {
        limitAt = time;
        if (eps <= 0.001) tasks.done('small');
        if (eps >= 0.1) tasks.done('big');
      }
    }
    if (time >= END) {
      if (limitAt === null && eps <= 0.001) tasks.done('small');
      play(false);
    }
  };

  // ---- drawing ------------------------------------------------------------------
  const draw = (ctx, w, h) => {
    const hTop = Math.round(h * 0.5);
    // attractor (x horizontal, z vertical)
    const ax = { x: 16, y: 26, w: w - 32, h: hTop - 34 };
    const X = v => ax.x + (v + 22) / 44 * ax.w, Z = v => ax.y + ax.h - (v - 2) / 50 * ax.h;
    S.label(ctx, t('vorhersage.attractor'), 16, 12, { px: 12 });
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    ctx.beginPath();
    shape.forEach(([x, z], i) => { i ? ctx.lineTo(X(x), Z(z)) : ctx.moveTo(X(x), Z(z)); });
    ctx.stroke();
    for (let k = MEMBERS - 1; k >= 0; k--) {
      const m = members[k];
      ctx.beginPath(); ctx.arc(X(m[0]), Z(m[2]), k === 0 ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = k === 0 ? C.control : C.member; ctx.fill();
    }
    S.label(ctx, t('vorhersage.wingL'), X(-13), Z(6), { align: 'center', px: 12, weight: 400, ink: C.muted });
    S.label(ctx, t('vorhersage.wingR'), X(13), Z(6), { align: 'center', px: 12, weight: 400, ink: C.muted });

    // x over time: the "spaghetti" plot
    const P = { x: 46, y: hTop + 22, w: w - 46 - 80, h: h - hTop - 54 };
    const TX = v => P.x + v / END * P.w, TY = v => P.y + P.h - (v + 22) / 44 * P.h;
    S.label(ctx, t('vorhersage.spaghetti'), P.x, hTop + 8, { px: 12 });
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const v of [-15, 0, 15]) { ctx.moveTo(P.x, TY(v)); ctx.lineTo(P.x + P.w, TY(v)); }
    ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x, P.y + P.h); ctx.lineTo(P.x + P.w, P.y + P.h); ctx.stroke();
    for (const d of [0, 5, 10, 15, 20, 25, 30]) S.label(ctx, String(d), TX(d), P.y + P.h + 4, { align: 'center', base: 'top', px: 12, weight: 400, bg: null });
    for (const v of [-15, 0, 15]) S.label(ctx, String(v), P.x - 6, TY(v), { align: 'right', px: 12, weight: 400, bg: null });
    if (limitAt !== null) {
      ctx.fillStyle = C.spread;
      ctx.fillRect(TX(limitAt), P.y, P.w - (TX(limitAt) - P.x), P.h);
      ctx.strokeStyle = C.limit; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(TX(limitAt), P.y); ctx.lineTo(TX(limitAt), P.y + P.h); ctx.stroke();
      S.label(ctx, t('vorhersage.limitLabel', S.num(limitAt, 0)), Math.min(TX(limitAt) + 6, P.x + P.w - 120), P.y + 10, { px: 12, ink: C.limit });
    }
    for (let k = MEMBERS - 1; k >= 0; k--) {
      ctx.beginPath();
      hist[k].forEach(([tt, x], i) => { i ? ctx.lineTo(TX(tt), TY(x)) : ctx.moveTo(TX(tt), TY(x)); });
      ctx.strokeStyle = k === 0 ? C.control : C.member;
      ctx.lineWidth = k === 0 ? 2.5 : 1.2;
      ctx.stroke();
    }

    $('v-time').textContent = t('vorhersage.dayN', S.num(time, 1));
    $('v-spread').textContent = S.num(spread(), 1);
    $('v-limit').textContent = limitAt !== null ? t('vorhersage.dayN', S.num(limitAt, 1)) : time >= END ? t('vorhersage.beyond') : '…';
  };

  const frame = $('v-stage');
  const view = S.canvas(frame, draw);
  const hint = S.badge(frame);
  hint.show(t('vorhersage.badge'));

  const playBtn = $('v-play');
  const loop = now => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    step(dt * DAYS_PER_S);
    view.paintNow();
    if (playing) raf = requestAnimationFrame(loop);
  };
  const play = on => {
    playing = on;
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.textContent = on ? t('vorhersage.pause') : time >= END ? t('vorhersage.again') : time > 0 ? t('vorhersage.resume') : t('vorhersage.start');
    cancelAnimationFrame(raf);
    if (on && active) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  playBtn.addEventListener('click', () => {
    hint.hide(); tasks.done('run');
    if (!playing && time >= END) reset();
    play(!playing);
  });
  $('v-restart').addEventListener('click', () => { reset(); play(false); view.redraw(); });

  const e = $('v-eps');
  e.max = EPS.length - 1; e.value = EPS.indexOf(eps);
  S.range(e, $('v-eps-out'), v => t('vorhersage.epsName.' + v));
  e.addEventListener('input', () => { eps = EPS[+e.value]; reset(); play(false); view.redraw(); });

  reset();
  play(false);
  S.chapter.vorhersage = {
    enter() { active = true; view.redraw(); },
    leave() { active = false; play(false); }
  };
})();
