/* ============================================================
   Feuillets · Session de démonstration (connexion simulée)
   - Stocke une "session" en localStorage.
   - Remplace, dans le header, le bouton « Connexion » par un
     accès au profil lorsque l'utilisateur est connecté.
   Exposé sur window.FeuilletsAuth.
   ============================================================ */
(function () {
  const KEY = 'feuillets_session';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function set(session) { localStorage.setItem(KEY, JSON.stringify(session)); }
  function clear() { localStorage.removeItem(KEY); }

  function initials(name) {
    const parts = String(name || '').trim().split(/[\s._-]+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const css = `
    .fa-profile{position:relative;}
    .fa-trigger{display:flex;align-items:center;gap:10px;background:none;border:1px solid var(--line,#37322d);
      color:var(--ink,#f4f0ea);font-family:var(--sans,system-ui);padding:6px 12px 6px 7px;cursor:pointer;
      transition:border-color .2s,background .2s;}
    .fa-trigger:hover{border-color:var(--accent,#c4774e);background:rgba(196,119,78,.08);}
    .fa-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-family:var(--serif,Georgia,serif);font-weight:700;font-size:13px;flex:none;letter-spacing:.01em;
      background:rgba(196,119,78,.16);border:1px solid color-mix(in srgb,var(--accent,#c4774e) 55%,transparent);color:var(--accent,#c4774e);}
    .fa-name{font-size:14px;font-weight:600;letter-spacing:.01em;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .fa-chev{color:var(--muted,#8a837a);transition:transform .2s;flex:none;}
    .fa-profile.open .fa-chev{transform:rotate(180deg);}
    .fa-menu{position:absolute;top:calc(100% + 10px);right:0;min-width:236px;background:var(--bg-soft,#211f1c);
      border:1px solid var(--line-2,#46403a);box-shadow:0 18px 44px rgba(0,0,0,.5);z-index:200;padding:6px;}
    .fa-menu[hidden]{display:none;}
    .fa-menu-head{display:flex;align-items:center;gap:12px;padding:13px 13px 14px;border-bottom:1px solid var(--line,#37322d);margin-bottom:6px;}
    .fa-avatar.lg{width:42px;height:42px;font-size:17px;}
    .fa-menu-name{font-family:var(--serif,Georgia,serif);font-weight:700;font-size:16px;color:#fbf8f3;line-height:1.1;}
    .fa-menu-id{font-size:12.5px;color:var(--muted,#8a837a);margin-top:3px;max-width:165px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .fa-item{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:none;cursor:pointer;
      font-family:var(--sans,system-ui);font-size:14px;color:var(--soft,#c7c0b6);padding:11px 13px;text-decoration:none;transition:background .15s,color .15s;}
    .fa-item:hover{background:rgba(255,255,255,.04);color:var(--ink,#f4f0ea);}
    .fa-item svg{width:16px;height:16px;color:var(--muted,#8a837a);flex:none;}
    .fa-sep{height:1px;background:var(--line,#37322d);margin:6px 0;}
    .fa-logout,.fa-logout svg{color:#d18a68;}
    .fa-logout:hover{color:var(--accent,#c4774e);background:rgba(196,119,78,.08);}`;
    const s = document.createElement('style');
    s.id = 'fa-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  const IC_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>';
  const IC_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a2 2 0 0 1 2 2v14"></path><path d="M8 4v16"></path><path d="M20 7v13H6"></path></svg>';
  const IC_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"></path></svg>';
  const IC_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>';
  const IC_PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>';

  function renderHeader() {
    const actions = document.querySelector('header .actions');
    if (!actions) return;
    const link = actions.querySelector('a.btn-line, button.btn-line');
    const session = get();
    if (!session || !link) return; // déconnecté, ou pas de bouton Connexion (ex : page Connexion)

    injectStyles();
    const name = session.name || 'Mon compte';
    const ini = initials(name);
    const idLine = session.identifier || '';

    const wrap = document.createElement('div');
    wrap.className = 'fa-profile';
    wrap.innerHTML = `
      <button class="fa-trigger" type="button" aria-haspopup="true" aria-expanded="false">
        <span class="fa-avatar">${ini}</span>
        <span class="fa-name">${name}</span>
        <svg class="fa-chev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="fa-menu" hidden>
        <div class="fa-menu-head">
          <span class="fa-avatar lg">${ini}</span>
          <div><div class="fa-menu-name">${name}</div><div class="fa-menu-id">${idLine}</div></div>
        </div>
        <a class="fa-item" href="MonProfil.html">${IC_USER}Mon profil</a>
        <a class="fa-item" href="MesLectures.html">${IC_HEART}Mes lectures</a>
        <a class="fa-item" href="MesPublications.html">${IC_PEN}Mes publications</a>
        <div class="fa-sep"></div>
        <button class="fa-item fa-logout" type="button">${IC_OUT}Se déconnecter</button>
      </div>`;
    link.replaceWith(wrap);

    const trigger = wrap.querySelector('.fa-trigger');
    const menu = wrap.querySelector('.fa-menu');
    function close() { menu.hidden = true; wrap.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }
    function open() { menu.hidden = false; wrap.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
    trigger.addEventListener('click', e => { e.stopPropagation(); menu.hidden ? open() : close(); });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    wrap.querySelector('.fa-logout').addEventListener('click', () => { clear(); location.href = 'Feuillets.html'; });
  }

  // Connexion simulée : enregistre la session puis redirige vers l'accueil.
  function login(identifier, name) {
    set({ name: name || 'Lecteur', identifier: identifier || '', since: Date.now() });
    location.href = 'Feuillets.html';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
  } else {
    renderHeader();
  }

  window.FeuilletsAuth = { get, set, clear, login, renderHeader, initials };
})();
