from html.parser import HTMLParser
from pathlib import Path

class ScriptParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.current = None
    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.current = {'attrs': dict(attrs), 'text': ''}
    def handle_data(self, data):
        if self.current is not None:
            self.current['text'] += data
    def handle_endtag(self, tag):
        if tag == 'script' and self.current is not None:
            self.scripts.append(self.current)
            self.current = None

path = Path('/home/ubuntu/duck-producao-musical/dist/public/index.html')
parser = ScriptParser()
parser.feed(path.read_text(encoding='utf-8'))
print('HTML_BYTES', path.stat().st_size)
for index, script in enumerate(parser.scripts, 1):
    attrs = ' '.join(f'{key}={value}' for key, value in script['attrs'].items())
    print(f'SCRIPT_{index}_BYTES={len(script["text"].encode("utf-8"))} {attrs}')
