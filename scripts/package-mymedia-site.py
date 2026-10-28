"""Create the photos.uubright.com direct-upload bundle from the canonical source."""
from pathlib import Path
import shutil,zipfile,sys
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'artifacts/photos-site-build80'
assert out!=root and out!=root/'docs/mymedia'
if out.exists():shutil.rmtree(out)
shutil.copytree(root/'docs/mymedia',out)
(out/'assets').mkdir(exist_ok=True)
shutil.copy(root/'docs/assets/uubright-mark.svg',out/'assets/uubright-mark.svg')
release=__import__('json').loads((out/'release-build80.json').read_text())
(out/'_redirects').write_text('/download/mac-arm64 '+release['downloadUrl']+' 302\n/mymedia / 301\n/mymedia/* /:splat 301\n')
# Static bundle: no script injection, worker, subscriber database or analytics.
with zipfile.ZipFile(out.with_suffix('.zip'),'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(out.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(out))
print(out);print(out.with_suffix('.zip'))
