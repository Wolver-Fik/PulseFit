(function () {
  'use strict';

  window.PulseFit = window.PulseFit || {};

  var chartInstance = null;
  var selectedChartEx = null;

  function $(id) {
    return document.getElementById(id);
  }

  function num(v) {
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function esc(s) {
    if (window.PulseFit && window.PulseFit.esc) return window.PulseFit.esc(s);
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function t(k) {
    if (window.PulseFit && window.PulseFit.t) return window.PulseFit.t(k);
    var I18N = window.PULSEFIT_I18N || {};
    var curLang = (window.PulseFit && window.PulseFit.curLang) || 'es';
    var dict = I18N[curLang] || I18N.es || {};
    return dict[k] !== undefined ? dict[k] : ((I18N.es && I18N.es[k]) !== undefined ? I18N.es[k] : k);
  }

  function fmtDate(s) {
    if (window.PulseFit && window.PulseFit.fmtDate) return window.PulseFit.fmtDate(s);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return '';
    var p = s.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2], 12);
    var LOCALE = (window.PulseFit && window.PulseFit.LOCALE) || { es: 'es-ES' };
    var curLang = (window.PulseFit && window.PulseFit.curLang) || 'es';
    var loc = LOCALE[curLang] || 'es-ES';
    return d.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Solo claves YYYY-MM-DD válidas: evita puntos con fechas corruptas o ausentes.
  function validDateKey(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return '';
    var p = s.split('-');
    var y = +p[0], m = +p[1] - 1, d = +p[2];
    var dt = new Date(y, m, d, 12, 0, 0, 0);
    return (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) ? s : '';
  }

  function sortDateKeys(keys) {
    if (window.PulseFitStorage && window.PulseFitStorage.sortByDateAsc) {
      return window.PulseFitStorage.sortByDateAsc(keys, function (k) { return k; });
    }
    return (keys || []).slice().sort();
  }

  function fmt(n, dec) {
    if (window.PulseFit && window.PulseFit.fmt) return window.PulseFit.fmt(n, dec);
    var LOCALE = (window.PulseFit && window.PulseFit.LOCALE) || { es: 'es-ES' };
    var curLang = (window.PulseFit && window.PulseFit.curLang) || 'es';
    var loc = LOCALE[curLang] || 'es-ES';
    return (Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)).toLocaleString(loc, { maximumFractionDigits: dec });
  }

  function getCanonicalExerciseKey(rawName) {
    // Acepta tanto un nombre como el registro completo de la serie: así los
    // ejercicios elegidos en el menú (exerciseKey) y los personalizados
    // (ejercicio) caen en la misma clave canónica.
    if (rawName && typeof rawName === 'object') {
      rawName = rawName.exerciseKey || rawName.ejercicio || '';
    }
    if (window.PulseFit && window.PulseFit.getCanonicalExerciseKey) {
      return window.PulseFit.getCanonicalExerciseKey(rawName);
    }
    if (!rawName) return '';
    return String(rawName).trim().toLowerCase();
  }

  function updateChartExerciseSelect(distinctKeys, customDisplayMap) {
    var sel = $('chartExSelect');
    if (!sel) return;
    if (!distinctKeys.length) {
      sel.innerHTML = '<option value="">' + esc(t('emptyChartNoEx')) + '</option>';
      sel.disabled = true;
      selectedChartEx = null;
      return;
    }
    sel.disabled = false;
    var EX_NAME_MAP = (window.PulseFit && window.PulseFit.EX_NAME_MAP) || {};
    var getName = (window.PulseFit && window.PulseFit.getExerciseName) || function (k, lang) {
      return EX_NAME_MAP[k] ? (EX_NAME_MAP[k][lang] || EX_NAME_MAP[k].es) : k;
    };
    var curLang = (window.PulseFit && window.PulseFit.curLang) || 'es';
    var LOCALE = (window.PulseFit && window.PulseFit.LOCALE) || { es: 'es-ES' };

    var items = distinctKeys.map(function (k) {
      var name = EX_NAME_MAP[k] ? getName(k, curLang) : (customDisplayMap[k] || k);
      return { key: k, name: name };
    });
    items.sort(function (a, b) { return a.name.localeCompare(b.name, LOCALE[curLang] || 'es'); });

    var found = items.some(function (it) { return it.key === selectedChartEx; });
    if (!found) {
      selectedChartEx = items[0].key;
    }
    sel.innerHTML = items.map(function (it) {
      var isSel = it.key === selectedChartEx ? ' selected' : '';
      return '<option value="' + esc(it.key) + '"' + isSel + '>' + esc(it.name) + '</option>';
    }).join('');
  }

  function renderProgressionChart() {
    var emptyEl = $('chartEmpty'), containerEl = $('chartContainer'), metaEl = $('chartMeta');
    if (!emptyEl || !containerEl || !metaEl) return;

    var lifts = (window.PulseFit && window.PulseFit.getLifts) ? window.PulseFit.getLifts() :
                ((window.PulseFit && window.PulseFit.lifts) || (window.PulseFitStorage && window.PulseFitStorage.loadLifts()) || {});

    var distinctKeys = [], keySet = {}, customDisplayMap = {}, liftsByEx = {};
    Object.keys(lifts).forEach(function (id) {
      var v = lifts[id];
      if (!v || !v.ejercicio) return;
      var canKey = getCanonicalExerciseKey(v);
      if (!keySet[canKey]) {
        keySet[canKey] = true;
        distinctKeys.push(canKey);
        customDisplayMap[canKey] = String(v.ejercicio).trim();
      }
      if (!liftsByEx[canKey]) liftsByEx[canKey] = [];
      liftsByEx[canKey].push(v);
    });

    updateChartExerciseSelect(distinctKeys, customDisplayMap);

    if (!distinctKeys.length || !selectedChartEx || !liftsByEx[selectedChartEx]) {
      emptyEl.hidden = false;
      containerEl.hidden = true;
      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
      return;
    }

    emptyEl.hidden = true;
    containerEl.hidden = false;

    var exLifts = liftsByEx[selectedChartEx];
    var maxWeightByDate = {};
    exLifts.forEach(function (lift) {
      var d = validDateKey(lift && lift.date);
      if (!d) return;
      var w = num(lift.kg);
      if (maxWeightByDate[d] == null || w > maxWeightByDate[d]) {
        maxWeightByDate[d] = w;
      }
    });

    // Todos los puntos se ordenan por la fecha real del entrenamiento.
    var sortedDates = sortDateKeys(Object.keys(maxWeightByDate));
    var labels = sortedDates.map(function (d) { return fmtDate(d); });
    var dataPoints = sortedDates.map(function (d) { return maxWeightByDate[d]; });
    var topWeight = dataPoints.reduce(function (a, b) { return Math.max(a, b); }, 0);
    var sessionsCount = sortedDates.length;

    metaEl.innerHTML =
      '<div class="chart-meta-stat"><span>' + esc(t('chartRecord')) + ':</span> <span class="chart-meta-val">' + fmt(topWeight, 1) + ' kg</span></div>' +
      '<div class="chart-meta-stat"><span>' + esc(t('chartSessions')) + ':</span> <span class="chart-meta-val">' + fmt(sessionsCount, 0) + '</span></div>';

    if (typeof Chart === 'undefined') return;

    var canvas = $('loadChart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: t('chartWeightLabel'),
          data: dataPoints,
          borderColor: '#3CC4A8',
          backgroundColor: 'rgba(60, 196, 168, 0.14)',
          borderWidth: 2.5,
          tension: 0.25,
          fill: true,
          pointBackgroundColor: '#3CC4A8',
          pointBorderColor: '#0C1513',
          pointBorderWidth: 2,
          pointRadius: dataPoints.length === 1 ? 6 : 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#5EE2C8',
          pointHoverBorderColor: '#0C1513',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#16211F',
            titleColor: '#E6EFEC',
            bodyColor: '#3CC4A8',
            borderColor: '#273532',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function (items) {
                if (!items.length) return '';
                var idx = items[0].dataIndex;
                return sortedDates[idx] ? fmtDate(sortedDates[idx]) : items[0].label;
              },
              label: function (context) {
                return (t('chartWeightLabel') || 'Peso') + ': ' + fmt(context.parsed.y, 1) + ' kg';
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#93A5A0',
              font: { family: "'Inter', system-ui, sans-serif", size: 11 },
              maxRotation: 45
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.07)',
              drawBorder: false
            },
            ticks: {
              color: '#93A5A0',
              font: { family: "'Inter', system-ui, sans-serif", size: 11 },
              callback: function (val) { return val + ' kg'; }
            }
          }
        }
      }
    });
  }

  // Se llama después de editar o borrar una serie: vuelve a leer el estado actual
  // de `lifts`, recalcula el peso máximo por día y descarta puntos que ya no existen.
  function refresh() {
    renderProgressionChart();
  }

  function initChartEvents() {
    var sel = $('chartExSelect');
    if (sel) {
      sel.addEventListener('change', function (e) {
        selectedChartEx = e.target.value;
        renderProgressionChart();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChartEvents);
  } else {
    initChartEvents();
  }

  var PulseFitCharts = {
    render: renderProgressionChart,
    refresh: refresh,
    renderProgressionChart: renderProgressionChart,
    updateChartExerciseSelect: updateChartExerciseSelect,
    getSelectedExercise: function () { return selectedChartEx; },
    setSelectedExercise: function (k) { selectedChartEx = k; },
    getChartInstance: function () { return chartInstance; },
    destroy: function () {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    },
    initChartEvents: initChartEvents
  };

  window.PulseFitCharts = PulseFitCharts;
  window.PulseFit.Charts = PulseFitCharts;
  window.renderProgressionChart = renderProgressionChart;
})();
