# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado semántico.

## [2.0.0] - 2026-11-25

Restauración completa: la CI vuelve a ejecutarse, el sitio hace lo que dice y
todo lo que se afirma está verificado por una prueba.

### Corregido
- **CI muerta desde hace semanas.** Cuatro workflows (`ci.yml`, `codeql.yml`,
  `security.yml`, `discovery.yml`) declaraban dos veces `permissions:` de primer
  nivel. El YAML era inválido y GitHub los abortaba a los 0 s sin ejecutar un
  solo paso. Ahora hay un único bloque por archivo y `security.yml` cubre
  configuración de despliegue en lugar de duplicar CodeQL.
- **`make test` ejecutaba 0 pruebas.** `tests/` no era un paquete y
  `unittest discover` devolvía «Ran 0 tests ... OK». Añadido `tests/__init__.py`
  y el comando correcto (`-t .`).
- **Enlace roto en `site/index.html`** (`apple-touch-icon.png` inexistente):
  único fallo del gate de enlaces, que dejaba la CI en rojo.
- **Portada sin funcionalidad.** El botón de reproducción, el volumen y el
  visualizador no tenían código detrás; el «WebGL» solo limpiaba el canvas. El
  hero, las cifras y el catálogo tampoco se cargaban desde `data.js`.
- **`producto.html` y `ecosistema.html` con 5–6 `<main>` y `<header>`
  duplicados**, ids repetidos y sin CSS para sus componentes (21 y 15 clases sin
  regla). Reconstruidos con un solo landmark y hojas propias.
- **70 tarjetas del ecosistema eran enlaces sin `href`.** Ahora solo enlazan
  repositorios públicos verificados (9, por coincidencia exacta de nombre); el
  resto son tarjetas informativas sin URL inventada.
- **`doctor.py` fallaba (46/50).** Pedía `CONTRIBUTING.md` y
  `CODE_OF_CONDUCT.md`, que estaban en `.gitignore`; validaba `catalogo.json`
  contra claves que nunca tuvo. Corregido: los archivos existen, el catálogo
  tiene esquema medido y el doctor ejecuta los mismos gates que la CI (76/76).
- **10 clases CSS usadas y nunca definidas** en la portada (`.lede`, `.kicker`,
  `.ux-btn`, `.contacto`, `.datos`, `.dato`, `.sub`, `.thin`, `.hero`).

### Añadido
- **Estación de audio real**: sintetizador de dos osciladores con filtro
  resonante y LFO, envolvente, metrónomo con planificación anticipada,
  analizador de 2048 puntos en bandas logarítmicas y afinación A4 440/432 Hz.
- **Shader WebGL propio** (FBM con deformación de dominio), con degradación a
  CSS, pausa por visibilidad y frame estático con movimiento reducido.
- **Suite de pruebas**: 43 en Node (matemática de audio, contratos de datos,
  herramientas internas, DOM con jsdom) y 25 en Python (estructura de páginas,
  descubrimiento, medios, higiene). Antes: 5 pruebas Node y 0 ejecutadas en
  Python.
- **Pruebas end-to-end del camino feliz** con jsdom cargando el `index.html`
  real (`runScripts: "dangerously"`, `resources: "usable"`): hidratación del
  catálogo, gráfico de audio tras el gesto, ARIA, afinación de 432 Hz y estado
  honesto de los enlaces.
- **Herramientas internas** (`scripts/`): `audit-html.mjs`, `audit-config.mjs`,
  `verify-discovery.mjs`, `measure.mjs`, `deploy-manifest.mjs`,
  `report-budget.mjs`. Todas con `--help`, todas en la CI.
- **`.vercelignore` generado**: excluye `legacy/` (2,3 GB) y 181 activos no
  referenciados. Despliegue: de ~2,3 GB a 4,18 MB.
- **Cabeceras de seguridad**: HSTS, COOP, `Permissions-Policy` con micrófono y
  cámara bloqueados y CSP sin `unsafe-inline` para scripts en las rutas que la
  soportan.
- **Documentación honesta**: README reescrito (describía un sintetizador, un
  player y un vocal booth que no existían), `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, arquitectura, presupuesto y fuentes con versión.
- Tarjeta social real (`brand/og-image.jpg`, 1200×630, 48 kB) en lugar de un SVG
  que las redes no muestran.

### Cambiado
- Portadas del catálogo servidas en WebP con respaldo raster; hero y estaciones
  en WebP (≈50 % menos peso).
- `sitemap.xml` declara las 7 páginas públicas (antes solo la portada);
  `verify-discovery.mjs` valida cada URL contra el sistema de archivos.
- `manifest.webmanifest` con colores de marca e iconos reales (antes
  `#9377e6`/`#0b0a12`, fuera de paleta).

### Eliminado
- `debug.log` (12 kB de trazas de Chromium), `magic/package.json` y su
  `package-lock.json` de 3 bytes, y el directorio `--weak-model=gemini/`, creado
  por un error de comillas en la shell.
- Efecto «WebGL» que solo limpiaba el canvas y el `<script>` inline de la
  portada (incompatible con CSP estricta).

### Notas
- No se ha reescrito la historia ni se ha borrado `legacy/`. Los archivos siguen
  en Git; simplemente no se despliegan.

## [1.0.0] - 2025-10-15

### Added
- Initial repository setup with CI/CD (GitHub Actions)
- Standardized issue templates (bug_report.yml)
- Pull request template
- Security workflow (CodeQL scanning)
- Dependabot configuration
- Code of Conduct (Contributor Covenant 2.1)
- Security Policy (SECURITY.md)
- Contribution Guidelines (CONTRIBUTING.md)

### Security
- Enabled Dependabot alerts and security updates
- Added CodeQL workflow for automated security scanning
