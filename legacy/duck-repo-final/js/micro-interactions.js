// micro-interactions.js — Premium micro-interactions for DUCK
let microInteractionsInitialized = false;

export function initMicroInteractions() {
  if (microInteractionsInitialized) return;
  microInteractionsInitialized = true;

  // Gallery lightbox effect
  document.addEventListener('click', function(event) {
    var item = event.target.closest('.gallery-item');
    if (!item) return;
    var img = item.querySelector('img');
    if (!img) return;
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn .3s;';
    var bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain;';
    overlay.appendChild(bigImg);
    overlay.addEventListener('click', function() { overlay.remove(); });
    document.body.appendChild(overlay);
  });

  // Scroll-triggered text reveal
  document.querySelectorAll('.sec-h').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.sec-h').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.sec-h').forEach(function(el) { observer.observe(el); });

}
