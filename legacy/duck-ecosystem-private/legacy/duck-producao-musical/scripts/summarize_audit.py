import json
from collections import Counter
from pathlib import Path

path = Path('/home/ubuntu/duck-producao-musical/pnpm_audit.json')
data = json.loads(path.read_text(encoding='utf-8'))
advisories = data.get('advisories') or {}
severity = Counter()
packages = Counter()
for key, item in advisories.items():
    severity[item.get('severity', 'unknown')] += 1
    for package in item.get('findings', []):
        name = package.get('module_name') or item.get('module_name') or key
        packages[name] += 1
print(f'ADVISORIES={len(advisories)}')
for level, count in sorted(severity.items()):
    print(f'{level.upper()}={count}')
print('PACKAGES')
for name, count in packages.most_common():
    print(f'{count}\t{name}')
print('TOP ADVISORIES')
for key, item in list(advisories.items())[:40]:
    print(f"{key}\t{item.get('severity')}\t{item.get('module_name')}\t{item.get('title')}")
