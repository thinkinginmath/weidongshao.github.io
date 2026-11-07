# Next-beta readiness — November 7, 2026

PR #181 is merged into MyMedia main at 9fd0dd9. Its folder wizard build passed, 16 copy checks passed, and source/error/cancel/explicit-copy/result/reopen/survey UI checks passed at 1280×800 and 760×700. These UI checks use fixtures.

## Real Mac evidence

Installed development build 2501.2.48: Downloads survey/exclusion and readable sample previews, cleanup report/review agreement, a five-HEIC 2,793,528-byte organize **copy**, a same-disk verified backup and separate receipt check passed. Independent SHA-256 comparison confirmed both copies and unchanged source originals. Organize History reported five kept/copied/hash-verified. This app predates PR181; the new wizard was tested separately in the browser fixture.

## Public-release gates

- Build a new release candidate from current main; the tested app is ad-hoc signed, has no TeamIdentifier and is rejected by spctl. This says nothing negative about the separately notarized public build 80.
- Sign, notarize, staple, test a browser-downloaded quarantined DMG on a clean Mac; verify the exact artifact/build/checksum before changing download metadata.
- Exercise separate physical-drive copy, restore and sample opening; interruption/reconnect/retry and low-disk refusal using disposable copies. The small same-disk test cannot close these gates.
- Complete source-specific packaged acceptance before advertising it: full direct phone import/retry/companions, large multi-ZIP Takeout, Apple Photos permissions/save boundary, Messages/WeChat read-only boundaries.
- Auto-update signed N→N+1 and busy deferral need real Mac evidence before claiming automatic updates work publicly.
- R10 (#150) is open: do not advertise Pro, prices or a reclaim cap. A free limited beta can explicitly defer licensing; the full PRD MVP cannot mark it complete.
- R7 video duplicate cleanup and R11 cache relocation/universal 3% footprint are not claimed. Google Drive's public OAuth approval remains a separate gate.

## Website scope

Keep build-80 downloads, hashes, signing statements and metadata unchanged. Add a version-aware small-batch guide and next-beta preview using sample-only screenshots. No Buttondown account has been provided; retain mailto. Retain the existing Cloudflare Pages project mymedia-photos; no new hosting project or DNS changes.
