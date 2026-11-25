#!/usr/bin/env node
/**
 * audit-config.mjs — Auditoría de configuración de despliegue y seguridad.
 *
 * Verifica lo que nadie mira hasta que arde:
 *   1. `.vercelignore` existe y deja fuera del CDN el archivo histórico.
 *   2. `vercel.json` es JSON válido y declara las cabeceras de seguridad que
 *      el propio sitio promete, incluida una CSP sin `unsafe-inline` para
 *      scripts en las rutas que la soportan.
 *   3. Los workflows de GitHub Actions no tienen claves de primer nivel
 *      duplicadas (el defecto que dejó toda la CI en rojo a los 0 s).
 *   4. Las páginas cubiertas por la CSP estricta no tienen scripts inline.
 *   5. No hay credenciales con forma de credencial en los archivos publicados.
 *
 * Uso: node scripts/audit-config.mjs [--json] [--help]
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { referencedAssets } from "./deploy-manifest.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED_SECURITY_HEADERS = [
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
  "Strict-Transport-Security"
];
const STRICT_CSP_ROUTES = ["/", "/index.html", "/producto", "/ecosistema", "/404"];
const SECRET_PATTERNS = [
  { name: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/ },
  { name: "OpenAI/Anthropic style key", pattern: /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}\b/ },
  { name: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Private key block", pattern: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: "Supabase service key assignment", pattern: /SERVICE_ROLE_KEY\s*[:=]\s*["'][A-Za-z0-9._-]{20,}["']/ }
];
const DEPLOY_EXCLUDED = new Set(["legacy", "node_modules", ".git", ".github", "tests", "scripts", "docs", "data", "locales"]);

const findings = [];
const report = (severity, rule, message) => findings.push({ severity, rule, message });

function readJson(relativePath) {
  const full = join(ROOT, relativePath);
  if (!existsSync(full)) {
    report("error", "missing-file", relativePath + " no existe");
    return null;
  }
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch (error) {
    report("error", "invalid-json", relativePath + ": " + error.message);
    return null;
  }
}

function checkVercelIgnore() {
  const path = join(ROOT, ".vercelignore");
  if (!existsSync(path)) {
    report("error", "vercelignore", "falta .vercelignore: todo el árbol, incluido legacy/, se publicaría");
    return;
  }
  const text = readFileSync(path, "utf8");
  for (const required of ["legacy/", ".env", "node_modules/"]) {
    if (!text.split(/\r?\n/).some((line) => line.trim() === required)) {
      report("error", "vercelignore-missing", ".vercelignore no excluye " + required);
    }
  }
}

/**
 * El despliegue excluye los activos que nadie referencia. Ese es el único
 * fallo posible de la estrategia: excluir algo que una página sí pide y servir
 * un 404 en producción. Esta comprobación lo cierra.
 */
function checkDeployedAssets() {
  const path = join(ROOT, ".vercelignore");
  if (!existsSync(path)) return;
  const patterns = readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  for (const asset of referencedAssets(ROOT)) {
    const blocked = patterns.some((pattern) => {
      if (pattern.endsWith("/")) return asset.startsWith(pattern.slice(1));
      return pattern === "/" + asset || pattern === asset;
    });
    if (blocked) {
      report("error", "excluded-but-referenced", "«" + asset + "» se referencia pero .vercelignore lo excluye del despliegue");
    }
  }
}

function checkVercelHeaders() {
  const config = readJson("vercel.json");
  if (!config) return;
  const headers = (config.headers || []).flatMap((rule) => (rule.headers || []).map((header) => header.key));
  for (const required of REQUIRED_SECURITY_HEADERS) {
    if (!headers.includes(required)) report("error", "security-header", "vercel.json no declara " + required);
  }
  for (const route of STRICT_CSP_ROUTES) {
    const rule = (config.headers || []).find((entry) => entry.source === route);
    const csp = rule && (rule.headers || []).find((header) => header.key === "Content-Security-Policy");
    if (!csp) {
      report("error", "csp", "sin Content-Security-Policy para la ruta " + route);
      continue;
    }
    const scriptSrc = (csp.value.match(/script-src([^;]*)/) || [])[1] || "";
    if (scriptSrc.includes("unsafe-inline") || scriptSrc.includes("unsafe-eval")) {
      report("error", "csp-weak", "script-src de " + route + " permite unsafe-inline/unsafe-eval");
    }
  }
  for (const rule of config.headers || []) {
    if (rule.source === "/images/(.*)" || rule.source === "/js/(.*)" || rule.source === "/assets/(.*)") {
      const cache = (rule.headers || []).find((header) => header.key === "Cache-Control");
      if (!cache || !cache.value.includes("immutable")) {
        report("warning", "cache", rule.source + " sin Cache-Control immutable");
      }
    }
  }
}

function checkWorkflows() {
  const directory = join(ROOT, ".github/workflows");
  if (!existsSync(directory)) return;
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))) {
    const text = readFileSync(join(directory, file), "utf8");
    const keys = [...text.matchAll(/^([A-Za-z0-9_-]+):/gm)].map((match) => match[1]);
    const duplicates = [...new Set(keys.filter((key) => keys.filter((other) => other === key).length > 1))];
    if (duplicates.length) {
      report("error", "workflow-yaml", file + " repite claves de primer nivel: " + duplicates.join(", "));
    }
    if (!/^on:/m.test(text)) report("error", "workflow-yaml", file + " no declara disparadores (on:)");
  }
}

function checkInlineScripts() {
  const routes = {
    "/": "index.html",
    "/producto": "producto.html",
    "/ecosistema": "ecosistema.html",
    "/404": "404.html"
  };
  for (const [route, file] of Object.entries(routes)) {
    const full = join(ROOT, file);
    if (!existsSync(full)) continue;
    const html = readFileSync(full, "utf8");
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/gi)];
    if (inline.length) {
      report("error", "csp-inline-script", file + " tiene " + inline.length + " script inline; la CSP de " + route + " lo bloqueará");
    }
  }
}

function deployableFiles(directory = ROOT, accumulator = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (DEPLOY_EXCLUDED.has(entry) || entry.startsWith(".")) continue;
      deployableFiles(full, accumulator);
    } else if (/\.(html|js|css|json|webmanifest|txt|xml|svg)$/.test(entry)) {
      accumulator.push(full);
    }
  }
  return accumulator;
}

function checkSecrets() {
  for (const file of deployableFiles()) {
    const text = readFileSync(file, "utf8");
    for (const { name, pattern } of SECRET_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        report("error", "secret", relative(ROOT, file).split("\\").join("/") + " contiene un patrón de " + name);
      }
    }
  }
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Uso: node scripts/audit-config.mjs [--json]\n\nAudita .vercelignore, vercel.json, workflows, scripts inline y secretos.");
    return 0;
  }

  checkVercelIgnore();
  checkDeployedAssets();
  checkVercelHeaders();
  checkWorkflows();
  checkInlineScripts();
  checkSecrets();

  const json = argv.includes("--json");
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");

  if (json) {
    console.log(JSON.stringify({ errors: errors.length, warnings: warnings.length, findings }, null, 2));
  } else {
    for (const finding of findings) {
      console.log((finding.severity === "error" ? "ERROR  " : "AVISO  ") + finding.rule + " · " + finding.message);
    }
    console.log("\n" + errors.length + " errores · " + warnings.length + " avisos");
  }
  return errors.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
