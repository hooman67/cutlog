# CutLog — project_docs Index

Map of all project documentation. **New agents: read `../CLAUDE.md` first** (repo root) — it holds
the operating rules and the cold-start procedure.

There are three tiers of docs, by trust and purpose:

| Folder | What it is | Trust |
|---|---|---|
| `records/` | **What we actually did** — living logs, updated every session. | Trusted; the source of truth for status. |
| `4.8_research/` | **Current research, plans & build notes** (Opus 4.8 pivot). | Trusted reference (plans, not status). |
| `legacy/` | **Older-model docs**, archived by topic. Useful history. | Untrusted narrative; verify before relying. |
| `project_summary.md` | Full project history / entry point. | History; treat per the ground-truth rule. |

## `records/` — living logs (start here for status)

- **`PROJECT_STATE.md`** — master log: Action Items · Learnings · Decisions · Long-term Plans.
- **`wtp.md`** — Willingness-To-Pay validation (the current top-priority gate).
- **`reddit.md`**, **`facebook.md`**, **`youtube.md`** — per-channel outreach logs (incl. creators).
- **`seo.md`** — programmatic SEO work.

> One file per topic. Don't create a file per post/experiment. Add a new topic file only when we
> actually start executing that topic. See the rules in `../CLAUDE.md`.

## `4.8_research/` — current trusted research & plans

- `00_SYNTHESIS_AND_VERDICT.md` — **read first**; the current verdict + strategy.
- Competitive: `competitive_app_stores.md`, `competitive_web.md`, `competitor_product_audit.md`,
  `competitor_verification.md`.
- Market & feasibility: `market_sizing.md`, `hardware_data_model.md`, `feedback_analysis.md`,
  `mobile_audit_and_ios_plan.md`.
- Plans: `wtp_validation_plan.md`, `OUTREACH_STRATEGY.md`, `IMPL_seo.md`.
- Build notes (features shipped): `IMPL_core.md`, `IMPL_import.md`, `IMPL_export.md`,
  `IMPL_pricing.md`. Marketing: `MARKETING_CHEAT_SHEET.md`.

## `legacy/` — archived older-model docs (by topic)

- `competitive/` — early competitive analysis & scorecards.
- `product/` — product definition, prototype, feasibility, recommendation/speed algorithms,
  LightBurn/migration research.
- `data-collection/` — data sources, scraping, extraction, validation, Etsy/academic research,
  `validation_data.csv`.
- `launch/` — launch checklist/strategy, demo video, beta invites.
- `outreach-history/` — raw outreach archives (reddit/youtube strategies, DM rounds 1–2,
  influencer/lead-gen). Real human replies in `round1/2_dms_and_replies.md` are GROUND TRUTH and
  have been distilled into `records/`.
- `strategy/` — June-26 pivot note, IndieHackers learnings.
