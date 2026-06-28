# CutLog — Programmatic SEO Implementation Plan

**Date:** 2026-06-28
**Author:** SEO/Next.js implementation pass (Opus 4.8)
**Status:** Phase-1 route, dataset, sitemap, robots, and layout metadata are IMPLEMENTED in this repo. This doc is the strategy + scale-up plan + Hooman action list.

> Read `00_SYNTHESIS_AND_VERDICT.md` first. This plan operationalizes its conclusion: the
> only defensible white space is **industrial thick-metal fiber cutting depth** + **galvo/MOPA
> marking depth**, executed mobile-first, with **honest positioning** ("a better starting point
> so you run fewer test squares" — NOT an AI oracle). Our SEO content must embody that honesty,
> which is also exactly what Google's helpful-content system rewards.

---

## 1. The opportunity & the threat

**Target queries (long-tail, high intent, low competition for the metal niche):**

- `best fiber laser settings for [N]mm [material]` (e.g. *best fiber laser settings for 10mm mild steel*)
- `how to cut [material] with a fiber laser`
- `[material] [thickness] laser cutting speed / gas pressure / nozzle`
- `MOPA settings for color marking stainless steel`
- `fiber laser settings for engraving anodized aluminum`
- `CO2 laser settings for [N]mm acrylic / plywood` (secondary, crowded)

**Why these:** they are bottom-of-funnel ("I have this exact job right now"), they map 1:1 to a
material × thickness × laser-type tuple (perfect for programmatic generation), and the
**industrial metal** variants are under-served by the current SEO leaders.

**The threat (from the research):** **Machines for Makers** owns the maker/SEO audience with a
13,209-setting catalog — but it aggregates *manufacturer CO2/diode/hobbyist* data and is web-only.
It is **weak on industrial thick-metal fiber cutting depth** (gas type/pressure, nozzle, pierce,
multi-pass, kerf for 6–25mm). `lasertips.org` and `LaserMarkDB` are the strongest free incumbents
on the galvo/marking side. **We win by going deep on the metal-cutting long-tail before MfM or a
fiber-OEM does**, and by being the only one pairing each chart with an honest test workflow + a
mobile PWA that remembers the operator's own proven numbers.

---

## 2. Page architecture (programmatic SEO, statically generated)

```
src/data/seo-settings.ts        ← hand-authored curated dataset (single source of truth)
src/app/settings/page.tsx       ← category hub / index (ItemList JSON-LD, grouped links)
src/app/settings/[slug]/page.tsx← one page per material×thickness×laser-type combo
src/app/sitemap.ts              ← all setting pages + core pages
src/app/robots.ts               ← allow crawl, point to sitemap, block app/api routes
src/app/layout.tsx              ← strong default metadata (title template, OG, twitter, robots)
```

- **`force-static` + `dynamicParams = false`** on `[slug]`: pages are baked at build time from the
  static dataset. **No Supabase at build time** (safe, fast, deterministic, no rate limits).
- **`generateStaticParams`** enumerates slugs from `SEO_SETTINGS`.
- **`generateMetadata`** emits per-page `title`, `description`, `keywords`, `canonical`,
  OpenGraph + Twitter.
- Slug format: `[thickness]mm-[material]-fiber-laser-cutting` (cutting) or descriptive slug for
  marking/engraving (e.g. `stainless-steel-color-marking-mopa-fiber-laser`). Stable, lowercase,
  hyphenated — **never change a published slug** (use 301 redirects if you must).

### What each page renders (the content quality bar — see §5)

1. **H1 = the exact target query** ("Best fiber laser settings for 10mm Mild Steel").
2. **Honesty banner** — "Starting point, not a recipe. Run a material test."
3. **Recommended starting-point parameter table** — gas, pressure, speed, focus, nozzle, standoff,
   pierce, assumed power band — each with a contextual note.
4. **"Dialing it in" tips** — process-specific, genuinely useful (gas purity, focus drift, dross
   troubleshooting). This is the anti-thin-content payload.
5. **Material-test workflow** — the 4-step loop (baseline → array → judge edge → log once). This is
   our differentiator and our honesty made concrete.
6. **CTA** to `cutlog-two.vercel.app/suggest` and `/auth`.
7. **FAQ** (real questions) with accordion UI **and** `FAQPage` JSON-LD.
8. **Related-combo internal links** (same material other thicknesses, then same laser type).
9. **"Last reviewed" date** + conservative-values disclaimer.

### Structured data (schema.org JSON-LD) per page

- **`FAQPage`** — from the page's FAQ list (eligible for rich results / People-Also-Ask).
- **`HowTo`** — the material-test workflow steps.
- **`Article`** — headline, description, `dateModified`, author/publisher = CutLog.
- Index page emits **`ItemList`**.

### Internal linking

- Index hub (`/settings`) links to every page, grouped by process.
- Each page links to ≤6 related pages (same material chain first → builds thickness "ladders" like
  3→5→8→10→12→16→20→25mm mild steel, which is a strong topical cluster signal).
- Landing page and app should link to `/settings` (request the landing-page owner to add a nav/footer
  link — **we do not edit landing/page.tsx ourselves**).

### Sitemap & robots

- `sitemap.ts` returns core pages + all setting pages; industrial pages get `priority: 0.8`,
  others `0.6`; `lastModified` from `SEO_CONTENT_LAST_UPDATED`.
- `robots.ts` allows `/`, disallows `/api/`, `/admin/`, `/auth`, `/history`, `/log`, `/import`,
  `/machine`, `/feedback`; points to `/sitemap.xml`.

---

## 3. Keyword strategy: material × thickness × laser-type matrix

**Primary axis = industrial fiber metal cutting** (the segment with money and the white space):

| Material | Thicknesses (mm) | Primary gas | Notes |
|---|---|---|---|
| Mild steel | 3, 5, 8, 10, 12, 16, 20, 25 | O₂ (thick), N₂ (thin/clean) | The flagship ladder. Highest volume of industrial searches. |
| Stainless steel | 3, 5, 8, 10, 12, 16, 20 | N₂ (clean edge) | High-value; "oxide-free edge" intent. |
| Aluminum | 3, 5, 8, 10, 12 | N₂ | Reflective caveats; burr on thick. |
| Brass / Copper | 3 | N₂ | Reflective; high-power machines only. |

**Secondary axis = galvo / MOPA marking + engraving** (engaged niche, low drift, defensible depth):

- MOPA color marking stainless, anodized-aluminum engraving, deep-engrave steel, UV plastic marking.

**Tertiary (broad reach, crowded — keep small) = CO₂ non-metal:** 3mm acrylic, 3mm plywood.
These exist to capture some hobbyist traffic and feed internal links, but we **do not** try to
out-scale Machines for Makers here.

---

## 4. Prioritized first 30–50 pages (lead with industrial thick-metal)

**Implemented now (28 pages):**

*Tier 1 — Mild steel fiber cutting (flagship ladder, 8):* 3, 5, 8, 10, 12, 16, 20, 25mm.
*Tier 1 — Stainless steel fiber cutting (7):* 3, 5, 8, 10, 12, 16, 20mm.
*Tier 1 — Aluminum fiber cutting (5):* 3, 5, 8, 10, 12mm.
*Tier 1 — Brass 3mm, Copper 3mm (2).*
*Tier 2 — Galvo/MOPA/UV (4):* MOPA color-marking stainless, anodized-aluminum engraving,
deep-engrave mild steel, UV plastic marking.
*Tier 3 — CO₂ (2):* 3mm acrylic, 3mm plywood.

**Next 20–30 to add (scale-up backlog, in priority order):**

1. Galvanized steel (3, 5, 8, 10mm) — common industrial, distinct (zinc fume) — high value.
2. Stainless 25mm; Aluminum 16, 20mm (extend the high-power ladders).
3. Brass/Copper 5, 8mm.
4. Mild steel **with N₂** variants (clean-edge intent) at 3, 5, 8mm — distinct query from O₂.
5. Titanium 3, 5mm (Ar/N₂ assist) — niche but zero competition, high authority signal.
6. Tool steel / spring steel 3, 5mm.
7. Galvo: black-on-stainless annealing, MOPA on titanium, rotary marking ring blanks.
8. CO₂: 6mm/10mm acrylic, 6mm plywood, 3mm MDF, 3mm leather, 1.5mm/3mm hardwood.
9. Diode: basswood, anodized aluminum (entry hobbyist).
10. "How to cut [material] with a fiber laser" explainer variants (information-intent, link to the
    parameter pages) — these earn featured snippets.

Target ~50 live pages within the first push, then grow toward 150–250 as combinations and
process-explainer articles are added. **Quality gate every page** (§5) before publishing.

---

## 5. Content quality bar — avoiding thin-content / doorway penalties

Google's **helpful-content** and **spam** systems penalize programmatically-generated pages that are
near-duplicates with only a number swapped ("doorway pages"). We avoid this deliberately:

- **Every page carries unique, genuinely useful substance**: per-combo gas/focus/pierce notes,
  process-specific troubleshooting tips (gas purity %, focal drift, dross fixes), and FAQs whose
  answers differ materially by material/thickness. This is hand-authored, not Lorem-ipsum templating.
- **The material-test workflow + honesty banner** is the opposite of a doorway page: it tells the
  user the chart alone won't work and gives them the method — high E-E-A-T (Experience/Expertise).
- **No fake precision.** Values are ranges and explicitly "conservative starting points," with the
  physics reasoning ("4–5x feed-rate spread across same-wattage brands") stated. This builds trust
  with technical operators (the exact audience) and reads as expert content to Google.
- **Real internal linking** (thickness ladders, related materials) — topical clusters, not a flat
  pile of orphan pages.
- **Index page** provides genuine navigation/value, not just a link dump.
- **Scale gated by quality:** add pages only when we can author real per-combo notes + FAQs. Do
  **not** auto-generate every conceivable tuple. ~50 excellent pages beat 500 thin ones.
- **Disclaimers + dateModified** signal maintenance and honesty.

**Risk if we ignore this:** a site-wide helpful-content classifier hit can suppress *all* pages,
not just thin ones. The mitigation is the above: depth, honesty, uniqueness, maintenance.

---

## 6. WHAT HOOMAN NEEDS TO DO

**A. Google Search Console (do this first, ~30 min)**
1. Go to search.google.com/search-console → add property.
2. Easiest now: add `https://cutlog-two.vercel.app` as a **URL-prefix** property; verify via the
   HTML-tag method (paste the meta tag — ask me to add it to `layout.tsx` metadata `verification`,
   or use the Vercel/DNS method if you buy a domain per (C)).
3. Submit the sitemap: **`https://cutlog-two.vercel.app/sitemap.xml`** under Sitemaps.
4. Use **URL Inspection → Request indexing** on `/settings` and the top mild-steel pages to seed
   crawling.
5. (Optional) Add **Bing Webmaster Tools** too — cheap incremental traffic.

**B. Verify the deploy**
- After this branch ships, hit `cutlog-two.vercel.app/sitemap.xml`, `/robots.txt`, `/settings`, and a
  few `/settings/[slug]` pages. Confirm they render server-side (view-source shows the H1, table, and
  JSON-LD). Run them through Google's **Rich Results Test** to confirm FAQ/HowTo are detected.

**C. Buy a custom domain (HIGH IMPACT — recommended)**
- `*.vercel.app` subdomains rank **noticeably worse**: they share root-domain trust signals with
  thousands of other apps, can't get a clean GSC domain property, and look less credible in SERPs.
- Buy something like **cutlog.io / getcutlog.com / cutlog.app** (~$12–40/yr), point it at Vercel,
  set it as the primary domain, and **301-redirect** the vercel.app URLs to it.
- After moving: update the `SITE_URL` constant in `sitemap.ts`, `robots.ts`, `layout.tsx`,
  `settings/page.tsx`, and `settings/[slug]/page.tsx` (currently all `https://cutlog-two.vercel.app`),
  re-verify in GSC, resubmit the sitemap. **Do this before heavy link-building** so authority accrues
  to the permanent domain.

**D. Expected timeline to rank**
- Indexing: days to ~2 weeks after sitemap submission.
- First long-tail impressions (low-competition metal queries): ~3–6 weeks.
- Meaningful ranking/traffic on the easier metal long-tail: ~2–4 months (new domain = sandbox-ish).
- Competitive terms: 6–12 months and dependent on backlinks + content depth. Long-tail metal-cutting
  pages are the fastest wins because competition is thin there.

**E. Scale page count over time**
- Add pages from the §4 backlog in batches, each meeting the §5 quality bar (real notes + FAQs).
- Add 5–10 "how to cut X with a fiber laser" **explainer articles** that link down to the parameter
  pages — these win featured snippets and feed internal authority.
- Refresh `SEO_CONTENT_LAST_UPDATED` (in `seo-settings.ts`) whenever values change.
- Seed a few **real backlinks**: answer relevant Reddit/forum threads (r/lasercutting, fab forums)
  with a genuinely helpful reply linking to the specific page; submit to laser-tool directories.
- Watch GSC Performance → double-down on queries already getting impressions but ranking #8–20
  (improve those pages, add FAQs matching the actual query strings).

---

## 7. Files delivered in this implementation

- `src/data/seo-settings.ts` — 28 hand-authored entries (23 industrial fiber-cutting), helpers,
  computed related-links, content-updated date.
- `src/app/settings/[slug]/page.tsx` — static per-combo page (metadata, H1, table, tips, workflow,
  CTA, FAQ, FAQPage+HowTo+Article JSON-LD, related links).
- `src/app/settings/page.tsx` — category hub (grouped, ItemList JSON-LD).
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- `src/app/layout.tsx` — enhanced default metadata only (title template, keywords, OG, Twitter,
  robots, metadataBase). Structure untouched.

**Verification done:** dataset compiles under the project tsconfig; 28 unique slugs, 0 broken
internal links, 23 industrial. (Did not run `next build` — other agents are working in parallel.)
