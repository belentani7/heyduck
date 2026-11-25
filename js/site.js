/**
 * site.js — Render progresivo del contenido de heyduck desde `data.js`.
 *
 * Principios:
 *   - Todo se construye con `document.createElement` y `textContent`: los datos
 *     del catálogo nunca se interpretan como HTML.
 *   - Las imágenes usan `<picture>` con WebP + respaldo raster, `loading="lazy"`,
 *     `decoding="async"` y dimensiones intrínsecas para no provocar CLS.
 *   - Un enlace de streaming solo se pinta como enlace si es http(s) verificado
 *     (`link !== "#"`); si está pendiente se muestra el estado, no un botón
 *     muerto.
 *   - Sin JavaScript, el documento conserva su lista `<noscript>` estática.
 */
(function () {
  "use strict";

  function data() {
    if (typeof window.DUCK_DATA === "object" && window.DUCK_DATA) return window.DUCK_DATA;
    return null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function publishable(url) {
    var core = window.HeyduckAudio;
    if (core && core.isPublishableLink) return core.isPublishableLink(url);
    return typeof url === "string" && /^https?:\/\/[^\s]+$/i.test(url);
  }

  function cover(single) {
    var picture = document.createElement("picture");
    if (single.coverWebp) {
      var source = document.createElement("source");
      source.type = "image/webp";
      source.srcset = single.coverWebp;
      picture.appendChild(source);
    }

    var img = document.createElement("img");
    img.src = single.cover;
    img.alt = "Portada de " + single.title + " — " + single.artist;
    img.width = 256;
    img.height = 256;
    // Atributos explícitos: `img.loading = "lazy"` depende de una propiedad IDL
    // que no todos los motores implementan igual.
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    picture.appendChild(img);
    return picture;
  }

  function metaRow(single) {
    var list = el("ul", "release-meta");
    var facts = [];
    if (single.genre) facts.push(single.genre);
    if (single.bpm) facts.push(single.bpm);
    if (single.key) facts.push(single.key);
    if (single.streams) facts.push(single.streams + " streams");
    facts.forEach(function (fact) {
      list.appendChild(el("li", null, fact));
    });
    return list;
  }

  function releaseCard(single) {
    var item = el("li", "release");
    item.appendChild(cover(single));

    var body = el("div", "release-body");
    body.appendChild(el("h3", "release-title", single.title));
    body.appendChild(el("p", "release-artist", single.artist));
    body.appendChild(metaRow(single));

    if (publishable(single.link)) {
      var link = el("a", "release-link", "Escuchar");
      link.href = single.link;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      link.setAttribute("aria-label", "Escuchar " + single.title + " en la plataforma de streaming (se abre en una pestaña nueva)");
      body.appendChild(link);
    } else {
      var pending = el("span", "release-pending", "Enlace pendiente de verificación");
      pending.setAttribute("role", "note");
      body.appendChild(pending);
    }

    item.appendChild(body);
    return item;
  }

  function renderReleases(root) {
    var list = root.querySelector("[data-releases]");
    var source = data();
    if (!list || !source || !Array.isArray(source.singles)) return;

    var fragment = document.createDocumentFragment();
    source.singles.forEach(function (single) {
      fragment.appendChild(releaseCard(single));
    });
    list.replaceChildren(fragment);
  }

  function renderServices(root) {
    var list = root.querySelector("[data-services]");
    var source = data();
    if (!list || !source || !Array.isArray(source.services)) return;

    var fragment = document.createDocumentFragment();
    source.services.forEach(function (service) {
      var item = el("li", "service");
      var icon = el("span", "service-icon", service.icon || "•");
      icon.setAttribute("aria-hidden", "true");
      item.appendChild(icon);
      item.appendChild(el("h3", null, service.title));
      item.appendChild(el("p", null, service.description));
      fragment.appendChild(item);
    });
    list.replaceChildren(fragment);
  }

  function renderStations(root) {
    var list = root.querySelector("[data-stations]");
    var source = data();
    if (!list || !source || !Array.isArray(source.stations)) return;

    var fragment = document.createDocumentFragment();
    source.stations.slice(0, 4).forEach(function (station) {
      var item = el("li", "station");
      var img = document.createElement("img");
      img.src = station.image;
      img.alt = "Fotografía de la estación de trabajo " + station.name;
      img.width = 512;
      img.height = 341;
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      item.appendChild(img);

      var body = el("div", "station-body");
      body.appendChild(el("h3", null, station.name));
      body.appendChild(el("p", null, station.description));
      var specs = el("ul", "station-specs");
      (station.specs || []).forEach(function (spec) {
        specs.appendChild(el("li", null, spec));
      });
      body.appendChild(specs);
      item.appendChild(body);
      fragment.appendChild(item);
    });
    list.replaceChildren(fragment);
  }

  function renderStats(root) {
    var source = data();
    if (!source || !source.stats) return;
    var core = window.HeyduckAudio;
    var formatter = core && core.formatCompact ? core.formatCompact : String;

    var map = {
      "[data-stat-streams]": formatter(source.stats.streams),
      "[data-stat-releases]": String(source.stats.releases),
      "[data-stat-years]": String(source.stats.yearsActive)
    };

    Object.keys(map).forEach(function (selector) {
      var node = root.querySelector(selector);
      if (node) node.textContent = map[selector];
    });
  }

  function markCurrentPage() {
    var path = window.location.pathname.replace(/\/+$/, "/") || "/";
    var links = document.querySelectorAll("nav a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href || href.charAt(0) === "#" || /^https?:/i.test(href)) continue;
      var target = href.replace(/\/+$/, "/");
      var isHome = (target === "index.html" || target === "/") && (path === "/" || /\/index\.html$/.test(path));
      if (isHome || (target !== "/" && path.indexOf(target.replace(/^\.\//, "")) !== -1)) {
        links[i].setAttribute("aria-current", "page");
      }
    }
  }

  function revealOnScroll(root) {
    var items = root.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("in");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  function collectWarnings(root) {
    var warnings = [];
    if (!data()) warnings.push("data.js no se cargó: el catálogo queda vacío");
    if (!window.HeyduckAudio) warnings.push("audio-core.js no disponible");
    ["[data-releases]", "[data-services]", "[data-stations]"].forEach(function (selector) {
      var node = root.querySelector(selector);
      if (node && node.children.length === 0) {
        warnings.push("contenedor vacío tras render: " + selector);
      }
    });
    if (warnings.length && window.console && console.warn) {
      console.warn("site.js:", warnings.join(" · "));
    }
    return warnings;
  }

  function boot() {
    var root = document.querySelector("main") || document.body;
    if (!root) return;
    renderStats(root);
    renderReleases(root);
    renderServices(root);
    renderStations(root);
    markCurrentPage();
    revealOnScroll(document);
    window.HeyduckSite = { warnings: collectWarnings(root) };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
