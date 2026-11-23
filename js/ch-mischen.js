// Chapter 3 "Mischen": yesterday's forecast says 12 °C, the station measures
// 16 °C. Which number goes into the box? Both are weighed like on a seesaw:
// the more exact one counts more. The pivot sits at the mixed value.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const $ = id => document.getElementById(id);

  const FORECAST = 12, MEASURED = 16;
  const DEVICE = { profi: 0.5, handy: 3 };   // how unsure (°C)
  const AGE = { gestern: 1, woche: 4 };
  let device = 'profi', age = 'gestern';
  let shown = null;   // animated weight of the measurement
  const tried = new Set();

  const weight = () => {
    const sf = AGE[age] ** 2, sm = DEVICE[device] ** 2;
    return sf / (sf + sm);   // share of the measurement
  };

  const draw = (ctx, w, h) => {
    const wm = shown, wf = 1 - wm, mix = FORECAST + wm * (MEASURED - FORECAST);
    const left = 40, right = w - 40, lo = 10, hi = 18;
    const X = v => left + (v - lo) / (hi - lo) * (right - left);
    const scaleY = h - 70;

    // temperature scale
    const n = 60;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = S.tempColor(lo + (hi - lo) * (i + 0.5) / n, 4, 24);
      ctx.fillRect(left + (right - left) * i / n, scaleY, (right - left) / n + 0.5, 14);
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.strokeRect(left, scaleY, right - left, 14);
    for (let v = lo; v <= hi; v += 1) {
      ctx.beginPath(); ctx.moveTo(X(v), scaleY + 14); ctx.lineTo(X(v), scaleY + 20); ctx.stroke();
      S.label(ctx, v + '°', X(v), scaleY + 30, { align: 'center', px: 13, weight: 400, bg: null });
    }

    // the seesaw: beam, two weights, pivot at the mixed value
    const beamY = scaleY - 64;
    const rMax = Math.min(80, (X(MEASURED) - X(FORECAST)) * 0.42);
    const rf = 14 + (rMax - 14) * Math.sqrt(wf), rm = 14 + (rMax - 14) * Math.sqrt(wm);
    // pivot
    ctx.fillStyle = C.analysis;
    ctx.beginPath(); ctx.moveTo(X(mix), beamY + 4); ctx.lineTo(X(mix) - 30, scaleY - 6); ctx.lineTo(X(mix) + 30, scaleY - 6); ctx.closePath(); ctx.fill();
    // beam
    ctx.fillStyle = C.ink;
    ctx.fillRect(X(FORECAST) - 10, beamY, X(MEASURED) - X(FORECAST) + 20, 6);
    // weights
    const ball = (v, r, col, share, name) => {
      ctx.beginPath(); ctx.arc(X(v), beamY - r, r, 0, 2 * Math.PI);
      ctx.fillStyle = col; ctx.fill();
      S.label(ctx, Math.round(share * 100) + ' %', X(v), beamY - r, { align: 'center', px: r > 26 ? 16 : 12, ink: C.paper, bg: null });
      S.label(ctx, name, X(v), beamY - 2 * r - 16, { align: 'center', px: 14 });
    };
    ball(FORECAST, rf, C.model, wf, t('mischen.forecastAt', FORECAST));
    ball(MEASURED, rm, C.obs, wm, t('mischen.measuredAt', MEASURED));
    // the mixed value on the scale
    ctx.strokeStyle = C.analysis; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(X(mix), scaleY - 6); ctx.lineTo(X(mix), scaleY + 18); ctx.stroke();
    S.label(ctx, t('mischen.result', S.num(mix)), X(mix), h - 18, { align: 'center', px: 16, ink: C.analysis });
  };

  const frame = $('x-stage');
  const view = S.canvas(frame, draw);
  const tasks = S.tasks($('x-tasks'));

  let raf = 0;
  const animate = () => {
    cancelAnimationFrame(raf);
    const target = weight();
    const tick = () => {
      shown += (target - shown) * 0.18;
      if (Math.abs(target - shown) < 0.002) shown = target;
      view.paintNow();
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const readout = () => {
    const wm = weight(), mix = FORECAST + wm * (MEASURED - FORECAST);
    $('x-mix').textContent = S.num(mix) + ' °C';
    $('x-say').textContent = t('mischen.say.' + device + '.' + age);
  };
  const seg = (attr, set) => {
    const btns = [...document.querySelectorAll('[data-' + attr + ']')];
    const key = attr.replace(/-(.)/g, (_, c) => c.toUpperCase());
    const mark = v => btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset[key] === v)));
    btns.forEach(b => b.addEventListener('click', () => { set(b.dataset[key]); mark(b.dataset[key]); readout(); animate(); }));
    return mark;
  };
  seg('x-device', v => { device = v; tried.add(v); if (v === 'handy') tasks.done('handy'); check(); })(device);
  seg('x-age', v => { age = v; if (v === 'woche') tasks.done('woche'); check(); })(age);
  function check() { if (device === 'profi' && age === 'woche') tasks.done('almost'); }

  shown = weight();
  readout();
  S.chapter.mischen = { enter() { view.redraw(); } };
})();
