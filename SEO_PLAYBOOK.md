# Deal Flow CRM — SEO Operations Playbook

**Site:** https://dealflowcrm.co.in
**App:** https://app.dealflowcrm.co.in
**Owner (business):** Momentum Marketing & Software Technologies (India)
**Primary contact:** support@dealflowcrm.co.in · +91 74398 52955
**Document owner:** SEO lead
**Last updated:** 2026-11-06
**Status:** Living document — update after every change

> **Security note:** This document is a playbook, NOT a password store. Real passwords, API keys, 2FA codes and recovery codes must live in the team password manager (1Password / Bitwarden shared vault). Never paste real credentials into this file, email, or chat. If a credential appears here, rotate it immediately.

---

## 0. Quick start for a new team member

1. Read sections 1–3 (brand + goals).
2. Get access: password-manager vault invite, Google Search Console (GSC), Google Business Profile, social accounts, directory accounts (see section 8 — Credentials & Access).
3. Confirm you can log into GSC and see dealflowcrm.co.in. If not, ask the SEO lead.
4. Pick one task from section 7 (weekly checklist) and do it. Report back in the team channel.

---

## 1. Brand & positioning (read before doing anything)

- **Brand name (canonical):** Deal Flow CRM (with the space). Also written DealFlow CRM / dealflowcrm (no space).
- **Website:** https://dealflowcrm.co.in (marketing) — **this** is the site we are ranking.
- **App:** https://app.dealflowcrm.co.in (product) — do not try to rank the app subdomain for marketing queries.
- **Legal entity:** Momentum Marketing & Software Technologies.
- **Category:** AI sales CRM with an AI calling agent (AI telecaller) for small and growing sales teams worldwide.
- **Key differentiator:** AI calling agent that answers missed calls and calls lead lists in 40+ languages from your own phone, then books meetings.
- **Pricing (per user, billed yearly):** Free (5 leads/5 deals), Basic $19/mo ($228/yr), Pro $49/mo ($588/yr). India: Basic ₹1,000/mo (₹12,000/yr), Pro ₹2,000/mo (₹24,000/yr), GST included.
- **Support hours:** Mon–Fri, 9 am–5 pm IST.

### Brand-confusion warning
There are unrelated products with similar names. Do **not** confuse them and never link to them as if they were us:
- dealflowcrm.app — real-estate CRM (different company)
- dealflowcrm.in — dealership CRM (different company)
- dealflow.com / deal-workflow.com — PE/VC deal software (different)
- dealflowphx.com — different product

Our disambiguation line (use in bios/directories/FAQs): *"Deal Flow CRM is the AI sales CRM at dealflowcrm.co.in, made by Momentum Marketing & Software Technologies (India). The one with the AI calling agent that answers missed calls and calls lead lists in 40+ languages."*

---

## 2. SEO goals & KPIs

**Primary goal:** Rank #1 on Google for the brand query "dealflow CRM" / "deal flow CRM" / "dealflowcrm" (so our marketing site outranks dealflowcrm.app and dealflowcrm.in).

**Secondary goals:**
- Rank on page 1 for: "ai calling agent", "ai telecaller", "ai crm for small business", "crm with ai calling", "sales crm india".
- Grow organic sessions and signups month over month.

**KPIs (track monthly):**
- Google Search Console: impressions, clicks, CTR, average position for brand + category queries.
- Number of indexed pages (should be ~20+).
- Referring domains / backlinks (target: +5 quality domains/month).
- Organic signups (from GA4, once installed).
- Core Web Vitals (LCP, CLS, INP) — keep green.

---

## 3. What's already done (technical SEO — by engineering)

Do not redo these; verify they still work after any deploy:
- Per-page title + meta description + canonical URL
- Open Graph + Twitter cards (with image alt)
- JSON-LD: Organization, WebSite, WebPage, SoftwareApplication, FAQPage, BreadcrumbList
- sitemap.xml, robots.txt, llms.txt
- hreflang (en-IN + x-default)
- Custom 404 page (noindex)
- Security headers (firebase.json)
- HTTPS + HSTS
- clean URLs, fast static hosting (Firebase)

**Owner:** Engineering. **Cadence:** verify after every release.

---

## 4. On-page SEO checklist (per page)

When editing or adding a page, confirm:
- [ ] Unique, keyword-rich `<title>` (≤ 60 chars) and meta description (≤ 160 chars)
- [ ] One H1 containing the primary keyword
- [ ] H2/H3 structure with secondary keywords
- [ ] Descriptive image `alt` text (no empty alt on meaningful images)
- [ ] Internal links to at least 2 other site pages (use descriptive anchor text, not "click here")
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] Canonical URL set correctly
- [ ] Schema/JSON-LD present and valid (test with Google Rich Results Test)
- [ ] Mobile-friendly (test on phone)
- [ ] Page added to sitemap (rebuilt via `node build.mjs`)

---

## 5. Off-page SEO playbook (team tasks)

