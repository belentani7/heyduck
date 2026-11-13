import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const modules = [
  "01-portal-vivo",
  "02-identidad-organica",
  "03-motor-produccion",
  "04-laboratorio-sonoro",
  "05-discografia-conexion"
];

const failures = [];
for (const name of modules) {
  const folder = resolve(root, "modules", name);
  for (const file of ["artifact.html", "module.css", "module.js", "README.md"]) {
    const path = resolve(folder, file);
    try {
      const info = await stat(path);
      if (!info.isFile() || info.size === 0) failures.push(`${name}/${file}: empty`);
    } catch { failures.push(`${name}/${file}: missing`); }
  }
  try {
    const source = await readFile(resolve(folder, "module.js"), "utf8");
    execFileSync(process.execPath, ["--check", resolve(folder, "module.js")], { stdio: "pipe" });
    if (!/export\s+(?:function|const|\{)[\s\S]*mount/.test(source)) failures.push(`${name}/module.js: mount export not found`);
  } catch (error) { failures.push(`${name}/module.js: ${error.message}`); }
}

const finalPath = resolve(root, "..", "duck-living-machine.html");
try {
  const html = await readFile(finalPath, "utf8");
  const order = [...html.matchAll(/data-duck-module="(\d{2})"/g)].map(match => match[1]);
  if (order.join(",") !== "01,02,03,04,05") failures.push(`integrated module order: ${order.join(",")}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`duplicate IDs: ${[...new Set(duplicates)].join(",")}`);
  const localAssets = [...html.matchAll(/(?:src|href)="((?!https?:|mailto:|#)[^"]+)"/g)].map(match => match[1]);
  for (const asset of localAssets) {
    try { await stat(resolve(root, "..", asset)); } catch { failures.push(`missing integrated asset: ${asset}`); }
  }
} catch (error) { failures.push(`duck-living-machine.html: ${error.message}`); }

const unexpected = (await readdir(resolve(root, "modules"), { withFileTypes: true }).catch(() => []))
  .filter(entry => entry.isDirectory() && !modules.includes(entry.name))
  .map(entry => `unexpected module folder: ${entry.name}`);
failures.push(...unexpected);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.debug("5 modules present; required artifacts and module syntax verified.");
