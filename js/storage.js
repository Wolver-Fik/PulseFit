(function () {
  'use strict';

  window.PulseFit = window.PulseFit || {};

  var LS_DAYS = 'cf_days';
  var LS_LIFTS = 'cf_lifts';
  var LS_LANG = 'pulsefit_lang';
  var LS_CONFIG = 'pulsefit_routine_config';
  var LS_CARDIO_CONFIG = 'pulsefit_cardio_config';

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

  // Construye registros cuya propiedad `date` es exactamente la fecha elegida.
  function makeDayRecord(date, data) {
    var record = {};
    Object.keys(data || {}).forEach(function (k) { if (k !== 'date') record[k] = data[k]; });
    record.date = normalizeDate(date);
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

      var backupData = {
        app: 'PulseFit',
        version: 1,
        exportDate: iso(today()),
        exportedAt: new Date().toISOString(),
        days: curDays,
        lifts: curLifts,
        pulsefit_lang: curLang,
        pulsefit_routine_config: curRoutineConfig,
        pulsefit_cardio_config: curCardioConfig,
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
      CARDIO_CONFIG: LS_CARDIO_CONFIG
    },
    load: load,
    save: save,
    todayIso: todayIso,
    normalizeDate: normalizeDate,
    makeDayRecord: makeDayRecord,
    makeLiftRecord: makeLiftRecord,
    saveDay: saveDay,
    addLift: addLift,
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
    exportBackup: exportBackup,
    handleImportFile: handleImportFile,
    initBackupEvents: initBackupEvents
  };

  window.PulseFitStorage = PulseFitStorage;
  window.PulseFit.Storage = PulseFitStorage;
})();
