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

LOGO_MARK = (
    '<svg viewBox="0 0 32 32" aria-hidden="true">'
    '<rect width="32" height="32" rx="9" fill="#0D1B2E"/>'
    '<path d="M5.5 16c2.9-4.8 6.4-7.2 10.5-7.2s7.6 2.4 10.5 7.2c-2.9 4.8-6.4 7.2-10.5 7.2S8.4 20.8 5.5 16z" '
    'fill="none" stroke="#BDEB6B" stroke-width="2.2" stroke-linejoin="round"/>'
    '<circle cx="16" cy="16" r="3.6" fill="#BDEB6B"/></svg>'
)

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
    <a class="logo" href="index.html" aria-label="SeeSight home">{LOGO_MARK}<span>SeeSight</span></a>
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
        <a class="logo" href="index.html" aria-label="SeeSight home">{LOGO_MARK}<span>SeeSight</span></a>
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
<meta name="theme-color" content="#F3F2EC">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
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


# ---------- Device frames with placeholder screens ----------
PH = '<span class="placeholder-tag">Placeholder screen</span>'


def phone(inner, label="SeeSight on a phone (placeholder screen)"):
    return (
        f'<div class="phone" role="img" aria-label="{label}"><div class="phone-screen">'
        f'<div class="ui ui-phone" aria-hidden="true">{inner}</div>{PH}</div></div>'
    )


def browser(inner, url="app.seesight.net", label="SeeSight in a web browser (placeholder screen)"):
    return (
        f'<div class="browser" role="img" aria-label="{label}">'
        f'<div class="browser-bar" aria-hidden="true"><div class="browser-dots"><i></i><i></i><i></i></div>'
        f'<div class="browser-url">{url}</div><div style="width:47px"></div></div>'
        f'<div class="browser-body"><div class="ui" aria-hidden="true">{inner}</div>{PH}</div></div>'
    )


SCREEN_RECEIPT = """
<div><div class="ui-sub">New expense</div><div class="ui-title">Receipt read</div></div>
<div class="ui-receipt">Receipt photo</div>
<div class="ui-card">
  <div class="ui-row"><span class="ui-label">Merchant</span><span class="ui-value">City hotel</span></div>
  <div class="ui-row"><span class="ui-label">Date</span><span class="ui-value">12 Mar</span></div>
  <div class="ui-row"><span class="ui-label">Amount</span><span class="ui-value">480.00 GEL</span></div>
  <div class="ui-row"><span class="ui-label">Category</span><span class="chip info">Hotel</span></div>
</div>
<div class="ui-btn lime">Looks right</div>
"""

SCREEN_CLAIM = """
<div><div class="ui-sub">Claim · Draft</div><div class="ui-title">Client visit</div></div>
<div class="ui-card">
  <div class="ui-row"><span class="ui-value">Flight</span><span class="chip ok">Ready</span></div>
  <div class="ui-row"><span class="ui-value">City hotel</span><span class="chip warn">Over limit</span></div>
  <div class="ui-row"><span class="ui-value">Airport taxi</span><span class="chip bad">Duplicate?</span></div>
  <div class="ui-row"><span class="ui-value">Per diem</span><span class="chip ok">Ready</span></div>
</div>
<div class="ui-flag"><span>!</span><span><b>Check before sending</b>Hotel is above the nightly limit. Add a note for your accountant.</span></div>
<div class="ui-btn">Send to accountant</div>
"""

SCREEN_STATUS = """
<div><div class="ui-sub">Claim status</div><div class="ui-title">Client visit</div></div>
<div class="ui-card">
  <div class="ui-row"><span class="ui-value">Draft</span><span class="chip ok">Done</span></div>
  <div class="ui-row"><span class="ui-value">Submitted</span><span class="chip ok">Done</span></div>
  <div class="ui-row"><span class="ui-value">In review</span><span class="chip info">Now</span></div>
  <div class="ui-row"><span class="ui-label">Decision</span><span class="ui-label">Next</span></div>
</div>
<div class="ui-card">
  <div class="ui-label">Assigned accountant</div>
  <div class="ui-value" style="margin-top:4px">Your accountant</div>
  <div class="ui-bar w80" style="margin-top:10px"></div>
  <div class="ui-bar w40" style="margin-top:6px"></div>
</div>
<div class="ui-btn lime">Email when decided</div>
"""

