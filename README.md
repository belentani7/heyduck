# heyduck

<p>
  <img src="https://github.com/belentani7/heyduck/actions/workflows/ci.yml/badge.svg" alt="CI">
  <img src="https://github.com/belentani7/heyduck/actions/workflows/codeql.yml/badge.svg" alt="CodeQL">
  <img src="https://img.shields.io/badge/licencia-MIT-2bb673" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/dependencias-0-2bb673" alt="Cero dependencias">
</p>

Portfolio y estación de audio de **Duck** (Lucas Belentani), productor musical y
beatmaker en Aracaju (SE, Brasil). Sitio estático: HTML, CSS y JavaScript sin
framework, sin paso de build y **sin ninguna dependencia en tiempo de
ejecución**.

- **Producción:** <https://heyduck.vercel.app/>
- **Código:** <https://github.com/belentani7/heyduck>
- **Ficha de producto:** [`plataforma/FICHA.md`](plataforma/FICHA.md) — identidad, oferta y límites comerciales.

## Qué hace de verdad

Todo lo que sigue está implementado en el repositorio y verificado por la suite
de pruebas. Nada de esta lista es una promesa a futuro.

| Función | Implementación | Verificación |
|---|---|---|
| **Sintetizador** | Dos osciladores (principal + sub una octava abajo), filtro paso bajo resonante con LFO lento, envolvente de amplitud | `js/audio-core.js` + `js/studio.js`, pruebas en `tests/audio-core.test.cjs` |
| **Metrónomo** | Planificación anticipada (*look-ahead*) de 150 ms con clics acentuados por compás | `js/studio.js`, `bpmToMs` probado |
| **Analizador de espectro** | FFT de 2048 puntos del `AnalyserNode` repartida en bandas logarítmicas y dibujada en Canvas 2D | `spectrumBands` probada con picos graves y agudos |
| **Afinación de referencia** | Selector A4 = 440 Hz (ISO 16) o 432 Hz, aplicado a la frecuencia real emitida | `tunedFrequency()` |
| **Fondo generativo WebGL** | Shader FBM con deformación de dominio, 1 draw call, reactivo al nivel de audio | `js/hero-gl.js` |
| **Catálogo** | Se renderiza desde `data.js`; los enlaces sin verificar se muestran como estado, no como botón | `js/site.js` + contratos en `tests/` |
| **Accesibilidad** | Teclado, `aria-pressed`, `aria-live`, foco visible, un solo `<main>`, un solo `<h1>` | `scripts/audit-html.mjs` |

### Degradación y límites, dichos sin adornos

- **El audio solo suena tras un clic.** Es la política de autoplay de los
  navegadores; se declara en la interfaz en vez de fingir un arranque automático.
- **Sin WebGL** (o si se pierde el contexto) el hero cae a un degradado CSS
  equivalente; no hay error visible ni pantalla vacía.
- **`prefers-reduced-motion`**: el shader dibuja un frame estático y el
  analizador no anima.
- **Pestaña oculta**: se suspende el `AudioContext`, se detiene el bucle de
  dibujo y no se consume CPU.
- **La web no graba micrófono.** `Permissions-Policy` lo declara bloqueado
  (`microphone=()`), y no hay captura de voz en el código.
- **No hay checkout ni pasarela de pago.** Los servicios se contratan por correo
  con factura y transferencia SEPA (ver `plataforma/COBRO.md`).

## Estructura

```
heyduck/
├── index.html              Portada + estación de audio
├── producto.html           Oferta, precios y contratación
├── ecosistema.html         Mapa del ecosistema (solo enlaces verificados)
├── docs.html               Documentación
├── accesibilidad.html      Declaración de accesibilidad
├── privacidad.html         Privacidad
├── aviso-legal.html        Aviso legal
├── 404.html
├── data.js                 Modelo de datos: catálogo, servicios, estaciones
├── js/
│   ├── audio-core.js       Matemática de audio pura (testeable en Node)
│   ├── studio.js           Motor Web Audio + metrónomo + analizador
│   ├── hero-gl.js          Shader WebGL del hero
│   └── site.js             Render progresivo desde data.js
├── assets/
│   ├── site.css            Hoja única (tokens, layout, componentes)
│   ├── producto.css        Componentes de la página comercial
│   └── ecosistema.css      Componentes del mapa del ecosistema
├── images/                 Portadas, estudio y fondos (WebP + respaldo raster)
├── scripts/                Herramientas internas (ver más abajo)
├── tests/                  Suite Node + Python
├── docs/                   Arquitectura, operación, fuentes
└── legacy/                 Archivo histórico; NO se despliega (.vercelignore)
```

