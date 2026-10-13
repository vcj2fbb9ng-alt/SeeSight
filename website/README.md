# SeeSight marketing site

Static marketing site (HTML, CSS, JS, no framework). Five pages: Home, For travelers,
For accountants, For companies, How it works. Every "Book a demo" button opens a popup
with the Cal.com calendar (`https://cal.com/seesight/30min`) and an "open in a new tab"
fallback. Without JavaScript the same buttons simply link to Cal.com.

```
website/
  index.html, traveler.html, accountant.html, company.html, how-it-works.html
  .htaccess           clean addresses (/traveler, /accountant, /company, /how-it-works), https, old-URL redirects
  assets/styles.css   design tokens, layout, components
  assets/main.js      nav, mobile menu, demo popup, reveals, count-ups, tabs, FAQ, rules demo
  assets/logo.png, assets/logo-mark.png   logo and favicon
  build/              optional generator for the HTML (shared header, footer, mockups)
```

## Preview locally

```
cd website
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing

The HTML files are generated so the header, footer and device mockups exist in one place.
Edit `build/build.py` (page content) or `build/partials.py` (shared pieces), then run:

```
cd website
python3 build/build.py
```

You can also edit the `.html` files directly; just don't run the build afterwards or it will
overwrite them.

## Placeholders to replace

- **Product screens**: every phone and browser frame is a labelled "Placeholder screen" built
  in HTML. Replace the inner markup (see `SCREEN_*` and `WEB_*` in `build/partials.py`) with
  `<img>` tags once real screenshots exist.
- **Partner logos**: `logo_marquee()` in `build/partials.py`.

## Deploy

Upload the contents of `website/` (the `build/` folder is not needed), including the hidden `.htaccess`, to an Apache host such as cPanel. The `.htaccess` file gives the pages clean addresses without `.html`. On other static hosts (
Netlify, Vercel, Cloudflare Pages) turn on their "pretty URLs" option instead. The site must sit at the domain root.
