"""Shared pieces for the SeeSight marketing site.

The site is plain static HTML. This tiny build step only exists so the header,
footer and device mockups are written once. Run `python3 build/build.py` from
the website/ folder after editing anything in build/; it rewrites the *.html files.
"""

CAL_URL = "https://cal.com/seesight/30min"
EMAIL = "info@seesight.net"

PAGES = [
    ("travelers.html", "For travelers"),
    ("accountants.html", "For accountants"),
    ("companies.html", "For companies"),
    ("how-it-works.html", "How it works"),
]

LOGO_IMG = '<img src="assets/logo.png" alt="SeeSight" width="292" height="26">'

ARROW = (
    '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>'
)


def demo_btn(label="Book a demo", cls="btn", arrow=True):
    return (
        f'<a class="{cls}" href="{CAL_URL}" data-demo target="_blank" rel="noopener">'
        f'{label}{ARROW if arrow else ""}</a>'
    )


# ---------- Icons (24px stroke) ----------
_ICON_PATHS = {
    "receipt": '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    "alert": '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "phone": '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/>',
    "queue": '<path d="M4 6h16M4 12h16M4 18h10"/>',
    "rules": '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    "chat": '<path d="M4 5h16v11H9l-5 4z"/>',
    "file": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h4"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
    "link": '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/>',
    "eye": '<path d="M2.5 12C5 7.5 8.2 5.3 12 5.3s7 2.2 9.5 6.7c-2.5 4.5-5.7 6.7-9.5 6.7S5 16.5 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    "settings": '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "search": '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    "camera": '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
    "copy": '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    "up": '<path d="M6 15l6-6 6 6"/>',
    "down": '<path d="M6 9l6 6 6-6"/>',
}


def icon(name, size=None):
    s = f' width="{size}" height="{size}"' if size else ""
    return (
        f'<svg viewBox="0 0 24 24"{s} fill="none" stroke="currentColor" stroke-width="1.8" '
        f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{_ICON_PATHS[name]}</svg>'
    )


# ---------- Page shell ----------
def _cur(href, active):
    return ' aria-current="page"' if href == active else ""


def header(active):
    links = "".join(
        f'<li><a href="{href}"{_cur(href, active)}>{label}</a></li>'
        for href, label in PAGES
    )
    mobile_links = "".join(
        f'<li><a href="{href}"{_cur(href, active)}>{label}{ARROW}</a></li>'
        for href, label in PAGES
    )
    return f"""<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="logo" href="index.html" aria-label="SeeSight home">{LOGO_IMG}</a>
    <nav aria-label="Main">
      <ul class="nav-links">{links}</ul>
    </nav>
    <div class="nav-cta">{demo_btn(cls="btn btn-dark btn-sm", arrow=False)}</div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu">
  <nav aria-label="Mobile">
    <ul>{mobile_links}</ul>
  </nav>
  {demo_btn(cls="btn btn-lg")}
</div>"""


def footer():
    links = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l in [("index.html", "Home")] + PAGES)
    return f"""<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="logo" href="index.html" aria-label="SeeSight home">{LOGO_IMG}</a>
        <p class="footer-tag">SeeSight. <span class="muted">Business travel expenses without the stress.</span></p>
      </div>
      <div class="footer-col">
        <h2>Pages</h2>
        <ul>{links}</ul>
      </div>
      <div class="footer-col">
        <h2>Contact</h2>
        <ul>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="{CAL_URL}" data-demo target="_blank" rel="noopener">Book a demo</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 SeeSight</span>
      <a href="mailto:{EMAIL}">{EMAIL}</a>
    </div>
  </div>
</footer>"""


def page(filename, title, description, body):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#F4F7FE">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/logo-mark.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600;700&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="assets/styles.css">
<script src="assets/main.js" defer></script>
</head>
<body>
{header(filename)}
<main id="main">
{body}
</main>
{footer()}
</body>
</html>
"""


# ---------- Shared sections ----------
def cta_band(title, lead):
    return f"""<section class="section-tight" aria-labelledby="cta-title">
  <div class="wrap">
    <div class="cta-band reveal">
      <h2 class="h2" id="cta-title">{title}</h2>
      <p class="lead">{lead}</p>
      <div class="actions">{demo_btn(cls="btn btn-lg")}</div>
      <p class="small">About 30 minutes. Questions first? <a href="mailto:{EMAIL}">{EMAIL}</a></p>
    </div>
  </div>
</section>"""


def faq(items, title="Questions, answered.", lead=None):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    rows = "".join(
        f"""<details>
        <summary>{q}<span class="plus" aria-hidden="true"></span></summary>
        <div class="faq-body"><p>{a}</p></div>
      </details>"""
        for q, a in items
    )
    return f"""<section class="section" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div class="section-head reveal">
      <span class="eyebrow">FAQ</span>
      <h2 class="h2" id="faq-title">{title}</h2>
      {lead_html}
    </div>
    <div class="faq reveal">{rows}</div>
  </div>
