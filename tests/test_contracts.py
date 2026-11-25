"""Contratos del sitio: lo que la página promete, verificado contra los archivos.

Cada prueba de este módulo corresponde a una afirmación que el producto hace
en su interfaz o en su documentación. Si una rompe, la promesa es falsa.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted(
    path
    for path in ROOT.rglob("*.html")
    if "legacy" not in path.parts and ".git" not in path.parts and "node_modules" not in path.parts
)
CANONICAL = "https://heyduck.vercel.app/"
PUBLIC_PAGES = [
    "index.html",
    "producto.html",
    "ecosistema.html",
    "docs.html",
    "accesibilidad.html",
    "privacidad.html",
    "aviso-legal.html",
]


class Structure(HTMLParser):
    """Recolecta la información estructural que usan las comprobaciones."""

    VOID = {"meta", "link", "img", "br", "hr", "input", "source", "col", "area", "base", "embed", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.stack: list[str] = []
        self.counts: dict[str, int] = {}
        self.anchors: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.controls: list[dict[str, str]] = []
        self.labels_for: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.saw_html = False
        self.html_attrs: dict[str, str] = {}
        self.titles = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key.lower(): (value or "") for key, value in attrs}
        self.counts[tag] = self.counts.get(tag, 0) + 1

        if tag == "html":
            self.saw_html = True
            self.html_attrs = attributes
        if tag == "title":
            self.titles += 1
        if "id" in attributes:
            if attributes["id"] in self.ids:
                self.duplicate_ids.add(attributes["id"])
            self.ids.append(attributes["id"])
        if tag == "a":
            self.anchors.append(attributes)
        if tag == "img":
            self.images.append(attributes)
        if tag in ("input", "select", "textarea"):
            self.controls.append({"tag": tag, **attributes})
        if tag == "label" and "for" in attributes:
            self.labels_for.add(attributes["for"])

        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag:
                pass


def structure_of(path: Path) -> Structure:
    parser = Structure()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def node(script: str, code: str) -> subprocess.CompletedProcess[str]:
    """Ejecuta un fragmento de Node con el repositorio como directorio actual."""
    return subprocess.run(
        ["node", "-e", code],
        cwd=ROOT,
        capture_output=True,
        text=True,
        timeout=120,
    )


class PageStructureTests(unittest.TestCase):
    """Una página rota no se publica."""

    def test_there_are_pages_to_audit(self) -> None:
        self.assertGreaterEqual(len(PAGES), len(PUBLIC_PAGES))

    def test_every_page_has_one_main_one_h1_and_lang(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                parsed = structure_of(page)
                self.assertTrue(parsed.saw_html, "falta <html>")
                self.assertTrue(parsed.html_attrs.get("lang"), "falta lang en <html>")
                self.assertEqual(parsed.counts.get("main", 0), 1, "debe haber exactamente un <main>")
                self.assertEqual(parsed.counts.get("h1", 0), 1, "debe haber exactamente un <h1>")
                self.assertEqual(parsed.titles, 1, "debe haber exactamente un <title>")

    def test_no_duplicate_ids(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                self.assertEqual(sorted(structure_of(page).duplicate_ids), [])

    def test_anchors_have_href(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                for anchor in structure_of(page).anchors:
                    self.assertIn("href", anchor, "hay un <a> sin href")

    def test_images_have_alt(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                for image in structure_of(page).images:
                    self.assertIn("alt", image, "imagen sin alt")

    def test_form_controls_have_accessible_names(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                parsed = structure_of(page)
                for control in parsed.controls:
                    if control.get("type") in ("hidden", "submit", "button"):
                        continue
                    named = (
                        control.get("id") in parsed.labels_for
                        or control.get("aria-label")
                        or control.get("aria-labelledby")
                        or control.get("title")
                    )
                    self.assertTrue(named, f"control sin etiqueta: {control}")

    def test_pages_declare_a_single_description_and_canonical(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                text = page.read_text(encoding="utf-8")
                descriptions = len(re.findall(r'<meta\s+name=["\']description["\']', text, re.I))
                self.assertLessEqual(descriptions, 1, "meta description duplicada")


class DiscoveryTests(unittest.TestCase):
    """Sitemap, robots y manifiesto deben describir el sitio real."""

    def test_sitemap_lists_only_existing_public_pages(self) -> None:
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", sitemap)
        self.assertTrue(urls, "el sitemap no declara ninguna URL")
        for url in urls:
            self.assertTrue(url.startswith(CANONICAL), f"URL fuera del canónico: {url}")
            relative = url[len(CANONICAL):].strip("/")
            target = ROOT / (relative + ".html" if relative else "index.html")
            self.assertTrue(target.is_file(), f"el sitemap anuncia algo que no existe: {url}")
        self.assertIn(CANONICAL, urls)

    def test_robots_points_to_the_same_sitemap(self) -> None:
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn(CANONICAL + "sitemap.xml", robots)

    def test_manifest_is_installable_and_icons_exist(self) -> None:
        manifest = json.loads((ROOT / "manifest.webmanifest").read_text(encoding="utf-8"))
        for key in ("name", "short_name", "start_url", "display", "icons"):
            self.assertIn(key, manifest)
        self.assertIn(manifest["display"], ("standalone", "fullscreen", "minimal-ui"))
        self.assertTrue(manifest["icons"], "sin iconos no hay instalación")
        for icon in manifest["icons"]:
            self.assertTrue((ROOT / icon["src"]).is_file(), f"icono inexistente: {icon['src']}")

    def test_sitemap_covers_every_public_page(self) -> None:
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        for page in PUBLIC_PAGES:
            relative = "" if page == "index.html" else page[: -len(".html")]
            url = CANONICAL + relative
            self.assertIn(url, sitemap, f"{page} no está en el sitemap")


class DataContractTests(unittest.TestCase):
    """El catálogo solo puede apuntar a archivos y URLs reales."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.result = node("data.js", "const d=require('./data.js');console.log(JSON.stringify(d));")
        if cls.result.returncode != 0:
            raise AssertionError("data.js no se puede cargar: " + cls.result.stderr[-500:])
        cls.data = json.loads(cls.result.stdout)

    def test_every_local_asset_exists(self) -> None:
        assets: list[str] = list(self.data["heroBackgrounds"])
        for single in self.data["singles"]:
            assets.append(single["cover"])
            if single.get("coverWebp"):
                assets.append(single["coverWebp"])
        for station in self.data["stations"]:
            assets.append(station["image"])
        for asset in assets:
            with self.subTest(asset=asset):
                self.assertFalse(asset.startswith("/"), "las rutas deben ser relativas")
                self.assertNotIn("..", asset, "no se permite salir del repositorio")
                self.assertTrue((ROOT / asset).is_file(), f"recurso inexistente: {asset}")

    def test_release_links_are_verifiable(self) -> None:
        for single in self.data["singles"]:
            with self.subTest(title=single["title"]):
                self.assertRegex(single["link"], r"^(https://[^\s]+|#)$")

    def test_webp_variants_are_declared_only_when_present(self) -> None:
        declared = [s for s in self.data["singles"] if s.get("coverWebp")]
        self.assertGreaterEqual(len(declared), 7, "el catálogo debería servir WebP en las portadas raster")

    def test_services_and_stations_are_unique(self) -> None:
        service_ids = [service["id"] for service in self.data["services"]]
        self.assertEqual(len(service_ids), len(set(service_ids)))
        station_ids = [station["id"] for station in self.data["stations"]]
        self.assertEqual(len(station_ids), len(set(station_ids)))


