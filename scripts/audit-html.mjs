#!/usr/bin/env node
/**
 * audit-html.mjs — Auditoría estructural y de accesibilidad sin dependencias.
 *
 * Motivo: el repositorio no tiene `node_modules` a propósito y no queremos
 * introducir una cadena de build para vigilar el HTML. Este script cubre los
 * fallos que realmente han ocurrido en este proyecto:
 *
 *   - bloques `<main>`, `<h1>` o `<header>` duplicados por inyecciones masivas;
 *   - `id` repetidos (rompen `aria-labelledby` y los enlaces de ancla);
 *   - enlaces de salto que apuntan a un id inexistente;
 *   - `<a>` sin `href` y `<a target="_blank">` sin `rel="noopener"`;
 *   - imágenes sin `alt` o sin dimensiones intrínsecas (CLS);
 *   - controles de formulario sin etiqueta accesible;
 *   - clases usadas en el HTML sin ninguna regla CSS en la página;
 *   - saltos en la jerarquía de encabezados.
 *
 * Uso:
 *   node scripts/audit-html.mjs            # informa y falla si hay errores
 *   node scripts/audit-html.mjs --strict   # los avisos también fallan
 *   node scripts/audit-html.mjs --json     # salida legible por máquina
 *   node scripts/audit-html.mjs --help
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const IGNORED_DIRECTORIES = new Set([".git", "legacy", "node_modules", ".vercel", "coverage"]);
const SEVERITY_ORDER = { error: 0, warning: 1 };

/** Recorre el árbol y devuelve las rutas de todos los .html publicables. */
export function collectPages(root) {
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry) || entry.startsWith(".")) continue;
        walk(full);
      } else if (entry.endsWith(".html")) {
        pages.push(relative(root, full).split("\\").join("/"));
      }
    }
  };
  walk(root);
  return pages.sort();
}

