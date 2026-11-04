"""Check that retirement removes church content but preserves deck imports."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import sys
root = Path(sys.argv[1] if len(sys.argv) > 1 else 'docs')
for path in ['presos/b0.html','presos/b2.html','presos/bible-study',
             'reveal.js/index.html','reveal.js/weekly_summary.html','reveal.js/i58_12',
             'reveal.js/i58_13','presos/plugin/multiplex','presos/plugin/notes-server']:
    assert not (root/path).exists(), f'Retired content still published: {path}'
class Assets(HTMLParser):
    def __init__(self): super().__init__(); self.urls=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='script' and a.get('src'): self.urls.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet': self.urls.append(a.get('href',''))
count=0
for page in (root/'presos').glob('*.html'):
    if page.name=='demo.html': continue
    parser=Assets();parser.feed(page.read_text());count+=1
    for url in parser.urls:
        parts=urlsplit(url)
        if parts.scheme or parts.netloc: continue
        path=unquote(parts.path)
        target=root/path.lstrip('/') if path.startswith('/') else page.parent/path
        assert target.is_file(), f'{page}: missing {url}'
assert count>=10, f'Technical presentations unexpectedly missing: {count}'
math=(root/'presos/angela_001.html').read_text()
assert 'katex: { local: "/reveal.js/vendor/katex" }' in math
for path in ['reveal.js/vendor/katex/dist/katex.min.js','reveal.js/vendor/katex/dist/contrib/auto-render.min.js']:
    assert (root/path).is_file(), path
print(f'Slide checks passed: {count} retained decks, local runtime imports, church retirement and pinned local math.')
