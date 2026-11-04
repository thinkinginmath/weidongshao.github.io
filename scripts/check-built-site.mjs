import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { posts, pages } from '../src/lib/content.js';
const root = 'dist';
const historical = JSON.parse(await readFile('qa/security/legacy-posts.json', 'utf8'));
for (const old of historical) {
 const html = await readFile(join(root, old.path), 'utf8');
 for (const heading of old.headings) assert.ok(html.includes(`id="${heading.id}"`), `${old.path}: lost #${heading.id}`);
 assert.ok(!html.includes('{%'), `${old.path}: unrendered Liquid`);
 assert.ok(!html.includes('MATHPLACEHOLDER'), `${old.path}: unrendered math`);
 assert.ok(!html.includes('katex-error'), `${old.path}: invalid math`);
 for(const asset of old.assets) assert.ok(html.includes(asset),`${old.path}: lost embedded asset ${asset}`);
}
for (const p of pages) assert.ok((await stat(join(root, p.url, 'index.html'))).isFile());
for (const route of ['CNAME','.nojekyll','index.html','index_old.html','404.html','feed.xml','sitemap.xml','css/main.css','presos/alexa-intro.html','presos/sum-of-triangle.html']) {
 const info = await stat(join(root, route));
 assert.ok(info.isFile() && (route === '.nojekyll' || info.size > 0), `Missing file ${route}`);
}
async function checkStatic(dir) {
 for (const e of await readdir(join('docs',dir), {withFileTypes:true})) {
  const path = join(dir,e.name);
  if(e.isDirectory()) await checkStatic(path);
  else if(/\.html$/.test(path)) assert.deepEqual(await readFile(join(root,path)),await readFile(join('docs',path)),`Static page changed: ${path}`);
 }
}
await checkStatic('mymedia');
assert.deepEqual(await readFile('dist/index.html'),await readFile('docs/index.html'),'Marketing homepage changed');
const feed=await readFile('dist/feed.xml','utf8');
for(const p of posts) assert.ok(feed.includes(`https://uubright.com${p.url}`),`Feed lost ${p.url}`);
assert.equal((feed.match(/<item>/g)||[]).length,posts.length);
console.log(`Site checks passed: ${posts.length} historical post URLs and heading anchors; page routes, feed, static homepage/product pages and technical decks.`);
