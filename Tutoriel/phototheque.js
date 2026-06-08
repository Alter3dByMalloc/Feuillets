/* ============================================================
   Feuillets · Photothèque de démonstration
   Bibliothèque d'images mise à disposition des auteurs pour
   illustrer leurs histoires. Les visuels sont générés en SVG
   (autonomes, hors-ligne, persistables) et exposés sous forme
   de data-URI prêtes à insérer dans le texte.
   Exposé sur window.FPhoto.
   ============================================================ */
(function () {
  function rnd(seed) { let x = seed % 2147483647; if (x <= 0) x += 2147483646; return () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }

  function stars(n, h, seed) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = (r() * 800).toFixed(1), y = (r() * h).toFixed(1);
      const rad = (r() * 1.3 + 0.4).toFixed(2), o = (r() * 0.6 + 0.3).toFixed(2);
      s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" opacity="${o}"/>`;
    }
    return s;
  }

  const MOTIF = {
    gare: () => `
      <ellipse cx="600" cy="150" rx="150" ry="150" fill="#f0c98a" opacity="0.16"/>
      <circle cx="600" cy="150" r="24" fill="#ffe0a6" opacity="0.8"/>
      <rect x="0" y="372" width="800" height="148" fill="#000" opacity="0.3"/>
      <rect x="0" y="372" width="800" height="3" fill="#fff" opacity="0.12"/>
      <line x1="150" y1="520" x2="330" y2="376" stroke="#fff" stroke-width="2" opacity="0.1"/>
      <line x1="470" y1="520" x2="430" y2="376" stroke="#fff" stroke-width="2" opacity="0.1"/>
      <rect x="60" y="250" width="14" height="125" fill="#000" opacity="0.22"/>
      <circle cx="67" cy="246" r="9" fill="#ffe0a6" opacity="0.5"/>`,
    sunsea: () => `
      <circle cx="400" cy="300" r="74" fill="#ffdca0" opacity="0.9"/>
      <circle cx="400" cy="300" r="150" fill="#ffd29a" opacity="0.12"/>
      <rect x="0" y="320" width="800" height="200" fill="#1c2436" opacity="0.34"/>
      <rect x="0" y="320" width="800" height="200" fill="url(#shine)"/>`,
    city: () => {
      let b = ''; const r = rnd(31); let x = -20;
      while (x < 820) { const w = 34 + r() * 60, h = 120 + r() * 210; b += `<rect x="${x.toFixed(0)}" y="${(520 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#10161e" opacity="${(0.18 + r() * 0.22).toFixed(2)}"/>`; x += w + 6; }
      return b + `<rect x="0" y="0" width="800" height="520" fill="#aab4bd" opacity="0.06"/>`;
    },
    forest: () => {
      let t = ''; const r = rnd(53);
      for (let i = 0; i < 13; i++) { const x = (i * 64 + r() * 24).toFixed(0), w = (10 + r() * 12).toFixed(0), o = (0.12 + r() * 0.22).toFixed(2); t += `<rect x="${x}" y="120" width="${w}" height="400" fill="#15201a" opacity="${o}"/>`; }
      return `<rect x="0" y="0" width="800" height="520" fill="#cdd8c8" opacity="0.05"/>` + t;
    },
    stars: () => `${stars(80, 360, 7)}<circle cx="640" cy="120" r="42" fill="#f3ead0" opacity="0.85"/><circle cx="640" cy="120" r="90" fill="#f3ead0" opacity="0.07"/><rect x="0" y="430" width="800" height="90" fill="#000" opacity="0.3"/>`,
    lighthouse: () => `
      <polygon points="560,150 800,70 800,300" fill="#ffe6b0" opacity="0.14"/>
      <rect x="540" y="200" width="34" height="200" fill="#0e1a26" opacity="0.4"/>
      <polygon points="540,200 574,200 567,160 547,160" fill="#0e1a26" opacity="0.45"/>
      <circle cx="557" cy="150" r="11" fill="#ffe6b0" opacity="0.85"/>
      <rect x="0" y="400" width="800" height="120" fill="#0a1622" opacity="0.4"/>`,
    rain: () => {
      let l = ''; const r = rnd(91);
      for (let i = 0; i < 90; i++) { const x = (r() * 860 - 30).toFixed(0), y = (r() * 520).toFixed(0), len = (10 + r() * 18).toFixed(0); l += `<line x1="${x}" y1="${y}" x2="${(+x - 7)}" y2="${(+y + +len)}" stroke="#dfe7ee" stroke-width="1.4" opacity="${(0.12 + r() * 0.22).toFixed(2)}"/>`; }
      let dots = ''; const r2 = rnd(13);
      for (let i = 0; i < 9; i++) dots += `<circle cx="${(r2() * 800).toFixed(0)}" cy="${(r2() * 520).toFixed(0)}" r="${(14 + r2() * 26).toFixed(0)}" fill="#ffdca0" opacity="0.05"/>`;
      return dots + l;
    },
    dunes: () => `
      <circle cx="610" cy="160" r="54" fill="#fff2d6" opacity="0.85"/>
      <circle cx="610" cy="160" r="120" fill="#fff2d6" opacity="0.1"/>
      <path d="M0 360 Q200 300 420 350 T800 330 L800 520 L0 520 Z" fill="#b98b52" opacity="0.32"/>
      <path d="M0 430 Q260 380 520 420 T800 410 L800 520 L0 520 Z" fill="#8a6238" opacity="0.34"/>`,
    books: () => {
      let s = ''; const r = rnd(67); let x = 70;
      const cols = ['#7a4a2c', '#5a3320', '#8a6038', '#46342a', '#9a6a3a'];
      while (x < 740) { const w = 26 + r() * 26, h = 230 + r() * 150; s += `<rect x="${x.toFixed(0)}" y="${(520 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${cols[(r() * cols.length) | 0]}" opacity="0.5"/><rect x="${x.toFixed(0)}" y="${(520 - h + 16).toFixed(0)}" width="${w.toFixed(0)}" height="6" fill="#e9d8be" opacity="0.3"/>`; x += w + 8; }
      return s;
    },
    road: () => `
      <polygon points="360,180 440,180 620,520 180,520" fill="#0b0e14" opacity="0.45"/>
      <circle cx="380" cy="200" r="10" fill="#ffe6b0" opacity="0.8"/>
      <circle cx="420" cy="200" r="10" fill="#ffe6b0" opacity="0.8"/>
      <circle cx="400" cy="200" r="60" fill="#ffe6b0" opacity="0.1"/>
      <rect x="396" y="250" width="8" height="34" fill="#e9d8be" opacity="0.4"/>
      <rect x="394" y="320" width="12" height="44" fill="#e9d8be" opacity="0.35"/>
      <rect x="391" y="410" width="18" height="60" fill="#e9d8be" opacity="0.3"/>`,
    coffee: () => `
      <ellipse cx="400" cy="380" rx="120" ry="34" fill="#000" opacity="0.2"/>
      <rect x="300" y="250" width="200" height="130" rx="14" fill="#2a1c13" opacity="0.5"/>
      <ellipse cx="400" cy="250" rx="100" ry="26" fill="#5a3a26" opacity="0.6"/>
      <ellipse cx="400" cy="250" rx="78" ry="18" fill="#1a110b" opacity="0.7"/>
      <path d="M360 210 Q345 180 365 150 Q385 125 368 100" stroke="#e9d8be" stroke-width="4" fill="none" opacity="0.25"/>
      <path d="M430 210 Q415 180 435 150 Q455 125 438 100" stroke="#e9d8be" stroke-width="4" fill="none" opacity="0.2"/>`,
    mountains: () => `
      <circle cx="170" cy="150" r="46" fill="#fff" opacity="0.16"/>
      <polygon points="0,520 220,210 380,520" fill="#1e3346" opacity="0.4"/>
      <polygon points="160,210 200,250 240,205 180,210" fill="#eaf2f8" opacity="0.5"/>
      <polygon points="260,520 520,170 800,520" fill="#243f56" opacity="0.42"/>
      <polygon points="470,200 520,250 570,195 500,190" fill="#eaf2f8" opacity="0.5"/>
      <polygon points="560,520 760,300 800,360 800,520" fill="#2c4a63" opacity="0.4"/>`
  };

  function grad(c1, c2) {
    return `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  }

  function build(p) {
    const defs = `<defs>${grad(p.c1, p.c2)}` +
      `<radialGradient id="vig" cx="0.5" cy="0.4" r="0.82"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>` +
      `<linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdca0" stop-opacity="0.18"/><stop offset="1" stop-color="#ffdca0" stop-opacity="0"/></linearGradient>` +
      `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"/></filter></defs>`;
    const body = `<rect width="800" height="520" fill="url(#bg)"/>${(MOTIF[p.motif] || (() => ''))()}<rect width="800" height="520" fill="url(#vig)"/><rect width="800" height="520" filter="url(#grain)" opacity="0.06"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">${defs}${body}</svg>`;
  }

  const DEFS = [
    { id: 'quai-nuit', title: 'Quai de gare, la nuit', category: 'Ville', motif: 'gare', c1: '#1b2433', c2: '#39485c' },
    { id: 'mer-crepuscule', title: 'Mer au crépuscule', category: 'Mer', motif: 'sunsea', c1: '#e7a468', c2: '#6f5589' },
    { id: 'ville-brume', title: 'Ville sous la brume', category: 'Ville', motif: 'city', c1: '#3d454f', c2: '#97a0aa' },
    { id: 'foret-matin', title: 'Forêt au petit matin', category: 'Paysages', motif: 'forest', c1: '#2d3a31', c2: '#7e8f77' },
    { id: 'ciel-etoile', title: 'Ciel étoilé', category: 'Nuit', motif: 'stars', c1: '#0e1530', c2: '#28315c' },
    { id: 'phare', title: 'Le phare solitaire', category: 'Mer', motif: 'lighthouse', c1: '#15273b', c2: '#34597b' },
    { id: 'pluie-vitre', title: 'Pluie sur la vitre', category: 'Ville', motif: 'rain', c1: '#33414e', c2: '#5d6b78' },
    { id: 'dunes-aube', title: "Dunes à l'aube", category: 'Paysages', motif: 'dunes', c1: '#caa069', c2: '#ead0a4' },
    { id: 'grimoires', title: 'Vieux grimoires', category: 'Objets', motif: 'books', c1: '#3a2a20', c2: '#76553a' },
    { id: 'route-nuit', title: 'Route de nuit', category: 'Nuit', motif: 'road', c1: '#191c23', c2: '#3a3f4a' },
    { id: 'cafe-matin', title: 'Café du matin', category: 'Objets', motif: 'coffee', c1: '#473325', c2: '#b3855a' },
    { id: 'montagnes', title: 'Montagnes lointaines', category: 'Paysages', motif: 'mountains', c1: '#32506b', c2: '#9eb7ce' }
  ];

  const LIBRARY = DEFS.map(d => ({
    id: d.id, title: d.title, category: d.category,
    src: 'data:image/svg+xml,' + encodeURIComponent(build(d))
  }));

  window.FPhoto = { LIBRARY };
})();
