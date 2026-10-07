/* hub-motion.js — HUB motion plate · Figma GFVDHzPgeMjx4KSkjyW4NE
   glyph display · loading bar · chip reveal · button-press · plate-card cycle
   (concentric squares self-animate via CSS; warmth scan retired 2026-07-01) */
(function () {
  'use strict';

  /* prefers-reduced-motion: every demo paints its first frame (honest static state)
     and the perpetual intervals never start. Read once at load — house idiom (the
     OHM reader does the same). */
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadLevel(i) {
    if (i < 2) return 'l0';
    if (i < 4) return 'l1';
    if (i < 6) return 'l2';
    if (i < 8) return 'l3';
    if (i < 10) return 'l4';
    return 'l5';
  }

  var GLYPH_FRAMES = ['∂', '12', 'IM', 'OK', '·+'];

  var PLATE = '.hub-motion-plate';

  var glyphs = window.HubGlyphs;
  if (glyphs) {
    document.querySelectorAll(PLATE + ' .hub-mo-glyph.is-live').forEach(function (el) {
      glyphs.buildGrid(el);
      var fi = 0;
      function tick() {
        glyphs.paint(el, GLYPH_FRAMES[fi % GLYPH_FRAMES.length]);
        fi += 1;
      }
      tick();
      if (!REDUCED) setInterval(tick, 900);
    });
  }

  function bindLoadCycle(row) {
    var n = +(row.dataset.blocks || 12);
    if (!row.children.length) {
      for (var i = 0; i < n; i++) {
        var blk = document.createElement('span');
        blk.className = 'blk ' + loadLevel(i);
        blk.style.setProperty('--i', String(i));
        row.appendChild(blk);
      }
    }
    function cycle() {
      row.classList.add('reset');
      row.classList.remove('lit');
      void row.offsetWidth;
      row.classList.remove('reset');
      row.classList.add('lit');
    }
    cycle();
    if (!REDUCED) setInterval(cycle, 3600);
  }

  document.querySelectorAll(PLATE + ' .hub-mo-load').forEach(bindLoadCycle);

  document.querySelectorAll('.hub-card-plate .hub-card.is-live').forEach(function (card) {
    function cycle() {
      card.classList.add('reset');
      card.classList.remove('lit');
      void card.offsetWidth;
      card.classList.remove('reset');
      card.classList.add('lit');
    }
    cycle();
    if (!REDUCED) {
      var offset = +(card.style.getPropertyValue('--i') || 0) * 500;
      setTimeout(function () { setInterval(cycle, 3600); }, offset);
    }
  });

  document.querySelectorAll(PLATE + ' .hub-mo-btn-row.is-live').forEach(function (row) {
    var btns = [].slice.call(row.querySelectorAll('.ctl-btn:not([disabled])'));
    if (!btns.length) return;
    var i = 0;
    function tick() {
      btns.forEach(function (b) { b.classList.remove('is-press-demo'); });
      btns[i % btns.length].classList.add('is-press-demo');
      i += 1;
    }
    tick();
    if (!REDUCED) setInterval(tick, 2400);
  });

  document.querySelectorAll(PLATE + ' .hub-mo-chips.is-live').forEach(function (chips) {
    [].slice.call(chips.querySelectorAll('.ctl-chip')).forEach(function (chip, idx) {
      chip.style.setProperty('--i', String(idx));
    });
    function cycle() {
      chips.classList.add('reset');
      chips.classList.remove('lit');
      void chips.offsetWidth;
      chips.classList.remove('reset');
      chips.classList.add('lit');
    }
    cycle();
    if (!REDUCED) setInterval(cycle, 3600);
  });
})();