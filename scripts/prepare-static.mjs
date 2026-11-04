// Only static assets/pages enter publicDir; templates and dependency files do not.
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import * as sass from 'sass';
const root = resolve('.');
const source = join(root, 'docs'), target = join(root, '.generated-public');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const entry of await readdir(source, { withFileTypes: true })) {
  if (entry.name.startsWith('_') || entry.name.startsWith('.') || ['Gemfile', 'Gemfile.lock', 'page'].includes(entry.name)) continue;
  await cp(join(source, entry.name), join(target, entry.name), { recursive: true, filter: path => !['package.json','package-lock.json','Gemfile','Gemfile.lock','.github','node_modules'].includes(path.split('/').pop()) });
}
const scss = (await readFile(join(source, 'css/main.scss'), 'utf8')).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const result = sass.compileString(scss, { loadPaths: [join(source, '_sass')], style: 'compressed' });
await writeFile(join(target, 'css/main.css'), result.css);
await rm(join(target, 'css/main.scss'));
await mkdir(join(target, 'assets/katex'), { recursive: true });
await cp(join(root, 'node_modules/katex/dist/katex.min.css'), join(target, 'assets/katex/katex.min.css'));
await cp(join(root, 'node_modules/katex/dist/fonts'), join(target, 'assets/katex/fonts'), { recursive: true });
await writeFile(join(target, '.nojekyll'), '');
console.log('Prepared static pages/assets without Ruby, Liquid templates or package manifests.');
