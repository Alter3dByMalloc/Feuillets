/* ============================================================
   Feuillets · Données partagées des SÉRIES
   Source de vérité unique pour les regroupements d'histoires.
   Une série = titre + description + liste ordonnée d'histoires.
   La note, les thèmes et les caractéristiques sont DÉRIVÉS
   des histoires qui la composent.
   Exposé sur window.FS pour éviter toute collision de variables.
   ============================================================ */
(function () {
  // Chaque histoire d'une série porte sa propre métadonnée pour
  // permettre le calcul des propriétés dérivées sur toutes les pages.
  const SERIES = [
    {
      id: 'les-seuils-de-minuit',
      title: 'Les Seuils de Minuit',
      author: 'Élise Morvan',
      authorSlug: 'elise-morvan',
      added: '2026-02-10',
      description:
        "Deux nuits, deux seuils que l'on n'aurait jamais dû franchir. Un diptyque où la frontière entre le réel et ce qui attend de l'autre côté n'est jamais qu'une porte entrouverte.",
      stories: [
        { slug: 'le-dernier-train-pour-minuit', title: 'Le Dernier Train pour Minuit', themes: ['Thriller'], chars: ['Atmosphérique', 'Huis clos', 'Première personne'], rating: 4.7, time: 12, readers: 4832 },
        { slug: 'chambre-313', title: 'Chambre 313', themes: ['Thriller'], chars: ['Atmosphérique', 'Première personne', 'Huis clos'], rating: 4.6, time: 11, readers: 3870 }
      ]
    },
    {
      id: 'les-voix-du-vide',
      title: 'Les Voix du Vide',
      author: 'Paul Renard',
      authorSlug: 'paul-renard',
      added: '2026-05-18',
      description:
        "Aux confins de l'espace, deux équipages séparés par les siècles tendent l'oreille vers une Terre devenue silencieuse. Un diptyque sur l'espoir que l'on transmet, malgré le vide.",
      stories: [
        { slug: 'les-enfants-du-vide', title: 'Les Enfants du Vide', themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Fin inattendue'], rating: 4.7, time: 22, readers: 3442 },
        { slug: 'la-derniere-sonde', title: 'La Dernière Sonde', themes: ['Science-fiction'], chars: ['Mélancolique', 'Atmosphérique'], rating: 4.6, time: 19, readers: 2940 }
      ]
    },
    {
      id: 'les-jardiniers-d-erebus',
      title: "Les Jardiniers d'Erebus",
      author: 'Paul Renard',
      authorSlug: 'paul-renard',
      added: '2026-06-01',
      description:
        "Sur un monde mort que l'humanité s'obstine à réveiller, deux générations de jardiniers veillent sur une promesse qui les dépasse. Un diptyque sur la patience et l'héritage.",
      stories: [
        { slug: 'la-premiere-graine', title: 'La Première Graine', themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Lumineux'], rating: 4.6, time: 17, readers: 2510 },
        { slug: 'la-derniere-recolte', title: 'La Dernière Récolte', themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Fin inattendue'], rating: 4.7, time: 20, readers: 2230 }
      ]
    }
  ];

  // ---- Propriétés dérivées ----
  function avg(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
  function unionBy(stories, key) {
    const out = [];
    stories.forEach(s => s[key].forEach(v => { if (!out.includes(v)) out.push(v); }));
    return out;
  }

  const byStory = {};
  const byId = {};
  SERIES.forEach(s => {
    s.rating = avg(s.stories.map(x => x.rating));     // moyenne des notes
    s.themes = unionBy(s.stories, 'themes');          // ensemble des thèmes
    s.chars = unionBy(s.stories, 'chars');            // ensemble des caractéristiques
    s.readers = s.stories.reduce((a, x) => a + x.readers, 0);
    s.time = s.stories.reduce((a, x) => a + x.time, 0);
    s.count = s.stories.length;
    byId[s.id] = s;
    s.stories.forEach((x, i) => {
      byStory[x.slug] = { series: s, order: i + 1, total: s.stories.length };
    });
  });

  function fmt(r) { return r.toFixed(1).replace('.', ','); }

  // Comptage des séries par auteur (clé = authorSlug)
  function seriesCountByAuthor(authorSlug) {
    return SERIES.filter(s => s.authorSlug === authorSlug).length;
  }

  window.FS = {
    SERIES,
    byStory,                 // slug d'histoire -> { series, order, total }
    byId,                    // id de série -> série
    fmt,
    seriesCountByAuthor,
    // mise en avant pour la page d'accueil
    best: SERIES.slice().sort((a, b) => (b.rating - a.rating) || (b.readers - a.readers)),
    recent: SERIES.slice().sort((a, b) => (a.added < b.added ? 1 : -1))
  };
})();