SCREEN_DECISION = """
<div><div class="ui-sub">Decision</div><div class="ui-title">Approved in part</div></div>
<div class="ui-card">
  <div class="ui-row"><span class="ui-label">Claimed</span><span class="ui-value">Full claim</span></div>
  <div class="ui-row"><span class="ui-label">Approved</span><span class="chip ok">Part</span></div>
</div>
<div class="ui-card">
  <div class="ui-label">Comment from your accountant</div>
  <div class="ui-bar w80" style="margin-top:10px"></div>
  <div class="ui-bar w60" style="margin-top:6px"></div>
</div>
<div class="ui-card"><div class="ui-row"><span class="ui-value">Claim PDF</span><span class="chip info">With receipts</span></div></div>
<div class="ui-btn">Download PDF</div>
"""


def _side(active):
    items = ["Queue", "Rules", "Travelers", "Exports"]
    navs = "".join(f'<div class="ui-nav{" active" if i == active else ""}">{i}</div>' for i in items)
    return f'<div class="ui-side"><span class="logo">{LOGO_MARK}<span>SeeSight</span></span>{navs}</div>'


WEB_QUEUE = f"""
<div class="ui-web">
  {_side("Queue")}
  <div class="ui-main">
    <div class="ui-row"><div><div class="ui-sub">Accountant</div><div class="ui-title">Review queue</div></div><span class="chip info">In review</span></div>
    <div class="ui-toolbar">
      <div class="ui-search">Search traveler, merchant, trip…</div>
      <span class="ui-filter">Status</span><span class="ui-filter">Flagged</span><span class="ui-filter">Date</span>
    </div>
    <table class="ui-table">
      <thead><tr><th>Traveler</th><th class="hide-sm">Trip purpose</th><th class="hide-sm">Submitted</th><th>Flags</th><th>Status</th></tr></thead>
      <tbody>
        <tr class="sel"><td><span class="ui-avatar">NK</span>Nino K.</td><td class="hide-sm">Client visit</td><td class="hide-sm">Today</td><td><span class="chip warn">Over limit</span></td><td><span class="chip info">In review</span></td></tr>
        <tr><td><span class="ui-avatar">GM</span>Giorgi M.</td><td class="hide-sm">Conference</td><td class="hide-sm">Today</td><td><span class="chip bad">Duplicate?</span></td><td><span class="chip">Submitted</span></td></tr>
        <tr><td><span class="ui-avatar">AL</span>Ana L.</td><td class="hide-sm">Site visit</td><td class="hide-sm">Yesterday</td><td><span class="chip ok">None</span></td><td><span class="chip">Submitted</span></td></tr>
        <tr><td><span class="ui-avatar">DB</span>Dato B.</td><td class="hide-sm">Training</td><td class="hide-sm">Yesterday</td><td><span class="chip ok">None</span></td><td><span class="chip ok">Approved</span></td></tr>
      </tbody>
    </table>
  </div>
</div>
"""

