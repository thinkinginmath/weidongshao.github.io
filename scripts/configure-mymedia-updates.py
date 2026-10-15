"""Enable the standard Buttondown form only after the owner configures the newsletter."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
c=json.loads((root/'config/mymedia-updates.json').read_text())
if not c.get('enabled'):raise SystemExit('Signup stays pending; no addresses are collected.')
assert c['doubleOptInVerified'] and c['trackingDisabledVerified'], 'Verify provider settings first'
assert re.fullmatch(r'[a-zA-Z0-9_-]+',c.get('username') or ''), 'Set the real newsletter username'
p=root/'docs/mymedia/index.html';s=p.read_text();assert 'data-release-updates-pending' in s,'Already configured'
form=f'''<form class="updates-form" method="post" action="https://buttondown.com/api/emails/embed-subscribe/{c['username']}"><label for="updates-email">Email address</label><div><input id="updates-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"><button class="button" type="submit">Get release updates</button></div><input type="hidden" name="embed" value="1"><p class="fine">Confirmation and delivery by Buttondown. You will continue to its confirmation page.</p></form>'''
s=re.sub(r'<div class="updates-form" data-release-updates-pending>.*?</div>',lambda _:form,s);s=s.replace('When signup opens, you will confirm','You will confirm');p.write_text(s)
p=root/'docs/mymedia/privacy/index.html';s=p.read_text();a=s.index('<h2 id="release-updates">');b=s.index('<h2>Measurement without tracking scripts',a)
s=s[:a]+'''<h2 id="release-updates">Release-update emails</h2><p>If you submit the optional form, your email address goes directly to Buttondown for confirmation and occasional MyMedia Photos build announcements, Intel availability and the 1.0 announcement. Confirming your address is required. This is separate from desktop Google sign-in. No photo library, search activity or diagnostics is included.</p><p>Buttondown processes the address, subscription status and ordinary delivery/security metadata under its <a href="https://buttondown.com/legal/privacy">privacy policy</a>. We use the address only for these updates, keep it until you unsubscribe or request removal, and disable email-open and click tracking. Use the unsubscribe link in any update, or email support for deletion help. Unsubscribing stops future announcements; the provider may keep suppression and security records as described in its policy.</p>'''+s[b:];p.write_text(s)
