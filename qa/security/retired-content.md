# Retired church content and slide servers

Owner requested removal of all Bible-study and church-specific pages.
Removed the `docs/reveal.js` daily-reading pages (including their Isaiah images),
`docs/presos/bible-study`, and the fellowship decks `presos/b0.html` and
`presos/b2.html`. Their history remains in Git. No technical blog or work/math
presentation is removed. Shared slide CSS, JS and media are retained. The math deck angela_001.html still
uses /reveal.js asset URLs, so that path now contains only precompiled reveal.js
6.0.2 runtime assets, reproducible from tools/slides; no church content.

The now-unused Gulp/Puppeteer dependency graph in docs/reveal.js and the
Bible-study Gulp/Node-Sass manifest are gone with those trees. The Node 4
multiplex and notes demo servers were also removed: no remaining deck
references them, and a static site cannot run them. This addresses the 43
alerts in the reveal.js lockfile and 4 in the multiplex manifest by removing
the unused code, not by suppressing vulnerability scanning. The replacement npm
manifest has one pinned runtime dependency and npm audit reports zero alerts.

The separate Astro migration removes the two Ruby lockfiles (124 alerts).
GitHub recalculates default-branch alerts only after merge. Remaining legacy
technical slide runtime is unchanged and must not be described as fully
security-audited simply because it has no npm manifest.