WEB_HOME = f"""
<div class="ui-web">
  {_side("Queue")}
  <div class="ui-main">
    <div class="ui-row"><div><div class="ui-sub">Overview</div><div class="ui-title">Travel expenses</div></div><span class="chip ok">All in one place</span></div>
    <div class="ui-kpis">
      <div class="ui-kpi"><div class="ui-label">Submitted</div><div class="ui-bar w60"></div></div>
      <div class="ui-kpi"><div class="ui-label">In review</div><div class="ui-bar w40"></div></div>
      <div class="ui-kpi"><div class="ui-label">Decided</div><div class="ui-bar w80"></div></div>
    </div>
    <table class="ui-table">
      <thead><tr><th>Traveler</th><th>Purpose</th><th class="hide-sm">Receipt</th><th>Status</th></tr></thead>
      <tbody>
        <tr class="sel"><td><span class="ui-avatar">NK</span>Nino K.</td><td>Client visit</td><td class="hide-sm">Attached</td><td><span class="chip info">In review</span></td></tr>
        <tr><td><span class="ui-avatar">GM</span>Giorgi M.</td><td>Conference</td><td class="hide-sm">Attached</td><td><span class="chip warn">Document asked</span></td></tr>
        <tr><td><span class="ui-avatar">AL</span>Ana L.</td><td>Site visit</td><td class="hide-sm">Attached</td><td><span class="chip ok">Approved</span></td></tr>
      </tbody>
    </table>
  </div>
</div>
"""

WEB_PEOPLE = """
<div class="ui-web" style="grid-template-columns:1fr">
  <div class="ui-main">
    <div class="ui-row"><div><div class="ui-sub">Company settings</div><div class="ui-title">People</div></div><span class="chip ok">Invite by email</span></div>
    <div class="ui-toolbar"><span class="ui-filter" style="background:var(--ink);color:#fff;border-color:var(--ink)">People</span><span class="ui-filter">Plan &amp; billing</span><span class="ui-filter">Settings</span></div>
    <table class="ui-table">
      <thead><tr><th>Name</th><th>Role</th><th>Accountant</th></tr></thead>
      <tbody>
        <tr><td><span class="ui-avatar">NK</span>Nino K.</td><td>Traveler</td><td><span class="chip info">Mariam T.</span></td></tr>
        <tr class="sel"><td><span class="ui-avatar">GM</span>Giorgi M.</td><td>Traveler</td><td><span class="chip warn">Change…</span></td></tr>
        <tr><td><span class="ui-avatar">MT</span>Mariam T.</td><td>Accountant</td><td>—</td></tr>
      </tbody>
    </table>
  </div>
</div>
"""

WEB_DECIDE = """
<div class="ui-web" style="grid-template-columns:1fr 1fr">
  <div class="ui-main" style="border-right:1px solid var(--line)">
    <div><div class="ui-sub">Expense</div><div class="ui-title">City hotel</div></div>
    <div class="ui-receipt" style="height:150px">Receipt image</div>
    <div class="ui-flag"><span>!</span><span><b>Hotel rule</b>Above the nightly limit set in your rules.</span></div>
  </div>
  <div class="ui-main">
    <div class="ui-sub">Your decision</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="ui-btn lime" style="margin:0">Approve</div>
      <div class="ui-btn" style="margin:0;background:#fff;color:var(--ink);border:1px solid var(--line)">Reject</div>
      <div class="ui-btn" style="margin:0;background:#fff;color:var(--ink);border:1px solid var(--line)">Approve part</div>
      <div class="ui-btn" style="margin:0;background:#fff;color:var(--ink);border:1px solid var(--line)">Ask for document</div>
    </div>
    <div class="ui-card" style="box-shadow:none;border:1px solid var(--line)"><div class="ui-label">One comment</div><div class="ui-bar w80" style="margin-top:10px"></div><div class="ui-bar w40" style="margin-top:6px"></div></div>
  </div>
</div>
"""


def logo_marquee(label="Partner companies. Logos coming soon."):
    names = [f"Partner logo {i}" for i in range(1, 9)]
    a = "".join(f'<span class="logo-ph">{n}</span>' for n in names)
    b = "".join(f'<span class="logo-ph" aria-hidden="true">{n}</span>' for n in names)
    return f"""<div class="marquee-wrap">
  <p class="marquee-label">{label}</p>
  <div class="marquee"><div class="marquee-track">{a}{b}</div></div>
</div>"""