</section>"""


def steps(items, title, eyebrow="Step by step", lead=None, cols=None):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    cls = f"steps cols-{cols}" if cols else "steps"
    lis = "".join(
        f'<li class="step reveal" style="--d:{i * 0.07:.2f}s"><h3>{t}</h3><p>{d}</p></li>'
        for i, (t, d) in enumerate(items)
    )
    return f"""<section class="section" aria-labelledby="steps-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">{eyebrow}</span>
      <h2 class="h2" id="steps-title">{title}</h2>
      {lead_html}
    </div>
    <ol class="{cls}">{lis}</ol>
  </div>
</section>"""


def benefit_cards(items, title, eyebrow="What gets better", lead=None, navy=False):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    cards = "".join(
        f"""<article class="card reveal" style="--d:{i * 0.08:.2f}s">
        <div class="icon">{icon(ic)}</div>
        <h3 class="h3">{t}</h3>
        <p>{d}</p>
      </article>"""
        for i, (ic, t, d) in enumerate(items)
    )
    wrap_open = '<div class="band-navy rounded-band">' if navy else "<div>"
    return f"""{wrap_open}<section class="section" aria-labelledby="better-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">{eyebrow}</span>
      <h2 class="h2" id="better-title">{title}</h2>
      {lead_html}
    </div>
    <div class="grid-3">{cards}</div>
  </div>
</section></div>"""


# ---------- Device frames with real product screenshots ----------
# Images live in assets/screens/ (WebP). Web screens also have a tighter "-m" crop for phones.
SHOTS = {
    "phone-1-receipt": (780, 1688), "phone-2-claim": (780, 1688),
    "phone-3-status": (780, 1688), "phone-4-decision": (780, 1688),
    "web-1-overview": (1800, 637), "web-2-queue": (1800, 719), "web-3-decision": (1800, 951),
    "web-4-people": (1800, 822), "web-5-rules": (1800, 800),
}

ALT = {
    "phone-1-receipt": "SeeSight on a phone: checking a hotel receipt SeeSight has read, flagged as over the 250 GEL nightly limit",
    "phone-2-claim": "SeeSight on a phone: the Batumi client visit claim with three records and two warnings, over a limit and a possible duplicate",
    "phone-3-status": "SeeSight on a phone: claim sent to the accountant, with the status timeline from draft to decision",
    "phone-4-decision": "SeeSight on a phone: a rejected claim with the accountant’s comment and the approved total",
    "web-1-overview": "SeeSight company overview: claims this month, claims waiting for review, approved amount and each trip with its status",
    "web-2-queue": "SeeSight accountant queue with search and filters by status, company, traveler and date",
    "web-3-decision": "SeeSight accountant decision screen: expense details, the rule that flagged it, decision buttons and the receipt image",
    "web-4-people": "SeeSight company people page: accountants and travelers, their status and each traveler’s assigned accountant",
    "web-5-rules": "SeeSight rules screen: five rules checked from top to bottom, each with a condition and a result",
}


def phone(shot, eager=False):
    w, h = SHOTS[shot]
    load = "eager" if eager else "lazy"
    return (
        f'<div class="phone"><div class="phone-screen">'
        f'<div class="phone-status" aria-hidden="true"><span>9:41</span><i></i></div>'
        f'<img src="assets/screens/{shot}.webp" width="{w}" height="{h}" alt="{ALT[shot]}" loading="{load}" decoding="async">'
        f'</div></div>'
    )


def browser(shot, eager=False, url="app.seesight.net"):
    w, h = SHOTS[shot]
    load = "eager" if eager else "lazy"
    return (
        f'<div class="browser">'
        f'<div class="browser-bar" aria-hidden="true"><div class="browser-dots"><i></i><i></i><i></i></div>'
        f'<div class="browser-url">{url}</div><div style="width:47px"></div></div>'
        f'<picture class="browser-body">'
        f'<source media="(max-width: 720px)" srcset="assets/screens/{shot}-m.webp">'
        f'<img src="assets/screens/{shot}.webp" width="{w}" height="{h}" alt="{ALT[shot]}" loading="{load}" decoding="async">'
        f'</picture></div>'
    )


def logo_marquee(label="Partner companies. Logos coming soon."):
    names = [f"Partner logo {i}" for i in range(1, 9)]
    a = "".join(f'<span class="logo-ph">{n}</span>' for n in names)
    b = "".join(f'<span class="logo-ph" aria-hidden="true">{n}</span>' for n in names)
    return f"""<div class="marquee-wrap">
  <p class="marquee-label">{label}</p>
  <div class="marquee"><div class="marquee-track">{a}{b}</div></div>
</div>"""
