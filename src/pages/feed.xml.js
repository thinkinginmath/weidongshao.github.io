import { posts } from '../lib/content.js';
const xml = s => String(s).replace(/[<>&"']/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export function GET() {
  const items=posts.slice(0,10).map(p=>`<item><title>${xml(p.title)}</title><description>${xml(p.html)}</description><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><link>https://uubright.com${p.url}</link><guid isPermaLink="true">https://uubright.com${p.url}</guid>${[...p.categories,...p.tags].map(t=>`<category>${xml(t)}</category>`).join('')}</item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>David Wei Shao</title><description>Random notes on software and technology</description><link>https://uubright.com/</link><atom:link href="https://uubright.com/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
