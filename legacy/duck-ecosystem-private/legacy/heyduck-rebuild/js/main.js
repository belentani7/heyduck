/**
 * DUCK - Main Orchestrator v2.0
 * Initializes all modules in correct order
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Wait for preloader to finish, then init everything
initPreloader(() => {
  // Set default language
  try {
    setDuckLang("pt");
  } catch (e) {}

  // Render dynamic content
  renderGallery("galleryGrid");
  renderSingles("singlesGrid");
  renderTracks("tracksGrid", "all");
  initFilters(".filter-btn", "tracksGrid");

  // Render contact links
  const contactEl = document.getElementById("contactLinks");
  if (contactEl) {
    contactEl.innerHTML = DUCK_CONTACT.map(
      (c) => `
      <a href="${c.url}" target="_blank" rel="noopener" class="contact-link">
        <span class="contact-label">${c.type}</span>
        <span class="contact-value">${c.value}</span>
      </a>
    `,
    ).join("");
  }

  // Init all animations
  initAllAnimations();

  // Init instruments and interactive features
  initInstruments();

  // Init audio pad
  initAudioPad();

  // Init easter egg
  initEasterEgg();
});
