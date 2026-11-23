// The invented landscape shared by the chapters "Messen", "Kästchen" and
// "Vorausrechnen": a mountain in the north-east, a city, a river, eight
// weather stations, and the "real" temperature of a summer afternoon.
// All values are made up (synthetic). Load after js/canvas.js.
(() => {
  const S = window.SCAPE, C = window.THEME.modellgitter;
  const g = (x, y, cx, cy, s) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));

  const MOUNTAIN = [0.74, 0.27], CITY = [0.36, 0.66];
  // y = 0 is the north edge: colder in the north, cold on the mountain, warm in the city
  const temp = (x, y) =>
    15 + 7 * y
    - 11 * g(x, y, MOUNTAIN[0], MOUNTAIN[1], 0.11)
    + 3.5 * g(x, y, CITY[0], CITY[1], 0.045)
    + 0.6 * Math.sin(6 * x + 1) * Math.cos(5 * y);

  const STATIONS = [[0.14, 0.18], [0.46, 0.13], [0.18, 0.52], [0.42, 0.42], [0.26, 0.86], [0.62, 0.62], [0.86, 0.84], [0.88, 0.52]]
    .map(([x, y], i) => ({ i, x, y, v: Math.round(temp(x, y)) }));

  const LO = 4, HI = 24;

  // the land: plain ground, a river, the mountain and the city as symbols
  const drawLand = (ctx, b, { faint = false } = {}) => {
    const X = v => b.x + v * b.s, Y = v => b.y + v * b.s;
    ctx.save();
    ctx.globalAlpha = faint ? 0.55 : 1;
    // river
    ctx.strokeStyle = C.river; ctx.lineWidth = Math.max(3, b.s * 0.012); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let k = 0; k <= 40; k++) {
      const x = k / 40, y = 0.42 + 0.1 * Math.sin(x * 5.5) + 0.25 * x;
      k ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y));
    }
    ctx.stroke();
    // mountain: a few peaks
    const peaks = [[0, 0, 1], [-0.07, 0.04, 0.7], [0.07, 0.035, 0.75], [0.02, 0.07, 0.6]];
    for (const [dx, dy, k] of peaks) {
      const cx = X(MOUNTAIN[0] + dx), cy = Y(MOUNTAIN[1] + dy), w = b.s * 0.07 * k, h = b.s * 0.09 * k;
      ctx.beginPath(); ctx.moveTo(cx - w, cy + h / 2); ctx.lineTo(cx, cy - h / 2); ctx.lineTo(cx + w, cy + h / 2); ctx.closePath();
      ctx.fillStyle = C.mountain; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - w * 0.3, cy - h * 0.2); ctx.lineTo(cx, cy - h / 2); ctx.lineTo(cx + w * 0.3, cy - h * 0.2); ctx.closePath();
      ctx.fillStyle = C.paper; ctx.fill();
    }
    // city: a cluster of houses
    const houses = [[-0.03, -0.02, 1.3], [0.0, -0.03, 1.8], [0.03, -0.015, 1.1], [-0.015, 0.02, 0.9], [0.02, 0.02, 1.2], [0.05, 0.015, 0.8]];
    for (const [dx, dy, k] of houses) {
      const w = b.s * 0.022, h = b.s * 0.022 * k;
      ctx.fillStyle = C.city;
      ctx.fillRect(X(CITY[0] + dx) - w / 2, Y(CITY[1] + dy) - h, w, h);
    }
    ctx.restore();
  };

  const drawStation = (ctx, b, st, { muted = false } = {}) => {
    const x = b.x + st.x * b.s, y = b.y + st.y * b.s;
    ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.fillStyle = muted ? C.paper : C.station; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = muted ? C.station : C.paper; ctx.stroke();
    S.label(ctx, st.v + '°', x, y - 19, { align: 'center', px: 15, weight: 500 });
  };

  S.land = { temp, STATIONS, MOUNTAIN, CITY, LO, HI, drawLand, drawStation };
})();
