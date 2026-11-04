// Preserve asset URLs used by angela_001.html without retaining the old Gulp tree.
import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const upstream = join(root,'tools/slides/node_modules/reveal.js');
const {version} = JSON.parse(await readFile(join(upstream,'package.json'),'utf8'));
if(version!=='6.0.2') throw new Error(`Review upgrade before vendoring ${version}`);
const target=join(root,'docs/reveal.js');
await mkdir(target,{recursive:true});
for(const name of ['dist','plugin']) await rm(join(target,name),{recursive:true,force:true});
await cp(join(upstream,'dist'),join(target,'dist'),{recursive:true,filter:p=>!p.endsWith('.d.ts')&&!p.includes('/dist/utils')});
for(const name of ['markdown','highlight','math','notes','search','zoom']) {
 const dir=join(target,'plugin',name);await mkdir(dir,{recursive:true});
 await cp(join(upstream,'dist/plugin',`${name}.js`),join(dir,`${name}.js`));
 await cp(join(upstream,'dist/plugin',`${name}.mjs`),join(dir,`${name}.esm.js`));
}
await cp(join(upstream,'dist/plugin/highlight'),join(target,'plugin/highlight'),{recursive:true});
await cp(join(upstream,'dist/reveal.mjs'),join(target,'dist/reveal.esm.js'));
await cp(join(upstream,'LICENSE'),join(target,'LICENSE'));
const katex=join(root,'tools/slides/node_modules/katex');
const local=join(target,'vendor/katex');
await rm(local,{recursive:true,force:true});
await mkdir(join(local,'dist/contrib'),{recursive:true});
for(const file of ['katex.min.js','katex.min.css','contrib/auto-render.min.js'])
 await cp(join(katex,'dist',file),join(local,'dist',file));
await cp(join(katex,'dist/fonts'),join(local,'dist/fonts'),{recursive:true});
await cp(join(katex,'LICENSE'),join(local,'LICENSE'));
console.log(`Vendored reveal.js ${version}; technical deck's asset URLs retained.`);
