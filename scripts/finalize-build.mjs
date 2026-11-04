// Astro's directory output would otherwise turn the historical .html URL into
// a directory. Keep the exact file path used by links and old bookmarks.
import { readFile, rm, writeFile } from 'node:fs/promises';
const archive = await readFile('dist/index_old.html/index.html');
await rm('dist/index_old.html', {recursive:true});
await writeFile('dist/index_old.html', archive);
