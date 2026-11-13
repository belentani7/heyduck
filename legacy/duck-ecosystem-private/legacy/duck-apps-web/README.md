# DUCK APPS WEB — apps musicales estáticas + catálogo

Todo lo estático del ecosistema Duck en una sola repo, lista para GitHub Pages. Consolida las antiguas repos `duck-apps` y `DuckHTML`.

## Aplicaciones

| Ruta | Producto | Uso principal |
| --- | --- | --- |
| `/` | iDuck | Índice visual de proyectos y enlaces del ecosistema. |
| `/station/` | DUCK STATION | Sintetizador, pads de batería, secuenciador, efectos y grabación WAV. |
| `/fl/` | DUCK FL STUDIO | DAW experimental: piano roll, playlist, mixer y exportación. |
| `/catalog/` | Catálogo Duck | Hub/catálogo estático (antes repo `DuckHTML`, fuente de `Duck-html.zip`). |

## Desarrollo local

No hay servidor ni dependencias: son archivos HTML autocontenidos que pueden abrirse directamente en el navegador. Para servir localmente:

```bash
python3 -m http.server 8000
```

## Publicar en GitHub Pages

Incluye el workflow `.github/workflows/pages.yml`: cada push a `main` publica el sitio.
Activar una vez: Settings → Pages → Source: **GitHub Actions**.

## Validación y CI

- `node scripts/validate-inline-js.mjs` comprueba la sintaxis de todos los bloques JavaScript embebidos.
- `.github/workflows/ci.yml` y `quality.yml` ejecutan la validación en cada push/PR.

## Compatibilidad y principios

DUCK STATION y DUCK FL STUDIO dependen de Web Audio; el audio requiere interacción inicial del usuario y la grabación puede pedir permiso de micrófono. Las apps permanecen autocontenidas para publicarse como sitio estático; los enlaces externos que abren pestaña nueva conservan `rel="noopener noreferrer"`.
