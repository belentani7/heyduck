import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const machineRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(machineRoot, "..");
const modules = [
  "01-portal-vivo",
  "02-identidad-organica",
  "03-motor-produccion",
  "04-laboratorio-sonoro",
  "05-discografia-conexion"
];

const fragments = await Promise.all(modules.map(async name => {
  const source = await readFile(resolve(machineRoot, "modules", name, "artifact.html"), "utf8");
  return source.replaceAll("../../../images/", "images/").trim();
}));

const styles = modules.map(name =>
  `  <link rel="stylesheet" href="living-machine/modules/${name}/module.css">`
).join("\n");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#15091f">
  <meta name="description" content="Duck — produtor musical brasileiro. Um portfólio vivo para ouvir, explorar e iniciar uma colaboração.">
  <title>Duck — produtor musical</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="living-machine/core/core.css">
${styles}
</head>
<body>
  <a class="duck-machine__skip" href="#duck-main">Ir para o conteúdo</a>
  <div class="duck-machine__signal" aria-hidden="true"><span></span></div>
  <main id="duck-main" class="duck-machine">
${fragments.map(fragment => fragment.split("\n").map(line => `    ${line}`).join("\n")).join("\n\n")}
  </main>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
  <script src="living-machine/dist/duck-living-machine.js"></script>
</body>
</html>
`;

await writeFile(resolve(projectRoot, "duck-living-machine.html"), html, "utf8");
console.debug(`Composed ${modules.length} modules into duck-living-machine.html`);
