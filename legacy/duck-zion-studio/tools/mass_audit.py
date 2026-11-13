#!/usr/bin/env python3
from __future__ import annotations
import hashlib
import json
import os
import re
import stat
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'research' / 'mass-audit'
OUT.mkdir(parents=True, exist_ok=True)
EXCLUDE = {'node_modules', '.next', '.git', 'release'}
SECRET_PATTERNS = [
    re.compile(r'(?i)(api[_-]?key|secret|token|password|private[_-]?key)\s*[=:]\s*["\']?[^\s"\']{8,}'),
    re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    re.compile(r'(?i)sk-[A-Za-z0-9]{20,}'),
]
BIN_EXTS = {'.dll', '.vst', '.vst3', '.clap', '.aax', '.exe', '.dylib', '.so', '.bin', '.db'}
ARCHIVE_EXTS = {'.zip', '.7z', '.rar', '.tar', '.gz', '.xz'}
TEXT_EXTS = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.txt', '.toml', '.yaml', '.yml', '.env', '.sql', '.prisma', '.html', '.css'}

def files():
    for p in ROOT.rglob('*'):
        if not p.is_file():
            continue
        if any(part in EXCLUDE for part in p.parts):
            continue
        yield p

def sha256(path: Path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

records = []
secret_hits = []
for path in files():
    rel = path.relative_to(ROOT).as_posix()
    size = path.stat().st_size
    suffix = path.suffix.lower()
    rec = {'path': rel, 'size': size, 'suffix': suffix, 'sha256': sha256(path)}
    if suffix in BIN_EXTS:
        rec['classification'] = 'binary_or_database'
    elif suffix in ARCHIVE_EXTS:
        rec['classification'] = 'archive'
    elif suffix in TEXT_EXTS or path.name.startswith('.env'):
        rec['classification'] = 'text'
        try:
            text = path.read_text(errors='replace')
            for lineno, line in enumerate(text.splitlines(), 1):
                if any(pattern.search(line) for pattern in SECRET_PATTERNS):
                    secret_hits.append({'path': rel, 'line': lineno, 'sha256': hashlib.sha256(line.encode()).hexdigest()})
        except OSError:
            pass
    else:
        rec['classification'] = 'other'
    mode = path.stat().st_mode
    rec['executable'] = bool(mode & (stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH))
    records.append(rec)

manifests = []
for name in ('package.json', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lock', 'Cargo.toml', 'pyproject.toml', 'requirements.txt', 'Dockerfile'):
    for p in ROOT.rglob(name):
        if any(part in EXCLUDE for part in p.parts):
            continue
        manifests.append(p.relative_to(ROOT).as_posix())

summary = {
    'root': str(ROOT),
    'files': len(records),
    'bytes': sum(r['size'] for r in records),
    'binaries_or_databases': sum(r['classification'] == 'binary_or_database' for r in records),
    'archives': sum(r['classification'] == 'archive' for r in records),
    'executables': sum(r['executable'] for r in records),
    'secret_signal_count': len(secret_hits),
    'manifest_count': len(manifests),
    'policy': 'local-only; findings are signals requiring human review; no binary execution',
}
(OUT / 'summary.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False) + '\n')
(OUT / 'files.jsonl').write_text('\n'.join(json.dumps(r, ensure_ascii=False) for r in records) + '\n')
(OUT / 'secret-signals.json').write_text(json.dumps(secret_hits, indent=2, ensure_ascii=False) + '\n')
(OUT / 'manifests.txt').write_text('\n'.join(sorted(manifests)) + '\n')
print(json.dumps(summary, indent=2, ensure_ascii=False))
