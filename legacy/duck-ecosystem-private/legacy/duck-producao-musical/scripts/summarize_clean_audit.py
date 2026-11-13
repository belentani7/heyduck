import json
from collections import Counter
from pathlib import Path

path = Path('/home/ubuntu/duck-producao-musical/clean_audit.json')
data = json.loads(path.read_text(encoding='utf-8'))
advisories = data.get('advisories') or {}
print('ADVISORIES', len(advisories))
print('SEVERITY', dict(Counter(v.get('severity', 'unknown') for v in advisories.values())))
for key, item in advisories.items():
    print('\nID', key)
    print('SEVERITY', item.get('severity'))
    print('MODULE', item.get('module_name'))
    print('TITLE', item.get('title'))
    print('VULNERABLE', item.get('vulnerable_versions'))
    print('PATCHED', item.get('patched_versions'))
    print('URL', item.get('url'))
    print('FINDINGS', [(f.get('module_name'), f.get('version')) for f in item.get('findings', [])])
