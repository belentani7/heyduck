#!/usr/bin/env node
/**
 * Verifica que cada recurso local referenciado desde las páginas exista,
 * y que cada ancla (#id) apunte a un id presente en el documento destino.
 * Falla con código 1 si encuentra algo roto.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, relative, join } from "node:path";

function collectHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      out.push(...collectHtml(full));
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const pages = collectHtml(".");
let errors = 0;
let checked = 0;

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])));
  }
  return idCache.get(file);
}

for (const page of pages) {
  // Se ignoran <script> y <style>: sus plantillas JS/CSS no son rutas reales.
  const html = readFileSync(page, "utf8")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const refs = [
    ...[...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m => m[1]),
  ];

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(ref)) {
      if (ref.startsWith("#")) {
        checked++;
        const id = decodeURIComponent(ref.slice(1));
        if (id && !idsOf(page).has(id)) {
          console.error(`✖ ${page}: ancla "#${id}" sin destino en la misma página`);
          errors++;
        }
      }
      continue;
    }
    checked++;
    const [rawPath, hash] = ref.split("#");
    // Las rutas que empiezan por "/" son absolutas respecto a la raíz del sitio.
    const target = rawPath.startsWith("/")
      ? resolve(".", decodeURIComponent(rawPath.replace(/^\/+/, "")) || ".")
      : resolve(dirname(page), decodeURIComponent(rawPath));
    if (!existsSync(target)) {
      console.error(`✖ ${page}: recurso inexistente "${ref}"`);
      errors++;
      continue;
    }
    if (hash && target.endsWith(".html")) {
      const id = decodeURIComponent(hash);
      if (!idsOf(relative(process.cwd(), target)).has(id)) {
        console.error(`✖ ${page}: "${ref}" → ancla #${id} inexistente`);
        errors++;
      }
    }
  }
}

console.log(`\n${checked} referencias comprobadas en ${pages.length} páginas · errores: ${errors}`);
process.exit(errors === 0 ? 0 : 1);
