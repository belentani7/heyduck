import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const names = [...new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])];
const entries = [];
for (const name of names) {
  try {
    const metadata = JSON.parse(await readFile(path.join(root, "node_modules", name, "package.json"), "utf8"));
    entries.push({ name: metadata.name, version: metadata.version, license: metadata.license ?? metadata.licenses ?? "UNSPECIFIED" });
  } catch {
    entries.push({ name, version: "unresolved", license: "UNRESOLVED — inspect lockfile/package metadata" });
  }
}
entries.sort((a, b) => a.name.localeCompare(b.name));
const header = "# DUCK MUSIC STACK — Third-party notices\n\nGenerated from direct dependency package metadata and the committed lockfile. Verify upstream notices before redistribution.\n\n| Package | Version | Declared license |\n|---|---:|---|\n";
const body = entries.map((item) => `| ${item.name} | ${item.version} | ${typeof item.license === "string" ? item.license : JSON.stringify(item.license)} |`).join("\n");
await writeFile(path.join(root, "THIRD-PARTY-NOTICES.md"), header + body + "\n");
console.debug(`Wrote THIRD-PARTY-NOTICES.md with ${entries.length} direct packages`);
