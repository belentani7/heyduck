#!/usr/bin/env node
/**
 * report-budget.mjs — Presupuesto de peso del camino crítico.
 *
 * En este entorno no hay navegador ni Lighthouse disponible (la descarga de
 * Chromium está bloqueada), así que la métrica de rendimiento que sí se puede
 * verificar de forma reproducible es el peso transferido: bytes en disco y
 * bytes comprimidos con gzip, que es como Vercel sirve HTML, CSS y JS.
 *
 * Presupuesto (gzip) del camino crítico de la portada:
 *   HTML + CSS + JS propios ≤ 60 kB. Los tres módulos de audio y el shader
 *   caben con holgura; si alguien mete una librería, el número lo delata.
 *
 * Uso:
 *   node scripts/report-budget.mjs            # informa y valida el presupuesto
 *   node scripts/report-budget.mjs --json
 *   node scripts/report-budget.mjs --help
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CRITICAL_PATH = [
  "index.html",
  "assets/site.css",
  "js/audio-core.js",
  "js/site.js",
  "js/studio.js",
  "js/hero-gl.js"
];
const GZIP_BUDGET_BYTES = 60 * 1024;

function sizesOf(file) {
  const buffer = readFileSync(join(ROOT, file));
  return {
    file,
    raw: buffer.length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    brotli: brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
    }).length
  };
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Uso: node scripts/report-budget.mjs [--json]\n\nMide el peso del camino crítico (crudo, gzip y brotli) y valida el presupuesto.");
    return 0;
  }

  const rows = CRITICAL_PATH.map(sizesOf);
  const bytes = rows.reduce(
    (totals, row) => ({
      raw: totals.raw + row.raw,
      gzip: totals.gzip + row.gzip,
      brotli: totals.brotli + row.brotli
    }),
    { raw: 0, gzip: 0, brotli: 0 }
  );
  const overBudget = bytes.gzip > GZIP_BUDGET_BYTES;

  if (argv.includes("--json")) {
    console.log(
      JSON.stringify({ budget: GZIP_BUDGET_BYTES, total: bytes, overBudget, files: rows }, null, 2)
    );
    return overBudget ? 1 : 0;
  }

  const kb = (value) => (value / 1024).toFixed(1).padStart(6) + " kB";
  console.log("archivo".padEnd(24) + "crudo".padStart(10) + "gzip".padStart(10) + "brotli".padStart(10));
  for (const row of rows) {
    console.log(row.file.padEnd(24) + kb(row.raw) + kb(row.gzip) + kb(row.brotli));
  }
  console.log("-".repeat(54));
  console.log("TOTAL".padEnd(24) + kb(bytes.raw) + kb(bytes.gzip) + kb(bytes.brotli));
  console.log(
    `\nPresupuesto gzip: ${(GZIP_BUDGET_BYTES / 1024).toFixed(0)} kB · usado ${(bytes.gzip / 1024).toFixed(1)} kB ` +
      `(${((bytes.gzip / GZIP_BUDGET_BYTES) * 100).toFixed(0)} %)`
  );

  // Aviso si algún archivo del despliegue se ha vuelto innecesariamente pesado.
  for (const row of rows) {
    if (row.brotli > 200 * 1024) {
      console.warn("AVISO  " + row.file + " supera 200 kB comprimido: revisar si es imprescindible");
    }
  }

  if (overBudget) {
    console.error("FALLA  el camino crítico excede el presupuesto gzip");
    return 1;
  }
  console.log("OK     camino crítico dentro de presupuesto");
  return 0;
}

process.exit(main(process.argv.slice(2)));
