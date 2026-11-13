import json
from collections import Counter, defaultdict
from pathlib import Path

src = Path('/home/ubuntu/duck-producao-musical/drive_inventory.ndjson')
files = []
for line in src.read_text(encoding='utf-8').splitlines():
    line = line.strip()
    if not line:
        continue
    payload = json.loads(line)
    files.extend(payload.get('files', []))

mime_counts = Counter(f.get('mimeType', 'unknown') for f in files)
name_ext_counts = Counter()
for f in files:
    name = f.get('name', '')
    if '.' in name and not name.startswith('.'):
        name_ext_counts[name.rsplit('.', 1)[-1].lower()] += 1
    else:
        name_ext_counts['(no extension)'] += 1

folder_counts = Counter()
for f in files:
    for parent in f.get('parents', []):
        folder_counts[parent] += 1

print(f'FILES={len(files)}')
print('\nMIME TYPES')
for k, v in mime_counts.most_common():
    print(f'{v:4} {k}')
print('\nEXTENSIONS')
for k, v in name_ext_counts.most_common():
    print(f'{v:4} .{k}')
print('\nLARGEST FILES')
for f in sorted(files, key=lambda x: int(x.get('size', '0') or 0), reverse=True)[:40]:
    print(f"{int(f.get('size', '0') or 0):12} {f.get('name','')} | {f.get('mimeType','')} | {f.get('id','')}")
print('\nNAMES')
for f in sorted(files, key=lambda x: (x.get('mimeType',''), x.get('name','').lower())):
    print(f"{f.get('name','')} | {f.get('mimeType','')} | {f.get('modifiedTime','')} | {f.get('id','')}")
