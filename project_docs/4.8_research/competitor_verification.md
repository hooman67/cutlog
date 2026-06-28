# CutLog Competitor Verification (Adversarial Fact-Check)

Date: 2026-06-28
Method: Direct WebFetch of the actual URLs + JS-rendering proxy (r.jina.ai) for SPAs.
Search engines (Google, Bing, DuckDuckGo, Mojeek, Startpage) were largely unusable from
this environment — Google returned errors/451, Bing returned irrelevant junk results,
DuckDuckGo/Mojeek/Startpage refused connections (403/ECONNREFUSED). So traction signals
(Reddit/ProductHunt) could NOT be independently confirmed for most entries. Findings below
are based on what actually rendered on the live sites.

Legend: VERIFIED / PARTIALLY VERIFIED / UNVERIFIED / DEBUNKED

---

## 1. Laser Settings Hub (lasersettingshub.com) — VERIFIED (real & live), but traction claim is WEAK

Site is live and fully rendered (server-rendered, readable).

What it actually is: a community reference library of laser engraving/cutting settings,
organized by machine type and material, with community contributions and feedback.

Pricing (verbatim from site):
- Free — $0/mo: public library + downloads; publish up to 20 settings; up to 20 private
  materials + 10 bookmarks; LightBurn .clb export.
- Pro — $5/mo or $49/yr: unlimited publishing, unlimited private materials/bookmarks,
  test-grid generator, "Verified contributor badge", side-by-side material comparison.
- Team — $19/mo or $189/yr: branded team page, shared private library, roles/permissions/
  audit trail, 3 seats included.

Source-provenance badges: CONFIRMED. Entries carry badges indicating "supplier reference,
personal test, or community report."

Vote-on-worked / feedback loop: CONFIRMED. Users vote on settings effectiveness, upload
test photos; "Community voting surfaces most community-confirmed settings."

Traction: footer says "© 2026". Headline metrics displayed: "367 community settings",
"19 Material types", "245 Laser machines." This is the closest direct competitor to CutLog's
model (cross-brand community DB + provenance + voting + freemium at the SAME price points
$5/$19), BUT it is small/early — only ~367 settings. No launch date on page; no Reddit/PH
mention could be confirmed (search engines blocked).

Bottom line: The most architecturally-identical competitor. Pricing tiers match the prior
claim exactly. But it is tiny in content and shows no provable traction yet.

---

## 2. Laser Assistant (laserassistant.com, "Blue Moose Designs", Anchorage AK) — PARTIALLY VERIFIED

Raw site is a JS SPA — plain WebFetch returned ONLY the title "Laser Assistant SaaS
Application" (no content). Confirmed real content via r.jina.ai rendering proxy.

CONFIRMED (rendered):
- Company: "built in a real production shop in Anchorage, Alaska by operators at Blue Moose
  Designs." -> Blue Moose Designs / USA claim VERIFIED.
- Value prop: pre-configured, production-tested settings; "from 90 minutes down to 10
  minutes"; "production-ready parameters calibrated in real-world shop environments."
- Coverage: "500+ Material Profiles"; laser types Fiber (MOPA + non-MOPA), CO2 (Gantry +
  Galvo), UV, Diode. -> matches the fiber MOPA / CO2 galvo / UV / diode claim.
- AI generation: CONFIRMED as a metered feature. Pricing page lists "AI generations":
  Free 5/mo, Hobby 100/mo, Pro 300/mo, Shop 1000/mo, Corporate Unlimited.
- LightBurn export: CONFIRMED. Comparison table shows LightBurn Export available Hobby tier
  and up, unavailable (✕) on Free.
- Pricing: Free $0, Hobby $9.99/mo, Pro $29.99/mo, Shop $99.99/mo, Corporate custom.

NOT CONFIRMED / likely OVERSTATED by prior research:
- "Community / shared database" — NO mention on the rendered home or pricing pages. It is a
  curated, shop-built library, not a community-contributed DB.
- "Feedback loop" — NOT found.
- "Per-machine management" — NOT explicitly found (profiles are by material/laser type).
- "Mobile apps" — NO mention anywhere.
- No Google Play app named "Laser Assistant" by Blue Moose Designs (searched; only unrelated
  "Laser Helper", "Blue Moose Rewards", "Blue Moose Bar & Grill"). No iOS app page found.

Bottom line: Real, live SaaS with AI parameter generation + LightBurn export across the
claimed laser types, by Blue Moose Designs. But it's a curated single-shop library, NOT a
community DB with feedback loop, and there are no mobile apps. Prices are higher than CutLog/
LSH ($9.99–$99.99). Competitive on the AI-parameter angle, not on the community angle.

---

## 3. Machines for Makers (machinesformakers.com) — VERIFIED count, but MISCHARACTERIZED as community

Site is live, Next.js, fully rendered.

The "13,209 settings" claim: VERIFIED on /laser-material-library — the page states
"13,209 settings from 72 sources." So the raw count claim (bigger than CutLog) is TRUE.

BUT the nature is different from the prior claim:
- It is NOT cross-brand COMMUNITY/crowd-sourced settings. It is a CURATED AGGREGATION of
  MANUFACTURER data: "13,000 data points from manufacturers beats starting from zero,"
  aggregated from xTool, Epilog, Glowforge, Thunder, Boss, Monport, Creality, Algolaser,
  LaserTips + 63 other sources.
- Settings are machine-targeted (filter by "My 50W CO2" / material / operation).
- The broader site is a review/comparison platform (laser cutters, machine comparisons,
  deals, LightBurn learning, ink calculator, "Laser Lab" tool). The settings library is one
  feature, branded "Laser Material Library."

