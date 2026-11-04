import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import MarkdownIt from 'markdown-it';
import katex from 'katex';
const root = process.cwd();
const legacy = JSON.parse(readFileSync(join(root, 'qa/security/legacy-posts.json'), 'utf8'));
export function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error('Expected YAML frontmatter');
  return { data: parse(match[1]), body: source.slice(match[0].length) };
}
const array = value => Array.isArray(value) ? value : String(value ?? '').split(/\s+/).filter(Boolean);
export function renderMarkdown(body, oldHeadings = []) {
  const md = new MarkdownIt({ html: true, linkify: true });
  const headings = [], used = new Set();
  const original = md.renderer.rules.heading_open;
  md.renderer.rules.heading_open = (tokens, i, options, env, renderer) => {
    const inline = tokens[i + 1];
    const text = inline.children.filter(t => ['text','code_inline'].includes(t.type)).map(t => t.content).join('');
    let id = oldHeadings.find(h => h.text.trim() === text.trim() && !used.has(h.id))?.id
      ?? text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
    const base = id || 'section'; let n = 1;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id); tokens[i].attrSet('id', id);
    headings.push({ id, text, level: Number(tokens[i].tag.slice(1)) });
    return original ? original(tokens, i, options, env, renderer) : renderer.renderToken(tokens, i, options);
  };
  // The source has four simple YouTube includes; reject any other Liquid syntax.
  body = body.replace(/\{%\s*include youtubePlayer\.html id="([\w-]+)"\s*%\}/g,
    (_, id) => `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${id}" width="800" height="460" title="Embedded video" loading="lazy" allowfullscreen></iframe></div>`);
  if (/\{%|\{\{/.test(body)) throw new Error('Unconverted Liquid in Markdown');
  body = body.replace(/^\* content\s*\n\{:toc\}\s*/m, '').replace(/^\{:\.image-caption\}\s*$/gm, '');
  // Protect fenced/inline code, then render all legacy MathJax delimiters.
  // Code examples containing shell dollar signs must remain literal.
  const codes = [];
  body = body.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g, code => `CODEPLACEHOLDER${codes.push(code)-1}END`);
  const maths = [];
  const math = (tex, displayMode) => `MATHPLACEHOLDER${maths.push(katex.renderToString(tex.trim(), {throwOnError:false,strict:'ignore',displayMode,trust:false}))-1}END`;
  body = body.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => math(tex,true));
  body = body.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => math(tex,false));
  body = body.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => math(tex,tex.includes('\n')));
  body = body.replace(/(?<![\\$])\$(?!\s)([^\n$]*?\S)\$(?!\d)/g, (_,tex) => math(tex,false));
  body = body.replace(/CODEPLACEHOLDER(\d+)END/g,(_,id)=>codes[Number(id)]);
  let html = md.render(body).replace(/MATHPLACEHOLDER(\d+)END/g, (_, id) => maths[Number(id)]);
  return { html, headings };
}
export const posts = readdirSync(join(root, 'docs/_posts')).filter(f => /\.md$/.test(f)).map(filename => {
  const { data, body } = frontmatter(readFileSync(join(root, 'docs/_posts', filename), 'utf8'));
  const date = String(data.date).slice(0, 10);
  const publishedAt = String(data.date).replace(' ', 'T').replace(/ ([+-]\d{2})(\d{2})$/, '$1:$2');
  if (Number.isNaN(Date.parse(publishedAt))) throw new Error(`Invalid publication time: ${filename}`);
  if (!/^\d{4}-\d\d-\d\d$/.test(date)) throw new Error(`Bad post date: ${filename}`);
  const slug = filename.replace(/^\d{4}-\d\d-\d\d-/, '').replace(/\.md$/, '');
  const url = `/${date.replaceAll('-', '/')}/${slug}/`;
  const historical = legacy.find(p => `/${p.path.replace(/index\.html$/, '')}` === url);
  const rendered = renderMarkdown(body, historical?.headings);
  return { ...data, date, publishedAt, url, filename, categories: array(data.categories), tags: array(data.tags), ...rendered };
}).sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url));
export const pages = ['3quicklinks.md', '4about.md'].map(filename => {
  const { data, body } = frontmatter(readFileSync(join(root, 'docs/page', filename), 'utf8'));
  return { ...data, url: data.permalink, ...renderMarkdown(body) };
});
export const groups = kind => [...new Set(posts.flatMap(p => p[kind]))].sort().map(name => ({ name, posts: posts.filter(p => p[kind].includes(name)) }));
