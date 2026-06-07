(function () {
  'use strict';

  function createModal() {
    var modal = document.createElement('div');
    modal.className = 'mermaid-modal';
    modal.hidden = true;
    modal.innerHTML = [
      '<div class="mermaid-modal__backdrop" data-mermaid-close aria-hidden="true"></div>',
      '<div class="mermaid-modal__panel" role="dialog" aria-modal="true" aria-label="Diagrama Mermaid ampliado">',
      '  <button type="button" class="mermaid-modal__close" data-mermaid-close aria-label="Cerrar diagrama" title="Cerrar">×</button>',
      '  <div class="mermaid-modal__stage"></div>',
      '</div>'
    ].join('');

    document.body.appendChild(modal);
    return modal;
  }

  function makeSvgFocusable(svg) {
    if (!svg.hasAttribute('tabindex')) svg.setAttribute('tabindex', '0');
    if (!svg.hasAttribute('role')) svg.setAttribute('role', 'button');
    if (!svg.hasAttribute('aria-label')) svg.setAttribute('aria-label', 'Ampliar diagrama Mermaid');
  }

  function init() {
    var svgs = document.querySelectorAll('.main-content .mermaid svg');
    if (!svgs.length) return;

    var modal = createModal();
    var stage = modal.querySelector('.mermaid-modal__stage');
    var lastFocus = null;

    function closeModal() {
      if (modal.hidden) return;
      modal.hidden = true;
      stage.innerHTML = '';
      document.body.classList.remove('mermaid-modal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    function openModal(svg) {
      var clone = svg.cloneNode(true);

      clone.removeAttribute('id');
      clone.removeAttribute('width');
      clone.removeAttribute('height');
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.style.maxWidth = 'none';
      clone.style.display = 'block';

      lastFocus = document.activeElement;
      stage.innerHTML = '';
      stage.appendChild(clone);
      modal.hidden = false;
      document.body.classList.add('mermaid-modal-open');
      modal.querySelector('.mermaid-modal__close').focus();
    }

    svgs.forEach(function (svg) {
      makeSvgFocusable(svg);
      svg.classList.add('mermaid-zoomable');

      svg.addEventListener('click', function () {
        openModal(svg);
      });

      svg.addEventListener('keydown', function (event) {
        var key = event.key || event.code;
        if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
          event.preventDefault();
          openModal(svg);
        }
      });
    });

    modal.addEventListener('click', function (event) {
      if (event.target && event.target.hasAttribute('data-mermaid-close')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
