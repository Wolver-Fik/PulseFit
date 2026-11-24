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

  // Reinicio explícito: se van también las claves nuevas (plan, medidas y unidad).
  function resetAllData() {
    [LS_DAYS, LS_LIFTS, LS_CONFIG, LS_CARDIO_CONFIG, LS_PLAN, LS_MEASURES, LS_MEASURE_UNIT].forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    var pf = window.PulseFit || {};
    if (pf.setDays) pf.setDays({});
    if (pf.setLifts) pf.setLifts({});
    if (pf.setPlan) pf.setPlan(defaultPlan());
    if (pf.setMeasures) pf.setMeasures({});
    if (pf.setMeasureUnit) pf.setMeasureUnit('kg');
    if (pf.render) pf.render();
    var sayFn = pf.say || function () {};
    var tFn = pf.t || function (k) { return k; };
    sayFn('backupMsg', tFn('resetDataDone'));
  }

  function load(key) {
    try {
      var g = JSON.parse(localStorage.getItem(key) || 'null');
      return g && typeof g === 'object' ? g : {};
    } catch (e) {
      return {};
    }
  }

  function save(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
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
      var g = JSON.parse(localStorage.getItem(LS_CONFIG));
      if (g && typeof g === 'object') {
        if (g.goal && (!validGoals || validGoals[g.goal])) targetConfig.goal = g.goal;
        if (g.split && (!validSplits || validSplits[g.split])) targetConfig.split = g.split;
        if (Array.isArray(g.equipment) && g.equipment.length) targetConfig.equipment = g.equipment;
      }
    } catch (e) {}
    return targetConfig;
  }

  function saveConfig(targetConfig) {
    save(LS_CONFIG, targetConfig);
  }

  function loadCardioConfig(targetCardioConfig, validGoals) {
    try {
      var g = JSON.parse(localStorage.getItem(LS_CARDIO_CONFIG));
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

      var backupData = {
        app: 'PulseFit',
        version: 3,
        exportDate: iso(today()),
        exportedAt: new Date().toISOString(),
        days: curDays,
        lifts: curLifts,
        weeklyPlan: curPlan,
        measures: curMeasures,
        pulsefit_lang: curLang,
        pulsefit_routine_config: curRoutineConfig,
        pulsefit_cardio_config: curCardioConfig,
        pulsefit_weekly_plan: curPlan,
        pulsefit_body_measures: curMeasures,
        pulsefit_measure_unit: curMeasureUnit,
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

  function handleImportFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      var tFn = (window.PulseFit && window.PulseFit.t) || function (k) { return k; };
      var sayFn = (window.PulseFit && window.PulseFit.say) || function () {};
      try {
        var raw = evt.target.result;
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid format');

        if (parsed.localStorage && typeof parsed.localStorage === 'object') {
          Object.keys(parsed.localStorage).forEach(function (k) {
            var val = parsed.localStorage[k];
            if (typeof val === 'object') {
              localStorage.setItem(k, JSON.stringify(val));
            } else if (val != null) {
              localStorage.setItem(k, String(val));
            }
          });
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
          try { localStorage.removeItem(LS_PLAN); } catch (e) {}
          if (window.PulseFit && window.PulseFit.setPlan) window.PulseFit.setPlan(defaultPlan());
        }

        var newMeasures = parsed.measures || parsed.pulsefit_body_measures ||
          (parsed.localStorage && (parsed.localStorage.pulsefit_body_measures || parsed.localStorage.measures));
        if (newMeasures && typeof newMeasures === 'object') {
          save(LS_MEASURES, newMeasures);
          if (window.PulseFit && window.PulseFit.setMeasures) window.PulseFit.setMeasures(newMeasures);
        } else {
          try { localStorage.removeItem(LS_MEASURES); } catch (e) {}
          if (window.PulseFit && window.PulseFit.setMeasures) window.PulseFit.setMeasures({});
        }

        var newMeasureUnit = parsed.pulsefit_measure_unit ||
          (parsed.localStorage && parsed.localStorage.pulsefit_measure_unit);
        if (newMeasureUnit === 'kg' || newMeasureUnit === 'lb') {
          try { localStorage.setItem(LS_MEASURE_UNIT, newMeasureUnit); } catch (e) {}
          if (window.PulseFit && window.PulseFit.setMeasureUnit) window.PulseFit.setMeasureUnit(newMeasureUnit);
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

        sayFn('backupMsg', tFn('backupImportSuccess'));
      } catch (err) {
        sayFn('backupMsg', tFn('backupImportError'), true);
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
      MEASURE_UNIT: LS_MEASURE_UNIT
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
    resetAllData: resetAllData,
    exportBackup: exportBackup,
    handleImportFile: handleImportFile,
    initBackupEvents: initBackupEvents
  };

  window.PulseFitStorage = PulseFitStorage;
  window.PulseFit.Storage = PulseFitStorage;
})();
