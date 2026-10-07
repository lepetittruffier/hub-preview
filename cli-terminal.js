/* cli-terminal.js — 006_cli · repl · instrument rack */
(function () {
  'use strict';

  var REPL_LINES = [
    'HubGraph.setView("pipeline")',
    'scout batch --stage 14',
    'warmth Rhode +12 → attn',
    'press-hub-atoms.py --gate-index',
    'deploy.sh · gates clear ✓'
  ];
  var LOG_LINES = [
    { cat: 'glass', text: 'GLASS.frost_bones( 32% )' },
    { cat: 'scout', text: 'SCOUT.drafts_staged( 3 )' },
    { cat: 'pipeline', text: 'PIPELINE.hub_register( tiers:3 )' },
    { cat: 'pipeline', text: '// PIPELINE.graph_layer( retired )' }
  ];

  var replIdx = 0;
  var replChar = 0;
  var logIdx = 0;
  var rafId = 0;
  var lastRepl = 0;
  var lastLog = 0;
  var logFilter = 'all';
  var logPaused = false;

  function tickRepl(now) {
    if (now - lastRepl < 45) return;
    lastRepl = now;
    var input = document.querySelector('[data-cli-input]');
    var body = document.querySelector('[data-cli-repl]');
    if (!input || !body) return;
    var line = REPL_LINES[replIdx];
    if (replChar <= line.length) {
      input.textContent = line.slice(0, replChar);
      replChar++;
    } else {
      var row = document.createElement('div');
      row.className = 'cli-repl-line';
      row.innerHTML = '<span class="cli-repl-out">‹</span> ' + line;
      body.appendChild(row);
      while (body.children.length > 6) body.removeChild(body.firstChild);
      input.textContent = '';
      replChar = 0;
      replIdx = (replIdx + 1) % REPL_LINES.length;
    }
  }

  function appendLogLine(entry) {
    var log = document.querySelector('[data-cli-log]');
    if (!log) return;
    var row = document.createElement('div');
    row.className = 'cli-receipt-line';
    row.setAttribute('data-log-cat', entry.cat);
    if (logFilter !== 'all' && entry.cat !== logFilter) {
      row.classList.add('is-filtered-out');
    }
    row.textContent = entry.text;
    log.appendChild(row);
    var unpinned = Array.prototype.slice.call(log.children).filter(function (c) {
      return !c.classList.contains('is-pinned');
    });
    while (unpinned.length > 5) log.removeChild(unpinned.shift());
  }

  function nextLogEntry() {
    var entry = LOG_LINES[logIdx];
    logIdx = (logIdx + 1) % LOG_LINES.length;
    return entry;
  }

  function tickLog(now) {
    if (logPaused) return;
    if (now - lastLog < 2200) return;
    lastLog = now;
    appendLogLine(nextLogEntry());
  }

  function applyLogFilter() {
    var log = document.querySelector('[data-cli-log]');
    if (!log) return;
    Array.prototype.forEach.call(log.children, function (row) {
      var cat = row.getAttribute('data-log-cat');
      var pinned = row.classList.contains('is-pinned');
      row.classList.toggle('is-filtered-out', !pinned && logFilter !== 'all' && cat !== logFilter);
    });
  }

  function wireLogControls() {
    var filters = document.querySelector('[data-cli-log-filters]');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-log-filter]');
        if (!btn) return;
        logFilter = btn.getAttribute('data-log-filter');
        Array.prototype.forEach.call(filters.children, function (chip) {
          chip.classList.toggle('active', chip === btn);
        });
        applyLogFilter();
      });
    }
    var ping = document.querySelector('[data-cli-log-ping]');
    if (ping) {
      ping.addEventListener('click', function () {
        var pool = logFilter === 'all' ? LOG_LINES : LOG_LINES.filter(function (e) { return e.cat === logFilter; });
        if (!pool.length) return;
        appendLogLine(pool[Math.floor(Math.random() * pool.length)]);
        lastLog = performance.now();
      });
    }
    var rack = document.querySelector('.cli-rack-log--wide');
    if (rack) {
      rack.addEventListener('mouseenter', function () { logPaused = true; });
      rack.addEventListener('mouseleave', function () { logPaused = false; });
    }
    var log = document.querySelector('[data-cli-log]');
    if (log) {
      log.addEventListener('click', function (e) {
        var row = e.target.closest('.cli-receipt-line');
        if (row) row.classList.toggle('is-pinned');
      });
    }
  }

  function tick(now) {
    tickRepl(now);
    tickLog(now);
    rafId = requestAnimationFrame(tick);
  }

  /* prefers-reduced-motion: the REPL shows its lines already typed (no typing loop),
     the receipt log seeds its window once (no auto-append). Ping/filter/pin stay live. */
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function staticRender() {
    var input = document.querySelector('[data-cli-input]');
    var body = document.querySelector('[data-cli-repl]');
    if (body) {
      REPL_LINES.slice(-5).forEach(function (line) {
        var row = document.createElement('div');
        row.className = 'cli-repl-line';
        row.innerHTML = '<span class="cli-repl-out">‹</span> ' + line;
        body.appendChild(row);
        while (body.children.length > 6) body.removeChild(body.firstChild);
      });
    }
    if (input) input.textContent = '';
    LOG_LINES.forEach(appendLogLine);
  }

  function boot() {
    wireLogControls();
    if (REDUCED) {
      staticRender();
      return;
    }
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();