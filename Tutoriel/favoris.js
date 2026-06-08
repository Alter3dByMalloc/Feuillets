/* ============================================================
   Feuillets · Favoris (« Mes lectures »)
   - Permet de mettre une histoire ou une série en favoris.
   - Disponible UNIQUEMENT lorsqu'un lecteur est connecté.
   - Les favoris sont stockés en localStorage, par lecteur
     (clé dérivée de la session « feuillets_session »).
   Le module est autonome : il lit la session directement et
   n'exige aucun ordre de chargement vis-à-vis de auth.js.
   Exposé sur window.FeuilletsFav.
   ============================================================ */
(function () {
  const STORE = 'feuillets_favoris';      // { <userKey>: { stories:[…slugs], series:[…ids] } }
  const SESSION = 'feuillets_session';

  function session() {
    try { return JSON.parse(localStorage.getItem(SESSION)); } catch (e) { return null; }
  }
  function userKey() {
    const s = session();
    if (!s) return null;
    return s.identifier || s.name || 'lecteur';
  }
  function isLoggedIn() { return !!userKey(); }

  function readAll() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function writeAll(d) { localStorage.setItem(STORE, JSON.stringify(d)); }

  // Renvoie { all, key, data } ou null si déconnecté.
  function bucket() {
    const key = userKey();
    if (!key) return null;
    const all = readAll();
    if (!all[key] || typeof all[key] !== 'object') all[key] = { stories: [], series: [] };
    if (!Array.isArray(all[key].stories)) all[key].stories = [];
    if (!Array.isArray(all[key].series)) all[key].series = [];
    return { all, key, data: all[key] };
  }

  function list(type) {            // type : 'stories' | 'series'
    const b = bucket();
    return b ? b.data[type].slice() : [];
  }
  function has(type, id) {
    const b = bucket();
    return b ? b.data[type].indexOf(id) >= 0 : false;
  }
  function count(type) { return list(type).length; }

  function toggle(type, id) {
    const b = bucket();
    if (!b) return false;
    const arr = b.data[type];
    const i = arr.indexOf(id);
    let now;
    if (i >= 0) { arr.splice(i, 1); now = false; }
    else { arr.push(id); now = true; }
    writeAll(b.all);
    return now;
  }

  /* ---------- Icônes ---------- */
  const HEART_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"></path></svg>';
  const HEART_FILL = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"></path></svg>';

  function nounOf(type) { return type === 'series' ? 'cette série' : 'cette histoire'; }

  /* ---------- Styles ---------- */
  let injected = false;
  function injectStyles() {
    if (injected) return;
    injected = true;
    const css = `
    /* Cœur d'angle sur les cartes de listing */
    .fav-heart{position:absolute;top:16px;right:16px;z-index:3;display:inline-flex;align-items:center;justify-content:center;
      width:38px;height:38px;background:none;border:none;border-radius:50%;cursor:pointer;color:var(--faint,#6f685f);
      padding:0;transition:color .18s,background .18s,transform .12s;}
    .fav-heart svg{width:21px;height:21px;}
    .fav-heart:hover{color:var(--accent,#c4774e);background:rgba(196,119,78,.1);}
    .fav-heart.on{color:var(--accent,#c4774e);}
    .fav-heart:active{transform:scale(.86);}
    .fav-heart:focus-visible{outline:2px solid var(--accent,#c4774e);outline-offset:2px;}
    /* réserve un peu de place à côté du cœur d'angle */
    body.fav-on .card .arrow{display:none !important;}
    body.fav-on .card h3,
    body.fav-on .card .series-flag,
    body.fav-on .card .series-tag,
    body.fav-on .card .card-themes{padding-right:34px;}

    /* Bouton pleine largeur sur les pages Histoire / Série */
    .fav-pill{display:inline-flex;align-items:center;gap:11px;border:1px solid var(--line-2,#46403a);background:none;
      color:var(--ink,#f4f0ea);font-family:var(--sans,system-ui);font-size:13px;font-weight:600;letter-spacing:.1em;
      text-transform:uppercase;padding:14px 24px;cursor:pointer;transition:border-color .2s,background .2s,color .2s;}
    .fav-pill svg{width:17px;height:17px;color:var(--accent,#c4774e);transition:transform .14s;}
    .fav-pill:hover{border-color:var(--accent,#c4774e);background:rgba(196,119,78,.08);}
    .fav-pill.on{border-color:var(--accent,#c4774e);background:rgba(196,119,78,.14);color:#f6ddcd;}
    .fav-pill:active svg{transform:scale(.84);}
    .fav-pill:focus-visible{outline:2px solid var(--accent,#c4774e);outline-offset:2px;}`;
    const s = document.createElement('style');
    s.id = 'fav-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- Fabriques d'UI ---------- */

  // Cœur d'angle pour une carte de listing. opts.onToggle(now) optionnel.
  function heartButton(type, id, opts) {
    opts = opts || {};
    injectStyles();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fav-heart' + (opts.className ? ' ' + opts.className : '');
    function paint() {
      const on = has(type, id);
      btn.classList.toggle('on', on);
      btn.innerHTML = on ? HEART_FILL : HEART_OUT;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', (on ? 'Retirer ' : 'Ajouter ') + nounOf(type) + (on ? ' de vos favoris' : ' à vos favoris'));
      btn.title = on ? 'Dans vos favoris' : 'Ajouter à mes favoris';
    }
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const now = toggle(type, id);
      paint();
      if (opts.onToggle) opts.onToggle(now);
    });
    paint();
    return btn;
  }

  // Bouton libellé pour les pages de détail. opts.onToggle(now) optionnel.
  function favPill(type, id, opts) {
    opts = opts || {};
    injectStyles();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fav-pill';
    function paint() {
      const on = has(type, id);
      btn.classList.toggle('on', on);
      btn.innerHTML = (on ? HEART_FILL : HEART_OUT) +
        '<span>' + (on ? 'Dans vos favoris' : 'Ajouter à mes favoris') + '</span>';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    btn.addEventListener('click', () => {
      const now = toggle(type, id);
      paint();
      if (opts.onToggle) opts.onToggle(now);
    });
    paint();
    return btn;
  }

  function markBody() {
    if (document.body) document.body.classList.toggle('fav-on', isLoggedIn());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markBody);
  } else {
    markBody();
  }

  window.FeuilletsFav = {
    isLoggedIn, list, has, count, toggle,
    heartButton, favPill
  };
})();