### 5.1 Google Search Console (GSC) — PRIORITY 1
**Owner:** SEO lead. **Frequency:** weekly.
1. Go to https://search.google.com/search-console → add property `dealflowcrm.co.in`.
2. Verify via DNS TXT record (preferred) or HTML tag. If HTML tag: paste code into `build.mjs` (the commented placeholder), rebuild, deploy, then click "Verify".
3. Submit sitemap: `https://dealflowcrm.co.in/sitemap.xml`.
4. Request indexing for: `/`, `/features`, `/ai-calling`, `/pricing`, `/use-cases`, `/faq`.
5. Weekly: check Performance → queries for "dealflow", "deal flow", "ai calling", "ai telecaller"; fix any coverage errors.

### 5.2 Google Business Profile
**Owner:** Founder/ops. **One-time + monthly.**
1. Create profile at https://business.google.com for "Deal Flow CRM" (or legal entity name).
2. Category: Software company. Add website, phone, hours, description with brand-disambiguation line.
3. Add photos (logo, product screenshots).
4. Post updates monthly (feature launches, tips).
5. Ask happy customers to leave a review.

### 5.3 Social profiles (create + link back)
**Owner:** Marketing. **One-time.**
Create accounts with exact handle/name "Deal Flow CRM" where available:
- LinkedIn company page → https://linkedin.com/company/deal-flow-crm
- X / Twitter → @dealflowcrm (or closest)
- Facebook page
- YouTube channel (product demos, AI call recordings)
- GitHub organization (optional, for dev credibility)

Each bio must include: brand name, one-line description, and link to https://dealflowcrm.co.in. Then send all URLs to the SEO lead so they get added to `sameAs` in `seo.mjs` and the footer.

### 5.4 Software directories (high authority backlinks)
**Owner:** Marketing. **2–3 per week.**
Submit to: G2, Capterra, GetApp, Software Advice, Product Hunt, AlternativeTo, SaaSHub, Crunchbase, Slant, SourceForge (if applicable).
- Use the canonical brand name and the disambiguation line.
- Link back to dealflowcrm.co.in (not the app).
- Collect and respond to reviews.

### 5.5 Backlinks & mentions
**Owner:** Marketing + content. **Ongoing.**
- Guest posts on sales/CRM/SaaS blogs (include a link to a relevant page, e.g., /ai-calling or /features).
- Podcast interviews (founder talking about AI calling for small business).
- Indie Hackers / Reddit posts (r/CRM, r/sales, r/Entrepreneur, r/IndiaStartups) — provide value, link naturally.
- Hacker News "Show HN" for the AI calling agent.
- Answer questions on Quora/Stack Exchange linking to the FAQ page.
- HARO / Connectively / Featured.com journalist queries.

### 5.6 Press releases
**Owner:** Founder. **Per major launch.**
One press release for the AI calling agent launch via PRWeb / EIN Presswire / Indian wire (PTI/ANI). Include brand name + link + disambiguation line.

### 5.7 Reviews
**Owner:** Customer success. **Monthly.**
Ask 5–10 active customers per month to review on G2/Capterra. Respond to every review (positive or negative). Never incentivize fake reviews.

---

## 6. Content SEO playbook

**Owner:** Content. **Cadence:** 2–4 pieces/month.

### 6.1 Comparison pages (high intent)
Build pages like `/deal-flow-crm-vs-zoho`, `/deal-flow-crm-vs-hubspot`, `/deal-flow-crm-vs-pipedrive`. Each: honest feature comparison table, pricing, who each suits, CTA. These capture "alternative to" searches.

### 6.2 Use-case landing pages
Already have `/use-cases`. Expand into dedicated pages: `/crm-for-real-estate`, `/crm-for-education`, `/crm-for-clinics`, `/crm-for-tiffin-and-food-services`, `/crm-for-interiors`, `/crm-for-manufacturing`, `/crm-for-agencies`, `/crm-for-travel`.

### 6.3 Blog
Create `/blog` with SEO articles targeting:
- "AI calling agent for small business"
- "Best CRM for real estate in India"
- "How to follow up leads faster"
- "AI telecaller vs human telecaller"
- "WhatsApp CRM for sales teams"

Each post: 1,000+ words, H2 structure, internal links to product pages, one CTA.

### 6.4 Case studies / testimonials
Real customer stories with permission. Add `Review`/`AggregateRating` schema only when genuine reviews exist.

**Engineering note:** Content pages are added as `pages/<name>.main.html` and registered in `build.mjs` `PAGES` array, then `node build.mjs` rebuilds the site. Deploy with `firebase deploy --only hosting`.

---

## 7. Weekly SEO checklist (team)

- [ ] GSC: check new queries, errors, indexing status (SEO lead)
- [ ] Publish 1 content piece or update 1 existing page (Content)
- [ ] Submit 2 directory listings or send 2 outreach emails (Marketing)
- [ ] Ask 3 customers for a review (Customer success)
- [ ] Post 1 social update linking to the site (Marketing)
- [ ] Verify site still loads, 404 works, sitemap valid (Engineering)
- [ ] Monthly: review KPIs (section 2) and adjust priorities