## Uso local

No hay instalación: es estático.

```bash
python3 -m http.server 8000
# abre http://localhost:8000/
```

Para que el audio funcione hace falta un origen `http(s)` (o `localhost`); abrir
`index.html` con `file://` limita algunas APIs del navegador.

## Comandos

```bash
make help            # lista los comandos
make check           # gates + suite + doctor: lo mismo que la CI
make test            # suite completa (Node + Python)
make gates           # enlaces, HTML, configuración, SEO, presupuesto
make measure         # recalcula data/catalogo.json con cifras medidas
python3 scripts/doctor.py
```

Herramientas internas (todas con `--help`):

| Comando | Qué hace |
|---|---|
| `node scripts/audit-html.mjs [--strict]` | Estructura y accesibilidad del HTML sin dependencias |
| `node scripts/audit-config.mjs` | `.vercelignore`, cabeceras, CSP, YAML de CI y patrones de secreto |
| `node scripts/verify-discovery.mjs` | Canonical, sitemap y robots contra las páginas reales |
| `node scripts/measure.mjs [--check]` | Mide el repositorio y escribe/verifica `data/catalogo.json` |
| `node scripts/deploy-manifest.mjs [--check]` | Regenera `.vercelignore` desde lo que el sitio referencia |
| `node .github/scripts/check-links.mjs` | Enlaces, anclas y recursos locales |
| `python3 scripts/doctor.py` | Estado del repositorio (solo lectura) |

## Pruebas

```bash
node --check data.js && node --test tests/*.test.cjs   # 43 pruebas
python3 -m unittest discover -s tests -t . -v          # 25 pruebas
```

Cubren: matemática de audio (frecuencias, ADSR, curvas de volumen, bandas FFT,
metrónomo), contratos de datos y medios (cada `src` existe), estructura de cada
página (un `<main>`, un `<h1>`, ids únicos, controles etiquetados), descubrimiento
(canonical/sitemap/robots), configuración de despliegue y las propias
herramientas internas.

## Despliegue

Vercel sirve la rama `main`. Reglas relevantes:

- **`.vercelignore` se genera** con `scripts/deploy-manifest.mjs`: publica lo que
  el sitio referencia y excluye `legacy/` (2,3 GB) y los activos que nadie usa.
  La CI falla si el archivo se desactualiza o si se excluye algo referenciado.
- **Cabeceras** (`vercel.json`): `nosniff`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` con micrófono y cámara bloqueados, HSTS, COOP y una CSP
  sin `unsafe-inline` para scripts en las rutas que la soportan.
- **Caché inmutable** para `/assets/`, `/js/` e `/images/` (un año).

## Documentación

| Documento | Contenido |
|---|---|
| [`plataforma/FICHA.md`](plataforma/FICHA.md) | Ficha de producto y límites comerciales |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Cómo se compone el sitio |
| [`docs/ACCESIBILIDAD.md`](docs/ACCESIBILIDAD.md) | Compromisos y mecanismos de accesibilidad |
| [`docs/OPERACION.md`](docs/OPERACION.md) | Despliegue y mantenimiento |
| [`docs/FUENTES.md`](docs/FUENTES.md) | Fuentes técnicas consultadas, con versión |
| [`CAMBIOS.md`](CAMBIOS.md) · [`CHANGELOG.md`](CHANGELOG.md) | Historial de cambios |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Cómo contribuir y qué se exige |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Código de conducta |
| [`AGENTS.md`](AGENTS.md) | Reglas para agentes automáticos |

## Licencia

Código bajo licencia **MIT** (ver [`LICENSE`](LICENSE), copyright Pedro
Belentani, 2026). Las grabaciones, portadas, fotografías, logotipos, nombres de
artistas y marcas conservan sus derechos propios: la licencia del código **no**
concede derechos de explotación sobre esos activos. Ver
[`LICENSES.md`](LICENSES.md).

---

| Campo | Valor |
|---|---|
| Autor | Belentani / NOIACORE |
| Contacto | [belentani7studio@proton.me](mailto:belentani7studio@proton.me) |
| Código | <https://github.com/belentani7/heyduck> |
| Demo | <https://heyduck.vercel.app/> |
