/* ============================================================
   Feuillets · Données partagées du CATALOGUE (histoires)
   Source de vérité unique pour les fiches d'histoires :
   thèmes, caractéristiques, extraits, notes et slugs.
   Utilisée par le Catalogue ET par la page « Mes lectures »
   pour rendre des cartes identiques sans dupliquer les données.
   Exposé sur window.FC.
   ============================================================ */
(function () {
  const THEMES = [
    { id: 'Polar', color: '#c4774e' },
    { id: 'Thriller', color: '#c25c4a' },
    { id: 'Science-fiction', color: '#6791c4' },
    { id: 'Fantasy', color: '#b277c2' },
    { id: 'Roman', color: '#c97a9c' },
    { id: 'Témoignage', color: '#5ea283' },
    { id: 'Nouvelle', color: '#8a9d6a' }
  ];
  const THEME_COLOR = Object.fromEntries(THEMES.map(t => [t.id, t.color]));

  const CHARS = [
    'Atmosphérique', 'Rythme intense', 'Fin inattendue', 'Huis clos',
    'Première personne', 'Personnage féminin', 'Faits réels',
    'Mélancolique', 'Lumineux', 'Lecture courte'
  ];

  const STORIES = [
    { title: "L'Architecte des Ombres", author: "Jean-Luc Breton", time: 35,
      themes: ['Polar', 'Thriller'], chars: ['Atmosphérique', 'Rythme intense', 'Personnage féminin'],
      excerpt: "Dans une ville brumeuse du Nord, l'inspectrice Vera Kalm traque un tueur qui transforme chaque scène de crime en tableau." },
    { title: "Le Dernier Train pour Minuit", author: "Élise Morvan", time: 12,
      themes: ['Thriller'], chars: ['Atmosphérique', 'Huis clos', 'Première personne'],
      excerpt: "Elle ne devait jamais monter dans ce train. Pourtant, le quai 9 l'attendait, silencieux comme un secret." },
    { title: "Les Cendres du Lendemain", author: "Claire Fontaine", time: 8,
      themes: ['Roman'], chars: ['Mélancolique', 'Personnage féminin', 'Faits réels'],
      excerpt: "Une femme retrouve les lettres de sa mère disparue, et avec elles, une vérité qu'elle n'était pas prête à entendre." },
    { title: "Mémoire Vive", author: "Thomas Leray", time: 15,
      themes: ['Science-fiction'], chars: ['Rythme intense', 'Fin inattendue'],
      excerpt: "En 2041, les souvenirs se vendent au marché noir. Marcus veut récupérer les siens, coûte que coûte." },
    { title: "Kaboul, l'été de mes quinze ans", author: "Nadia Ahmadi", time: 20,
      themes: ['Témoignage'], chars: ['Faits réels', 'Première personne', 'Mélancolique'],
      excerpt: "Un récit intime sur l'exil, la reconstruction et la résilience d'une adolescente devenue femme entre deux cultures." },
    { title: "La Gardienne du Phare", author: "Amélie Voss", time: 10,
      themes: ['Fantasy'], chars: ['Atmosphérique', 'Personnage féminin', 'Lumineux'],
      excerpt: "Sur une île que les cartes ont oubliée, une jeune femme veille sur une lumière qui ne devrait pas exister." },
    { title: "Vengeance à Montmartre", author: "Marc Duval", time: 18,
      themes: ['Polar'], chars: ['Rythme intense', 'Fin inattendue'],
      excerpt: "Trente ans après, un nom resurgit dans un carnet jauni. Pour le commissaire Le Goff, l'affaire n'a jamais été close." },
    { title: "Le Dernier Été à Paros", author: "Sophie Arnaud", time: 12,
      themes: ['Nouvelle', 'Roman'], chars: ['Lumineux', 'Lecture courte', 'Personnage féminin'],
      excerpt: "Deux sœurs, une maison blanche au bord de l'Égée, et l'été où tout, doucement, a basculé." },
    { title: "Les Enfants du Vide", author: "Paul Renard", time: 22,
      themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Fin inattendue'],
      excerpt: "À bord d'un vaisseau-génération, la dernière génération née en route apprend qu'aucune planète ne les attend." },
    { title: "La Maison aux Volets Clos", author: "Hélène Marquet", time: 16,
      themes: ['Thriller', 'Polar'], chars: ['Huis clos', 'Fin inattendue', 'Atmosphérique'],
      excerpt: "Six invités, une demeure isolée par la neige, et un hôte qui n'apparaît jamais. La nuit sera longue." },
    { title: "Le Cartographe des Rêves", author: "Julien Sorel", time: 25,
      themes: ['Fantasy'], chars: ['Atmosphérique', 'Lumineux', 'Première personne'],
      excerpt: "On l'engage pour dessiner les territoires que les dormeurs visitent. Une carte, pourtant, refuse d'être achevée." },
    { title: "Lettres à personne", author: "Camille Roy", time: 9,
      themes: ['Roman', 'Témoignage'], chars: ['Mélancolique', 'Première personne', 'Lecture courte'],
      excerpt: "Chaque soir, elle écrit une lettre qu'elle n'enverra jamais. Un an plus tard, quelqu'un commence à répondre." },
    { title: "La Langue de l'autre", author: "Nadia Ahmadi", time: 14,
      themes: ['Témoignage'], chars: ['Première personne', 'Faits réels', 'Lumineux'],
      excerpt: "Apprendre à penser, à rêver, à aimer dans une langue qui n'était pas la sienne — et y trouver, un jour, une seconde naissance." },
    { title: "La Marchande de Coquillages", author: "Sophie Arnaud", time: 9,
      themes: ['Nouvelle'], chars: ['Lumineux', 'Lecture courte', 'Mélancolique'],
      excerpt: "Sur le port, une vieille femme vend des coquillages et, à qui sait écouter, le bruit d'étés que l'on croyait perdus." },
    { title: "Le Vernissage", author: "Jean-Luc Breton", time: 28,
      themes: ['Polar', 'Thriller'], chars: ['Atmosphérique', 'Fin inattendue', 'Rythme intense'],
      excerpt: "Le soir du vernissage, une toile de trop est accrochée au mur. Personne ne l'a peinte. Tout le monde s'y reconnaît." },
    { title: "Le Témoin du Quai des Orfèvres", author: "Marc Duval", time: 16,
      themes: ['Polar'], chars: ['Rythme intense', 'Atmosphérique'],
      excerpt: "Un seul témoin, un seul aveu, et trente années d'archives qui, soudain, ne racontent plus la même histoire." },
    { title: "La Chambre du Haut", author: "Claire Fontaine", time: 11,
      themes: ['Roman'], chars: ['Mélancolique', 'Personnage féminin'],
      excerpt: "On ferme certaines portes pour ne pas réveiller les morts. Trente ans après, elle décide enfin d'ouvrir celle du haut." },
    { title: "Le Dernier Algorithme", author: "Thomas Leray", time: 18,
      themes: ['Science-fiction'], chars: ['Rythme intense', 'Atmosphérique'],
      excerpt: "La première intelligence à se savoir mortelle n'a pas demandé à vivre plus longtemps. Elle a demandé à comprendre pourquoi." },
    { title: "L'Ascenseur", author: "Hélène Marquet", time: 13,
      themes: ['Thriller', 'Polar'], chars: ['Huis clos', 'Rythme intense', 'Atmosphérique'],
      excerpt: "Entre le huitième et le neuvième étage, l'ascenseur s'est immobilisé. Ils étaient quatre. L'un d'eux n'aurait jamais dû monter." },
    { title: "Chambre 313", author: "Élise Morvan", time: 11,
      themes: ['Thriller'], chars: ['Atmosphérique', 'Première personne', 'Huis clos'],
      excerpt: "L'hôtel n'avait pas de treizième étage. Pourtant, sa clé portait le numéro 313, et l'ascenseur, lui, savait où aller." },
    { title: "La Dernière Sonde", author: "Paul Renard", time: 19,
      themes: ['Science-fiction'], chars: ['Mélancolique', 'Atmosphérique'],
      excerpt: "Lancée avant l'extinction, une sonde continue d'émettre vers une Terre qui ne répond plus. Quelqu'un, pourtant, l'écoute encore." },
    { title: "Le Répondeur", author: "Camille Roy", time: 8,
      themes: ['Roman', 'Témoignage'], chars: ['Mélancolique', 'Première personne', 'Lecture courte'],
      excerpt: "Elle n'a jamais effacé le message. Chaque soir, elle compose le numéro, juste pour entendre, encore, le timbre d'une voix éteinte." },
    { title: "L'Horloger du Crépuscule", author: "Julien Sorel", time: 21,
      themes: ['Fantasy'], chars: ['Atmosphérique', 'Lumineux'],
      excerpt: "Dans son atelier sans fenêtre, un horloger répare le temps des autres. Le sien, depuis longtemps, s'est arrêté à six heures." },
    { title: "La Tisseuse de Marées", author: "Amélie Voss", time: 12,
      themes: ['Fantasy'], chars: ['Atmosphérique', 'Personnage féminin', 'Lumineux'],
      excerpt: "Au bout de la jetée, une femme tisse la mer comme une étoffe. Chaque vague qu'elle noue éloigne un peu plus celui qu'elle attend." },
    { title: "La Consigne 47", author: "Élise Morvan", time: 10,
      themes: ['Thriller'], chars: ['Atmosphérique', 'Première personne'],
      excerpt: "Dans le hall désert de la gare, un casier que personne n'a loué s'ouvre chaque nuit à la même heure — et chaque matin, il est de nouveau verrouillé." },
    { title: "Onze Heures Onze", author: "Élise Morvan", time: 9,
      themes: ['Thriller'], chars: ['Atmosphérique', 'Mélancolique'],
      excerpt: "Chaque nuit, sa montre s'arrête à 23 h 11. Et l'on frappe trois coups à une porte que le plan de l'hôtel ne mentionne nulle part." },
    { title: "La Première Graine", author: "Paul Renard", time: 17,
      themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Lumineux'],
      excerpt: "On lui avait confié une graine et un siècle. Sur Erebus, monde de cendre et de gel, elle planta la première — sachant qu'elle ne verrait jamais l'arbre." },
    { title: "La Dernière Récolte", author: "Paul Renard", time: 20,
      themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique', 'Fin inattendue'],
      excerpt: "Quatre générations plus tard, Erebus a des forêts. Mais le jour de la première récolte, le monde découvre qu'il attendait, lui aussi, quelque chose des jardiniers." },
    { title: "Le Phare de Proxima", author: "Paul Renard", time: 16,
      themes: ['Science-fiction'], chars: ['Atmosphérique', 'Mélancolique'],
      excerpt: "À mi-chemin entre deux étoiles, une balise solitaire répète le même message depuis mille ans. Le jour où elle se tait, un vaisseau, enfin, change de cap." }
  ];

  const RATINGS = {
    "L'Architecte des Ombres": 4.8,
    "Le Dernier Train pour Minuit": 4.7,
    "Les Cendres du Lendemain": 4.5,
    "Mémoire Vive": 4.6,
    "Kaboul, l'été de mes quinze ans": 4.9,
    "La Gardienne du Phare": 4.4,
    "Vengeance à Montmartre": 4.5,
    "Le Dernier Été à Paros": 4.6,
    "Les Enfants du Vide": 4.7,
    "La Maison aux Volets Clos": 4.8,
    "Le Cartographe des Rêves": 4.5,
    "Lettres à personne": 4.7,
    "La Langue de l'autre": 4.7,
    "La Marchande de Coquillages": 4.5,
    "Le Vernissage": 4.6,
    "Le Témoin du Quai des Orfèvres": 4.4,
    "La Chambre du Haut": 4.4,
    "Le Dernier Algorithme": 4.5,
    "L'Ascenseur": 4.7,
    "Chambre 313": 4.6,
    "La Dernière Sonde": 4.6,
    "Le Répondeur": 4.6,
    "L'Horloger du Crépuscule": 4.4,
    "La Tisseuse de Marées": 4.3,
    "La Consigne 47": 4.6,
    "Onze Heures Onze": 4.5,
    "La Première Graine": 4.6,
    "La Dernière Récolte": 4.7,
    "Le Phare de Proxima": 4.5
  };

  const SLUGS = {
    "L'Architecte des Ombres": "l-architecte-des-ombres",
    "Le Dernier Train pour Minuit": "le-dernier-train-pour-minuit",
    "Les Cendres du Lendemain": "les-cendres-du-lendemain",
    "Mémoire Vive": "memoire-vive",
    "Kaboul, l'été de mes quinze ans": "kaboul-quinze-ans",
    "La Gardienne du Phare": "la-gardienne-du-phare",
    "Vengeance à Montmartre": "vengeance-a-montmartre",
    "Le Dernier Été à Paros": "le-dernier-ete-a-paros",
    "Les Enfants du Vide": "les-enfants-du-vide",
    "La Maison aux Volets Clos": "la-maison-aux-volets-clos",
    "Le Cartographe des Rêves": "le-cartographe-des-reves",
    "Lettres à personne": "lettres-a-personne",
    "La Langue de l'autre": "la-langue-de-l-autre",
    "La Marchande de Coquillages": "la-marchande-de-coquillages",
    "Le Vernissage": "le-vernissage",
    "Le Témoin du Quai des Orfèvres": "le-temoin-du-quai",
    "La Chambre du Haut": "la-chambre-du-haut",
    "Le Dernier Algorithme": "le-dernier-algorithme",
    "L'Ascenseur": "l-ascenseur",
    "Chambre 313": "chambre-313",
    "La Dernière Sonde": "la-derniere-sonde",
    "Le Répondeur": "le-repondeur",
    "L'Horloger du Crépuscule": "l-horloger-du-crepuscule",
    "La Tisseuse de Marées": "la-tisseuse-de-marees",
    "La Consigne 47": "la-consigne-47",
    "Onze Heures Onze": "onze-heures-onze",
    "La Première Graine": "la-premiere-graine",
    "La Dernière Récolte": "la-derniere-recolte",
    "Le Phare de Proxima": "le-phare-de-proxima"
  };

  const ratingOf = t => RATINGS[t] || 0;
  const fmtRating = r => r.toFixed(1).replace('.', ',');

  // Index slug -> histoire (avec slug et note résolus), pour un rendu direct par slug.
  const bySlug = {};
  STORIES.forEach(s => {
    const slug = SLUGS[s.title];
    if (slug) bySlug[slug] = Object.assign({}, s, { slug, rating: ratingOf(s.title) });
  });

  window.FC = { THEMES, THEME_COLOR, CHARS, STORIES, RATINGS, SLUGS, ratingOf, fmtRating, bySlug };
})();
