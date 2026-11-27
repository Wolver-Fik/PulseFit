(function () {
  'use strict';

  window.PulseFit = window.PulseFit || {};

  var LS_DAYS = 'cf_days';
  var LS_LIFTS = 'cf_lifts';
  var LS_LANG = 'pulsefit_lang';
  var LS_CONFIG = 'pulsefit_routine_config';
  var LS_CARDIO_CONFIG = 'pulsefit_cardio_config';
  var LS_PLAN = 'pulsefit_weekly_plan';
  var LS_MEASURES = 'pulsefit_body_measures';
  var LS_MEASURE_UNIT = 'pulsefit_measure_unit';
  var LS_TEMPLATES = 'pulsefit_routine_templates_v2';

  /* ---------- Capa IndexedDB (Etapa 1) ----------
     Espejo completo de localStorage en IndexedDB + store de archivos para
     imagenes/recortes sin el limite de 5 MB. La API sincrona no cambia. */
  var DB_NAME = 'pulsefit_db';
  var DB_VERSION = 2;
  var SCHEMA_VERSION = 4;
  var STORE_STATE = 'state';
  var STORE_FILES = 'files';
  var STORE_TEMPLATES = 'templates'; // Etapa 2: plantillas con id propio en IndexedDB.
  var STATE_KEY = 'main';
  var dbPromise = null, idbReady = false, idbFailed = false;
  var initPromise = null, writeChain = Promise.resolve(), templateChain = Promise.resolve(), memoryBackup = null;

  /* IndexedDB es la única fuente de verdad. `memoryDump` es la copia en memoria
     del estado persistido para que la API síncrona (load/save) no lea nunca
     localStorage como si fuera la fuente autoritativa. */
  var memoryDump = null;
  var STORAGE_ERROR_MESSAGE = 'Error al guardar los datos en este dispositivo. Exporta un respaldo JSON por seguridad.';
  var storageErrorHandler = null, lastStorageError = null, storageErrorActive = false;

  function emitStorageError(err, origin) {
    if (storageErrorActive) return;
    storageErrorActive = true;
    lastStorageError = { message: STORAGE_ERROR_MESSAGE, error: err || null, origin: origin || '' };
    try { if (typeof storageErrorHandler === 'function') storageErrorHandler(lastStorageError); } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('onStorageError', { detail: lastStorageError }));
    } catch (e) {
      try {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('onStorageError', false, false, lastStorageError);
        window.dispatchEvent(ev);
      } catch (e2) {}
    }
  }
  function clearStorageError() { storageErrorActive = false; lastStorageError = null; }

  function idbOpen() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) { reject(new Error('IndexedDB no disponible')); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE_STATE)) db.createObjectStore(STORE_STATE);
        if (!db.objectStoreNames.contains(STORE_FILES)) db.createObjectStore(STORE_FILES, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_TEMPLATES)) db.createObjectStore(STORE_TEMPLATES, { keyPath: 'id' });
      };
      req.onsuccess = function () { idbReady = true; resolve(req.result); };
      req.onerror = function () { idbFailed = true; reject(req.error || new Error('No se pudo abrir IndexedDB')); };
      req.onblocked = function () { idbFailed = true; reject(new Error('IndexedDB bloqueada')); };
    });
    return dbPromise;
  }
  function idbRequest(db, store, mode, run) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, mode), os = tx.objectStore(store), result;
      try { result = run(os); } catch (e) { reject(e); return; }
      tx.oncomplete = function () { resolve(result && result.result !== undefined ? result.result : undefined); };
      tx.onerror = function () { reject(tx.error || new Error('Error de IndexedDB')); };
      tx.onabort = function () { reject(tx.error || new Error('Transaccion abortada')); };
    });
  }
  function idbGet(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.get(key); }) });
  }
  function idbGetAll(store) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.getAll(); }) });
  }
  function idbPut(store, key, value) {
    return idbOpen().then(function (db) {
      return idbRequest(db, store, 'readwrite', function (os) { return key === undefined ? os.put(value) : os.put(value, key) });
    });
  }
  function idbDelete(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readwrite', function (os) { return os.delete(key); }) });
  }
  var LIGHT_KEYS = [LS_LANG, LS_MEASURE_UNIT];
  var HEAVY_KEYS = [LS_DAYS, LS_LIFTS, LS_CONFIG, LS_CARDIO_CONFIG, LS_PLAN, LS_MEASURES, LS_TEMPLATES];

  function dumpLocal() {
    var dump = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); dump[k] = localStorage.getItem(k); } } catch (e) {}
    return dump;
  }
  /* Solo preferencias ligeras: nunca se intenta escribir el estado en
     localStorage (puede no haber cuota, pero IndexedDB sí). */
  function lightDump() {
    var out = {};
    try { LIGHT_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) out[k] = v; }); } catch (e) {}
    return out;
  }
  function syncPreferencesToMemory() {
    var p = lightDump();
    if (!memoryDump) memoryDump = {};
    Object.keys(p).forEach(function (k) { memoryDump[k] = p[k]; });
  }
  function savePreferences() {
    try {
      var p = lightDump();
      Object.keys(p).forEach(function (k) { localStorage.setItem(k, p[k]); });
    } catch (e) { /* Preferencia ligera: no es un fallo de persistencia. */ }
  }
  function pruneLocalState() {
    try { HEAVY_KEYS.forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
  }
  function applyDump(dump) {
    Object.keys(dump || {}).forEach(function (k) {
      try { if (dump[k] !== null && dump[k] !== undefined) localStorage.setItem(k, dump[k]); } catch (e) {}
    });
  }
  function writeIDB(dump) {
    var attempt = writeChain.then(function () {
      return idbPut(STORE_STATE, STATE_KEY, {
        schemaVersion: SCHEMA_VERSION, app: 'pulsefit', localStorage: dump,
        updatedAt: new Date().toISOString()
      });
    });
    writeChain = attempt.catch(function () {});
    return attempt.then(function () {
      clearStorageError();
    }, function (e) {
      idbFailed = true;
      emitStorageError(e, 'IndexedDB');
    });
  }
  function initIDB() {
    if (initPromise) return initPromise;
    initPromise = idbOpen().then(function () { return idbGet(STORE_STATE, STATE_KEY); })
      .then(function (rec) {
        if (!rec) {
          /* Migración única: lo que hubiera en localStorage pasa a IndexedDB
             y después se liberan las claves pesadas. */
          memoryDump = dumpLocal();
          syncPreferencesToMemory();
          return writeIDB(memoryDump).then(function () { pruneLocalState(); });
        }
        memoryDump = (rec.localStorage && typeof rec.localStorage === 'object') ? rec.localStorage : {};
        syncPreferencesToMemory();
        pruneLocalState();
      }).catch(function (e) {
        idbFailed = true;
        emitStorageError(e, 'IndexedDB (init)');
      });
    return initPromise;
  }
  function whenReady() { return initIDB(); }
  function putFile(id, data, meta) {
    var rec = {
      id: String(id), data: data, type: (meta && meta.type) || '', name: (meta && meta.name) || '',
      size: typeof data === 'string' ? data.length : ((data && data.size) || 0),
      schemaVersion: SCHEMA_VERSION, createdAt: new Date().toISOString()
    };
    return idbPut(STORE_FILES, undefined, rec);
  }
  function getFile(id) { return idbGet(STORE_FILES, String(id)); }
  function listFiles() { return idbGetAll(STORE_FILES); }
  function deleteFile(id) { return idbDelete(STORE_FILES, String(id)); }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { var d = new Date(); d.setHours(12, 0, 0, 0); return d; }

  // Fecha local (nunca toISOString(), que desplaza el día según la zona UTC).
  function todayIso() { return iso(today()); }

  // Acepta solo claves YYYY-MM-DD reales; cualquier otro valor vuelve a hoy.
  function normalizeDate(value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      var p = value.split('-');
      var y = +p[0], m = +p[1] - 1, dd = +p[2];
      var d = new Date(y, m, dd, 12, 0, 0, 0);
      if (d.getFullYear() === y && d.getMonth() === m && d.getDate() === dd) return value;
    }
    return todayIso();
  }

  // Campos del constructor dinámico de cardio que deben sobrevivir a export/import.
  var CARDIO_DETAIL_FIELDS = {
    detail: 'entreno',
    notes: 'notes',
    state: 'detailFields'
  };

  function normalizeCardioDetail(record, data) {
    if (!data) return record;
    if (Object.prototype.hasOwnProperty.call(data, CARDIO_DETAIL_FIELDS.detail)) {
      record[CARDIO_DETAIL_FIELDS.detail] = typeof data.entreno === 'string' ? data.entreno : '';
    }
    if (Object.prototype.hasOwnProperty.call(data, CARDIO_DETAIL_FIELDS.notes)) {
      record[CARDIO_DETAIL_FIELDS.notes] = typeof data.notes === 'string' ? data.notes : '';
    }
    var state = data[CARDIO_DETAIL_FIELDS.state];
    if (state && typeof state === 'object') {
      record[CARDIO_DETAIL_FIELDS.state] = {
        activity: state.activity || '',
        values: (state.values && typeof state.values === 'object') ? state.values : {}
      };
    }
    return record;
  }

  // Construye registros cuya propiedad `date` es exactamente la fecha elegida.
  function makeDayRecord(date, data) {
    var record = {};
    Object.keys(data || {}).forEach(function (k) { if (k !== 'date') record[k] = data[k]; });
    record.date = normalizeDate(date);
    normalizeCardioDetail(record, data);
    return record;
  }

  function makeLiftRecord(date, data) {
    var record = makeDayRecord(date, data);
    if (record.ts == null) record.ts = Date.now();
    return record;
  }

  function saveDay(days, date, data) {
    var record = makeDayRecord(date, data);
    days[record.date] = record;
    saveDays(days);
    return record;
  }

  function addLift(lifts, date, data) {
    var record = makeLiftRecord(date, data);
    var id = record.date + '-' + Math.random().toString(36).slice(2, 8);
    lifts[id] = record;
    saveLifts(lifts);
    return { id: id, lift: record };
  }

  // Reemplaza exactamente la sesión indicada. Si cambió la fecha, se mueve la
  // clave antigua para no dejar un duplicado en el historial.
  function updateDay(days, oldDate, date, data) {
    var record = makeDayRecord(date, data);
    if (oldDate && oldDate !== record.date) delete days[oldDate];
    days[record.date] = record;
    saveDays(days);
    return record;
  }

  function deleteDay(days, date) {
    if (!Object.prototype.hasOwnProperty.call(days || {}, date)) return false;
    delete days[date];
    saveDays(days);
    return true;
  }

  // Actualiza una serie concreta conservando su id y su marca de tiempo original.
  function updateLift(lifts, id, date, data) {
    if (!lifts || !Object.prototype.hasOwnProperty.call(lifts, id)) return null;
    var previousTs = lifts[id] && lifts[id].ts;
    var record = makeLiftRecord(date, data);
    record.ts = previousTs || record.ts;
    lifts[id] = record;
    saveLifts(lifts);
    return { id: id, lift: record };
  }

  function deleteLift(lifts, id) {
    if (!lifts || !Object.prototype.hasOwnProperty.call(lifts, id)) return false;
    delete lifts[id];
    saveLifts(lifts);
    return true;
  }

  function getLiftsByDate(lifts, date) {
    var key = normalizeDate(date), out = [];
    Object.keys(lifts || {}).forEach(function (id) {
      var v = lifts[id];
      if (v && v.date === key) out.push({ id: id, v: v });
    });
    return out.sort(function (a, b) {
      if (a.v.date !== b.v.date) return a.v.date < b.v.date ? -1 : 1;
      return (a.v.ts || 0) - (b.v.ts || 0);
    });
  }

  // Orden cronológico por fecha real del entrenamiento (claves ISO YYYY-MM-DD).
  function sortByDateAsc(items, getDate) {
    return (items || []).slice().sort(function (a, b) {
      var da = String(getDate ? getDate(a) : ((a && a.date) || ''));
      var db = String(getDate ? getDate(b) : ((b && b.date) || ''));
      if (da === db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da < db ? -1 : 1;
    });
  }

  /* ---------- plan semanal / calendario ---------- */
  // El plan guarda overrides por día de semana (0=lunes) y por fecha concreta.
  // `mode: auto` significa "seguir las rutinas activas de pesas y cardio" y no se persiste.
  // `mode: combo` indica pesas + cardio en el mismo día.
  function defaultPlan() {
    return { weekdays: {}, dates: {} };
  }

  function normalizePlan(p) {
    var out = defaultPlan();
    if (!p || typeof p !== 'object') return out;
    function cleanEntry(e) {
      if (!e || typeof e !== 'object') return null;
      var modes = ['rest', 'cardio', 'routine', 'combo'];
      var mode = modes.indexOf(e.mode) >= 0 ? e.mode : 'auto';
      if (mode === 'auto') return null;
      var clean = { mode: mode, name: typeof e.name === 'string' ? e.name : '' };
      // `weights` guarda la opción elegida (sesión/división) y `cardio`
      // permite añadir/quitar la sesión de cardio a una jornada concreta.
      if (typeof e.weights === 'string' && e.weights.length <= 120) clean.weights = e.weights;
      if (typeof e.templateId === 'string' && e.templateId.length <= 80) clean.templateId = e.templateId;
      if (typeof e.cardio === 'boolean') clean.cardio = e.cardio;
      else if (typeof e.cardio === 'string' && e.cardio.length <= 80) clean.cardio = e.cardio;
      return clean;
    }
    if (p.weekdays && typeof p.weekdays === 'object') {
      Object.keys(p.weekdays).forEach(function (k) {
        var i = parseInt(k, 10);
        if (i < 0 || i > 6) return;
        var e = cleanEntry(p.weekdays[k]);
        if (e) out.weekdays[String(i)] = e;
      });
    }
    if (p.dates && typeof p.dates === 'object') {
      Object.keys(p.dates).forEach(function (k) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
        var e = cleanEntry(p.dates[k]);
        if (e) out.dates[k] = e;
      });
    }
    return out;
  }

  function loadPlan() {
    return normalizePlan(load(LS_PLAN));
  }

  function savePlan(plan) {
    save(LS_PLAN, normalizePlan(plan));
  }

  /* ---------- medidas corporales ---------- */
  function loadMeasures() {
    return load(LS_MEASURES);
  }

  function saveMeasures(measures) {
    save(LS_MEASURES, measures);
  }

  function addMeasure(measures, data) {
    var record = makeDayRecord(data && data.date, data);
    if (record.ts == null) record.ts = Date.now();
    var id = record.date + '-' + Math.random().toString(36).slice(2, 8);
    measures[id] = record;
    saveMeasures(measures);
    return { id: id, measure: record };
  }

  function deleteMeasure(measures, id) {
    if (!measures || !Object.prototype.hasOwnProperty.call(measures, id)) return false;
    delete measures[id];
    saveMeasures(measures);
    return true;
  }

  function getMeasuresAsc(measures) {
    return sortByDateAsc(Object.keys(measures || {}).map(function (id) {
      var v = measures[id];
      return v ? { id: id, v: v } : null;
    }).filter(Boolean), function (it) { return it.v.date; });
  }

  /* ---------- plantillas de rutinas (Etapa 2) ---------- */
  // Las plantillas viven en su propio store de IndexedDB y se espejan en
  // localStorage para que export/import funcione sin cambios de formato.
  function normalizeTemplate(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var id = (typeof raw.id === 'string' && raw.id) ? raw.id :
      ('tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7));
    var name = String(raw.name || '').trim().slice(0, 80);
    if (!name) return null;
    var sessions = [];
    if (Array.isArray(raw.sessions)) {
      raw.sessions.slice(0, 40).forEach(function (s) {
        if (!s || typeof s !== 'object') return;
        var exercises = [];
        if (Array.isArray(s.exercises)) {
          s.exercises.slice(0, 30).forEach(function (ex) {
            if (!ex || typeof ex !== 'object') return;
            var exName = String(ex.name || '').trim().slice(0, 120);
            var key = String(ex.key || '').slice(0, 80);
            if (!exName && !key) return;
            exercises.push({
              key: key,
              name: exName || key,
              sets: Math.max(0, Math.min(99, Number(ex.sets) || 0)),
              reps: Math.max(0, Math.min(999, Number(ex.reps) || 0)),
              setsReps: String(ex.setsReps || '').slice(0, 40)
            });
          });
        }
        sessions.push({
          dayKey: Number.isInteger(s.dayKey) ? s.dayKey : null,
          name: String(s.name || '').trim().slice(0, 80),
          exercises: exercises
        });
      });
    }
    return {
      id: String(id).slice(0, 80),
      name: name,
      source: String(raw.source || '').slice(0, 80),
      split: String(raw.split || '').slice(0, 40),
      goal: String(raw.goal || '').slice(0, 40),
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
      sessions: sessions
    };
  }

  function loadTemplates() {
    var raw = load(LS_TEMPLATES);
    var list = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.templates) ? raw.templates : []);
    return list.map(normalizeTemplate).filter(Boolean);
  }

  function saveTemplates(list) {
    var clean = (Array.isArray(list) ? list : []).map(normalizeTemplate).filter(Boolean);
    save(LS_TEMPLATES, clean);
    var attempt = templateChain.then(function () { return idbOpen(); }).then(function (db) {
      return idbRequest(db, STORE_TEMPLATES, 'readwrite', function (os) {
        os.clear();
        clean.forEach(function (tpl) { os.put(tpl); });
      });
    });
    templateChain = attempt.catch(function () {});
    return attempt.then(function () {
      clearStorageError();
    }, function (e) {
      idbFailed = true;
      emitStorageError(e, 'IndexedDB (plantillas)');
    });
  }

  function loadTemplatesFromIDB() {
    return idbGetAll(STORE_TEMPLATES).then(function (rows) {
      return (rows || []).map(normalizeTemplate).filter(Boolean);
    }).catch(function () { return []; });
  }

  function clearTemplatesIDB() {
    var attempt = templateChain.then(function () { return idbOpen(); }).then(function (db) {
      return idbRequest(db, STORE_TEMPLATES, 'readwrite', function (os) { os.clear(); });
    });
    templateChain = attempt.catch(function () {});
    return attempt.then(function () {
      clearStorageError();
    }, function (e) {
      idbFailed = true;
      emitStorageError(e, 'IndexedDB (plantillas)');
    });
  }

  // Reinicio explícito: se van también las claves nuevas (plan, medidas, unidad y plantillas).
  function resetAllData() {
    [LS_DAYS, LS_LIFTS, LS_CONFIG, LS_CARDIO_CONFIG, LS_PLAN, LS_MEASURES, LS_MEASURE_UNIT, LS_TEMPLATES].forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    if (memoryDump) HEAVY_KEYS.forEach(function (k) { delete memoryDump[k]; });
    clearTemplatesIDB();
    var pf = window.PulseFit || {};
    if (pf.setDays) pf.setDays({});
    if (pf.setLifts) pf.setLifts({});
    if (pf.setPlan) pf.setPlan(defaultPlan());
    if (pf.setMeasures) pf.setMeasures({});
    if (pf.setMeasureUnit) pf.setMeasureUnit('kg');
    if (pf.setTemplates) pf.setTemplates([]);
    if (pf.render) pf.render();
    writeIDB(memoryDump || dumpLocal());
    var sayFn = pf.say || function () {};
    var tFn = pf.t || function (k) { return k; };
    sayFn('backupMsg', tFn('resetDataDone'));
  }

  function load(key) {
    initIDB();
    try {
      /* Lee la copia en memoria alimentada desde IndexedDB; solo antes de
         que termine la migración se consulta localStorage. */
      var raw = (memoryDump && Object.prototype.hasOwnProperty.call(memoryDump, key)) ?
        memoryDump[key] : localStorage.getItem(key);
      var g = JSON.parse(raw || 'null');
      return g && typeof g === 'object' ? g : {};
    } catch (e) {
      return {};
    }
  }

  function save(key, obj) {
    initIDB();
    if (!memoryDump) memoryDump = dumpLocal();
    memoryDump[key] = JSON.stringify(obj);
    /* Escritura principal: IndexedDB recibe el estado directamente, sin
       depender de que localStorage tenga espacio libre. */
    writeIDB(memoryDump);
    savePreferences();
    return !lastStorageError && !idbFailed;
  }

  function loadDays() {
    return load(LS_DAYS);
  }

  function saveDays(days) {
    save(LS_DAYS, days);
  }

  function loadLifts() {
    return load(LS_LIFTS);
  }

  function saveLifts(lifts) {
    save(LS_LIFTS, lifts);
  }

  function loadConfig(targetConfig, validGoals, validSplits) {
    try {
      var g = load(LS_CONFIG);
      if (g && typeof g === 'object') {
        if (g.goal && (!validGoals || validGoals[g.goal])) targetConfig.goal = g.goal;
        if (g.split && (!validSplits || validSplits[g.split])) targetConfig.split = g.split;
        if (Array.isArray(g.equipment) && g.equipment.length) targetConfig.equipment = g.equipment;
        if (typeof g.name === 'string' && g.name.length <= 80) targetConfig.name = g.name;
        else delete targetConfig.name;
        if (typeof g.activeTemplateId === 'string' && g.activeTemplateId.length <= 80) targetConfig.activeTemplateId = g.activeTemplateId;
        else delete targetConfig.activeTemplateId;
      }
    } catch (e) {}
    return targetConfig;
  }

  function saveConfig(targetConfig) {
    save(LS_CONFIG, targetConfig);
  }

  function loadCardioConfig(targetCardioConfig, validGoals) {
    try {
      var g = load(LS_CARDIO_CONFIG);
      if (g && typeof g === 'object') {
        if (g.goal && (!validGoals || validGoals[g.goal])) targetCardioConfig.goal = g.goal;
        if (Array.isArray(g.equipment) && g.equipment.length) targetCardioConfig.equipment = g.equipment;
        // Preferencias del plan de cardio que también consume el plan semanal.
        ['plan', 'mode', 'enabled'].forEach(function (k) { delete targetCardioConfig[k]; });
        delete targetCardioConfig.days;
        if (typeof g.plan === 'string' && g.plan.length <= 40) targetCardioConfig.plan = g.plan;
        if (typeof g.mode === 'string' && g.mode.length <= 40) targetCardioConfig.mode = g.mode;
        if (typeof g.enabled === 'boolean') targetCardioConfig.enabled = g.enabled;
        if (Array.isArray(g.days)) {
          targetCardioConfig.days = g.days.filter(function (d) {
            return Number.isInteger(d) && d >= 0 && d <= 6;
          });
        } else if (g.days && typeof g.days === 'object') {
          var picked = {};
          Object.keys(g.days).forEach(function (k) {
            var i = parseInt(k, 10);
            if (i >= 0 && i <= 6 && g.days[k]) picked[String(i)] = true;
          });
          targetCardioConfig.days = picked;
        } else if (typeof g.days === 'string' && g.days.length <= 40) {
          targetCardioConfig.days = g.days;
        }
      }
    } catch (e) {}
    return targetCardioConfig;
  }

  function saveCardioConfig(targetCardioConfig) {
    save(LS_CARDIO_CONFIG, targetCardioConfig);
  }

  function exportBackup() {
    try {
      var dump = {};
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        try {
          dump[k] = JSON.parse(localStorage.getItem(k));
        } catch (e) {
          dump[k] = localStorage.getItem(k);
        }
      }

      var state = (window.PulseFit && window.PulseFit.getState) ? window.PulseFit.getState() : {};
      var curDays = state.days || load(LS_DAYS);
      var curLifts = state.lifts || load(LS_LIFTS);
      var curLang = state.curLang || localStorage.getItem(LS_LANG) || 'es';
      var curRoutineConfig = state.routineConfig || load(LS_CONFIG);
      var curCardioConfig = state.cardioConfig || load(LS_CARDIO_CONFIG);
      var curPlan = state.weeklyPlan || loadPlan();
      var curMeasures = state.measures || loadMeasures();
      var curMeasureUnit = state.measureUnit || localStorage.getItem(LS_MEASURE_UNIT) || 'kg';
      var curTemplates = state.templates || state.routineTemplates || loadTemplates();

      var backupData = {
        app: 'PulseFit',
        appId: 'pulsefit',
        schemaVersion: SCHEMA_VERSION,
        version: 4,
        exportDate: iso(today()),
        exportedAt: new Date().toISOString(),
        days: curDays,
        lifts: curLifts,
        weeklyPlan: curPlan,
        measures: curMeasures,
        templates: curTemplates,
        routineTemplates: curTemplates,
        pulsefit_lang: curLang,
        pulsefit_routine_config: curRoutineConfig,
        pulsefit_cardio_config: curCardioConfig,
        pulsefit_weekly_plan: curPlan,
        pulsefit_body_measures: curMeasures,
        pulsefit_measure_unit: curMeasureUnit,
        pulsefit_routine_templates_v2: curTemplates,
        pulsefit_routine_templates: curTemplates,
        localStorage: dump
      };

      var jsonStr = JSON.stringify(backupData, null, 2);
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'pulsefit-backup-' + iso(today()) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      var tFn = (window.PulseFit && window.PulseFit.t) || function (k) { return k; };
      var sayFn = (window.PulseFit && window.PulseFit.say) || function () {};
      sayFn('backupMsg', tFn('backupExportSuccess'));
    } catch (err) {
      var sayFn = (window.PulseFit && window.PulseFit.say) || function () {};
      sayFn('backupMsg', 'Error', true);
    }
  }

  /* Valida origen/estructura del respaldo antes de escribir nada. */
  function validateBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { ok: false, msgText: 'El archivo no contiene un respaldo válido.' };
    }
    if (data.app && String(data.app).toLowerCase() !== 'pulsefit') {
      return { ok: false, msgText: 'Este respaldo pertenece a otra aplicación y no se importará.' };
    }
    if (data.appId && String(data.appId).toLowerCase() !== 'pulsefit') {
      return { ok: false, msgText: 'Este respaldo pertenece a otra aplicación y no se importará.' };
    }
    var sv = data.schemaVersion == null ? (typeof data.version === 'number' ? data.version : 1) : Number(data.schemaVersion);
    if (!isFinite(sv) || sv < 1 || sv > SCHEMA_VERSION) {
      return { ok: false, msgText: 'La versión de esquema del respaldo no es compatible.' };
    }
    var fields = ['days', 'lifts', 'weeklyPlan', 'measures', 'templates', 'routineTemplates', 'pulsefit_routine_templates', 'pulsefit_routine_templates_v2', 'localStorage', 'pulsefit_routine_config', 'pulsefit_cardio_config'];
    if (!fields.some(function (k) { return data[k] !== undefined; })) {
      return { ok: false, msgText: 'El respaldo está incompleto: no se reconocen registros de PulseFit.' };
    }
    if (data.days !== undefined && (typeof data.days !== 'object' || Array.isArray(data.days))) {
      return { ok: false, msgText: 'El respaldo está dañado: los entrenamientos no son válidos.' };
    }
    if (data.lifts !== undefined && (typeof data.lifts !== 'object' || Array.isArray(data.lifts))) {
      return { ok: false, msgText: 'El respaldo está dañado: las pesadas no son válidas.' };
    }
    if (data.localStorage !== undefined && (typeof data.localStorage !== 'object' || Array.isArray(data.localStorage))) {
      return { ok: false, msgText: 'El respaldo está dañado: el estado local no es válido.' };
    }
    var rawTemplates = data.templates || data.routineTemplates || data.pulsefit_routine_templates_v2 || data.pulsefit_routine_templates || (data.localStorage && (data.localStorage[LS_TEMPLATES] || data.localStorage.pulsefit_routine_templates || data.localStorage.pulsefit_routine_templates_v2 || data.localStorage.templates || data.localStorage.routineTemplates));
    if (rawTemplates !== undefined && !Array.isArray(rawTemplates) &&
        !(rawTemplates && Array.isArray(rawTemplates.templates))) {
      return { ok: false, msgText: 'El respaldo está dañado: las plantillas no son válidas.' };
    }
    return { ok: true, version: sv };
  }
  function restoreLocal(dump) {
    /* Restaura la fuente en memoria y la refleja en IndexedDB; nunca revive
       claves pesadas en localStorage. */
    memoryDump = JSON.parse(JSON.stringify(dump || {}));
    syncPreferencesToMemory();
    writeIDB(memoryDump);
  }

  function handleImportFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      var tFn = (window.PulseFit && window.PulseFit.t) || function (k) { return k; };
      var sayFn = (window.PulseFit && window.PulseFit.say) || function () {};
      /* Copia de seguridad en memoria (localStorage + estado vivo) antes de
         sobrescribir nada: los setters de app.js mutan referencias compartidas. */
      memoryBackup = JSON.parse(JSON.stringify(memoryDump || dumpLocal()));
      var memState = null;
      try {
        memState = (window.PulseFit && window.PulseFit.getState) ?
          JSON.parse(JSON.stringify(window.PulseFit.getState())) : null;
      } catch (e) {}
      try {
        var raw = evt.target.result;
        var parsed = JSON.parse(raw);
        var check = validateBackup(parsed);
        if (!check.ok) throw new Error(check.msgText);

        if (parsed.localStorage && typeof parsed.localStorage === 'object') {
          if (!memoryDump) memoryDump = dumpLocal();
          Object.keys(parsed.localStorage).forEach(function (k) {
            var val = parsed.localStorage[k];
            if (val === null || val === undefined) delete memoryDump[k];
            else memoryDump[k] = (typeof val === 'object') ? JSON.stringify(val) : String(val);
          });
          writeIDB(memoryDump);
        }

        var newDays = parsed.days || parsed.cf_days || (parsed.localStorage && (parsed.localStorage.cf_days || parsed.localStorage.days));
        var newLifts = parsed.lifts || parsed.cf_lifts || (parsed.localStorage && (parsed.localStorage.cf_lifts || parsed.localStorage.lifts));

        if (newDays && typeof newDays === 'object') {
          save(LS_DAYS, newDays);
          if (window.PulseFit && window.PulseFit.setDays) {
            window.PulseFit.setDays(newDays);
          }
        }
        if (newLifts && typeof newLifts === 'object') {
          save(LS_LIFTS, newLifts);
          if (window.PulseFit && window.PulseFit.setLifts) {
            window.PulseFit.setLifts(newLifts);
          }
        }

        var newConfig = parsed.pulsefit_routine_config || (parsed.localStorage && parsed.localStorage.pulsefit_routine_config);
        if (newConfig && typeof newConfig === 'object') {
          if (window.PulseFit && window.PulseFit.setRoutineConfig) {
            window.PulseFit.setRoutineConfig(newConfig);
          } else {
            save(LS_CONFIG, newConfig);
          }
        }

        var newCardioConfig = parsed.pulsefit_cardio_config || (parsed.localStorage && parsed.localStorage.pulsefit_cardio_config);
        if (newCardioConfig && typeof newCardioConfig === 'object') {
          if (window.PulseFit && window.PulseFit.setCardioConfig) {
            window.PulseFit.setCardioConfig(newCardioConfig);
          } else {
            save(LS_CARDIO_CONFIG, newCardioConfig);
          }
        }

        var newPlan = parsed.weeklyPlan || parsed.pulsefit_weekly_plan ||
          (parsed.localStorage && (parsed.localStorage.pulsefit_weekly_plan || parsed.localStorage.weeklyPlan));
        if (newPlan && typeof newPlan === 'object') {
          var normalizedPlan = normalizePlan(newPlan);
          save(LS_PLAN, normalizedPlan);
          if (window.PulseFit && window.PulseFit.setPlan) window.PulseFit.setPlan(normalizedPlan);
        } else {
          if (memoryDump) delete memoryDump[LS_PLAN];
          if (window.PulseFit && window.PulseFit.setPlan) window.PulseFit.setPlan(defaultPlan());
        }

        var newMeasures = parsed.measures || parsed.pulsefit_body_measures ||
          (parsed.localStorage && (parsed.localStorage.pulsefit_body_measures || parsed.localStorage.measures));
        if (newMeasures && typeof newMeasures === 'object') {
          save(LS_MEASURES, newMeasures);
          if (window.PulseFit && window.PulseFit.setMeasures) window.PulseFit.setMeasures(newMeasures);
        } else {
          if (memoryDump) delete memoryDump[LS_MEASURES];
          if (window.PulseFit && window.PulseFit.setMeasures) window.PulseFit.setMeasures({});
        }

        var newMeasureUnit = parsed.pulsefit_measure_unit ||
          (parsed.localStorage && parsed.localStorage.pulsefit_measure_unit);
        if (newMeasureUnit === 'kg' || newMeasureUnit === 'lb') {
          try { localStorage.setItem(LS_MEASURE_UNIT, newMeasureUnit); } catch (e) {}
          syncPreferencesToMemory();
          if (window.PulseFit && window.PulseFit.setMeasureUnit) window.PulseFit.setMeasureUnit(newMeasureUnit);
        }

        // Etapa 2: las plantillas viajan en el respaldo y se sincronizan con
        // el store IndexedDB mediante el setter público de app.js.
        var newTemplates = parsed.templates || parsed.routineTemplates || parsed.pulsefit_routine_templates_v2 || parsed.pulsefit_routine_templates || (parsed.localStorage && (parsed.localStorage[LS_TEMPLATES] || parsed.localStorage.pulsefit_routine_templates || parsed.localStorage.pulsefit_routine_templates_v2 || parsed.localStorage.templates || parsed.localStorage.routineTemplates));
        if (Array.isArray(newTemplates) || (newTemplates && Array.isArray(newTemplates.templates))) {
          var cleaned = (Array.isArray(newTemplates) ? newTemplates : newTemplates.templates)
            .map(normalizeTemplate).filter(Boolean);
          if (window.PulseFit && window.PulseFit.setTemplates) {
            window.PulseFit.setTemplates(cleaned);
            saveTemplates(cleaned);
          } else {
            saveTemplates(cleaned);
          }
        } else if (window.PulseFit && window.PulseFit.setTemplates) {
          window.PulseFit.setTemplates([]);
          saveTemplates([]);
        }

        var newLang = parsed.pulsefit_lang || (parsed.localStorage && parsed.localStorage.pulsefit_lang);
        var supported = (window.PulseFit && window.PulseFit.SUPPORTED_LANGS) || ['es', 'en', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
        if (newLang && supported.indexOf(newLang) >= 0) {
          if (window.PulseFit && window.PulseFit.applyLang) {
            window.PulseFit.applyLang(newLang);
          }
        } else if (window.PulseFit && window.PulseFit.render) {
          window.PulseFit.render();
        }

        memoryBackup = null;
        sayFn('backupMsg', tFn('backupImportSuccess'));
      } catch (err) {
        if (memoryBackup) restoreLocal(memoryBackup);
        var pf = window.PulseFit || {};
        if (memState) {
          if (pf.setDays) pf.setDays(memState.days || {});
          if (pf.setLifts) pf.setLifts(memState.lifts || {});
          if (pf.setPlan) pf.setPlan(memState.weeklyPlan || defaultPlan());
          if (pf.setMeasures) pf.setMeasures(memState.measures || {});
          if (pf.setRoutineConfig) pf.setRoutineConfig(memState.routineConfig || {});
          if (pf.setCardioConfig) pf.setCardioConfig(memState.cardioConfig || {});
          if (pf.setMeasureUnit) pf.setMeasureUnit(memState.measureUnit || 'kg');
          if (pf.setTemplates) pf.setTemplates(memState.templates || []);
          saveTemplates(memState.templates || []);
          try { localStorage.setItem(LS_MEASURE_UNIT, memState.measureUnit || 'kg'); } catch (e) {}
          syncPreferencesToMemory();
          if (pf.applyLang && memState.curLang) pf.applyLang(memState.curLang);
          else if (pf.render) pf.render();
        }
        writeIDB(memoryDump || dumpLocal());
        sayFn('backupMsg', (err && err.message && err.message.indexOf('respaldo') >= 0) ? err.message : tFn('backupImportError'), true);
      } finally {
        var inp = document.getElementById('importInput');
        if (inp) inp.value = '';
      }
    };
    reader.readAsText(file);
  }

  function initBackupEvents() {
    var btnExp = document.getElementById('btnExportBackup');
    if (btnExp) {
      btnExp.addEventListener('click', exportBackup);
    }
    var btnImp = document.getElementById('btnImportBackup');
    if (btnImp) {
      btnImp.addEventListener('click', function () {
        var inp = document.getElementById('importInput');
        if (inp) inp.click();
      });
    }
    var inp = document.getElementById('importInput');
    if (inp) {
      inp.addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        if (f) handleImportFile(f);
      });
    }
    var btnReset = document.getElementById('btnResetData');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        var tFn = (window.PulseFit && window.PulseFit.t) || function (k) { return k; };
        if (window.confirm(tFn('resetDataConfirm'))) resetAllData();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackupEvents);
  } else {
    initBackupEvents();
  }

  var PulseFitStorage = {
    KEYS: {
      DAYS: LS_DAYS,
      LIFTS: LS_LIFTS,
      LANG: LS_LANG,
      CONFIG: LS_CONFIG,
      CARDIO_CONFIG: LS_CARDIO_CONFIG,
      PLAN: LS_PLAN,
      MEASURES: LS_MEASURES,
      MEASURE_UNIT: LS_MEASURE_UNIT,
      TEMPLATES: LS_TEMPLATES
    },
    load: load,
    save: save,
    todayIso: todayIso,
    normalizeDate: normalizeDate,
    makeDayRecord: makeDayRecord,
    normalizeCardioDetail: normalizeCardioDetail,
    makeLiftRecord: makeLiftRecord,
    saveDay: saveDay,
    updateDay: updateDay,
    deleteDay: deleteDay,
    addLift: addLift,
    updateLift: updateLift,
    deleteLift: deleteLift,
    getLiftsByDate: getLiftsByDate,
    sortByDateAsc: sortByDateAsc,
    loadDays: loadDays,
    saveDays: saveDays,
    loadLifts: loadLifts,
    saveLifts: saveLifts,
    loadConfig: loadConfig,
    saveConfig: saveConfig,
    loadCardioConfig: loadCardioConfig,
    saveCardioConfig: saveCardioConfig,
    defaultPlan: defaultPlan,
    normalizePlan: normalizePlan,
    loadPlan: loadPlan,
    savePlan: savePlan,
    loadMeasures: loadMeasures,
    saveMeasures: saveMeasures,
    addMeasure: addMeasure,
    deleteMeasure: deleteMeasure,
    getMeasuresAsc: getMeasuresAsc,
    normalizeTemplate: normalizeTemplate,
    normalizeTemplates: function(list){ return (Array.isArray(list)?list:[]).map(normalizeTemplate).filter(Boolean); },
    loadTemplates: loadTemplates,
    saveTemplates: saveTemplates,
    loadTemplatesFromIDB: loadTemplatesFromIDB,
    resetAllData: resetAllData,
    exportBackup: exportBackup,
    handleImportFile: handleImportFile,
    validateBackup: validateBackup,
    initBackupEvents: initBackupEvents,
    /* Etapa 1: almacenamiento durable y sin limite de 5 MB */
    DB_NAME: DB_NAME,
    SCHEMA_VERSION: SCHEMA_VERSION,
    whenReady: whenReady,
    isIndexedDBReady: function () { return idbReady && !idbFailed; },
    /* Fallo real de persistencia: callback y evento `onStorageError`. */
    STORAGE_ERROR_MESSAGE: STORAGE_ERROR_MESSAGE,
    get onStorageError() { return storageErrorHandler; },
    set onStorageError(fn) { storageErrorHandler = typeof fn === 'function' ? fn : null; },
    lastStorageError: function () { return lastStorageError; },
    isStorageHealthy: function () { return !lastStorageError && !idbFailed; },
    putFile: putFile,
    getFile: getFile,
    listFiles: listFiles,
    deleteFile: deleteFile
  };

  window.PulseFitStorage = PulseFitStorage;
  window.PulseFit.Storage = PulseFitStorage;
})();
