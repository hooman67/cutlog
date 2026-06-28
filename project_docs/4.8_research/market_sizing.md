# CutLog — Fresh Bottoms-Up Market Sizing

**Date:** 2026-06-28
**Author:** Research synthesis (5 parallel web-research agents, multi-source, adversarially verified)
**Scope:** Market sizing for CutLog, a laser cutting/engraving parameter-recommendation SaaS, with an optional future hardware data-collection device (OPC-UA / controller tap that reads actual cutting parameters and correlates with outcomes for per-machine recommendations).

> **Why this document exists.** A prior internal analysis claimed *"200K+ machines, $960M TAM."* This is a fresh, skeptical, bottoms-up rebuild that does **not** trust that number. Spoiler: the "200K machines" figure is roughly right *only* for the industrial fiber-cutting fleet, but the "$960M TAM" is **not defensible** as an obtainable market — it conflates total machines with an aspirational price and ignores that the segments with volume have almost no willingness to pay, and the segment with willingness to pay is small and hard to reach.

---

## 0. Data-quality warning (read first)

Public data is **abundant for market size in USD** but **genuinely sparse for unit shipments and installed base.** No major maker (Trumpf, Bystronic, Amada, IPG, Han's) or hobbyist brand (xTool, Glowforge, OMTech) discloses machine unit counts. Market-research firms overwhelmingly report **revenue, not units**, and the few unit figures online come from low-quality templated SEO reports that disagree by 2–3×.

A recurring trap that poisons most prior estimates: figures like "~811,000 fiber laser units/yr" count fiber laser **sources/modules** across *all* applications (welding, cleaning, marking, cutting, defense), **not cutting machines**. Conflating these inflates installed-base numbers by an order of magnitude.

**Confidence convention used throughout:** every installed-base / unit number below is a **triangulated estimate** unless explicitly marked as company-disclosed. Treat unit and installed-base figures as **order-of-magnitude only.** The decision-grade numbers are USD market sizes (multiple converging firms), disclosed company financials, and *published* pricing pages.

---

## 1. Installed base of laser machines, by segment

### Segment A — Industrial fiber laser cutting machines (sheet metal, 1kW–30kW)

**Market size (USD) — well-sourced, converging:**

| Figure | Year | Source |
|---|---|---|
| Fiber laser cutting machine market ~$2.0–2.3B | 2024–25 | Global Info Research ($2,270M, 2024); Intel Market Research ($2.02B, 2024); Cognitive ($1,954M, 2024); Global Growth Insights ($2,320M, 2025) |
| Broader laser cutting machine market $7.12–7.46B → ~$12.3–16.5B by 2031–34, CAGR 9.2–9.6%; fiber ≈ 52% of this | 2025 | Mordor Intelligence — https://www.mordorintelligence.com/industry-reports/laser-cutting-machine-market ; Straits Research — https://straitsresearch.com/report/laser-cutting-machine-market |
| Broader laser cutting machine market → $10.35B by 2030, CAGR 5.7% (most conservative) | 2024 | Grand View Research — https://www.grandviewresearch.com/industry-analysis/laser-cutting-machines-market |

**Definitional flag:** "fiber laser cutting machine" (~$2B) vs "laser cutting machine, all types" (~$7B+) are two different buckets; sources rarely state which. APAC ≈ 46% of units. Power range 2.1–6kW = ~38% share; >12kW fastest-growing.

**Maker shares / volumes:**
- **Bodor** — #1 in fiber-laser-cutting *unit sales* for 6 consecutive years; **>8,000 units (1kW+) sold in 2024** (company-disclosed, medium-high confidence). Source: https://markets.financialcontent.com/stocks/article/getnews-2025-5-21-bodor-laser-ranks-global-no1 (2024–25).
- **Trumpf** — ~10–18% share depending on definition (units vs revenue). Group sales €4.3B FY2024/25, **EBIT collapsed to €59M from €501M prior year** — a sharp downturn. Source: https://www.trumpf.com/en_INT/company/press/ (FY2024/25).
- **Bystronic** — ~14% share (Global Growth Insights, 2026). **Has the clearest native OPC-UA support** (relevant to the hardware model — see §5).
- **Amada** — ~12%, named a leader (2024). Data platform ("V-factory") appears **closed** — hostile to a third-party tap.
- **Han's Laser** — top-5; company-wide revenue CN¥14.09B in 2023 (all products).
- **HSG, Penta, Mazak** — named top-5/volume players; no clean published share retrieved.

**Units vs revenue split:** Bodor/HSG/Penta/Han's lead on *unit volume* (cheaper Chinese machines); Trumpf/Bystronic/Amada lead on *revenue/value* (high-power 6–30kW). This is the root of the conflicting share figures.

**Demand-cycle signal (well-sourced):** IPG Photonics (dominant fiber-source supplier) revenue fell $1,461M (2021) → $1,287M (2023) → **$977M (2024)**, recovering to $1,004M (2025). Source: https://stockanalysis.com/stocks/ipgp/financials/. The cutting-machine market was in a **cyclical downturn in 2023–2024.** (Relevant: a new shop-software vendor is selling into a depressed capex environment.)

**Published unit/installed-base figures (WEAK, single SEO sources):**
- "~63,000 fiber laser cutting machines installed in 2023" (stated as annual). Market Growth Reports — https://www.marketgrowthreports.com/market-reports/fiber-laser-cutting-machines-market-108986. *Low confidence.*
- ">92,000 installed worldwide." Business Research Insights — https://www.businessresearchinsights.com/market-reports/fiber-laser-cutter-market-101420. *Low confidence; internally inconsistent — likely report-sample scope, not global fleet.*

**Best estimates — Segment A:**
- **Annual shipments: ~75,000–80,000 units/yr (2024). Confidence: LOW–MEDIUM.** (Bottom-up from Bodor's 8,000 units at ~10% unit share, cross-checked vs the "63,000 in 2023" figure + growth.)
- **Cumulative installed base: ~600,000 units (range 500k–800k). Confidence: LOW.**
- **US: ~6,000–10,000 units/yr; Europe ~10,000–15,000/yr** (inferred from ~24–26% revenue shares; no direct unit source).

> **Reconciling the prior "200K machines":** The prior figure is plausible if it meant the *global* fiber-cutting fleet (~600k is higher) or a *US+Europe reachable* subset (~150k–250k installed in US+EU is reasonable). It is **not** 200K *shops* — it is machines, and most are concentrated in a smaller number of shops.

### Segment B — Fiber marking / engraving lasers (galvo, MOPA, ~$2–10K)

**Market size (USD) — wide disagreement (~3×):**

| Source | 2024 base | Forecast / CAGR | URL |
|---|---|---|---|
| GMInsights | $4.1B | $10.08B (2034), 9.2% | https://www.gminsights.com/industry-analysis/laser-marking-machine-market |
| Market.us | $3.5B | $7.8B (2034), 8.4% | market.us/report/laser-marking-machine-market/ |
| Emergen Research | $3.2B | $5.8B (2034), 6.1% | emergenresearch.com/industry-report/laser-marking-equipment-market |
| Verified Market Research | $3.0B | $5.09B (2032), 7.1% | verifiedmarketresearch.com/product/laser-marking-machine-market/ |
| Mordor Intelligence (outlier) | $1.38B (2025) | $3.11B (2031), 14.07% | https://www.mordorintelligence.com/industry-reports/laser-marking-market |

Consensus cluster **$3.0–4.1B (2024)**; fiber laser ≈ 37–60% of marking. US (N. America) = **$833.6M in 2024** (GMInsights, verified). China dominates sub-$5k desktop fiber/MOPA marker production via thousands of Alibaba OEMs; **export unit volume is a genuine data gap** (no customs figure retrievable).

**Best estimates — Segment B:**
- **Annual shipments: ~400,000 units/yr (range 250k–600k). Confidence: LOW.** (Published "38,000 fiber markers in 2024" figure is implausibly low — excludes cheap Chinese desktop volume; cross-check of $1.5–2B fiber-marking revenue at a low ~$3–8k blended ASP implies several hundred thousand units.)
- **Cumulative installed base: ~2.5–5 million units. Confidence: LOW.**

### Segment C — Hobbyist / prosumer CO2 + diode lasers (xTool, Glowforge, OMTech, Atomstack, Creality, K40)

**Hard data (the only solid facts here — MEDIUM-HIGH confidence):**
- **Glowforge:** 2015 crowdfunding **$27.9M in 30 days** (then a record); total funding **>$115M** (Apr 2025 press release). Sources: https://en.wikipedia.org/wiki/Glowforge ; https://www.globenewswire.com/news-release/2025/04/29/3070379/. No unit/revenue figures disclosed (private).
- **xTool / Makeblock:** Makeblock raised **$44M Series C (2018) at $367M valuation**; >10M users company-wide (Wikipedia). xTool-specific units not disclosed.
- **OMTech, Atomstack, Creality, Ortur, Sculpfun, K40:** private; **no sales/unit data published** (K40 is a generic ~$300–600 Chinese 40W CO2 *category*, not a company).

**Best estimates — Segment C:**
- **Annual shipments: ~2 million units/yr (range 0.8–4M). Confidence: LOW.** Diode engravers ($200–600) likely 75–85% of units; CO2/prosumer (xTool/Glowforge/OMTech) the dollar majority.
- **Cumulative installed base: ~6–12 million units (2026). Confidence: LOW.** Integrated over the ~2018–present diode-hobbyist boom.

### Cross-segment summary

| Segment | Annual shipments | Installed base | WTP profile | Reachability |
|---|---|---|---|---|
| **A — Industrial fiber cutting (1–30kW)** | ~75–80k/yr | ~600k (US+EU ~150–250k) | **HIGH** ($100s/mo/machine) | **HARD** (gated buyers, slow sales) |
| **B — Fiber marking/engraving** | ~400k/yr | ~2.5–5M | LOW–MEDIUM | MEDIUM |
| **C — Hobbyist CO2 + diode** | ~2M/yr | ~6–12M | **VERY LOW** ($4–17 one-time) | **EASY** (online, but churns hard) |

**The central tension of the entire business, in one line:** the segment with the money (A) is small and hard to reach; the segment that's easy to reach (C) has almost no money and churns brutally.

---

## 2. Broader laser machine market size (multiple sources)

| Market | Credible range (base year) | CAGR cluster | Best anchor sources |
|---|---|---|---|
| Laser **cutting** machine (all types) | $6.5–7.5B (2024/25) → $10–18B by 2030–34 | 5.7–9.6% | Mordor $7.14B→$12.34B@9.55% (2025); GVR →$10.35B@5.7% (2024); Straits $7.46B@9.21% |
| **Fiber laser** (sources, all apps) | $6.9–7.7B (2024) → $13–17.5B | 10.7–12.3% | GVR $6.87B→$17.55B@11.1%; M&M $7.70B→$12.82B@10.8% |
| Laser **marking/engraving** machine | $3.0–4.1B (2024) [Mordor low outlier $1.38B] | 7.2–14% | GMInsights $4.1B@9.2%; M&M $2.9B@7.2% |
| Laser **processing / industrial systems** | $6.7–8.0B (2025) → $11.4–16.9B | 5.2–9.6% | M&M $6.74B→$11.89B@8.5%; GMI →$16.9B@9.6% |
| Broad "laser technology" | $17.8–19.9B → $30–33B | ~7–7.8% | Mordor $19.89B@7.06%; GVR $17.82B→$32.69B@7.8% |
| Desktop/hobbyist engraver (standalone) | **Not reliably obtainable** | — | Rolled into marking/engraving; weakest-evidenced |

**Credibility note:** MarketsandMarkets, Mordor, and Grand View are the most credible (conservative CAGRs ~5.7–9.5%). Future Market Insights, Verified Market Research, Market Research Future, DataIntelo, GM Insights, Business Research Insights are press-release-grade and disagree by 2–3×. The gold-standard industry sources for actual laser *revenue* (Optech Consulting, Laser Focus World / Strategies Unlimited) could not be retrieved this run and are a **flagged gap** — their numbers typically run *lower and more conservative* because they count laser-source revenue, not full systems.

**Crucial point for sizing:** these are **machine/equipment** markets (the price of the steel-cutting iron), **not** the software/services attach market CutLog plays in. CutLog's TAM is a thin software layer *on top of* these machines — typically **1–3% of equipment spend** for adjacent shop software, and far less for a single-function parameter tool.

---

## 3. Willingness to pay (real, current prices)

### Hobbyist / prosumer — pays for *software & community*, barely for *settings*

| Item | Price | Source | Year |
|---|---|---|---|
| LightBurn Core (G-code) | **$99 one-time** | lightburnsoftware.com | 2026 |
| LightBurn Pro (DSP + Galvo) | **$199 one-time** | lightburnsoftware.com | 2026 |
| LightBurn annual update renewal | ~$30/yr optional [WEAK] | — | — |
| Etsy "settings library" files (xTool D1/P2 etc.) | **$4–$17** (real listings cluster $4–11; one $17.30) | etsy.com (multiple listings) | 2026 |
| LaserCutSettings.com community DB | **FREE** (115+ machines, downloadable .clb) | lasercutsettings.com | 2026 |
| LaserJobManager (shop mgmt incl. settings) | **$99 one-time** ($149 future); $29/yr optional updates | laserjobmanager.com | 2026 |
| Glowforge Premium (design software) | **$20/mo** | glowforge.com/premium | 2026 |
| Settings/community on Patreon | $2–$15/mo (most $2–6) | patreon.com (Sharks With Lasers 2,839 patrons; STOP Burning Stuff 1,701; Laser Everything 614) | 2026 |
| Skool laser communities | $29–$39/mo, but **small** (34–296 members) | skool.com | 2026 |
| **BeraTech (~$14.99/mo)** | **COULD NOT VERIFY** — domain does not resolve | — | [WEAK / unconfirmed] |

**Hobbyist verdict (strong signal):** Parameters/settings are a **near-commodity at $4–$17**, suppressed by *free* competition — xTool EasySet, Glowforge Proofgrade, LightBurn's built-in Material Library, and free community DBs (LaserCutSettings.com) all give settings away. **There is essentially no evidence of durable recurring payment for laser settings specifically.** The recurring money in this niche flows to (a) one-time control software ($99–$199, LightBurn), (b) community/coaching ($2–$40/mo), and (c) design software (Glowforge Premium $20/mo) — **not** to a standalone settings subscription. A pure settings subscription to hobbyists is a **hard sell with high churn.**

### Industrial — far less price-sensitive, but quote-gated

| Item | Price | Source | Year |
|---|---|---|---|
| CAM/nesting per seat (SigmaNEST, Lantek, ProNest, MetaCAM) | **$5k–$30k+ per seat** + ~15–20%/yr maintenance (all quote-only; estimates) | vendor sites (quote-gated) | 2026 |
| ProNest LT (subscription tiers) | Named tiers via FastSpring (exact $ behind checkout) | hypertherm.com | 2026 |
| Machine monitoring (FourJaw) | **£72–£180/machine/mo (~$90–$230)** | fourjaw.com/pricing | 2026 |
| FreePoint ShiftWorx | **$125/machine/mo** | SourceForge | 2026 |
| Predator MDC | **~$39/machine/mo** (or perpetual) | predator-software.com | 2026 |
| MachineMetrics | Undisclosed; est. $150–450/machine/mo [WEAK] | machinemetrics.com/pricing | 2026 |

**Industrial verdict:** Shops *do* pay recurring fees for software that touches **throughput/utilization** ($90–$230/machine/mo for monitoring; $5k–30k/seat for CAM). Willingness is tied to **ROI on machine time**, not to parameter convenience. CutLog's own product-definition price ($200–$400/machine/mo) sits at the **top** of the published monitoring band — defensible *only* if it demonstrably saves test-cut waste and setup time (the doc's ROI model: ~$11k/yr value/machine).

---

## 4. Comparable SaaS / hardware benchmarks (monetization reality check)

| Company | What | Per-machine pricing | Funding | Revenue/ARR | Outcome |
|---|---|---|---|---|---|
| **MachineMetrics** (closest comp) | CNC monitoring | **Undisclosed**, volume-tiered (~$150–450/mo est., weak) | ~$37M over ~7yrs (A $11.3M 2018, B $20M 2021) | **~$15M ARR (est.)** | No public Series C; the ceiling case for narrow monitoring |
| **FourJaw** | Machine monitoring | **£72–£180/machine/mo** (cleanest public) + £200 hw | ~£4M | ~$2.2M ARR (est.) | Early-stage |
| **Predator MDC** | MDC | ~$39/machine/mo + $500 hw | Bootstrapped | n/a | 30yr niche player |
| **Datanomix / Amper** | Monitoring/analytics | Quote-only | ~$18M / ~$11M | ~$5–11M ARR (est.) | **Amper acquired by ECI, Dec 2025** |
| **Tulip** | Frontline ops apps | $100–$250 per *interface*/mo | **~$273M over ~12yrs** | ~$100–200M ARR (inferred) | **$1.3B valuation, Series D Jan 2026** |
| **MaintainX** | CMMS | $20–$65/user/mo | ~$254M | **>$135M ARR (2026)** | **Acquired by Autodesk ~$3.6B, May 2026** |
| **Samsara** | Fleet/asset telematics | $27–$33/asset/mo | Public | ~$1.7B rev / ~$2B ARR | ~$18B market cap |
| **Augury** | Machine health (predictive) | Quote-only | ~$361M | n/a | $1B+ valuation |

**The pattern that matters for CutLog:**
1. **Narrow per-machine monitoring caps out at ~$10–20M ARR** and tends to **exit via acquisition** (Amper→ECI, Fiix→Rockwell) rather than scaling independently — and it took **~$37M and 7–10 years** even for the leader.
2. **The big outcomes broaden** into frontline-ops apps (Tulip $1.3B), maintenance workflows (MaintainX $3.6B exit), or marketplaces (Xometry ~$690M rev) — typically requiring **$200M+ capital and a decade.**
3. **Higher value-add ⇒ quote-only pricing** (Augury, MachineMetrics, Datanomix all hide price). Commodity IIoT connectivity publishes cents/device (Golioth $0.25, ThingsBoard $0.30, Particle $2.99).

**Implication:** A solo/small founder is **not** going to build the next Tulip. The realistic comparable is **FourJaw / Predator** — a low-single-digit-to-low-double-digit-$M-ARR niche tool. And CutLog's wedge (parameter recommendation) is *narrower* than machine monitoring, which is itself the narrow, $10–20M-ARR-capped category.

---

## 5. Hardware data-collection model economics

**Per-unit hardware cost (COGS):**
- DIY/RPi route: **~$85 bench, ~$150–$250 industrialized** (CM4 $41–55 + industrial carrier + enclosure + PSU + radio). Verified: Adafruit, raspberrypi.com (2026).
- Turnkey gateway to re-skin (RevPi €438–€571 / Advantech $465–$645): device-level COGS **~$300–$650** (verified: revolutionpi.com, wolfautomation.com, 2026).
- Custom PCB at modest volume: **~$120–$250 landed COGS** (extrapolated).

**Sensible retail:** Anchor to **FourJaw £200 (~$250) one-time** and the $400–$650 turnkey band. **Defensible retail ~$300–$600 one-time** (or subsidized into the subscription, as Amper/FourJaw-Pro do).

**Gross margins (both hypotheses confirmed):**
- Industrial-IoT **hardware GM clusters ~27–46%** (Damodaran electronics 26.76% / computers 38.36%; Advantech 38–41%; Kontron 37–44% — all Jan 2026 / stockanalysis.com).
- Enterprise **SaaS GM clusters ~75–90%** (Damodaran software 71.72%; Benchmarkit median 79%).
- **~35–45 point gap.** Charging $400–600 on $150–250 COGS gives ~35–50% steady-state hardware GM after RMA/freight/support. **Hardware should be break-even-to-lightly-profitable; the margin lives in SaaS.** Treat the gateway as a **customer-acquisition / lock-in device.**

**Controller integration — the real moat AND the real cost:**
- Laser-specific OPC-UA companion specs now exist: **OPC 40530 "OPC UA for Laser Systems" v1.0.0 (2024-02)** and OPC 40501-1 Machine Tools (2024). Source: reference.opcfoundation.org. (High confidence.)
- **Bystronic** = clearest native OPC-UA (friendly path). **Trumpf** = gated cloud/API platform, umati founder, embedded server unproven. **Amada** = appears closed/hostile (V-factory). Sources: bystronic.com, developer.trumpf.com, umati.org (2026).
- Controller OPC-UA is often a **paid license** (Beckhoff TwinCAT TF6100 confirmed paid; Siemens/Rexroth runtime licenses). **Fanuc FOCAS is copyright-gated, non-redistributable.**
- Even "standard" OPC-UA needs **per-machine semantic mapping**: a 12-parameter umati PoC took **8–16 hours per machine** (opcfoundation.org, 2018). Studies find **92% of reachable OPC-UA deployments misconfigured** (arXiv 2010.13539).
- **Net:** integration is a genuine moat (hard to copy) but a genuine cost (per-OEM, per-machine engineering, often gated/paid).

**Attach rate:** No published industry figure exists. It is architecture-dependent:
- *Sensor-first* (Amper, FourJaw): ~100% attach, but device is cheap/free and self-installed in minutes.
- *Protocol-first* (MachineMetrics): edge hardware needed mainly for legacy machines; modern CNCs connect adapter-light; attach tracks the legacy share of the fleet.

**Solo-founder build + certification:** FCC Part 15B $3–5k; with pre-cert radio module $6.5–10k; CE EMC+LVD ~€3–10k (inferred). **Realistic: ~$10–25k test-lab cost + ~12-month productization** with a pre-certified module, budgeting one fail-and-retest cycle. Sources: compliancetesting.com, predictabledesigns.com (2025).

---

## 6. TAM / SAM / SOM

### Pricing assumptions (grounded in §3–4, deliberately realistic, not aspirational)

| Segment | Realistic annual price/machine | Basis |
|---|---|---|
| A — Industrial (software-only) | **$1,200/yr** ($100/mo) base; up to $2,400/yr at top | Below CutLog's own $200–400/mo ask, because parameter-only is narrower than monitoring (FourJaw $90–230/mo). Use $100/mo as the *defensible* recurring number; $200/mo is optimistic. |
| A — Industrial (hardware+SaaS) | **$1,800/yr SaaS + $400 one-time hw** | Higher SaaS justified by per-machine data/lock-in |
| B — Marking/engraving | **$120/yr** ($10/mo) | Low WTP; closer to LightBurn/Glowforge Premium tier |
| C — Hobbyist | **$24/yr** ($2/mo) blended, *with brutal churn* | Patreon-tier; most pay $0 (free competition); realistic ARPU after churn is far lower |

### TAM (theoretical, all relevant machines × realistic price — NOT obtainable)

| Segment | Installed base | × Annual price | TAM |
|---|---|---|---|
| A — Industrial | 600,000 | $1,200 | **$720M** |
| B — Marking | 3,500,000 | $120 | **$420M** |
| C — Hobbyist | 9,000,000 | $24 | **$216M** |
| **Total TAM** | | | **~$1.36B** |

> **On the prior "$960M TAM":** A ~$1.36B *theoretical* TAM is in the same ballpark **only if you assume every machine pays.** That assumption is false. The honest read: the prior $960M was a TAM-as-vanity-metric. TAM here is **not** a meaningful planning number — SAM and SOM are.

### SAM (serviceable — US/Europe + segments actually reachable & monetizable)

Restrict to: (A) US+EU industrial fleet ~150–250k machines, realistically reachable subset with high job-mix variety where the product has ROI ~40% → ~80,000 machines; (B) English-speaking marking shops willing to pay, ~10% of base → ~350k machines but at low price; (C) English-speaking hobbyists who *ever* pay anything, ~5% of base → ~450k machines at $24/yr with 50%+ annual churn.

| Segment | Serviceable machines | × Annual price | SAM |
|---|---|---|---|
| A — Industrial (US+EU, high-mix) | 80,000 | $1,200 | **$96M** |
| B — Marking (reachable payers) | 350,000 | $120 | **$42M** |
| C — Hobbyist (ever-pay subset) | 450,000 | $24 | **$11M** |
| **Total SAM** | | | **~$149M** |

### SOM (realistic obtainable in 3–5 yrs, solo / small founder)

**Explicit assumptions:**
- Solo or 2–3 person team, bootstrapped or <$500k raised. No enterprise sales force.
- Industrial sales cycles are 3–9 months, gated by shop owners/foremen; a solo founder closes maybe **2–5 industrial logos/month at steady state**, ~1.5 machines each.
- Hobbyist acquisition is cheap (content/Reddit/YouTube) but converts <2% of free to paid and churns ~5–8%/month.
- CutLog's wedge is *narrower* than monitoring → realistically captures a *fraction* of even the FourJaw-scale outcome.
- **Benchmark ceiling:** FourJaw ~$2.2M ARR, MachineMetrics ~$15M ARR after $37M/7yr. A solo founder lands well below FourJaw, not above.

| Horizon | Industrial paying machines | Hobbyist/marking paying users | Realistic ARR (SOM) |
|---|---|---|---|
| Year 1 | 20–60 | 200–800 | **$50k–$150k** |
| Year 3 | 150–400 | 1,500–4,000 | **$300k–$700k** |
| Year 5 | 400–1,000 | 3,000–8,000 | **$700k–$1.8M** |

**3–5yr SOM ≈ $0.7M–$1.8M ARR.** This is a **profitable solo/lifestyle business at the top end, not a venture outcome.** To exceed it requires either (a) a sales team for industrial, or (b) broadening beyond parameters into shop workflow/monitoring (i.e., becoming a FourJaw/MachineMetrics competitor) — both require capital and change the company.

---

## 7. Software-only vs Hardware+software

| Dimension | **Software-only** | **Hardware+software** |
|---|---|---|
| What it is | Web app: material+thickness → recommended params; community library; manual entry / file import | Above + OPC-UA gateway reading *actual* machine parameters, auto-correlating with quality |
| Gross margin | **75–90%** (pure SaaS) | Blended ~60–75% (35–50% hw drags it) |
| Upfront cost to build | Low (software only) | **+$10–25k cert, ~12mo, per-OEM integration** |
| Defensibility / moat | **Weak** — settings are commodity, free competition (xTool EasySet, LightBurn library, LaserCutSettings.com free) | **Strong** — per-OEM controller integration is hard to copy (8–16 hrs/machine semantic mapping; gated Trumpf, closed Amada) |
| Reachable segments | All three (A/B/C) | **Industrial only** (B/C machines don't expose OPC-UA / aren't worth integrating) |
| Sales friction | Low (self-serve possible) | **High** (on-site install, IT/OT approval, weeks for legacy) |
| Realistic 5yr ARR | **$0.7–1.5M** (volume from hobbyist + some industrial, low ARPU) | **$0.5–2.5M** (fewer customers, much higher ARPU, stickier) |
| Churn | High (esp. hobbyist) | **Low** (hardware + integrated data = lock-in) |
| Capital efficiency | High | Lower (inventory, RMA, support) |
| Who it's for | Solo founder, fast | Needs a technical co-founder + patience |

**Verdict:** Software-only is faster and cheaper to start but has a **weak moat** (free competition crushes pure-settings pricing) and depends on the low-WTP hobbyist segment for volume. Hardware+software is **slower, costlier, industrial-only**, but builds a **real moat and low churn** — and points at the *only* segment with durable WTP. The hardware model is **strategically better but operationally harder for a solo founder**, and is essentially a bet on becoming a niche MachineMetrics-for-lasers.

---

## 8. Revenue scenarios (pessimistic / base / optimistic)

**Software-only (mixed segments):**

| Scenario | Year 1 ARR | Year 3 ARR | Year 5 ARR | Notes |
|---|---|---|---|---|
| Pessimistic | $15k | $80k | $200k | Hobbyist churn kills it; free competition; ~never reaches escape velocity |
| **Base** | $60k | $350k | $900k | Modest industrial + cheap hobbyist tier; lifestyle business |
| Optimistic | $150k | $800k | $2.0M | Strong content engine + a few hundred industrial machines; approaches FourJaw scale |

**Hardware+software (industrial focus):**

| Scenario | Year 1 ARR | Year 3 ARR | Year 5 ARR | Notes |
|---|---|---|---|---|
| Pessimistic | $20k | $120k | $300k | Integration drag; long installs; few logos; cert delays |
| **Base** | $50k | $400k | $1.2M | ~300–500 machines at $1,800/yr SaaS; sticky; Bystronic-first |
| Optimistic | $120k | $900k | $2.8M | Becomes the laser-specific MachineMetrics in US+EU; possible acqui-target |

*(Year-1 hardware revenue is suppressed by the ~12-month build/cert cycle — most year-1 revenue is software/pilot.)*

---

## 9. Where the data is weak (honest flags)

1. **All unit-shipment and installed-base numbers are triangulated estimates** — no segment has a well-sourced unit figure. Order-of-magnitude only.
2. **Gold-standard laser-revenue sources (Optech Consulting, Laser Focus World/Strategies Unlimited) not retrieved** — would tighten §1–2. Recommend a targeted follow-up.
3. **China export volumes (B & C)** — genuine gap; would need HS-code customs data.
4. **MachineMetrics / Amper / Datanomix exact pricing & ARR** — gated; estimates from single weak sources (Latka/lead-gen blogs).
5. **BeraTech ~$14.99/mo** — could not verify the product exists; treat the prior as unvalidated.
6. **Etsy sales-volume counts** — not captured (rate-limited); only star ratings seen.
7. **CAM/nesting dollar figures** — vendors quote-only by design; all estimates.
8. **CE certification euro quotes & controller OPC-UA license prices** — inferred, not quoted.

---

## Bottom Line

**Realistic revenue ceiling:**
- **Software-only:** base case **~$0.9M ARR by year 5**, optimistic **~$2M**. The pure-settings value prop is undercut by *free* competition (xTool EasySet, LightBurn library, LaserCutSettings.com), so pricing power is weak and hobbyist churn is brutal. This is a **lifestyle/solo-founder business**, not a venture outcome.
- **Hardware+software:** base case **~$1.2M ARR by year 5**, optimistic **~$2.8M**, with a *real* moat (per-OEM controller integration) and low churn. It is slower and costlier to start (~$10–25k cert, ~12-month build, painful integrations) and is **industrial-only**, but it is the only path with durable pricing power. Plausible exit: acqui-hire by a monitoring incumbent (cf. Amper→ECI, Fiix→Rockwell), not an independent scale-up.
- **Neither model realistically clears ~$3M ARR for a solo/small founder in 5 years.** The closest real comparables (FourJaw ~$2.2M, MachineMetrics ~$15M after $37M/7yr) confirm that narrow per-machine tooling caps low and usually exits via acquisition. The "$960M TAM" framing is a vanity metric; the obtainable SOM is **<$2M ARR**.

**Which segment holds the money:** **Industrial fiber cutting (Segment A).** It is the *only* segment with durable willingness to pay ($100–230+/machine/mo proven for adjacent monitoring software) and the only one where the hardware moat is buildable (OPC-UA exists, Bystronic is open). The hobbyist segment (C) has enormous volume but near-zero WTP, free competition, and savage churn — it is a **marketing/funnel asset, not a profit center**. Marking (B) is in between and largely unreachable at a price that matters.

**The strategic recommendation implied by the data:** lead with industrial, use Bystronic's open OPC-UA as the wedge, treat hardware as a lock-in/CAC device at break-even, make margin on $1,200–1,800/machine/yr SaaS, and use a free hobbyist tier purely for funnel/brand — never expecting it to pay the bills.
