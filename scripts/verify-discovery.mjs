import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const canonical = "https://belentani7.github.io/heyduck/";
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const robots = readFileSync(resolve(root, "robots.txt"), "utf8");
const homepageFile = resolve(root, "index.html");

// Structural SEO gate: not a functional or deployed-production certification.
assert.ok(statSync(homepageFile).size > 1000, "homepage must not be empty");
const html = readFileSync(homepageFile, "utf8");
for (const element of ["html", "head", "body", "title"]) {
  assert.match(html, new RegExp("<" + element + "(?:\\s|>)", "i"), "missing HTML " + element);
}
assert.doesNotMatch(html, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i,
  "homepage may not be marked noindex");
const head = html.split(/<\/head\s*>/i)[0];
const count = (pattern) => [...head.matchAll(pattern)].length;
assert.equal(count(/<meta\s+name=["']description["'][^>]*>/gi), 1, "one unique description");
assert.equal(count(/<meta\s+name=["']author["'][^>]*>/gi), 1, "one unambiguous author");
assert.equal(count(/<link\s+rel=["']canonical["'][^>]*>/gi), 1, "one canonical link");
assert.ok(head.includes('rel="canonical" href="' + canonical + '"'), "canonical URL must match sitemap");

assert.match(sitemap, /^<\?xml[^>]*\?>/);
assert.match(sitemap, /<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']>/);
const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((x) => x[1].trim());
assert.deepEqual(urls, [canonical],
  "one-page portfolio sitemap must contain only its homepage, not fragment links");
assert.doesNotMatch(sitemap, /<(?:priority|changefreq)>/i,
  "priority/changefreq do not improve Google discovery");
assert.match(robots, /^User-agent:\s*\*\s*$/mi);
assert.match(robots, /^Allow:\s*\/\s*$/mi);
assert.ok(robots.split(/\r?\n/).some((line) => line.trim() === "Sitemap: " + canonical + "sitemap.xml"),
  "robots.txt must reference the canonical sitemap URL");
console.log("SEO smoke OK: homepage present, one sitemap URL, consistent robots.txt");
