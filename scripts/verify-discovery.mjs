#!/usr/bin/env node
/**
 * verify-discovery.mjs — Contrato de descubrimiento (SEO) del sitio.
 *
 * Verifica que lo que se anuncia en sitemap.xml y robots.txt exista de verdad
 * y coincida con el dominio canónico. El sitemap declaraba una sola URL
 * mientras el sitio publicaba siete páginas; ahora se valida la lista completa
 * contra el sistema de archivos, no contra una expectativa escrita a mano.
 *
 * Uso: node scripts/verify-discovery.mjs [--help]
 */
import assert from "node:assert/strict";
import { readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const canonical = "https://heyduck.vercel.app/";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Uso: node scripts/verify-discovery.mjs\n\nValida canonical, sitemap y robots.txt contra las páginas reales del repositorio.");
  process.exit(0);
}

const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const robots = readFileSync(resolve(root, "robots.txt"), "utf8");
const homepageFile = resolve(root, "index.html");

// --- Portada -------------------------------------------------------------
assert.ok(statSync(homepageFile).size > 1000, "la portada no puede estar vacía");
const html = readFileSync(homepageFile, "utf8");
for (const element of ["html", "head", "body", "title"]) {
  assert.match(html, new RegExp("<" + element + "(?:\\s|>)", "i"), "falta el elemento " + element);
}
assert.doesNotMatch(
  html,
  /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i,
  "la portada no puede marcarse noindex"
);

const head = html.split(/<\/head\s*>/i)[0];
const count = (pattern) => [...head.matchAll(pattern)].length;
assert.equal(count(/<meta\s+name=["']description["'][^>]*>/gi), 1, "una sola meta description");
assert.equal(count(/<meta\s+name=["']author["'][^>]*>/gi), 1, "un solo autor declarado");
assert.equal(count(/<link\s+rel=["']canonical["'][^>]*>/gi), 1, "un solo canonical");
assert.ok(head.includes('rel="canonical" href="' + canonical + '"'), "el canonical debe coincidir con el sitemap");

// --- Sitemap -------------------------------------------------------------
assert.match(sitemap, /^<\?xml[^>]*\?>/);
assert.match(sitemap, /<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']>/);
const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => match[1].trim());
assert.ok(urls.length > 1, "el sitemap debe declarar las páginas públicas, no solo la portada");
assert.equal(new Set(urls).size, urls.length, "el sitemap no puede repetir URLs");
assert.equal(urls[0], canonical, "la portada debe ir primero");
assert.doesNotMatch(sitemap, /<(?:priority|changefreq)>/i, "priority/changefreq no aportan a Google");

for (const url of urls) {
  assert.ok(url.startsWith(canonical), "URL fuera del canónico: " + url);
  const relative = url.slice(canonical.length).replace(/\/+$/, "");
  const target = resolve(root, relative ? relative + ".html" : "index.html");
  assert.ok(existsSync(target), "el sitemap anuncia una página inexistente: " + url);
}

// --- robots.txt ----------------------------------------------------------
assert.match(robots, /^User-agent:\s*\*\s*$/mi);
assert.match(robots, /^Allow:\s*\/\s*$/mi);
assert.ok(
  robots.split(/\r?\n/).some((line) => line.trim() === "Sitemap: " + canonical + "sitemap.xml"),
  "robots.txt debe declarar el sitemap canónico"
);

console.debug(`SEO smoke OK: ${urls.length} URLs del sitemap existen y coinciden con el canónico`);
