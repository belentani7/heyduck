/**
 * DUCK - Easter Egg Module v2.0
 * Sound wave parallax Easter egg section
 */

function initEasterEgg() {
  const container = document.getElementById("eeWaves");
  const section = document.getElementById("easterEgg");
  if (!container || !section) return;

  // Generate wave bars
  for (let i = 0; i < 40; i++) {
    const bar = document.createElement("div");
    bar.className = "ee-wave-bar";
    bar.style.height = 5 + Math.random() * 80 + "px";
    container.appendChild(bar);
  }

  // Observe visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("active");
          animateWaves();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(section);

  // Animate wave bars
  function animateWaves() {
    const bars = container.querySelectorAll(".ee-wave-bar");

    function pulse() {
      bars.forEach((bar) => {
        const h = 5 + Math.random() * 100;
        bar.style.height = h + "px";
        bar.style.opacity = h / 120 + 0.2;
      });

      if (section.classList.contains("active")) {
        requestAnimationFrame(() => setTimeout(pulse, 150));
      }
    }

    pulse();
  }
}
