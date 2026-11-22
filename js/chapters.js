// The five chapters of the app, one visible at a time:
//   #warum · #stationen · #assimilation · #vorhersage · #gitter
// A grid key (#icon, #latlon, …) opens the grid chapter with that grid.
// Each chapter script registers SCAPE.chapter[key] = { enter(hash), leave() };
// enter/leave start and stop animations so hidden chapters cost nothing.
// Load last, after every chapter script.
(() => {
  const S = window.SCAPE;
  const KEYS = ['warum', 'stationen', 'assimilation', 'vorhersage', 'gitter'];
  const sections = Object.fromEntries(KEYS.map(k => [k, document.getElementById('ch-' + k)]));
  const navBtns = [...document.querySelectorAll('[data-chapter]')];
  const $ = id => document.getElementById(id);
  const isGrid = key => S.gallery && S.gallery.has(key);
  let current = null;

  const name = k => t('chapters.' + k + '.nav');

  const show = (hash, { scroll = false } = {}) => {
    const key = KEYS.includes(hash) ? hash : isGrid(hash) ? 'gitter' : KEYS[0];
    if (key !== current) {
      if (current && S.chapter[current] && S.chapter[current].leave) S.chapter[current].leave();
      KEYS.forEach(k => { sections[k].hidden = k !== key; });
      navBtns.forEach(b => b.setAttribute('aria-current', String(b.dataset.chapter === key)));
      current = key;

      // chapter pager at the foot of the page
      const i = KEYS.indexOf(key), prev = KEYS[i - 1], next = KEYS[i + 1];
      $('ch-prev').style.visibility = prev ? '' : 'hidden';
      $('ch-next').style.visibility = next ? '' : 'hidden';
      $('ch-prev-name').textContent = prev ? name(prev) : '';
      $('ch-next-name').textContent = next ? name(next) : '';
      $('ch-prev').setAttribute('aria-label', prev ? t('chapterPager.prevAria', name(prev)) : '');
      $('ch-next').setAttribute('aria-label', next ? t('chapterPager.nextAria', name(next)) : '');
      $('ch-count').textContent = t('chapterPager.count', i + 1, KEYS.length);

      if (scroll) window.scrollTo(0, 0);
      // let the newly shown canvases measure themselves
      window.dispatchEvent(new Event('resize'));
    }
    if (S.chapter[key] && S.chapter[key].enter) S.chapter[key].enter(hash);
    if (key !== 'gitter' && location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);
  };

  const go = key => { show(key, { scroll: true }); };
  navBtns.forEach(b => b.addEventListener('click', () => go(b.dataset.chapter)));
  $('ch-prev').addEventListener('click', () => go(KEYS[KEYS.indexOf(current) - 1]));
  $('ch-next').addEventListener('click', () => go(KEYS[KEYS.indexOf(current) + 1]));
  document.querySelectorAll('[data-goto]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); go(a.dataset.goto); }));
  window.addEventListener('hashchange', () => show(location.hash.slice(1), { scroll: false }));

  show(location.hash.slice(1));
})();
