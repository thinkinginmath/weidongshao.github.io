import { posts, pages } from '../lib/content.js';
export function GET() {
 const urls=['/','/index_old.html','/category/','/tag/',...pages.map(p=>p.url),...posts.map(p=>p.url)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p=>`<url><loc>https://uubright.com${p}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}
