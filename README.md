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
npm run build    # production build into docs/
npm run typecheck
```

## Deploy to GitHub Pages

The project is preconfigured for GitHub Pages project sites. The Vite `base` is set to
`/vulnerable-login-page-analyzer/` (absolute) so built assets resolve correctly with or
without a trailing slash on the URL.

There are three ways to deploy — pick whichever matches your repo settings:

### Option A — Deploy from `main` branch `/docs` folder (no Actions needed)

1. Run `npm run build` locally (outputs to `docs/`).
2. Commit the `docs/` folder to `main`.
3. In **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   select **`main`** and **`/docs`** folder.

### Option B — GitHub Actions artifact deploy (recommended for auto-deploy)

1. Push to the `main` branch.
2. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically.
3. In **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Option C — `gh-pages` branch deploy

1. Push to `main`. The workflow (`.github/workflows/deploy-gh-pages.yml`) builds and
   pushes the output to a `gh-pages` branch.
2. In **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   select **`gh-pages`** and **`/ (root)`** folder.

## Self-test

A standalone analyzer test lives in `scripts/selftest.ts`:

```bash
node --experimental-strip-types --no-warnings scripts/selftest.ts
```

## Educational notice

This tool **intentionally simulates** a vulnerable login form for learning purposes only.
Never deploy login logic that trusts unsanitized user input in production.
