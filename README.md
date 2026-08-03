# Sentinel — Vulnerable Login Page Analyzer

An interactive, educational web app that simulates a **vulnerable login form** and detects common
web-security attacks against it — then explains the risks and how to prevent them.

Built with **React + TypeScript + Tailwind CSS**, bundled by **Vite**.

## Features

- Realistic, responsive cybersecurity-themed login page (username, password, show/hide, examples).
- Detects, on every submission:
  - **SQL Injection** — `' OR '1'='1`, `UNION SELECT`, comments, stacked queries, etc.
  - **Cross-Site Scripting (XSS)** — `<script>`, `javascript:`, inline event handlers, `eval()`, etc.
  - **Weak passwords** — dictionary words, short length, digits/letters only, sequences, repeats.
  - **Empty username / password** — missing required fields.
- Clear **results panel** with an animated risk gauge, color-coded severity, and expandable findings.
- **Security Tips** section with prevention advice for each attack class.
- Color-coded warnings (green / amber / red), icons, and subtle animations throughout.
- Runs entirely in the browser — no backend, no data leaves the page.

## Risk levels

| Level  | Meaning                                             |
| ------ | --------------------------------------------------- |
| Low    | Clean input and a reasonably strong password        |
| Medium | Real weaknesses (e.g. short password) worth fixing  |
| High   | Dangerous input that could compromise a real backend |

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run typecheck
```

## Deploy to GitHub Pages

The project is preconfigured for GitHub Pages project sites.

1. Push to the `main` branch.
2. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.
3. In your repo settings: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The Vite `base` is set to `./` so assets resolve correctly from
`https://<user>.github.io/<repo>/`.

## Self-test

A standalone analyzer test lives in `scripts/selftest.ts`:

```bash
node --experimental-strip-types --no-warnings scripts/selftest.ts
```

## Educational notice

This tool **intentionally simulates** a vulnerable login form for learning purposes only.
Never deploy login logic that trusts unsanitized user input in production.
