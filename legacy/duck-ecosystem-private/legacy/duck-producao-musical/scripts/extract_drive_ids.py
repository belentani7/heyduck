import json
from pathlib import Path

needles = {
    'DUCK-2026-INVENTARIO-Y-PLUGINS.md',
    'DUCK-INTEGRADO-0-10.md',
    'DUCK-INTEGRADO-0-10.html',
    'DUCK-2026-ACTUALIZADO.html',
    'Exportación de Gemini (15 de agosto de 2026 a las 13:40:43 CEST)',
    'Manus Noiacore',
    'Andromeda',
}
for line in Path('/home/ubuntu/duck-producao-musical/drive_inventory.ndjson').read_text(encoding='utf-8').splitlines():
    if not line.strip():
        continue
    data = json.loads(line)
    for file in data.get('files', []):
        if file.get('name') in needles:
            print(json.dumps(file, ensure_ascii=False))
