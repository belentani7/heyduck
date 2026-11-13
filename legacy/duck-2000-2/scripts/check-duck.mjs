import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const variants = [
  "index.html",
  "legacy-studio-console.html",
  "02-DUCK-FUSIONADO-COMPLETO.html",
  "DUCK-MEGA-UNIFICADO.html",
  "duck-ink-playground.html",
  "duck-human-studio.html",
  "duck-analog-console.html",
  "duck-after-dark-ink.html",
  "duck-living-machine.html"
];
const scripts = ["data.js", "app.js", "duck-ink-playground.js", "duck-after-dark-ink.js"];
const failures = [];
const warnings = [];

for (const relative of variants) {
  const path = resolve(root, relative);
  if (!existsSync(path)) {
    failures.push(`${relative}: missing variant`);
    continue;
  }
  const html = readFileSync(path, "utf8");
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) failures.push(`${relative}: duplicate IDs ${duplicateIds.join(", ")}`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${relative}: expected exactly one h1`);
  if (!/<html[^>]+lang=["']pt-BR["']/i.test(html)) failures.push(`${relative}: lang must be pt-BR`);
  const refs = [...html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref) || ref.includes("${")) continue;
    const clean = ref.split(/[?#]/)[0];
    if (clean && !existsSync(resolve(dirname(path), clean))) failures.push(`${relative}: missing local resource ${clean}`);
  }
}

for (const relative of scripts) {
  try {
    execFileSync(process.execPath, ["--check", resolve(root, relative)], { stdio: "pipe" });
  } catch {
    failures.push(`${relative}: JavaScript syntax error`);
  }
}

const context = { window: {} };
vm.runInNewContext(readFileSync(resolve(root, "data.js"), "utf8"), context, { filename: "data.js" });
const releases = context.window.DUCK_DATA?.singles;
if (!Array.isArray(releases) || releases.length === 0) failures.push("data.js: singles must be a non-empty array");
else {
  const required = ["id", "title", "artist", "type", "cover", "link", "genre"];
  for (const release of releases) {
    for (const field of required) if (!release[field]) failures.push(`data.js: single ${release.id ?? "unknown"} missing ${field}`);
    if (release.cover && !existsSync(resolve(root, release.cover))) failures.push(`data.js: missing cover ${release.cover}`);
    if (release.link === "#") warnings.push(`data.js: ${release.title} has placeholder link`);
    if (!release.source) warnings.push(`data.js: ${release.title} lacks provenance source`);
  }
  const ids = releases.map((release) => String(release.id));
  if (new Set(ids).size !== ids.length) failures.push("data.js: duplicate single IDs");
}

if (warnings.length) console.warn(`WARN ${warnings.length}\n${warnings.join("\n")}`);
if (failures.length) {
  console.error(`FAIL ${failures.length}\n${failures.join("\n")}`);
  process.exit(1);
}
console.debug(`PASS ${variants.length} variants, ${scripts.length} scripts, ${releases.length} singles; ${warnings.length} content warnings.`);
