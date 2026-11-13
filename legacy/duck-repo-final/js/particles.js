// particles.js — CSS-based floating particles for DUCK
export function initParticlesCSS() {
  var container = document.getElementById('particles');
  if (!container || container.dataset.particlesInitialized === 'true') return;
  container.dataset.particlesInitialized = 'true';

  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.style.cssText =
      'position:fixed;width:' + (Math.random() * 4 + 2) + 'px;height:' + (Math.random() * 4 + 2) + 'px;' +
      'background:rgba(154,203,107,' + (Math.random() * 0.3 + 0.05) + ');border-radius:50%;' +
      'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;' +
      'pointer-events:none;z-index:1;' +
      'animation:particleFloat ' + (Math.random() * 20 + 15) + 's linear infinite;' +
      'animation-delay:' + (Math.random() * -20) + 's;';
    container.appendChild(p);
  }

  // Inject keyframes if not present
  if (!document.getElementById('particle-keyframes')) {
    var style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = '@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100vh) translateX(' + (Math.random() * 100 - 50) + 'px);opacity:0;}}';
    document.head.appendChild(style);
  }
}