/** Devuelve solo el cuerpo del documento (sin `<head>`) y sin script/style. */
export function bodyOf(html) {
  const withoutHead = html.replace(/<head[\s\S]*?<\/head>/i, "");
  return withoutHead
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

/** Atributos de una etiqueta de apertura en forma de objeto. */
export function attributesOf(tagSource) {
  const attrs = {};
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match;
  while ((match = pattern.exec(tagSource))) {
    const name = match[1].toLowerCase();
    if (name === "class" || name === "href" || name === "src") {
      attrs[name] = match[3] ?? match[4] ?? match[5] ?? "";
      continue;
    }
    attrs[name] = match[3] ?? match[4] ?? match[5] ?? "";
  }
  return attrs;
}

function tags(html, name) {
  const pattern = new RegExp("<" + name + "\\b([^>]*)>", "gi");
  const out = [];
  let match;
  while ((match = pattern.exec(html))) {
    out.push(attributesOf(match[1]));
  }
  return out;
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

/**
 * Audita un documento. Devuelve un array de hallazgos
 * `{ file, severity, rule, message }`.
 */
export function auditPage(file, html, cssText) {
  const findings = [];
  const body = bodyOf(html);

  const report = (severity, rule, message) => {
    findings.push({ file, severity, rule, message });
  };

  // --- Estructura del documento ---
  if (!/^\s*<!doctype\s+html/i.test(html)) report("error", "doctype", "falta <!DOCTYPE html> al inicio");
  const htmlTag = html.match(/<html\b([^>]*)>/i);
  if (!htmlTag) report("error", "html-root", "falta la etiqueta <html>");
  else if (!/\blang\s*=/i.test(htmlTag[1])) report("error", "lang", "<html> sin atributo lang");
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) report("error", "viewport", "falta meta viewport");

  const mains = count(body, /<main\b/gi);
  if (mains === 0) report("error", "main", "no hay ningún <main>");
  if (mains > 1) report("error", "main", mains + " elementos <main> (debe haber exactamente uno)");

  const h1s = count(body, /<h1\b/gi);
  if (h1s === 0) report("error", "h1", "no hay ningún <h1>");
  if (h1s > 1) report("error", "h1", h1s + " elementos <h1> (debe haber exactamente uno)");

  const titles = count(html, /<title\b/gi);
  if (titles !== 1) report("error", "title", titles + " elementos <title> (debe haber exactamente uno)");

  for (const [rule, pattern, label] of [
    ["description", /<meta\s+name=["']description["']/gi, "meta description"],
    ["canonical", /<link\s+rel=["']canonical["']/gi, "link canonical"]
  ]) {
    const found = count(html, pattern);
    if (found > 1) report("error", rule, found + " × " + label + " (debe ser único)");
  }

  // --- ids (se recogen antes para validar saltos sin regex dinámica) ---
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);

  // --- Enlaces de salto ---
  const skipLinks = [...body.matchAll(/<a\b([^>]*class=["'][^"']*\bskip(?:-link)?\b[^"']*["'][^>]*)>/gi)];
  if (skipLinks.length > 1) {
    report("error", "skip-link", skipLinks.length + " enlaces de salto (debe haber uno)");
  }
  for (const link of skipLinks) {
    const href = (link[1].match(/href=["']([^"']*)["']/i) || [])[1] || "";
    if (!href.startsWith("#")) {
      report("error", "skip-link-target", "el enlace de salto debe apuntar a un fragmento interno");
      continue;
    }
    const id = href.slice(1);
    if (!ids.includes(id)) {
      report("error", "skip-link-target", "el enlace de salto apunta a #" + id + ", que no existe");
    }
  }

  // --- ids duplicados ---
  const seen = new Map();
  for (const id of ids) seen.set(id, (seen.get(id) || 0) + 1);
  for (const [id, times] of seen) {
    if (times > 1) report("error", "duplicate-id", 'id="' + id + '" repetido ' + times + " veces");
  }

  // --- Enlaces ---
  for (const tag of tags(body, "a")) {
    const label = (tag["aria-label"] || "").trim();
    if (!("href" in tag)) {
      report("error", "anchor-without-href", "hay un <a> sin href (elemento no interactivo)");
      continue;
    }
    if (tag.href.trim() === "" || tag.href.trim() === "#") {
      report("warning", "empty-href", 'enlace con href vacío o "#"');
    }
    if (String(tag.target).toLowerCase() === "_blank") {
      const rel = String(tag.rel || "").toLowerCase();
      if (!rel.includes("noopener")) {
        report("warning", "target-blank", 'target="_blank" sin rel="noopener"');
      }
    }
    if (!label && (tag.cls || "").includes("card")) {
      report("warning", "link-name", "tarjeta enlazada sin aria-label explícito");
    }
  }

  // --- Imágenes ---
  for (const tag of tags(body, "img")) {
    if (!("alt" in tag)) report("error", "img-alt", "imagen sin atributo alt");
    if (!("width" in tag) || !("height" in tag)) {
      report("warning", "img-dimensions", "imagen sin width/height (riesgo de CLS)");
    }
  }

  // --- Controles de formulario ---
  const labelFor = new Set(
    [...body.matchAll(/<label\b[^>]*\bfor=["']([^"']+)["']/gi)].map((m) => m[1])
  );
  for (const name of ["input", "select", "textarea"]) {
    for (const tag of tags(body, name)) {
      const type = String(tag.type || "").toLowerCase();
      if (name === "input" && ["hidden", "submit", "button"].includes(type)) continue;
      const id = tag.id || "";
      const labelled = labelFor.has(id) || tag["aria-label"] || tag["aria-labelledby"] || tag.title;
      if (!labelled) report("error", "control-label", "<" + name + (id ? ' id="' + id + '"' : "") + "> sin etiqueta accesible");
      if (name === "button") continue;
    }
  }
  for (const tag of tags(body, "button")) {
    if (!("type" in tag)) report("warning", "button-type", "<button> sin atributo type");
  }

  // --- Jerarquía de encabezados ---
  const headings = [...body.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  let previous = 0;
  for (const level of headings) {
    if (previous && level > previous + 1) {
      report("warning", "heading-order", "salto de h" + previous + " a h" + level);
    }
    previous = level;
  }

  // --- Aviso: canvas con role="img" necesita nombre accesible ---
  for (const tag of tags(body, "canvas")) {
    if (tag.role === "img" && !tag["aria-label"] && !tag["aria-labelledby"]) {
      report("error", "canvas-name", 'canvas con role="img" sin nombre accesible');
    }
  }

  // --- Clases usadas sin regla CSS en la página ---
  if (cssText) {
    const used = new Set();
    for (const m of body.matchAll(/class=["']([^"']+)["']/g)) {
      m[1].split(/\s+/).filter(Boolean).forEach((name) => used.add(name));
    }
    const defined = new Set([...cssText.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));
    for (const name of used) {
      if (!defined.has(name)) {
        report("warning", "class-without-css", "clase ." + name + " sin ninguna regla CSS en la página");
      }
    }
  }

  return findings;
}

/** Texto CSS propio de la página: bloques <style> + hojas locales enlazadas. */
export function cssOf(file, html, root) {
  const parts = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  for (const link of html.matchAll(/<link\b[^>]*href=["']([^"']+\.css)["']/gi)) {
    const target = resolve(root, dirname(file), link[1].replace(/^\//, ""));
    if (existsSync(target)) parts.push(readFileSync(target, "utf8"));
  }
  return parts.join("\n");
}

/** Resuelve referencias locales y anclas entre documentos. */
export function auditLinks(file, html, root) {
  const findings = [];
  const body = bodyOf(html);
  const idCache = new Map();
  const idsOf = (target) => {
    if (!idCache.has(target)) {
      const text = readFileSync(target, "utf8");
      idCache.set(target, new Set([...text.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1])));
    }
    return idCache.get(target);
  };

  for (const tag of tags(body, "a")) {
    const ref = tag.href;
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const [rawPath, hash] = ref.split("#");
    if (!rawPath) continue; // ancla interna: la cubre el chequeo de skip-link e ids

    const target = rawPath.startsWith("/")
      ? resolve(root, rawPath.replace(/^\/+/, "") || ".")
      : resolve(root, dirname(file), decodeURIComponent(rawPath));

    if (!existsSync(target)) {
      findings.push({ file, severity: "error", rule: "broken-link", message: 'enlace roto a "' + ref + '"' });
      continue;
    }
    if (hash && target.endsWith(".html") && !idsOf(target).has(hash)) {
      findings.push({
        file,
        severity: "error",
        rule: "broken-anchor",
        message: '"' + ref + '" apunta a un ancla inexistente'
      });
    }
  }

  for (const tag of tags(body, "img")) {
    const src = tag.src || "";
    if (!src || /^(https?:|data:)/i.test(src)) continue;
    const target = resolve(root, dirname(file), decodeURIComponent(src));
    if (!existsSync(target)) {
      findings.push({ file, severity: "error", rule: "broken-image", message: 'imagen inexistente "' + src + '"' });
    }
  }

  return findings;
}

export function auditRepository(root) {
  const findings = [];
  for (const file of collectPages(root)) {
    const html = readFileSync(join(root, file), "utf8");
    findings.push(...auditPage(file, html, cssOf(file, html, root)));
    findings.push(...auditLinks(file, html, root));
  }
  return findings;
}

function printHelp() {
  console.log(`Uso: node scripts/audit-html.mjs [opciones]

  --strict   Los avisos también hacen fallar el comando.
  --json     Emite los hallazgos en JSON.
  --help     Muestra esta ayuda.

Sin opciones, recorre todas las páginas HTML del repositorio (excluyendo
legacy/) e informa de errores y avisos de estructura y accesibilidad.`);
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return 0;
  }

  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const strict = argv.includes("--strict");
  const json = argv.includes("--json");

  const findings = auditRepository(root).sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.file.localeCompare(b.file)
  );

  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");

  if (json) {
    console.log(JSON.stringify({ errors: errors.length, warnings: warnings.length, findings }, null, 2));
  } else {
    for (const finding of findings) {
      const tag = finding.severity === "error" ? "ERROR  " : "AVISO  ";
      console.log(tag + finding.file + " · " + finding.rule + " · " + finding.message);
    }
    console.log(
      "\n" + errors.length + " errores · " + warnings.length + " avisos en " + collectPages(root).length + " páginas"
    );
  }

  if (errors.length) return 1;
  if (strict && warnings.length) return 1;
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  process.exit(main(process.argv.slice(2)));
}