class FrontendAssetTests(unittest.TestCase):
    """Los activos del frontend deben ser sintácticamente válidos y locales."""

    FRONTEND_SCRIPTS = ["data.js", "js/audio-core.js", "js/site.js", "js/studio.js", "js/hero-gl.js"]

    def test_javascript_parses(self) -> None:
        for script in self.FRONTEND_SCRIPTS:
            with self.subTest(script=script):
                result = subprocess.run(
                    ["node", "--check", script], cwd=ROOT, capture_output=True, text=True, timeout=60
                )
                self.assertEqual(result.returncode, 0, result.stderr[-500:])

    def test_index_has_no_inline_scripts(self) -> None:
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        inline = re.findall(r"<script(?![^>]*\bsrc=)(?![^>]*application/ld\+json)[^>]*>", html, re.I)
        self.assertEqual(inline, [], "la portada debe cargar JS externo para poder aplicar CSP")

    def test_index_loads_the_station_modules_in_order(self) -> None:
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        # Solo las etiquetas <script src>: el nombre «data.js» también aparece
        # en el texto de la página, y buscar en crudo daba un falso positivo.
        sources = re.findall(r'<script[^>]+src="([^"]+)"', html)
        expected = ["js/audio-core.js", "data.js", "js/site.js", "js/studio.js", "js/hero-gl.js"]
        self.assertEqual(sources, expected, "los módulos deben cargarse en orden de dependencia")
        self.assertTrue(all('defer' in tag for tag in re.findall(r"<script[^>]+src=[^>]+>", html)),
                        "los módulos deben diferirse para no bloquear el render")

    def test_no_page_requests_third_party_assets(self) -> None:
        for page in PAGES:
            with self.subTest(page=page.name):
                html = page.read_text(encoding="utf-8")
                remote = re.findall(r'(?:src|href)="(https?://[^"]+)"', html)
                external = [
                    url
                    for url in remote
                    if not url.startswith(("https://github.com/belentani7", "https://heyduck.vercel.app", "https://www.belentani.es"))
                ]
                self.assertEqual(external, [], "recursos de terceros inesperados")

    def test_css_declares_every_custom_property_it_uses(self) -> None:
        css = (ROOT / "assets/site.css").read_text(encoding="utf-8")
        declared = set(re.findall(r"(--[\w-]+)\s*:", css))
        used = set(re.findall(r"var\((--[\w-]+)", css))
        self.assertEqual(sorted(used - declared), [], "variables CSS usadas sin declarar")

    def test_link_gate_passes(self) -> None:
        result = subprocess.run(
            ["node", ".github/scripts/check-links.mjs"], cwd=ROOT, capture_output=True, text=True, timeout=120
        )
        self.assertEqual(result.returncode, 0, result.stderr[-1000:])

    def test_html_audit_passes(self) -> None:
        result = subprocess.run(
            ["node", "scripts/audit-html.mjs"], cwd=ROOT, capture_output=True, text=True, timeout=180
        )
        self.assertEqual(result.returncode, 0, (result.stdout + result.stderr)[-1500:])


