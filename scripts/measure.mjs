#!/usr/bin/env node
/**
 * measure.mjs — Cataloga el repositorio con cifras medidas, no declaradas.
 *
 * Escribe (o verifica) `data/catalogo.json`. El valor de esta herramienta es
 * que el catálogo no puede mentir: `--check` recompone las cifras desde el
 * sistema de archivos y falla si el JSON versionado se ha desviado. La CI lo
 * ejecuta en cada push, así que cualquier página nueva obliga a actualizar el
 * catálogo o a romper el build.
 *
 * Uso:
 *   node scripts/measure.mjs            # reescribe data/catalogo.json
 *   node scripts/measure.mjs --check    # solo verifica (código 1 si difiere)
 *   node scripts/measure.mjs --json     # imprime las métricas
 *   node scripts/measure.mjs --help
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "data/catalogo.json");
const IGNORED = new Set([".git", "legacy", "node_modules", ".vercel", "coverage", "dist", "build"]);
const DEPLOY_EXCLUDED = new Set(["legacy", "node_modules", ".git", ".github", "tests", "scripts", "docs", "data", "locales"]);

function walk(directory, filter, accumulator = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (IGNORED.has(entry) || entry.startsWith(".")) continue;
      walk(full, filter, accumulator);
    } else if (filter(entry)) {
      accumulator.push(full);
    }
  }
  return accumulator;
}

function countTests() {
  let nodeTests = 0;
  for (const file of walk(ROOT, (name) => name.endsWith(".test.cjs"))) {
    const text = readFileSync(file, "utf8");
    nodeTests += [...text.matchAll(/^\s*test\(/gm)].length;
  }
  let pythonTests = 0;
  for (const file of walk(ROOT, (name) => name.startsWith("test_") && name.endsWith(".py"))) {
    const text = readFileSync(file, "utf8");
    pythonTests += [...text.matchAll(/^\s{4}def test_/gm)].length;
  }
  return { node: nodeTests, python: pythonTests };
}

/**
 * Bytes que realmente viajan al CDN: se aplica `.vercelignore` (el mismo
 * criterio que usa Vercel) en lugar de suponer que todo el árbol se publica.
 */
function deployableBytes() {
  const ignorePath = join(ROOT, ".vercelignore");
  const patterns = existsSync(ignorePath)
    ? readFileSync(ignorePath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
    : [];
  const directoryPatterns = patterns.filter((pattern) => pattern.endsWith("/")).map((pattern) => pattern.slice(0, -1));
  const filePatterns = new Set(patterns.filter((pattern) => !pattern.endsWith("/")).map((pattern) => pattern.replace(/^\//, "")));

  let total = 0;
  const visit = (directory, prefix) => {
    for (const entry of readdirSync(directory)) {
      const full = join(directory, entry);
      const relativePath = prefix ? prefix + "/" + entry : entry;
      const stats = statSync(full);
      if (stats.isDirectory()) {
        if (entry.startsWith(".") || DEPLOY_EXCLUDED.has(entry)) continue;
        if (directoryPatterns.includes(relativePath)) continue;
        visit(full, relativePath);
        continue;
      }
      if (entry.startsWith(".") || /\.(md|py|mjs|cjs|log|yml|yaml)$/.test(entry)) continue;
      if (filePatterns.has(relativePath)) continue;
      total += stats.size;
    }
  };
  visit(ROOT, "");
  return total;
}

function measure() {
  const pages = walk(ROOT, (name) => name.endsWith(".html")).map((file) => relative(ROOT, file).split("\\").join("/"));
  const scripts = walk(ROOT, (name) => name.endsWith(".js") && !name.endsWith(".min.js"));
  const stylesheets = walk(ROOT, (name) => name.endsWith(".css"));
  const images = walk(ROOT, (name) => /\.(jpe?g|png|webp|avif|svg)$/.test(name));
  const tests = countTests();

  return {
    nombre: "heyduck",
    familia: "producto-musical",
    descripcion: "Sitio estático de portfolio y estación de audio en el navegador.",
    medido: {
      paginas_html: pages.length,
      modulos_js: scripts.length,
      hojas_css: stylesheets.length,
      archivos_de_imagen: images.length,
      pruebas_node: tests.node,
      pruebas_python: tests.python,
      bytes_desplegables: deployableBytes(),
      paginas_publicas: pages.filter((page) => !page.includes("/")).length
    },
    generado: new Date().toISOString()
  };
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Uso: node scripts/measure.mjs [--check|--json]\n\nReescribe data/catalogo.json con cifras medidas del repositorio.");
    return 0;
  }

  const metrics = measure();

  if (argv.includes("--json")) {
    console.log(JSON.stringify(metrics, null, 2));
    return 0;
  }

  if (argv.includes("--check")) {
    if (!existsSync(CATALOG)) {
      console.error("FALTA data/catalogo.json · ejecuta node scripts/measure.mjs");
      return 1;
    }
    const current = JSON.parse(readFileSync(CATALOG, "utf8"));
    const drift = Object.keys(metrics.medido).filter(
      (key) => !current.medido || current.medido[key] !== metrics.medido[key]
    );
    if (current.nombre !== metrics.nombre) {
      console.error("catalogo.json declara otro repositorio: " + current.nombre);
      return 1;
    }
    if (drift.length) {
      console.error(
        "data/catalogo.json desactualizado: " +
          drift.map((key) => `${key} (${current.medido?.[key]} → ${metrics.medido[key]})`).join(", ")
      );
      console.error("Ejecuta: node scripts/measure.mjs");
      return 1;
    }
    console.log("catalogo.json coincide con el repositorio (" + Object.keys(metrics.medido).length + " métricas)");
    return 0;
  }

  metrics.generado = new Date().toISOString();
  writeFileSync(CATALOG, JSON.stringify(metrics, null, 2) + "\n", "utf8");
  console.log("Escrito data/catalogo.json · " + JSON.stringify(metrics.medido));
  return 0;
}

process.exit(main(process.argv.slice(2)));
