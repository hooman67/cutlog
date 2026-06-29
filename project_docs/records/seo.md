# CutLog — SEO (Running Log)

> One file for ALL SEO work. Record of actual state. See `4.8_research/IMPL_seo.md` for the full
> strategy + scale-up plan. Update every session we touch SEO.

**Last updated:** 2026-06-28

## Strategy (pointer)

The defensible white space is the **industrial thick-metal fiber-cutting long-tail** —
bottom-of-funnel queries like *"best fiber laser settings for [N]mm [material]"* that map 1:1 to a
material × thickness × laser-type tuple, plus a smaller galvo/MOPA marking depth play. Execution is
**mobile-first** with **honest "starting point, not a recipe" framing** ("a better starting point so
you run fewer test squares" — not an AI oracle), which is also what Google's helpful-content system
rewards. The goal is to **win the metal long-tail before Machines for Makers** (the SEO incumbent —
strong on hobbyist/CO2/diode catalog, weak on industrial thick-metal fiber depth) or a fiber OEM
does. Crowded CO2/non-metal terms are deliberately kept small. Full strategy + threat analysis:
`../4.8_research/IMPL_seo.md`.

## What's actually built (VERIFIED)

Independently verified to exist in `src/` and to compile under the project tsconfig (corrects the
IMPL doc, which said "23 industrial" — the true count is **22 industrial fiber-cutting**).

**28 programmatic SEO pages** (28 unique entries in `src/data/seo-settings.ts`):
- **22 industrial fiber-cutting** (`fiberCut()` entries): Mild Steel ladder (3, 5, 8, 10, 12, 16,
  20, 25mm = 8), Stainless Steel (3, 5, 8, 10, 12, 16, 20mm = 7), Aluminum (3, 5, 8, 10, 12mm = 5),
  Brass 3mm, Copper 3mm (2).
- **3 fiber-engraving** (galvo/MOPA): MOPA color-marking stainless, anodized-aluminum engraving,
  deep-engrave mild steel.
- **1 UV-marking**: light-colored plastics.
- **2 CO2-cutting**: 3mm cast acrylic, 3mm birch plywood.

**Wiring (all present and verified):**
- `src/app/settings/[slug]/page.tsx` — `dynamic = "force-static"`, `dynamicParams = false`,
  `generateStaticParams()` enumerates slugs from the dataset (baked at build time, no Supabase).
  Renders H1, honesty banner, param table, tips, material-test workflow, CTA, FAQ accordion, related
  links, and emits **FAQPage + HowTo + Article** JSON-LD (verified `@type`s: Article, FAQPage,
  HowTo/HowToStep, Question/Answer, Organization).
- `src/app/settings/page.tsx` — category hub (grouped, ItemList JSON-LD).
- `src/app/sitemap.ts` — core pages + all setting pages; `priority: 0.8` industrial / `0.6` others;
  `lastModified` from `SEO_CONTENT_LAST_UPDATED`.
- `src/app/robots.ts` — `allow: "/"`, disallows `/api/`, `/admin/`, `/auth`, `/history`, `/log`,
  `/import`, `/machine`, `/feedback`; points to `/sitemap.xml`.
- `src/app/layout.tsx` — default metadata (title template, keywords, OG, Twitter, robots,
  `metadataBase`).

**Build/test status:** dataset compiles (28 unique slugs, 0 broken internal links). `next build` was
NOT run during implementation (parallel agents). Confirm full static build in a clean session.

## Open action items (Hooman + agent)

From `IMPL_seo.md §6` — all still PLANNED, none done:

1. **Google Search Console (Hooman, do first, ~30 min):** add `https://cutlog-two.vercel.app` as a
   URL-prefix property, verify (HTML-tag method — ask agent to add `verification` to `layout.tsx`
   metadata), **submit sitemap** `…/sitemap.xml`, Request-Index `/settings` + top mild-steel pages.
   Optionally add Bing Webmaster Tools.
2. **Verify the deploy (Hooman):** after ship, hit `/sitemap.xml`, `/robots.txt`, `/settings`, and a
   few `/settings/[slug]` — confirm server-side render (view-source shows H1, table, JSON-LD) and run
   through Google's Rich Results Test for FAQ/HowTo detection.
3. **Buy a custom domain (Hooman, HIGH IMPACT):** `*.vercel.app` ranks noticeably worse. Buy
   cutlog.io / getcutlog.com / cutlog.app, set as primary on Vercel, **301-redirect** vercel.app
   URLs. Then **update `SITE_URL` constants** — currently `https://cutlog-two.vercel.app` in
   `sitemap.ts`, `robots.ts`, `settings/[slug]/page.tsx` (`SITE_URL` + `APP_URL`), `layout.tsx`
   (`metadataBase` + OG url), and `settings/page.tsx`. Re-verify GSC + resubmit sitemap. Do before
   link-building.
4. **Scale to ~50 pages (agent):** add from the backlog below in batches, **gated by the §5 quality
   bar** — only when real per-combo notes + FAQs can be authored. Refresh `SEO_CONTENT_LAST_UPDATED`
   when values change. Seed a few real backlinks (r/lasercutting, fab forums, tool directories).

## Page backlog (priority order)

Next 20–30, from `IMPL_seo.md §4` (each must clear the quality bar before publishing):

1. **Galvanized steel** fiber-cutting 3, 5, 8, 10mm (distinct: zinc fume) — high value.
2. Extend high-power ladders: **Stainless 25mm**; **Aluminum 16, 20mm**.
3. **Brass / Copper 5, 8mm**.
4. **Mild steel with N₂** (clean-edge) variants at 3, 5, 8mm — distinct query from O₂.
5. **Titanium 3, 5mm** (Ar/N₂ assist) — niche, zero competition, authority signal.
6. **Tool/spring steel 3, 5mm**.
7. Galvo: black-on-stainless annealing, MOPA on titanium, rotary marking ring blanks.
8. CO2: 6mm/10mm acrylic, 6mm plywood, 3mm MDF, 3mm leather, 1.5/3mm hardwood.
9. Diode: basswood, anodized aluminum (entry hobbyist).
10. **"How to cut [material] with a fiber laser" explainer articles** (information-intent, link down
    to the parameter pages) — win featured snippets, feed internal authority.

Target ~50 live pages in the first push, then grow toward 150–250 over time.

## Notes / quality bar

Anti-thin-content / anti-doorway rules (from `IMPL_seo.md §5`) — programmatic near-duplicates with
only a number swapped risk a **site-wide** helpful-content classifier hit:

- **Unique, hand-authored substance per combo:** per-combo gas/focus/pierce notes, process-specific
  troubleshooting (gas purity %, focal drift, dross fixes), and FAQs whose answers differ materially
  by material/thickness. No Lorem-ipsum templating.
- **Honesty banner + material-test workflow** on every page (the opposite of a doorway page; high
  E-E-A-T).
- **No fake precision:** values are explicit ranges and "conservative starting points," with the
  physics stated (same-wattage machines differ ~4–5x in real feed rate).
- **Real internal linking:** thickness ladders (3→5→8→10→12→16→20→25mm) + related materials, ≤6
  links/page — topical clusters, not orphan pages.
- **Scale gated by quality:** do NOT auto-generate every tuple. ~50 excellent pages beat 500 thin
  ones. Disclaimers + `dateModified` signal maintenance.
