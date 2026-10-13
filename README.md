# Barusology Initiative — Official Website

**Mobile apps, AI automation and practical digital products, built to launch.**

<p>
  <img alt="Static site" src="https://img.shields.io/badge/static%20site-HTML%20%C2%B7%20CSS%20%C2%B7%20JS-f5a623?style=flat-square">
  <img alt="No build step" src="https://img.shields.io/badge/build%20step-none-4ec9b0?style=flat-square">
  <img alt="Dependencies" src="https://img.shields.io/badge/dependencies-zero-6ea8fe?style=flat-square">
  <img alt="Analytics" src="https://img.shields.io/badge/analytics-not%20wired-a9b1dd?style=flat-square">
</p>

---

This repository is the public marketing site for **Barusology Initiative**, a founder-led IT studio. It is a hand-written static site — no framework, no bundler, no `node_modules` — so anything in this folder can be dropped onto any web host and it runs.

The site is written to convert a first-time visitor into an enquiry: a clear statement of what the studio builds, the services offered, proof of how work is delivered, and a contact path that lands enquiries in a Google Sheet.

---

## Table of contents

- [Pages and sections](#pages-and-sections)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [Configuration](#configuration)
- [Connecting the contact form](#connecting-the-contact-form)
- [Design system](#design-system)
- [Accessibility and motion](#accessibility-and-motion)
- [Deploying](#deploying)
- [Before you go live](#before-you-go-live)
- [Contributing](#contributing)
- [License](#license)

---

## Pages and sections

| Route | Purpose |
| --- | --- |
| `index.html` | The whole pitch, in scroll order. |
| `contact.html` | Project enquiry form and direct contact details. |

`index.html` is ordered to answer the questions a founder asks in the first thirty seconds:

| Anchor | Section | What it establishes |
| --- | --- | --- |
| `#services` | Three service cards | Mobile app development · AI automation · Digital products |
| `#results` | "What you get" | Four count-up commitments a lead can hold you to |
| `#founder` | Founder | Who actually builds the work |
| `#process` | Process | Scope call → Build in the open → Launch & hand over |
| `#products` | Digital products | The MVP Scope Sheet · Ship Your First App · AI Automation Recipes |
| `#faq` | FAQ | Five common objections, answered |

The header, footer and the **Powered by Barusology Initiative** credit are shared across both pages.

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Markup | Semantic HTML5 | Two pages; `<details>` powers the FAQ with no script. |
| Styling | One stylesheet, CSS custom properties | Tokens drive the whole palette; edit a variable, restyle the site. |
| Behaviour | Vanilla ES modules | No framework to patch, no build to break. |
| Fonts | Poppins (display) + Inter (body), Google Fonts | Matches the brand art. |
| Forms | Google Forms endpoint | The only browser-writable Google ingestion path that needs no server. |

There is deliberately **no dependency on a package manager**. Nothing here needs to be compiled, so there is no CI, lockfile or build artefact to keep in sync.

## Project structure

```
.
├── index.html          # home page
├── contact.html        # enquiry page
├── css/
│   └── style.css       # design tokens, layout, animation
├── js/
│   ├── config.js       # ← the only file you edit to go live
│   └── main.js         # nav, scroll reveals, counters, form logic
├── assets/
│   ├── logo.png / logo.webp / banner.webp / square.png
│   ├── favicon-32.png / favicon-64.png
│   ├── apple-touch-icon.png / icon-512.png
│   └── logo-tile.png   # logo glyph used by the header mark and footer credit
└── README.md
```

## Running it locally

`js/main.js` is loaded as an ES module, and browsers block `import` over the `file://` protocol. Serve the folder over HTTP instead — any static server works:

```bash
git clone https://github.com/Barusology/barusology-initiative.git
cd barusology-initiative

# pick whichever of these you already have
python -m http.server 8080
npx serve .
php -S localhost:8080
```

Then open <http://localhost:8080>. There is nothing to install and nothing to build.

To see the empty state of the enquiry form — the `mailto:` fallback — leave `js/config.js` untouched. To see a real submission, finish [Connecting the contact form](#connecting-the-contact-form) first.

## Configuration

Everything site-specific lives in [`js/config.js`](js/config.js).

```js
export const SITE = {
  name: "Barusology Initiative",
  email: "hello@barusologyinitiative.com",   // enquiries mailbox
  whatsapp: "",                              // optional; "" hides it from the footer
  location: "Remote · working with founders worldwide",
};
```

`SITE.email` is also what the form fallback uses to compose a pre-filled message when no Google Form is connected, so it should be a mailbox you actually read.

## Connecting the contact form

A browser cannot write into a Google Sheet directly. Google Forms is the service that does the writing, and it can be pointed at an existing spreadsheet — so the site collects leads and the data still lands in your sheet.

1. Go to [forms.google.com](https://forms.google.com) → **Blank form**.
2. Add these six fields, in this order, all left **optional**:

   | Field | Question type |
   | --- | --- |
   | Name | Short answer |
   | Email | Short answer |
   | Company / Startup | Short answer |
   | Service needed | Dropdown |
   | Budget | Dropdown |
   | Project details | Paragraph |

3. **Responses** tab → ⋮ menu → **Select response destination** → **Existing spreadsheet** → pick your spreadsheet.
4. In the form editor, ⋮ → **Send** → `</>` (embed) → copy the URL in `src="…"`, up to and including `/formResponse`. That string is your `action`.
5. Open the live form in a new tab, right-click → **View page source**, and copy each question's `name="entry.##########"` value.

Fill both into `js/config.js`:

```js
export const GOOGLE_FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLS…/formResponse",
  entries: {
    name: "entry.000000001",
    email: "entry.000000002",
    company: "entry.000000003",
    service: "entry.000000004",
    budget: "entry.000000005",
    message: "entry.000000006",
  },
};
```

**How the submission works.** `main.js` checks that `action` is set and all six `entries` are non-empty. If they are, the enquiry posts into a hidden iframe against the Forms endpoint — the visitor never leaves the page and no server is involved. If any field is missing, the site falls back to opening a pre-filled email so a lead is never silently dropped. Client-side validation always runs first: name, email, service and project details are required, the email is pattern-checked, and errors appear inline on the field.

> Never commit a private spreadsheet **edit** URL into this repository. The `action` above is a public form endpoint and is safe to publish; an edit link to a Sheet is not.

## Design system

The palette is derived from the brand artwork — deep navy surfaces with a single amber accent — and defined once as tokens at the top of `css/style.css`:

```css
--navy-950: #0f1226;  /* page background   */
--navy-900: #161a36;  /* raised surface    */
--navy-850: #1c2144;  /* cards             */
--navy-800: #252b57;  /* borders, chips    */
--ink-1: #ffffff;     /* headings          */
--ink-2: #a9b1dd;     /* body copy         */
--ink-3: #8891c4;     /* metadata, captions*/
--amber: #f5a623;     /* primary accent    */
```

Layout responds at **1000px, 760px and 520px**, from a multi-column desktop grid down to a single-column mobile stack. The hero's stacked-card motif is rebuilt in CSS from the banner's geometry rather than embedded as a flat image, so it scales and animates.

**Accessibility.** Every text token was checked against its background with WCAG relative-luminance maths, not eyeballed; body copy and metadata both clear the 4.5:1 AA threshold on their surfaces. The menu button, focus rings and form errors are keyboard-operable, decorative art is `aria-hidden`, and copy is real sentences rather than lorem.

**Motion.** Content reveals on scroll through `IntersectionObserver`, headline phrases sweep, and the "What you get" numbers count up. All of it is disabled under `@media (prefers-reduced-motion: reduce)` — the site is fully legible and usable with animation off.

## Deploying

Because there is no build, any host that serves files works.

**GitHub Pages** — repo → **Settings** → **Pages** → Source: **GitHub Actions**, then add `.github/workflows/deploy.yml`:

```yaml
name: Deploy site
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.page.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: page
        uses: actions/deploy-pages@v4
```

**Netlify / Vercel / Cloudflare Pages** — import the repo, set the publish directory to the project root, leave the build command empty.

**Any host or `dist` folder** — copy the repository contents as-is. Keep `assets/`, `css/` and `js/` beside the HTML files; paths are relative.

A custom domain needs these records at your DNS provider, plus time for Pages to issue the certificate:

```
Type    Name    Value
CNAME   @       <username>.github.io
CNAME   www     <username>.github.io
```

## Before you go live

These are still placeholders and read as such to a visitor:

- [ ] `GOOGLE_FORM` in `js/config.js` — no form is connected yet; the site is on its `mailto:` fallback.
- [ ] `SITE.email` — `hello@barusologyinitiative.com` is invented; point it at a mailbox that exists.
- [ ] Founder name, photo and biography.
- [ ] The three product titles and their prices.
- [ ] The four "What you get" numbers — written as commitments you can honour, not as a track record.
- [ ] Canonical URL and `og:image` once the domain is decided.

## Contributing

Fork the repo and branch from `main` (`feature/…`, `fix/…`). Keep both pages consistent — header, footer and tokens are shared, so a change to one usually belongs in the other. There is no test suite; verify by serving locally and checking the affected breakpoint plus reduced-motion, and confirm the FAQ, nav and form still work with JavaScript disabled where applicable.

## License

© 2026 Barusology Initiative. All rights reserved.

The site's design, copy and brand assets are the property of Barusology Initiative. Source in this repository is made available for operating the website; reuse elsewhere needs permission.

---

<p align="center"><sub>Powered by <b>Barusology Initiative</b></sub></p>
