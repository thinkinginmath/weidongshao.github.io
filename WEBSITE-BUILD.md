# Website build — Astro

Use Node 24 (`.nvmrc`). No Ruby, Jekyll, Bundler or github-pages gem is used.

    npm ci --ignore-scripts
    npm audit
    npm run build
    npm run preview

`docs/` remains the source for static company/product pages, images and
presentations. `scripts/prepare-static.mjs` copies these into an ignored public
staging folder and compiles the existing blog Sass. Templates, YAML config,
Ruby manifests and Markdown source are not published.

`src/` contains native Astro layouts and generated routes for the ten old
Markdown posts, categories, tags, about/quicklinks, archive, 404, RSS and sitemap.
Post URLs use the frontmatter date, not the filename: the Vim and Compass posts
have differing dates in their filenames. The compatibility fixture in
`qa/security/legacy-posts.json` records the pre-migration generated URLs and
heading anchors. `npm run build` checks them and verifies that standalone
marketing/product pages are copied byte for byte. Math is rendered at build
time with KaTeX and local fonts, instead of relying on a MathJax CDN script.
The four old YouTube includes are converted to equivalent iframe markup.
The original Markdown content remains in docs/_posts and docs/page.

## GitHub Pages migration (when this PR is merged)

PR checks build and audit but never deploy. Wait for those checks to pass.
Before merging, set repository Settings → Pages → Build and deployment →
Source to **GitHub Actions**. This keeps the last published deployment in place.
Then merge and let **Build and audit website** publish the new artifact; run
it on master manually if needed. Do not merge while the legacy /docs Jekyll
publisher is active: docs is now static/content input, not a Jekyll project.
This is a one-time publishing-source change; CNAME and custom-domain settings
stay the same. Verify the deployment after merging. Production settings have
not been changed by this PR.

photos.uubright.com is a separate Cloudflare Pages static deployment. Its
existing packaging script stays intact; this migration does not silently
publish another Photos version.

A companion PR removes the owner-selected Bible-study/church pages and unused
presentation servers; the retained technical/work/math decks stay static.

References:
- https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/
- https://docs.astro.build/en/guides/deploy/github/
