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
await cp(join(upstream,'dist'),join(target,'dist'),{recursive:true});
for(const name of ['markdown','highlight','math','notes','search','zoom']) {
 const dir=join(target,'plugin',name);await mkdir(dir,{recursive:true});
 await cp(join(upstream,'dist/plugin',`${name}.js`),join(dir,`${name}.js`));
 await cp(join(upstream,'dist/plugin',`${name}.mjs`),join(dir,`${name}.esm.js`));
}
await cp(join(upstream,'dist/plugin/highlight'),join(target,'plugin/highlight'),{recursive:true});
await cp(join(upstream,'dist/reveal.mjs'),join(target,'dist/reveal.esm.js'));
await cp(join(upstream,'LICENSE'),join(target,'LICENSE'));
await rm(join(target,'vendor/katex'),{recursive:true,force:true});
await cp(join(root,'tools/slides/node_modules/katex/dist'),join(target,'vendor/katex/dist'),{recursive:true});
await cp(join(root,'tools/slides/node_modules/katex/LICENSE'),join(target,'vendor/katex/LICENSE'));

console.log(`Vendored reveal.js ${version}; technical deck's asset URLs retained.`);
