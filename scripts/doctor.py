"""Doctor del repositorio: comprueba estructura, reglas y banco de datos.

Solo lectura. Código de salida 1 si hay fallos.

Cambios respecto a la versión anterior:
  - `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md` se exigen y existen (estaban en
    `.gitignore`, así que el doctor pedía archivos que el propio repo ignoraba).
  - El catálogo se valida contra su esquema real (`nombre` + `medido`), no
    contra dos claves que nunca tuvo.
  - Se comprueban los gates de calidad que la CI ejecuta, para que `make check`
    y la CI no puedan divergir.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = [
    "README.md", "LICENSE", "BIBLIA.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md",
    "SECURITY.md", "CHANGELOG.md", "AGENTS.md", ".editorconfig", ".gitattributes",
    "data/catalogo.json", "brand/tokens.json", "plataforma/FICHA.md",
    "plataforma/PLATAFORMA.md", "plataforma/PAYWALL.md", "plataforma/RECURSOS.md",
    "index.html", "sitemap.xml", "robots.txt", "manifest.webmanifest",
    "assets/site.css", "js/audio-core.js", "js/studio.js", "js/hero-gl.js", "js/site.js",
]
GATES = [
    (["node", ".github/scripts/check-links.mjs"], "enlaces y anclas"),
    (["node", "scripts/audit-html.mjs"], "estructura HTML"),
    (["node", "scripts/audit-config.mjs"], "configuración de despliegue"),
    (["node", "scripts/verify-discovery.mjs"], "descubrimiento SEO"),
    (["node", "scripts/measure.mjs", "--check"], "catálogo medido"),
    (["node", "scripts/deploy-manifest.mjs", "--check"], ".vercelignore"),
]


def check() -> list[tuple[str, bool, str]]:
    out: list[tuple[str, bool, str]] = []

    for rel in REQUIRED:
        path = ROOT / rel
        out.append((f"existe {rel}", path.is_file(), "" if path.is_file() else "falta"))

    catalogo = ROOT / "data" / "catalogo.json"
    if catalogo.is_file():
        try:
            data = json.loads(catalogo.read_text(encoding="utf-8"))
            esquema_ok = data.get("nombre") == "heyduck" and isinstance(data.get("medido"), dict)
            out.append(("catalogo.json con nombre y métricas", esquema_ok, "" if esquema_ok else "esquema incompleto"))
        except json.JSONDecodeError as exc:
            out.append(("catalogo.json válido", False, str(exc)))

    readme = ROOT / "README.md"
    if readme.is_file():
        texto = readme.read_text(encoding="utf-8", errors="replace")
        out.append(("README con contenido", len(texto.splitlines()) >= 10, f"{len(texto.splitlines())} líneas"))
        out.append(("README cita la ficha", "plataforma/FICHA.md" in texto, ""))
        out.append(("README en español", "## " in texto and "instal" in texto.lower(), ""))

    for html in list(ROOT.glob("*.html"))[:40]:
        texto = html.read_text(encoding="utf-8", errors="replace")
        out.append((f"{html.name}: doctype", bool(re.match(r"\s*<!doctype html", texto, re.I)), ""))
        out.append((f"{html.name}: lang", bool(re.search(r"<html[^>]+lang=", texto, re.I)), ""))
        out.append((f"{html.name}: viewport", bool(re.search(r"name=[\"']viewport", texto, re.I)), ""))
        mains = len(re.findall(r"<main\b", texto, re.I))
        out.append((f"{html.name}: un solo <main>", mains == 1, f"{mains}" if mains != 1 else ""))

    tokens = ROOT / "brand" / "tokens.json"
    if tokens.is_file():
        try:
            t = json.loads(tokens.read_text(encoding="utf-8"))
            out.append(("tokens con paleta", "paleta" in t, ""))
        except json.JSONDecodeError:
            out.append(("tokens con paleta", False, "json inválido"))

    for comando, etiqueta in GATES:
        try:
            resultado = subprocess.run(
                comando, cwd=ROOT, capture_output=True, text=True, timeout=300
            )
            out.append((f"gate: {etiqueta}", resultado.returncode == 0, "" if resultado.returncode == 0 else "falla"))
        except FileNotFoundError:
            out.append((f"gate: {etiqueta}", False, "node no disponible"))
        except subprocess.TimeoutExpired:
            out.append((f"gate: {etiqueta}", False, "tiempo agotado"))

    return out


def main() -> int:
    resultados = check()
    fallos = [r for r in resultados if not r[1]]
    for nombre, ok, detalle in resultados:
        print(("OK   " if ok else "FALLA ") + nombre + (f"  ({detalle})" if detalle else ""))
    print(f"\n{len(resultados) - len(fallos)}/{len(resultados)} comprobaciones en verde")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
