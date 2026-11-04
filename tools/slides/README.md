# Retained technical slide runtime

`presos/angela_001.html` uses `/reveal.js/dist` and `/reveal.js/plugin`.
The church pages formerly sharing that directory are retired, but removing
all its assets would break this math presentation. These asset URLs now hold
precompiled reveal.js 6.0.2 and local KaTeX 0.19.1 from npm, pinned by package-lock.json. Reproduce:

    npm ci --ignore-scripts --prefix tools/slides
    npm audit --prefix tools/slides
    npm run vendor --prefix tools/slides

The vendor script keeps legacy plugin and ES-module paths. The math deck
loads the pinned local KaTeX distribution, replacing the floating CDN latest
request. Slide content and navigation are unchanged. All other work/math
slides use the separate v3-era `presos/js/reveal.js` runtime, which is unchanged.
We do not install its unused Node 4 demo servers. No browser content is built
with the deleted upstream Gulp/Puppeteer/Node-Sass environments.

Upgrade notes: https://revealjs.com/upgrading/
