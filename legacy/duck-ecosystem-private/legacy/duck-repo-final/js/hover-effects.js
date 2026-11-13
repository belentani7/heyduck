// hover-effects.js — Premium hover interactions for DUCK
let hoverEffectsInitialized = false;

export function initHoverEffects() {
  if (hoverEffectsInitialized || window.innerWidth < 768) return;
  hoverEffectsInitialized = true;

  document.addEventListener('mousemove', function(event) {
    var button = event.target.closest('.btn-p, .studio-btn');
    var card = event.target.closest('.svc, .tool-card, .station-card');
    var target = button || card;
    if (!target) return;

    var rect = target.getBoundingClientRect();
    if (button) {
      var buttonX = event.clientX - rect.left - rect.width / 2;
      var buttonY = event.clientY - rect.top - rect.height / 2;
      button.style.transform = 'translate(' + (buttonX * 0.15) + 'px, ' + (buttonY * 0.15) + 'px)';
      return;
    }

    var cardX = (event.clientX - rect.left) / rect.width - 0.5;
    var cardY = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'perspective(800px) rotateY(' + (cardX * 8) + 'deg) rotateX(' + (-cardY * 8) + 'deg) translateY(-5px)';
  });

  document.addEventListener('mouseout', function(event) {
    var target = event.target.closest('.btn-p, .studio-btn, .svc, .tool-card, .station-card');
    if (!target || target.contains(event.relatedTarget)) return;
    target.style.transform = '';
  });

  document.addEventListener('mouseover', function(event) {
    var item = event.target.closest('.single-item, .port-item, .gallery-item');
    var link = event.target.closest('.nav-links a');
    if (item) {
      var overlay = item.querySelector('.single-over, .port-over, .gallery-caption');
      if (overlay) overlay.style.opacity = '1';
    }
    if (link) link.style.color = 'var(--a)';
  });

  document.addEventListener('mouseout', function(event) {
    var item = event.target.closest('.single-item, .port-item, .gallery-item');
    var link = event.target.closest('.nav-links a');
    if (item && !item.contains(event.relatedTarget)) {
      var overlay = item.querySelector('.single-over, .port-over, .gallery-caption');
      if (overlay) overlay.style.opacity = '';
    }
    if (link && !link.contains(event.relatedTarget) && !link.classList.contains('active')) link.style.color = '';
  });
}
