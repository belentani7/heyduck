from pathlib import Path
import hashlib
import shutil
import subprocess

PROJECT = Path('/home/ubuntu/duck-producao-musical')
ARCHIVE = Path('/home/ubuntu/duck-chat-archive-2026-08-22')
UPLOAD = Path('/home/ubuntu/upload')

if ARCHIVE.exists():
    shutil.rmtree(ARCHIVE)
(ARCHIVE / 'project').mkdir(parents=True)
(ARCHIVE / 'source_uploads').mkdir()
(ARCHIVE / 'history' / 'patches').mkdir(parents=True)

excluded_dirs = {'.git', 'node_modules', 'dist', '.manus-logs'}
excluded_files = {'iteration_audit.err', 'client/public/__manus__/debug-collector.js', 'client/public/__manus__/version.json', '.project-config.json'}

for source in PROJECT.rglob('*'):
    if not source.is_file():
        continue
    rel = source.relative_to(PROJECT)
    if any(part in excluded_dirs for part in rel.parts):
        continue
    if str(rel) in excluded_files:
        continue
    target = ARCHIVE / 'project' / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)

for name in ('duckweb.zip', 'pasted_content.txt'):
    source = UPLOAD / name
    if source.exists():
        shutil.copy2(source, ARCHIVE / 'source_uploads' / name)

log = subprocess.check_output(['git', '-C', str(PROJECT), 'log', '--oneline', '--decorate', '--all', '-30'], text=True)
(ARCHIVE / 'history' / 'git-log.txt').write_text(log, encoding='utf-8')
subprocess.run(['git', '-C', str(PROJECT), 'format-patch', '--root', '-o', str(ARCHIVE / 'history' / 'patches')], check=True, stdout=subprocess.DEVNULL)

hash_lines = []
for path in sorted(ARCHIVE.rglob('*')):
    if path.is_file():
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        hash_lines.append(f'{digest}  {path.relative_to(ARCHIVE).as_posix()}')
(ARCHIVE / 'SHA256SUMS.txt').write_text('\n'.join(hash_lines) + '\n', encoding='utf-8')
print(f'Created archive at {ARCHIVE}')
print(f'Files: {len(hash_lines)}')
