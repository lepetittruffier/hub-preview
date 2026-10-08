/* ══════════════════════════════════════════════════════════════════════
   EPOQ IIII · SOVEREIGN PRESENTATION CONTROLLER
   Pure fullscreen presenter mode, 40px grid chrome, site register footer.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var deckApp = document.getElementById('deck-app');
  var slides = Array.from(document.querySelectorAll('.slide-canvas'));
  var counterEl = document.querySelector('[data-deck-counter]');
  var headerTitleEl = document.querySelector('[data-deck-header-title]');
  var regLineEl = document.querySelector('[data-deck-reg-line]');
  var regLinks = Array.from(document.querySelectorAll('[data-deck-target]'));
  var btnPrev = document.querySelector('[data-deck-prev]');
  var btnNext = document.querySelector('[data-deck-next]');
  var btnFs = document.querySelector('[data-deck-fs]');
  var currentIdx = 0;

  function update() {
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('active', idx === currentIdx);
    });

    var activeSlide = slides[currentIdx];
    var slideNo = activeSlide ? activeSlide.getAttribute('data-slide-no') : '000';
    var slideLabel = activeSlide ? activeSlide.getAttribute('data-slide-label') : '';
    var fullTitle = slideNo + '_' + slideLabel.toUpperCase().replace(/\s+/g, '_');

    if (counterEl) {
      counterEl.textContent = 'SLIDE ' + (currentIdx + 1) + ' / ' + slides.length;
    }

    if (headerTitleEl) {
      headerTitleEl.textContent = activeSlide ? activeSlide.getAttribute('data-slide-title') || slideLabel : '';
    }

    if (regLineEl) {
      regLineEl.textContent = 'NOW // ' + fullTitle + ' · ' + (activeSlide ? activeSlide.getAttribute('data-slide-kicker') || '' : '');
    }

    regLinks.forEach(function (link) {
      var target = link.getAttribute('data-deck-target');
      link.classList.toggle('active', target === activeSlide.id);
    });

    if (activeSlide && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#' + activeSlide.id);
    }
  }

  function go(delta) {
    currentIdx = Math.max(0, Math.min(slides.length - 1, currentIdx + delta));
    update();
  }

  function goToId(id) {
    var idx = slides.findIndex(function (s) { return s.id === id; });
    if (idx !== -1) {
      currentIdx = idx;
      update();
    }
  }

  function toggleFullscreen() {
    if (deckApp) {
      deckApp.classList.toggle('is-fullscreen');
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      }
    }
  }

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && deckApp) {
      deckApp.classList.remove('is-fullscreen');
    }
  });

  if (btnPrev) btnPrev.addEventListener('click', function () { go(-1); });
  if (btnNext) btnNext.addEventListener('click', function () { go(1); });
  if (btnFs) btnFs.addEventListener('click', toggleFullscreen);

  regLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var id = link.getAttribute('data-deck-target');
      if (id) goToId(id);
    });
  });

  window.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, select')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'Escape') {
      if (deckApp && deckApp.classList.contains('is-fullscreen')) {
        deckApp.classList.remove('is-fullscreen');
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      currentIdx = 0;
      update();
    } else if (e.key === 'End') {
      e.preventDefault();
      currentIdx = slides.length - 1;
      update();
    }
  });

  var hash = window.location.hash.replace('#', '');
  if (hash) {
    var found = slides.findIndex(function (s) { return s.id === hash; });
    if (found !== -1) currentIdx = found;
  }

  update();
})();
