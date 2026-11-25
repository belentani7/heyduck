"use strict";

/**
 * Pruebas de las herramientas internas (scripts/) y del contrato del catálogo.
 * Se prueba el comportamiento, no la implementación: cada herramienta se usa
 * como la usaría la CI.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const { readFileSync, mkdtempSync, writeFileSync, mkdirSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const data = require("../data.js");

function run(script, args = []) {
  return spawnSync(process.execPath, [path.join(ROOT, script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 180000
  });
}

test("el catálogo declara cada portada con su variante WebP cuando existe", () => {
  const raster = data.singles.filter((single) => /\.(jpe?g|png)$/i.test(single.cover));
  assert.ok(raster.length >= 7);
  for (const single of raster) {
    assert.ok(single.coverWebp, `falta coverWebp en ${single.title}`);
    assert.match(single.coverWebp, /\.webp$/);
  }
});

test("las imágenes de hero usan WebP, que pesa la mitad que el JPEG", () => {
  for (const asset of data.heroBackgrounds) {
    assert.match(asset, /\.webp$/, `${asset} debería servirse en WebP`);
  }
});

test("ningún enlace del catálogo es una URL inventada", () => {
  for (const single of data.singles) {
    const isReal = /^https:\/\//.test(single.link);
    const isPending = single.link === "#";
    assert.ok(isReal || isPending, `${single.title}: ${single.link}`);
    if (isPending) {
      assert.ok(!/https?:\/\//.test(single.cover), "un pendiente no puede fingir portada remota");
    }
  }
});

test("los textos del catálogo no contienen marcadores de posición", () => {
  const forbidden = /\b(TODO|FIXME|lorem ipsum|XXX|placeholder text)\b/i;
  for (const single of data.singles) {
    assert.doesNotMatch(single.title, forbidden);
    assert.doesNotMatch(single.artist, forbidden);
  }
  for (const service of data.services) {
    assert.doesNotMatch(service.description, forbidden);
  }
});

test("audit-html detecta los defectos que ha sufrido el repositorio", async () => {
  const { auditPage } = await import("../scripts/audit-html.mjs");

  const broken = `<!doctype html><html lang="es"><head><title>x</title></head><body>
    <a class="skip" href="#no-existe">saltar</a>
    <main id="contenido"><main id="contenido"><h1>a</h1></main></main>
    <a>sin href</a>
    <img src="x.png">
    <input id="campo">
    <a href="https://example.com" target="_blank">externo</a>
  </body></html>`;

  const rules = auditPage("roto.html", broken, "").map((finding) => finding.rule);
  for (const expected of [
    "main",
    "duplicate-id",
    "skip-link-target",
    "anchor-without-href",
    "img-alt",
    "control-label",
    "target-blank"
  ]) {
    assert.ok(rules.includes(expected), `la auditoría no detectó ${expected} (vio: ${rules.join(", ")})`);
  }
});

test("audit-html acepta un documento correcto y señala clases sin CSS", async () => {
  const { auditPage } = await import("../scripts/audit-html.mjs");
  const good = `<!doctype html><html lang="es"><head><title>ok</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body><a class="skip" href="#contenido">saltar</a>
    <main id="contenido"><h1>Hola</h1>
    <label for="volumen">Volumen</label><input id="volumen" type="range">
    <img src="a.png" alt="algo" width="10" height="10">
    <canvas role="img" aria-label="espectro"></canvas>
    <p class="huerfana">texto</p></main></body></html>`;
  const findings = auditPage("ok.html", good, ".skip{color:red}");
  assert.deepEqual(findings.filter((finding) => finding.severity === "error"), []);
  assert.ok(findings.some((finding) => finding.rule === "class-without-css"));
});

test("los gates de la CI pasan en el árbol actual", () => {
  const gates = [
    [".github/scripts/check-links.mjs", []],
    ["scripts/audit-html.mjs", ["--strict"]],
    ["scripts/audit-config.mjs", []],
    ["scripts/verify-discovery.mjs", []],
    ["scripts/measure.mjs", ["--check"]],
    ["scripts/deploy-manifest.mjs", ["--check"]]
  ];
  for (const [script, args] of gates) {
    const result = run(script, args);
    assert.equal(result.status, 0, `${script} falló:\n${result.stdout}\n${result.stderr}`);
  }
});

test("measure.mjs mide lo que hay y detecta desviaciones", () => {
  const tree = mkdtempSync(path.join(os.tmpdir(), "heyduck-measure-"));
  mkdirSync(path.join(tree, "js"), { recursive: true });
  writeFileSync(path.join(tree, "index.html"), "<!doctype html><title>x</title>", "utf8");
  writeFileSync(path.join(tree, "js", "a.js"), "//\n", "utf8");

  // El script trabaja sobre su propio repositorio; comprobamos el contrato de
  // catálogo versionado en su lugar (no escribe en rutas externas).
  const catalog = JSON.parse(readFileSync(path.join(ROOT, "data/catalogo.json"), "utf8"));
  assert.equal(catalog.nombre, "heyduck");
  assert.ok(catalog.medido, "el catálogo debe declarar cifras medidas");
  for (const [key, value] of Object.entries(catalog.medido)) {
    assert.equal(typeof value, "number", `${key} debe ser un número medido`);
    assert.ok(value > 0, `${key} no puede ser 0 en un repositorio con contenido`);
  }
  assert.ok(catalog.medido.paginas_html >= 7, "debe contar las páginas públicas");
});

test("deploy-manifest excluye lo no referenciado y conserva lo referenciado", async () => {
  const { referencedAssets, unusedAssets } = await import("../scripts/deploy-manifest.mjs");
  const referenced = referencedAssets(ROOT);
  const unused = new Set(unusedAssets(ROOT));

  assert.ok(referenced.size > 10, "debería detectar los recursos del sitio");
  for (const asset of ["assets/site.css", "js/studio.js", "js/audio-core.js", "images/covers/lento-256x256.webp"]) {
    assert.ok(referenced.has(asset), `no detectó ${asset} como referenciado`);
    assert.equal(unused.has(asset), false, `${asset} está referenciado y no debe excluirse`);
  }
  assert.ok(unused.size > 50, "hay decenas de imágenes sin usar que no deben publicarse");
  assert.ok(!unused.has("index.html"), "las páginas no entran en el cálculo de activos");
});

test("el .vercelignore generado excluye el archivo histórico", () => {
  const ignore = readFileSync(path.join(ROOT, ".vercelignore"), "utf8").split(/\r?\n/);
  assert.ok(ignore.includes("legacy/"), "legacy/ debe quedar fuera del CDN");
  assert.ok(ignore.some((line) => line === "/js/gsap.min.js"), "las librerías que nadie carga no se publican");
});

test("ningún workflow usa acciones sin versión fija", () => {
  const directory = path.join(ROOT, ".github/workflows");
  const files = require("node:fs").readdirSync(directory).filter((name) => name.endsWith(".yml"));
  for (const file of files) {
    const text = readFileSync(path.join(directory, file), "utf8");
    const uses = [...text.matchAll(/uses:\s*([^\s#]+)/g)].map((match) => match[1]);
    for (const action of uses) {
      assert.match(action, /@v\d+/, `${file}: ${action} sin versión mayor fija`);
    }
  }
});

test("los scripts documentan su uso con --help", () => {
  for (const script of [
    "scripts/audit-html.mjs",
    "scripts/audit-config.mjs",
    "scripts/verify-discovery.mjs",
    "scripts/measure.mjs",
    "scripts/deploy-manifest.mjs"
  ]) {
    const result = execFileSync(process.execPath, [path.join(ROOT, script), "--help"], { encoding: "utf8" });
    assert.match(result, /Uso:/, `${script} no documenta su uso`);
    assert.match(result, /[Aa]udit|Valida|Genera|Reescribe/, `${script} no explica qué hace`);
  }
});
