/* ============================================================
   Feuillets · Publications des auteurs
   Source de vérité pour les histoires et séries publiées par
   les lecteurs (stockées en localStorage « feuillets_publications »,
   par compte). Ce module normalise ces enregistrements pour qu'ils
   s'intègrent au catalogue, aux pages Histoire / Série, et à la
   page « Mes publications ».

   Règles métier :
   - Une histoire publiée apparaît dans le catalogue (et est lisible).
   - Une série apparaît dans les listings UNIQUEMENT si elle contient
     au moins une histoire. Une série vide reste visible seulement
     dans « Mes publications » de son auteur.

   Exposé sur window.FP.
   ============================================================ */
(function () {
  const STORE = 'feuillets_publications';
  const SESSION = 'feuillets_session';

  function readAll() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function writeAll(d) { localStorage.setItem(STORE, JSON.stringify(d)); }

  function curKey() {
    try { const s = JSON.parse(localStorage.getItem(SESSION)); return s ? (s.identifier || s.name || 'lecteur') : null; }
    catch (e) { return null; }
  }

  function ownerRecords(key) { const all = readAll(); return Array.isArray(all[key]) ? all[key] : []; }
  function allRecords() {
    const all = readAll(); const out = [];
    Object.keys(all).forEach(k => (Array.isArray(all[k]) ? all[k] : []).forEach(r => out.push(Object.assign({ owner: k }, r))));
    return out;
  }

  function wordCount(t) { return String(t || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').trim().split(/\s+/).filter(Boolean).length; }
  function timeOf(rec) { return Math.max(1, Math.round(wordCount(rec.body) / 200)); }

  /* ---------- Normalisation ---------- */
  function normStory(rec) {
    return {
      id: rec.id, slug: rec.id, title: rec.title || 'Sans titre', author: rec.author || 'Auteur',
      themes: Array.isArray(rec.themes) ? rec.themes : [],
      chars: Array.isArray(rec.chars) ? rec.chars : [],
      excerpt: rec.description || '', description: rec.description || '', body: rec.body || '',
      time: timeOf(rec), rating: null, readers: 0,
      isUserPub: true, seriesId: rec.series || null, owner: rec.owner, created: rec.created || 0
    };
  }

  function storyIndex() {
    const m = {};
    allRecords().filter(r => r.type === 'story' && r.id).forEach(r => { m[r.id] = normStory(r); });
    return m;
  }

  function union(arr, key) {
    const out = [];
    arr.forEach(s => (s[key] || []).forEach(v => { if (!out.includes(v)) out.push(v); }));
    return out;
  }

  function normSeries(rec) {
    const idx = storyIndex();
    const stories = (Array.isArray(rec.stories) ? rec.stories : []).map(id => idx[id]).filter(Boolean);
    return {
      id: rec.id, title: rec.title || 'Sans titre', author: rec.author || 'Auteur', authorSlug: null,
      description: rec.description || '',
      stories: stories.map(s => ({ slug: s.slug, title: s.title, themes: s.themes, chars: s.chars, rating: null, time: s.time, description: s.description })),
      themes: union(stories, 'themes'), chars: union(stories, 'chars'),
      time: stories.reduce((a, s) => a + s.time, 0), readers: 0, rating: null, count: stories.length,
      isUserPub: true, owner: rec.owner, created: rec.created || 0
    };
  }

  /* ---------- Pour le catalogue (tous auteurs) ---------- */
  function catalogStories() { return allRecords().filter(r => r.type === 'story' && r.id).map(normStory); }
  function catalogSeries() { return allRecords().filter(r => r.type === 'series' && r.id).map(normSeries).filter(s => s.count > 0); }

  function storyById(id) { return storyIndex()[id] || null; }
  function seriesById(id) {
    const rec = allRecords().find(r => r.type === 'series' && r.id === id);
    return rec ? normSeries(rec) : null;
  }

  // Appartenance d'une histoire publiée à une série publiée
  function byStory(storyId) {
    const sers = allRecords().filter(r => r.type === 'series' && r.id);
    for (const rec of sers) {
      const ids = Array.isArray(rec.stories) ? rec.stories : [];
      const i = ids.indexOf(storyId);
      if (i >= 0) { const ns = normSeries(rec); return { series: ns, order: i + 1, total: ns.count }; }
    }
    return null;
  }

  /* ---------- Pour l'auteur courant (Mes publications) ---------- */
  function myStories() { const k = curKey(); return k ? ownerRecords(k).filter(r => r.type === 'story' && r.id).map(normStory) : []; }
  function mySeries() { const k = curKey(); return k ? ownerRecords(k).filter(r => r.type === 'series' && r.id).map(normSeries) : []; }

  /* ---------- Écriture ---------- */
  function publish(rec) {
    const key = curKey();
    if (!key) return null;
    const all = readAll();
    if (!Array.isArray(all[key])) all[key] = [];
    rec.created = Date.now();
    rec.author = (() => { try { return (JSON.parse(localStorage.getItem(SESSION)) || {}).name || 'Auteur'; } catch (e) { return 'Auteur'; } })();
    all[key].unshift(rec);
    writeAll(all);
    return rec;
  }
  // Rattache une histoire à une série appartenant à l'auteur courant.
  function attachStoryToSeries(seriesId, storyId) {
    const key = curKey();
    if (!key) return;
    const all = readAll();
    const arr = Array.isArray(all[key]) ? all[key] : [];
    const ser = arr.find(r => r.type === 'series' && r.id === seriesId);
    if (ser) {
      if (!Array.isArray(ser.stories)) ser.stories = [];
      if (!ser.stories.includes(storyId)) ser.stories.push(storyId);
      writeAll(all);
    }
  }

  /* ---------- Lecture brute (pour l'édition) ---------- */
  function rawStory(id) { const k = curKey(); return k ? (ownerRecords(k).find(r => r.type === 'story' && r.id === id) || null) : null; }
  function rawSeries(id) { const k = curKey(); return k ? (ownerRecords(k).find(r => r.type === 'series' && r.id === id) || null) : null; }

  /* ---------- Modification ---------- */
  function updateStory(id, fields) {
    const key = curKey();
    if (!key) return;
    const all = readAll();
    const arr = Array.isArray(all[key]) ? all[key] : (all[key] = []);
    const rec = arr.find(r => r.type === 'story' && r.id === id);
    if (!rec) return;
    if ('title' in fields) rec.title = fields.title;
    if ('body' in fields) rec.body = fields.body;
    if ('description' in fields) rec.description = fields.description;
    if ('themes' in fields) rec.themes = fields.themes;
    if ('chars' in fields) rec.chars = fields.chars;
    if ('series' in fields) {
      const newSer = fields.series || null;
      rec.series = newSer;
      // Resynchronise l'appartenance : retire l'histoire de toutes les séries, puis la rattache à la nouvelle.
      arr.filter(r => r.type === 'series' && Array.isArray(r.stories)).forEach(s => {
        const i = s.stories.indexOf(id); if (i >= 0) s.stories.splice(i, 1);
      });
      if (newSer) {
        const s = arr.find(r => r.type === 'series' && r.id === newSer);
        if (s) { if (!Array.isArray(s.stories)) s.stories = []; if (!s.stories.includes(id)) s.stories.push(id); }
      }
    }
    rec.updated = Date.now();
    writeAll(all);
  }

  function updateSeries(id, fields) {
    const key = curKey();
    if (!key) return;
    const all = readAll();
    const arr = Array.isArray(all[key]) ? all[key] : (all[key] = []);
    const rec = arr.find(r => r.type === 'series' && r.id === id);
    if (!rec) return;
    if ('title' in fields) rec.title = fields.title;
    if ('description' in fields) rec.description = fields.description;
    if (Array.isArray(fields.stories)) rec.stories = fields.stories.slice();
    rec.updated = Date.now();
    writeAll(all);
  }

  /* ---------- Suppression ---------- */
  function deleteStory(id) {
    const key = curKey();
    if (!key) return;
    const all = readAll();
    const arr = Array.isArray(all[key]) ? all[key] : [];
    const i = arr.findIndex(r => r.type === 'story' && r.id === id);
    if (i >= 0) arr.splice(i, 1);
    // Retire la référence dans les séries — SANS supprimer les séries.
    arr.filter(r => r.type === 'series' && Array.isArray(r.stories)).forEach(s => {
      const j = s.stories.indexOf(id); if (j >= 0) s.stories.splice(j, 1);
    });
    writeAll(all);
  }
  function deleteSeries(id) {
    const key = curKey();
    if (!key) return;
    const all = readAll();
    const arr = Array.isArray(all[key]) ? all[key] : [];
    const i = arr.findIndex(r => r.type === 'series' && r.id === id);
    if (i >= 0) arr.splice(i, 1);
    // Les histoires associées ne sont PAS supprimées ; on nettoie seulement leur rattachement.
    arr.filter(r => r.type === 'story' && r.series === id).forEach(s => { s.series = null; });
    writeAll(all);
  }

  window.FP = {
    curKey, catalogStories, catalogSeries, storyById, seriesById, byStory,
    myStories, mySeries, publish, attachStoryToSeries,
    rawStory, rawSeries, updateStory, updateSeries, deleteStory, deleteSeries
  };
})();
