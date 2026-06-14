# Product Definition: AI Laser Cutting Parameter Optimization SaaS

## Problem Statement

**Who has this problem**: Laser cutting job shops and in-house fabrication departments (5,000+ in US, 200,000+ machines globally). Specifically, the operators and programmers who set up new jobs on fiber/CO2 laser cutters.

**How painful**: Every new material/thickness combination requires finding the right parameters (power, speed, gas pressure, focus position, pulse frequency). Today this is done through:
1. **Manufacturer parameter tables** — cover 20-30 common materials. Everything else = trial and error.
2. **Operator tribal knowledge** — the experienced guy "just knows." When he retires or calls in sick, the shop struggles.
3. **Test cuts** — waste 1-3 sheets per new job ($5-$50/sheet depending on material). For a busy shop doing 20+ different jobs/week, that's $100-$1,000/week in wasted material + 30-60 min per setup.

**Current state of the art**:
- OEM-provided parameter libraries (Trumpf TruTops, Bystronic BySoft): cover standard materials only, no ML, not shared across users
- Experience-based trial and error: the dominant method for non-standard materials
- No cross-machine learning: what one shop discovers stays in that shop forever

**Why this is uniquely solvable now**:
- Fiber lasers have standardized interfaces (EtherCAT, OPC-UA) enabling data collection
- ML for multi-parameter optimization is mature
- Community/crowdsourced knowledge platforms are proven (Stack Overflow model)
- Edge compute is cheap enough to add to any machine

---

## Product Scope: v1 (MVP)

### What it does (3 features max):
1. **Parameter recommendation engine** — input: material type + thickness + desired edge quality → output: recommended power, speed, gas type/pressure, focus position, nozzle distance
2. **Community parameter library** — users share successful parameter sets with quality ratings; builds a growing database of "recipes" across thousands of material/machine combinations
3. **Machine connectivity** — connects to laser controller via OPC-UA or vendor APIs to read actual cutting parameters and correlate with part quality feedback

### What it does NOT do:
- NOT a CAD/CAM/nesting tool (LightBurn, SigmaNest, ProNest own that layer)
- NOT real-time closed-loop control (that requires specialized hardware sensors like Precitec)
- NOT a marketplace for cutting services (Xometry, SendCutSend own that)
- NOT limited to one OEM's machines — works across Trumpf, Bystronic, Amada, Han's, IPG, etc.

---

## User Workflow (Day 1)

1. Shop subscribes and connects their laser cutter via OPC-UA gateway (15-min setup)
2. Operator gets a new job: 2mm Inconel 718 — not in their machine's default library
3. Opens web/tablet app, selects machine model + material + thickness + quality target
4. System returns: "Recommended: 3200W, 1.8 m/min, N2 14 bar, focus +1.5mm" — based on similar successful cuts from the community
5. Operator runs the cut → rates the result (1-5 stars for edge quality, dross, kerf width)
6. Rating feeds back into the ML model; next recommendation for similar jobs is better
7. Over time: the community library grows, and this shop's specific machine characteristics are learned

---

## Pricing Model

| Tier | Price | What You Get |
|------|-------|--------------|
| **Free** | $0/month | Community library access (read-only), manual parameter search, 5 recommendations/month |
| **Pro** | $200/month per machine | Unlimited recommendations, machine connectivity, custom parameter history, quality analytics |
| **Enterprise** | $400/month per machine | Multi-machine fleet view, API access, dedicated parameter tuning, priority support |

**Customer's alternative cost**: 
- 1 wasted sheet/day × $20/sheet × 250 days = $5,000/year minimum
- 30 min setup time saved/day × $50/hr operator cost × 250 days = $6,250/year
- Total value: $11,000+/year per machine. Our price ($2,400-$4,800/year) = <50% of value created.

---

## Ideal First Customer Profile

| Attribute | Value |
|-----------|-------|
| Company size | 10-100 employees (job shop, high mix/low volume) |
| Equipment | 1-5 fiber laser cutters (Trumpf, Bystronic, Amada, or Chinese brands) |
| Work type | High job variety — many different materials/thicknesses per week |
| Pain signal | "We waste sheets on test cuts every time we get a new material" |
| Decision maker | Shop owner or shop foreman |
| Budget authority | Owner can approve $200/month immediately |
| Geography | US/Canada/Germany (largest laser cutting markets) |
| Anti-profile | Shops cutting only mild steel all day (they already have their parameters dialed in) |
