# Release-update setup — owner action remains

Recommendation: Buttondown, instead of a bespoke subscriber database/mailer.
The published candidate intentionally collects no email until an account exists.
No test or production email has been sent by this work.

1. Owner creates a Buttondown newsletter and accepts its account terms.
2. Use support@uubright.com as the monitored reply address; complete provider sender verification as required.
3. Keep double opt-in enabled and disable open/click tracking. Describe occasional builds, Intel availability and 1.0 only.
4. Put the actual newsletter username in config/mymedia-updates.json and record the verified settings. Set enabled true.
5. Run python3 scripts/configure-mymedia-updates.py. Review homepage/privacy changes and deploy.
6. Owner requests a test signup, confirms it and unsubscribes. Verify no announcement is sent before confirmation and no tracking pixel/redirect is enabled.

The form uses standard HTML POST to Buttondown, per official guidance; no fetch, embedded third-party script, API key or Cloudflare subscription store is needed. Buttondown handles validation/CAPTCHA/confirmation/unsubscribe. https://docs.buttondown.com/building-your-subscriber-base

Price checked 2026-10-16: first 100 subscribers free; recheck before committing to a plan. https://buttondown.com/pricing
