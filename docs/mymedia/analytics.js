// Website analytics only. No Google script or request before opt-in.
(() => {
  const ID = 'G-TGTTDCPXQZ';
  const KEY = 'mymedia-web-analytics-consent-v1';
  const MAX_AGE = 90 * 24 * 60 * 60 * 1000;
  let enabled = false;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Date.now() - saved.at < MAX_AGE) choice = saved.choice;
  } catch {}
  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Website analytics preferences');
  panel.innerHTML = '<div><strong>Optional website analytics</strong><p>Allow Google Analytics to measure visits and beta-request clicks? This uses analytics cookies. It does not track activity inside the MyMedia app. <a href="/mymedia/privacy/">Privacy details</a></p></div><div class="analytics-actions"><button type="button" data-choice="accepted">Accept analytics</button><button type="button" data-choice="declined">Decline analytics</button></div>';
  document.body.append(panel);
  panel.hidden = choice !== null;
  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.className = 'analytics-preferences';
  preferences.textContent = 'Analytics preferences';
  preferences.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  (document.querySelector('footer') || document.body).append(preferences);
  function start() {
    if (enabled) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('consent', 'update', {analytics_storage:'granted'});
    gtag('js', new Date());
    // Keep arbitrary query strings, fragments and referrer parameters out of GA.
    const page = new URL(location.origin + location.pathname);
    const query = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value = query.get(key);
      if (value && /^[a-z0-9_ .-]{1,100}$/i.test(value)) page.searchParams.set(key,value);
    }
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch {}
    gtag('config', ID, {page_location:page.href, page_referrer:referrer, allow_google_signals:false, allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.append(script);
  }
  panel.addEventListener('click', event => {
    const button = event.target.closest('button[data-choice]');
    if (!button) return;
    const next = button.dataset.choice;
    try { localStorage.setItem(KEY,JSON.stringify({choice:next,at:Date.now()})); } catch {}
    panel.hidden = true;
    if (next === 'accepted') start();
    else if (enabled) {
      // End this loaded tag's session and remove this site's GA cookies.
      window['ga-disable-' + ID] = true;
      for (const item of document.cookie.split(';')) {
        const name = item.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['',location.hostname,'.'+location.hostname,'.uubright.com'])
          document.cookie = name+'=; Max-Age=0; Path=/' + (domain ? '; Domain='+domain : '') + '; SameSite=Lax; Secure';
      }
      location.reload();
    }
  });
  document.addEventListener('click', event => {
    if (!enabled) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('mailto:')) gtag('event', /beta|testing/i.test(decodeURIComponent(href)) ? 'beta_cta_click' : 'contact_click', {cta_location:link.closest('.hero') ? 'hero' : 'page'});
    else if (/\/screenshots\/[^/]+\.(jpg|png)$/.test(href)) gtag('event','demo_view',{demo_name:href.split('/').pop()});
    else if (/\.(dmg|zip)(?:\?|$)/i.test(href)) gtag('event','download_click');
  });
  if (choice === 'accepted') start();
})();