Bottom line: The 13,209 number is real and is the largest settings corpus among the seven —
but it's manufacturer-reference aggregation, no voting/provenance/community-test model. It
competes on breadth of reference data, not on CutLog's community/feedback differentiator.

---

## 4. LaserParams.com — VERIFIED

Live and rendered. Confirmed it offers (verbatim): "Free AI-powered speed, power & pass
recommendations for your laser." So the core claim (free AI parameter recommendations) is
TRUE. Also: 23 laser-ready SVG templates, SVG personalization / photo-to-vector, guide
library (GRBL codes, material settings for wood/acrylic/leather, CO2 vs diode), calculators
(time/kerf/power), LightBurn/Inkscape compatibility, a feedback mechanism. Pricing: free,
no signup needed to browse/personalize.

Bottom line: Real free AI parameter-recommendation tool. Directly competitive on the
"free AI recommendations" angle. No evidence of community DB / provenance / paid tiers.

---

## 5. LaserMarkDB.com — VERIFIED

Live and rendered. Confirmed it is a community-verified, per-machine settings database.
Verbatim/near-verbatim findings:
- Per-machine: settings "tagged to make, model, wattage, and lens — not just 'CO2 60W'."
  Covers CO2, Fiber, Diode, UV.
- Verified-by-makers: shows verification counts, e.g. featured stainless entry "Fiber Mark
  Verified ×14."
- Export: entries include "LightBurn / EZCAD / RDWorks export notes." -> matches claim.
- Pricing: FREE — verbatim "No plans. No paywalls. No 'pro' tier that hides the good stuff.
  Every feature, every setting, free forever for makers."
- Each setting has power/speed/frequency/passes, air assist, before/after photos, Q&A.

Bottom line: Closest competitor to CutLog's per-machine + verified-by-community + multi-tool
export model — and it's FREE forever, which undercuts CutLog's freemium. Strong direct
competitor on model; no visible traction signal (no count of entries was shown), maturity
unknown.

---

## 6. The Laser Gurus (thelasergurus.com) — VERIFIED existence, but MISCHARACTERIZED

Live and rendered. It is an AI-powered laser DESIGN platform, NOT a laser-PARAMETER tool.
Tools: Vector Studio (text-to-design AI), Photo Converter (photo→line art), MosaicFlow
(multicolor inlay), "Laser Chat" (laser-aware chatbot), plus free utilities (MonoTrace,
Monogram Generator, File Converter, Canvas Pro, QR Code Generator).

Pricing: VERIFIED — "Plans start at $4.99/month for 40 credits" (AI tools cost 1 credit
each); "5 free credits when you complete your profile."

Bottom line: $4.99/mo AI suite claim is TRUE, but it is design/file tooling, NOT speed/power/
pass parameter recommendation. NOT a direct competitor to CutLog's parameter/settings DB —
adjacent at most. Prior "AI suite for laser parameters" framing is inaccurate.

---

## 7. xTool AIMake (claimed Nov 2025 launch) — DEBUNKED (as named)

Could not find any product called "AIMake" from xTool anywhere:
- xtool.com/products/aimake -> HTTP 404.
- aimake.xtool.com -> DNS does not resolve (ENOTFOUND).
- xtool.com/pages/software (rendered) lists xTool's software as: "xTool Studio" (all-in-one
  laser-making software), "Atomm" ("60,000+ free files and easily create with AI generator"),
  and "Customthings" (store/order management). NO "AIMake".
- xTool blog/news (rendered) references "Atomm" repeatedly but contains NO mention of
  "AIMake" and no Nov-2025 AI-software launch post.
- xtool.com internal search returns 4 hits for "AIMake" but bodies were truncated/unreadable;
  no confirming page.

Most likely explanation: the prior agent confused/fabricated "AIMake" with xTool's actual AI
design product "Atomm" (an AI design-file generator, not a laser-parameter tool). As stated
("xTool AIMake, Nov 2025 launch") the claim is DEBUNKED. If it meant Atomm, Atomm is real but
is AI DESIGN generation, not parameter recommendation — not a direct CutLog competitor.

---

## Summary table

| # | Product | Status | Direct competitor to CutLog? |
|---|---------|--------|------------------------------|
| 1 | Laser Settings Hub | VERIFIED (live) | YES — most identical model (community DB + provenance + voting + $5/$19 freemium). But tiny (~367 settings), no provable traction. |
| 2 | Laser Assistant | PARTIALLY VERIFIED | PARTIAL — real AI-param + LightBurn SaaS by Blue Moose Designs, but it's a curated single-shop library, NOT community/feedback; no mobile apps. Higher price. |
| 3 | Machines for Makers | VERIFIED count, mischaracterized | PARTIAL — 13,209 settings is real (largest corpus) but it's manufacturer-reference aggregation, not community/voting. |
| 4 | LaserParams.com | VERIFIED | YES — free AI speed/power/pass recommendations. |
| 5 | LaserMarkDB.com | VERIFIED | YES (strongest model match) — per-machine, verified-by-makers, LightBurn/EZCAD/RDWorks export, FREE forever (undercuts CutLog). |
| 6 | The Laser Gurus | VERIFIED, mischaracterized | NO (adjacent) — $4.99/mo is real but it's AI DESIGN tooling, not parameters. |
| 7 | xTool AIMake | DEBUNKED (as named) | NO — no such product; likely a mix-up with xTool "Atomm" (AI design generator). |

## Caveats
- Search engines were blocked/unreliable in this environment, so Reddit/ProductHunt/launch-
  date traction could NOT be independently verified for any entry. Maturity/traction claims
  remain UNVERIFIED across the board.
- Findings for #1, #3, #4, #5, #6 are from server-rendered pages (high confidence on what the
  sites claim about themselves). #2 required JS rendering via r.jina.ai. #7 is a negative
  finding from multiple direct attempts.
