/* hub-glyphs.js — 5×7 dot-matrix font · 11×7 LCD window · IM motion palette
   Authored in hub-glyphs.json; font inlined for static deploy. */
(function (global) {
  'use strict';

  var COLS = 11;
  var ROWS = 7;
  var GW = 5;
  var GH = 7;
  var GAP_COL = 1;

  /* synced from hub-glyphs.json */
  var FONT = {"0":["01110","10001","10011","10101","10101","10001","01110"],"1":["00100","01100","00100","00100","00100","00100","01110"],"2":["01110","10001","00001","00110","01000","10000","11111"],"3":["01110","10001","00001","00110","00001","10001","01110"],"4":["00010","00110","01010","10010","11111","00010","00010"],"5":["11111","10000","11110","00001","00001","10001","01110"],"6":["00110","01000","10000","11110","10001","10001","01110"],"7":["11111","00001","00010","00100","01000","01000","01000"],"8":["01110","10001","10001","01110","10001","10001","01110"],"9":["01110","10001","10001","01111","00001","00010","01100"],"A":["01110","10001","10001","11111","10001","10001","10001"],"B":["11110","10001","10001","11110","10001","10001","11110"],"C":["01111","10000","10000","10000","10000","10000","01111"],"D":["11110","10001","10001","10001","10001","10001","11110"],"E":["11111","10000","10000","11110","10000","10000","11111"],"F":["11111","10000","10000","11110","10000","10000","10000"],"G":["01111","10000","10000","10011","10001","10001","01111"],"H":["10001","10001","10001","11111","10001","10001","10001"],"I":["01110","00100","00100","00100","00100","00100","01110"],"J":["00111","00010","00010","00010","10010","10010","01100"],"K":["10001","10010","10100","11000","10100","10010","10001"],"L":["10000","10000","10000","10000","10000","10000","11111"],"M":["10001","11011","10101","10001","10001","10001","10001"],"N":["10001","11001","10101","10011","10001","10001","10001"],"O":["01110","10001","10001","10001","10001","10001","01110"],"P":["11110","10001","10001","11110","10000","10000","10000"],"Q":["01110","10001","10001","10001","10101","10010","01101"],"R":["11110","10001","10001","11110","10100","10010","10001"],"S":["01111","10000","10000","01110","00001","00001","11110"],"T":["11111","00100","00100","00100","00100","00100","00100"],"U":["10001","10001","10001","10001","10001","10001","01110"],"V":["10001","10001","10001","10001","10001","01010","00100"],"W":["10001","10001","10001","10101","10101","10101","01010"],"X":["10001","10001","01010","00100","01010","10001","10001"],"Y":["10001","10001","01010","00100","00100","00100","00100"],"Z":["11111","00001","00010","00100","01000","10000","11111"],"·":["00000","00000","00100","00000","00000","00000","00000"],"+":["00000","00100","00100","11111","00100","00100","00000"],"-":["00000","00000","00000","11111","00000","00000","00000"],"/":["00001","00010","00100","01000","10000","00000","00000"],"\\":["10000","01000","00100","00010","00001","00000","00000"],"[":["01110","01000","01000","01000","01000","01000","01110"],"]":["01110","00010","00010","00010","00010","00010","01110"],"→":["00000","00100","00100","01110","11111","00100","00100"],"□":["01110","10001","10001","10001","10001","10001","01110"],"∂":["01110","10001","10001","01110","10000","10000","10000"]};

  function normalizeChar(ch) {
    if (!ch) return '';
    if (ch.length !== 1) return ch;
    var u = ch.toUpperCase();
    if (FONT[u]) return u;
    if (FONT[ch]) return ch;
    return '□';
  }

  function parseInput(input) {
    if (Array.isArray(input)) {
      return input.slice(0, 2).map(normalizeChar);
    }
    var s = String(input || '').slice(0, 2);
    var out = [];
    for (var i = 0; i < s.length; i++) out.push(normalizeChar(s.charAt(i)));
    return out;
  }

  function slotOffsets(count) {
    if (count <= 0) return [];
    if (count === 1) return [Math.floor((COLS - GW) / 2)];
    return [0, GW + GAP_COL];
  }

  function ensureUnit(el) {
    if (!el) return null;
    var unit = el.closest('.hub-mo-glyph-unit');
    if (unit) {
      if (!unit.querySelector('.hub-mo-glyph-rule')) {
        var rule = document.createElement('span');
        rule.className = 'hub-mo-glyph-rule';
        rule.setAttribute('aria-hidden', 'true');
        unit.appendChild(rule);
      }
      if (!unit.querySelector('.hub-mo-glyph-readout')) {
        var readout = document.createElement('span');
        readout.className = 'hub-mo-glyph-readout';
        readout.setAttribute('aria-hidden', 'true');
        unit.appendChild(readout);
      }
      return unit;
    }
    unit = document.createElement('span');
    unit.className = 'hub-mo-glyph-unit';
    el.parentNode.insertBefore(unit, el);
    unit.appendChild(el);
    var ruleEl = document.createElement('span');
    ruleEl.className = 'hub-mo-glyph-rule';
    ruleEl.setAttribute('aria-hidden', 'true');
    unit.appendChild(ruleEl);
    var readoutEl = document.createElement('span');
    readoutEl.className = 'hub-mo-glyph-readout';
    readoutEl.setAttribute('aria-hidden', 'true');
    unit.appendChild(readoutEl);
    return unit;
  }

  function syncReadout(el, text) {
    var unit = ensureUnit(el);
    if (!unit) return;
    var readout = unit.querySelector('.hub-mo-glyph-readout');
    if (readout) readout.textContent = text || '';
  }

  function buildGrid(el, opts) {
    if (!el || el.dataset.glyphBuilt) return el;
    ensureUnit(el);
    var cols = +(opts && opts.cols || el.dataset.cols || COLS);
    var rows = +(opts && opts.rows || el.dataset.rows || ROWS);
    el.style.setProperty('--glyph-cols', String(cols));
    el.style.setProperty('--glyph-rows', String(rows));
    el.setAttribute('role', 'img');
    el.setAttribute('aria-hidden', 'true');
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = document.createElement('span');
        cell.className = 'hub-mo-glyph-cell';
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);
        el.appendChild(cell);
      }
    }
    el.dataset.glyphBuilt = '1';
    return el;
  }

  function clearGrid(el) {
    el.querySelectorAll('.hub-mo-glyph-cell').forEach(function (cell) {
      cell.classList.remove('is-on');
    });
  }

  function blitGlyph(el, glyph, colOff) {
    if (!glyph) return;
    for (var r = 0; r < GH; r++) {
      var row = glyph[r] || '00000';
      for (var c = 0; c < GW; c++) {
        if (row.charAt(c) !== '1') continue;
        var cell = el.querySelector(
          '.hub-mo-glyph-cell[data-r="' + r + '"][data-c="' + (colOff + c) + '"]'
        );
        if (cell) cell.classList.add('is-on');
      }
    }
  }

  function paint(el, input) {
    if (!el) return;
    buildGrid(el);
    clearGrid(el);
    var chars = parseInput(input);
    var offsets = slotOffsets(chars.length);
    for (var i = 0; i < chars.length; i++) {
      blitGlyph(el, FONT[chars[i]], offsets[i]);
    }
    var label = chars.join('');
    el.dataset.text = label;
    syncReadout(el, label);
  }

  function initStatic() {
    document.querySelectorAll('.hub-mo-glyph[data-text]').forEach(function (el) {
      paint(el, el.dataset.text || '');
    });
  }

  global.HubGlyphs = {
    FONT: FONT,
    COLS: COLS,
    ROWS: ROWS,
    buildGrid: buildGrid,
    paint: paint,
    initStatic: initStatic,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatic);
  } else {
    initStatic();
  }
})(typeof window !== 'undefined' ? window : this);