#!/usr/bin/env node
/**
 * deploy-manifest.mjs — Genera `.vercelignore` a partir de lo que el sitio usa.
 *
 * Problema real: el repositorio publica 2,3 GB de `legacy/` y 25 MB de imágenes
 * de las que solo una parte se referencia desde el producto. Este script
 * calcula qué archivos se mencionan de verdad en HTML, JS, CSS y el manifiesto,
 * y escribe un `.vercelignore` que excluye el resto.
 *
 * El resultado es determinista: los archivos se listan ordenados y la cabecera
 * explica cómo regenerarlo. `scripts/audit-config.mjs` comprueba además que
 * ningún recurso referenciado quede fuera del despliegue, que es el único fallo
 * posible de esta estrategia.
 *
 * Uso:
 *   node scripts/deploy-manifest.mjs           # reescribe .vercelignore
 *   node scripts/deploy-manifest.mjs --check    # falla si está desactualizado
 *   node scripts/deploy-manifest.mjs --help
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, ".vercelignore");
const SCAN_IGNORED = new Set([".git", "legacy", "node_modules", ".vercel", "coverage", "dist", "build"]);
const REFERENCE_SOURCES = /\.(html|js|css|webmanifest|mjs|cjs)$/;
const ASSET = /(?:images|assets|brand|js)\/[\w./-]+\.(?:jpg|jpeg|png|webp|avif|svg|css|js)/g;

const STATIC_EXCLUSIONS = `# ============================================================================
# .vercelignore — GENERADO. No editar a mano.
#
#   node scripts/deploy-manifest.mjs          → reescribe este archivo
#   node scripts/deploy-manifest.mjs --check  → verifica en CI
#
# Criterio: se publica lo que el sitio referencia y se excluye todo lo demás.
# La carpeta producto/ se excluye, entre otras razones, porque su existencia
# crea una ruta ambigua con producto.html cuando cleanUrls está activo.
# Los archivos excluidos siguen en Git (la historia no se reescribe); solo
# dejan de viajar al CDN y de ser descargables.
# ============================================================================

# Archivo histórico: 19.092 archivos, 2,3 GB de exportaciones antiguas
legacy/

# Documentación de ingeniería, pruebas y herramientas internas
tests/
scripts/
docs/
data/
locales/
plataforma/
site/
producto/
brand/*.css
brand/*.json
brand/*.md
brand/logo.svg
magic/package.json
magic/package-lock.json

# Metadatos del repositorio
.github/
.gitignore
.gitattributes
.editorconfig
.htmlvalidate.json
Makefile
pytest.ini
AGENTS.md
BIBLIA.md
CAMBIOS.md
CHANGELOG.md
ORGANIZACION.md
AUDITORIA_ESTADO.md
AUDITORIA-ESTADO-Y-PLAN.md
LICENSES.md
SECURITY.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
/package.json
/package-lock.json
node_modules/
data.js.map

# Entorno local y secretos
.vercel
node_modules/
*.log
.DS_Store
.env
.env.*
.env.local

# --- Activos no referenciados por ninguna página (calculado) -----------------`;

function walk(directory, accumulator = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (SCAN_IGNORED.has(entry) || entry.startsWith(".")) continue;
      walk(full, accumulator);
    } else {
      accumulator.push(full);
    }
  }
  return accumulator;
}

/**
 * Rutas de recurso citadas por el código *publicable*.
 * Se ignoran scripts/, tests/ y .github/: son herramientas internas y sus
 * menciones no implican que el navegador vaya a pedir el archivo.
 */
export function referencedAssets(root = ROOT) {
  const referenced = new Set();
  for (const file of walk(root)) {
    const relativePath = relative(root, file).split("\\").join("/");
    if (/^(scripts|tests|\.github)\//.test(relativePath)) continue;
    if (!REFERENCE_SOURCES.test(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(ASSET)) referenced.add(match[0]);
  }
  return referenced;
}

/** Archivos publicables que nadie referencia. */
export function unusedAssets(root = ROOT) {
  const referenced = referencedAssets(root);
  const candidates = walk(root).filter((file) => {
    const relativePath = relative(root, file).split("\\").join("/");
    if (!/^(images|assets|brand|js)\//.test(relativePath)) return false;
    if (!/\.(jpe?g|png|webp|avif|svg|css|js)$/.test(relativePath)) return false;
    if (relativePath.endsWith(".min.js") === false && relativePath.startsWith("js/") === false) {
      // los módulos propios de js/ se referencian desde el HTML
    }
    return !referenced.has(relativePath);
  });
  return candidates.map((file) => relative(root, file).split("\\").join("/")).sort();
}

export function render(unused) {
  const lines = unused.map((file) => "/" + file);
  return STATIC_EXCLUSIONS + "\n" + lines.join("\n") + "\n";
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Uso: node scripts/deploy-manifest.mjs [--check]\n\nGenera .vercelignore excluyendo los activos que ninguna página usa.");
    return 0;
  }

  const unused = unusedAssets();
  const content = render(unused);

  if (argv.includes("--check")) {
    if (!existsSync(TARGET)) {
      console.error("FALTA .vercelignore · ejecuta node scripts/deploy-manifest.mjs");
      return 1;
    }
    const current = readFileSync(TARGET, "utf8");
    if (current !== content) {
      const currentLines = new Set(current.split(/\r?\n/));
      const missing = content.split(/\r?\n/).filter((line) => line && !currentLines.has(line));
      console.error(
        ".vercelignore desactualizado · faltan " + missing.length + " entradas; ejecuta node scripts/deploy-manifest.mjs"
      );
      for (const line of missing.slice(0, 10)) console.error("  " + line);
      return 1;
    }
    console.log(".vercelignore al día · " + unused.length + " activos no referenciados excluidos");
    return 0;
  }

  writeFileSync(TARGET, content, "utf8");
  console.log("Escrito .vercelignore · " + unused.length + " activos no referenciados excluidos");
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  process.exit(main(process.argv.slice(2)));
}