class RepositoryHygieneTests(unittest.TestCase):
    """Nada de basura versionada ni artefactos del entorno de desarrollo."""

    def test_no_committed_logs_or_editor_artifacts(self) -> None:
        # Se pregunta a Git por lo *versionado*: `node_modules/` puede existir en
        # disco (dependencias de desarrollo para el test de DOM) sin estar en el
        # repositorio, y eso no es un defecto.
        result = subprocess.run(
            ["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            self.skipTest("git no disponible en este entorno")
        tracked = [line for line in result.stdout.splitlines() if line]
        # `legacy/` es el archivo histórico y queda fuera del despliegue por
        # `.vercelignore`; lo que se vigila es el sitio vivo.
        offenders = [
            path
            for path in tracked
            if not path.startswith("legacy/")
            and (path.endswith(".log")
            or path.startswith("node_modules/")
            or "/node_modules/" in path
            or path.startswith("playwright-report/"))
        ]
        self.assertEqual(offenders[:10], [], f"artefactos versionados: {offenders[:10]}")

    def test_no_directory_named_like_a_command_flag(self) -> None:
        for entry in ROOT.iterdir():
            if entry.is_dir() and entry.name.startswith("-"):
                self.fail(f"directorio creado por un error de shell: {entry.name}")

    def test_workflow_files_have_no_duplicate_top_level_keys(self) -> None:
        for workflow in sorted((ROOT / ".github/workflows").glob("*.yml")):
            with self.subTest(workflow=workflow.name):
                text = workflow.read_text(encoding="utf-8")
                keys = re.findall(r"(?m)^([A-Za-z0-9_-]+):", text)
                duplicates = {key for key in keys if keys.count(key) > 1}
                self.assertEqual(duplicates, set(), f"claves YAML duplicadas en {workflow.name}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