---

## 8. Credentials & access (DO NOT store passwords here)

All credentials live in the shared password-manager vault. This table lists **what accounts must exist**, who owns them, and where the credential is stored. If a row has no owner, assign one this week.

| # | Service | Account / handle | Owner | Where credential stored | Notes |
|---|---------|------------------|-------|------------------------|-------|
| 1 | Firebase (hosting) | deal-flow-crm-f8491 | Engineering | Password manager (Firebase) | `firebase deploy --only hosting` from `deal-flow-crm-website/` |
| 2 | GitHub | contactarjunjha-source/deal-flow-crm-website | Engineering | Password manager (GitHub) | Branch `dealflowcrm-co-in` is live; `master` is legacy |
| 3 | Google Search Console | dealflowcrm.co.in property | SEO lead | Password manager (Google) | Needs DNS/HTML verification — pending |
| 4 | Google Business Profile | Deal Flow CRM | Founder | Password manager (Google) | To be created |
| 5 | Google Analytics 4 | Measurement ID TBD | SEO lead | Password manager (Google) | To be created; paste ID into build.mjs |
| 6 | LinkedIn | Deal Flow CRM company page | Marketing | Password manager (LinkedIn) | To be created |
| 7 | X / Twitter | @dealflowcrm (or closest) | Marketing | Password manager (X) | To be created |
| 8 | Facebook | Deal Flow CRM page | Marketing | Password manager (Facebook) | To be created |
| 9 | YouTube | Deal Flow CRM channel | Marketing | Password manager (Google) | To be created |
| 10 | G2 | Deal Flow CRM listing | Marketing | Password manager (G2) | To be created |
| 11 | Capterra | Deal Flow CRM listing | Marketing | Password manager (Capterra) | To be created |
| 12 | Product Hunt | Deal Flow CRM | Marketing | Password manager (Product Hunt) | To be created |
| 13 | Crunchbase | Momentum Marketing & Software Technologies | Founder | Password manager (Crunchbase) | To be created |
| 14 | Bing Webmaster Tools | dealflowcrm.co.in | SEO lead | Password manager (Microsoft) | To be created |
| 15 | Domain registrar | dealflowcrm.co.in | Founder | Password manager (Registrar) | DNS for GSC verification + domain renewal |
| 16 | Cashfree (payments) | deal-flow-crm | Founder | Password manager (Cashfree) | Not SEO, but referenced on site |
| 17 | Meta (Pixel) | ID 1013590691784682 | Marketing | Password manager (Meta) | Already installed on site |

**Rules for credentials:**
- Store every password, recovery code and 2FA seed in the shared vault — never in this doc, email, or chat.
- Use a unique strong password per service (generated by the password manager).
- Enable 2FA on every account (authenticator app preferred; save backup codes in the vault).
- When someone leaves the team, rotate all shared credentials they had access to.
- If a credential is ever pasted into this document or chat, treat it as compromised and rotate it.

---

## 9. How to make site changes (engineering reference)

Working directory: `C:\Users\Bablu Jha\Documents\Projects\deal-flow-crm-website`

```powershell
# 1. Edit source
#    - Page content: pages/<name>.main.html
#    - Page metadata (title/description): build.mjs PAGES array
#    - SEO/schema/sitemap/robots/llms: seo.mjs
#    - Add a new page: create pages/<name>.main.html, register in build.mjs PAGES

# 2. Rebuild
node build.mjs

# 3. Preview locally (optional)
#    npx serve .   (or open index.html)

# 4. Deploy
firebase deploy --only hosting

# 5. Commit + push
git add -A
git commit -m "describe change"
git push origin dealflowcrm-co-in
```

**Important:** The live branch is `dealflowcrm-co-in`, not `master`. Always push to `dealflowcrm-co-in`.

---

## 10. Troubleshooting

- **Page not updating after deploy:** hard-refresh (Ctrl+Shift+R); Firebase cache for HTML is `no-cache` so it should be fresh; check `firebase deploy` succeeded.
- **Sitemap stale:** re-run `node build.mjs` (regenerates sitemap.xml with today's date).
- **Broken layout after edit:** check the build output for errors; the `pages/*.main.html` uses `<!--RIBBONS-->` and `<!--CALL-->` placeholders that `build.mjs` replaces.
- **Schema invalid:** test with https://search.google.com/test/rich-results and https://validator.schema.org.
- **404 not showing:** ensure `404.html` exists in repo root (Firebase auto-serves it).

---

## 11. Change log

| Date | Change | Owner |
|------|--------|-------|
| 2026-11-06 | Initial SEO playbook created; technical SEO pass deployed (hreflang, image alt, 404, security headers, schema sameAs, brand FAQ) | SEO lead |

---

*End of document. Keep this file in the repo (`SEO_PLAYBOOK.md`) so the team always has the latest version. Update the change log on every edit.*
