# Gather — local family event expense pilot

A responsive, dependency-free static app. Open `index.html` in a modern browser, or serve this folder over localhost. Create events with a budget, currency and members; record expenses and view equal-share repayment suggestions. The initial three events are fictional examples and can be deleted.

Data is saved in localStorage in the current browser and origin. It is not synchronized between people, devices, browser profiles or the eventual hosted site. Export a JSON backup before clearing browser data. Backup restore, accounts, shared editing and payment tracking are future work. Do not use this pilot as the sole record of important expenses. Each event has its own currency; the dashboard displays separate totals per currency without conversion. Splits use integer cents, distributing leftover cents in member order.

## Local preview

With Node.js installed: `node server.cjs`, then open http://localhost:4173 .

## GitHub Pages (next step)

The included GitHub Actions workflow deploys static files with relative asset paths, including under a repository subpath. Push to a GitHub repository on branch `main`, then select **Settings → Pages → Source → GitHub Actions**. No backend, build dependencies, credentials, analytics or payment processing are included. No deployment has been performed yet.

GitHub Pages is intended for static project hosting. Its rules prohibit using it to run a commercial SaaS or a site primarily facilitating commercial transactions, and advise against sensitive transactions such as passwords or card details. This personal, noncommercial local-storage pilot is designed around those restrictions; reassess hosting before adding commercial or sensitive features. This is a technical policy check, not a guarantee of compliance with every applicable law.

Policy references checked October 29, 2026:
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

The interface supports responsive layouts, native keyboard-operable forms, visible focus states, touch targets and reduced motion. No third-party assets or runtime requests are required.
