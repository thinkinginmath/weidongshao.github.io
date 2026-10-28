# MyMedia Photos site: screenshots still needed

Written 2026-10-28 with the copy refresh (branch `claude/site-refresh-oct28`).
To be captured on the owner's MacBook. Every slot is marked in the HTML with
`<!-- SCREENSHOT-TODO: <id> -->`; `grep -rn SCREENSHOT-TODO docs/mymedia`
lists them. The pages read correctly without these images, so the copy can
ship first.

Rules that still apply (from issue #61 on mymedia): sample data only, no owner
photos, names, paths or credentials; credited public-domain/CC0 photos; real
app screens, never mock-ups; captions say what the screen does *not* prove.
Capture at 1920×1080, save as `docs/mymedia/screenshots/<id>.jpg`, add
credits to `credits.json` and the credits page.

**Build rule.** `next-*` and `guide-*` slots show features that are not in
build 80. Capture them from the build that will be published next, and only
put them on the site when that build is downloadable. Then also move each
feature out of the "Coming in the next beta build" sections (home
`#next-build`, product facts `#next-build`, download `#next-build`, the guide
`next-note` boxes, `llms.txt`).

| id | Page | Screen and state | Stand-in data |
|---|---|---|---|
| `home-backup-copy` | Home, "A second copy you can check" | Back up copy dialog after a finished run: "Backup copy verified: N files", destination and receipt shown. Replaces the build 80 iPhone guide image now there. Build 80 or later. | The 24-photo public-domain sample folder copied to a second disk image named `Backup Drive`. |
| `hero-walkthrough` | Home hero | Optional. Re-record the 30–45 s walkthrough from the next build: add a drive → find an older photo → exact copies → organize preview → Back up menu. Keep the build 80 video until then. | Same sample drive image as the build 80 recording. |
| `next-iphone-flow` | Home `#next-build` | iPhone: organize and back up, Import step: device chosen, file/video counts and destination shown, before **Copy to this folder**. A second frame of the Back up step is welcome. | A real test iPhone with only sample photos on it, or the wizard's browser fixture if no phone. Device name must not be personal. |
| `next-similar-compare` | Home `#next-build` | Similar shots → a group of 3–4 takes → **Compare…** open, zoomed into one spot, suggested keeper visible with its note. | A burst of a non-personal subject (plant, street sign) shot by the owner within a few seconds, or a public-domain burst with intact EXIF times. Avoid faces, so the closed-eyes note does not appear. |
| `next-restore-check` | Home `#next-build` | Check or restore a backup: a finished check saying every receipt file matches. Optionally a second state with one changed file listed. | The `home-backup-copy` backup; for the second state, edit one file in a copy of it. |
| `next-space-view` | Home `#next-build` | Free up space → "Where your space went": per-folder totals and the Downloads/Desktop check listing a few copies with the library file that keeps them. | Sample library plus a Downloads folder holding two of its photos. Do not run the Messages or WeChat check on the owner's real account. |
| `next-drive-setup` | Home `#next-build` | Use this drive for your photos: survey step (groups such as camera card, phone import), then the plan step naming `Photo Library/` and `Photo Backups/`. | A disk image named `PhotoDrive` with sample folders `DCIM`, `iPhone import 2019`, `Old photos`. |
| `next-drive-card` | Home `#next-build` | Settings → Library folders → the drive card: folders, a backup copy with its checked date, "N photos exist only on this drive". | The same `PhotoDrive` image after setup plus one backup copy. |
| `next-suggested-albums` | Home `#next-build` | Trips and events: one trip selected, photos ticked, name prefilled (e.g. "Kyoto · May 17–19, 2024"), footer saying an album is not a copy. | Public-domain photos with sample EXIF dates and GPS for one trip. |
| `guide-iphone-flow` | iPhone backup guide | Rewrite this guide around the direct-import flow when the build ships, with screenshots of Import, Organize and Back up steps. | As `next-iphone-flow`. |
| `guide-drive-setup` | External drives guide | Drive setup and drive card, as above, inline with the steps. | As `next-drive-setup`. |
| `guide-similar-shots` | Exact duplicates guide | A Similar shots group in the list view (not Compare), beside the exact-copy section. | As `next-similar-compare`. |

Also check, once the next build ships: `social.jpg` still matches the
headline, and dark mode appears in at least one capture (the app follows the
system appearance).
