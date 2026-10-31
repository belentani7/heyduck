"""Test factual de presencia: protocolos + sintaxis (no inventa logica)."""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_protocolos_de_presencia():
    for fname in ("README.md", "LICENSE", ".gitignore"):
        assert os.path.exists(os.path.join(ROOT, fname)), f"falta {fname}"


def test_sintaxis_python():
    r = subprocess.run(
        [sys.executable, "-m", "compileall", "-q", "-x",
         r"(node_modules|\.venv|venv|build|dist|__pycache__|\.git|legacy)", ROOT],
        capture_output=True, text=True, timeout=300,
    )
    assert r.returncode == 0, (r.stderr or r.stdout)[-800:]
