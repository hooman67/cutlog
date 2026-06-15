# BeraTech CNC — Competitive Analysis

**Research Date:** 2026-06-15
**Discovered:** Mehmet Açıkgöz posted the app announcement in "Fiber Laser Cutting Machine | Metal Laser Cutter Users" Facebook group, under our Round 2 Chinese machines post.
**Threat Level:** 4/10

---

## 1. Company / Developer Info

| Field | Details |
|-------|---------|
| **App Name** | BeraTech CNC Calculator AI |
| **Developer** | Mehmet Açıkgöz |
| **Company** | Beratech Teknoloji / Beratech Bilisim Limited Sirketi |
| **Location** | Keçiören, Ankara, Turkey |
| **Day Job** | Laser Technologies, Automation & AI Software Systems Specialist at TMI Technological Machine Industry (aerospace manufacturing, 51-200 employees, AS 9100 / ISO 9001 certified) |
| **LinkedIn** | tr.linkedin.com/in/mehmet-açıkgöz-b567b6326 (~210 connections) |
| **Instagram** | @beratech_turkey — 1,144 followers |
| **Facebook** | facebook.com/memetagoz/ — 2,050 likes, "Digital creator" |
| **YouTube** | ~289 subscribers |
| **GitHub** | github.com/mehematk11 (1 repo: beratech-privacy) |
| **Email** | mhmtackgz1881@gmail.com |
| **Tech Stack** | Flutter (cross-platform mobile) |
| **Payment** | RevenueCat |

**Background:** Mehmet works daily with fiber laser cutters, CNC lathes, milling machines, plasma cutters, CMM, and wire EDM at TMI (an aerospace manufacturer in Ankara). He combines genuine shop-floor expertise with software/AI skills. This is a bootstrapped side project — no VC or corporate backing found.

---

## 2. App Store Presence

| Platform | Details |
|----------|---------|
| **iOS** | apps.apple.com/us/app/beratech-cnc/id6757587493 — Free w/ IAP, v1.0.26, 121 MB, iOS 13+, rated 4+ |
| **Android** | play.google.com/store/apps/details?id=com.beratech.cncassistant — ~1,000-1,900 downloads, 85 MB |
| **Reviews** | Insufficient ratings on iOS; no public reviews found |
| **Launch** | Privacy policy dated May 2026 — very recent launch |

---

## 3. Pricing Model

| Tier | Price | Details |
|------|-------|---------|
| **Free** | $0 | Base app with limited features |
| **BeraTech AI Pro** | $14.99 one-time | Unlock premium AI features |
| **Monthly Premium** | $14.99/month | Full subscription access |

---

## 4. Confirmed Features

The app is **AI-powered** (not just static reference tables):

### Laser-Specific
- AI Chat Assistant — parameter guidance, troubleshooting
- Laser parameter recommendations (material type, thickness, gas)
- Nozzle selection tool
- Focus calculations
- Gas settings reference
- Fault diagnosis — structured step-by-step troubleshooting

### Broader CNC (not laser-specific)
- CNC calculators (machining formulas, engineering tools)
- 3D machine simulators (lathe, milling, plasma)
- CMM measurement assistant
- G-Code library + automatic generation
- Technical drawing analysis (AI-powered)
- BeraCAM — sheet unfolding (premium)

### Platform Features
- 50+ modules organized in "Tool Center"
- Community forums / chat
- Industry news (metal pricing, wages)
- US CNC Module — 50-state filtering, Imperial units
- NEXUS Suite (new module, unclear details)

---

## 5. What They DON'T Have (Our Advantages)

| Gap | Implication for CutLog |
|-----|----------------------|
| **No community-contributed parameter data** | No network effects, no data flywheel |
| **No per-machine optimization** | Can't calibrate to YOUR specific machine |
| **No feedback loop** | Doesn't learn from real cut outcomes |
| **No machine connectivity** | Can't auto-log or detect drift |
| **No quality ratings on parameters** | Can't distinguish good vs bad suggestions |
| **No LightBurn integration** | Can't import/export .clb files |
| **No speed-focused UX** | Generic AI chat vs. "how fast to cut" one-answer UX |
| **Broad focus (laser+milling+turning+plasma)** | Jack of all trades vs. deep laser specialization |
| **AI-generated answers** | Likely LLM-based = same hallucination risk as ChatGPT for parameters |

---

## 6. Threat Assessment

### Why 4/10 (not higher):

1. **Different architecture** — They are an AI assistant (LLM-based chat). We are a data-driven optimization platform with community feedback loops. Fundamentally different value propositions.

2. **No network effects** — No mechanism to collect real-world cut data from users. Their AI doesn't get better as more people use it (unless they retrain, which solo developers rarely do).

3. **Broad scope = shallow depth** — 50+ modules across laser, milling, turning, plasma, CMM. They can't be best-in-class at laser cutting parameters when they're also building CNC simulators and G-code generators.

4. **Tiny traction** — ~1,900 downloads, no ratings, no organic buzz outside developer's own posts. Very early stage.

5. **Solo developer with a day job** — Limited velocity. Building a Flutter app, an AI backend, community features, 50+ modules... solo. Execution risk is high.

6. **Geographic focus** — Turkish-origin, expanding to US. Minimal overlap with our Facebook group audience (primarily US/Canada/Australia/UK).

7. **AI hallucination risk** — If their parameter recommendations are LLM-generated (likely), they suffer the same problem we identified: AI gives plausible but unverified answers. No ground-truth feedback loop.

### Why not lower (factors that increase threat):

1. **Real domain expertise** — Mehmet has genuine hands-on laser/CNC experience at an aerospace manufacturer. He KNOWS the problem space.

2. **He's posting in OUR groups** — Same Facebook groups, same target audience. If his app gains traction there, it could be perceived as "good enough" by potential CutLog users.

3. **AI-powered is a better pitch than static tables** — Easier for users to understand "ask the AI" vs. "search a database." Even if less accurate, the UX is more approachable.

4. **Could pivot** — If he adds real data collection from users and per-machine learning, he'd move closer to our value prop. But nothing in his current trajectory suggests this.

5. **Mobile-first** — Native iOS/Android app vs. our PWA. Some users may prefer a dedicated app (especially for shop floor use).

---

## 7. Strategic Response

### Do NOT:
- Panic — they are fundamentally different and very early
- Copy their broad approach — our depth is our advantage
- Engage/comment on his Facebook post (don't validate a competitor)

### DO:
- **Monitor** — Download the app, test the parameter recommendations, note quality
- **Differentiate** — Emphasize "verified community data" and "learns YOUR machine" vs. "AI guesses"
- **Move faster on LightBurn integration** — this is our moat they can't easily replicate (✅ DONE)
- **Get beta users logging real cuts** — once we have real feedback data, our suggestions are provably better than LLM-generated ones
- **Consider mobile** — if shop floor operators prefer native apps, evaluate React Native wrapper for CutLog (but PWA works fine for now)

### Positioning Against BeraTech:
> "BeraTech gives you AI-generated guesses. CutLog gives you community-verified parameters calibrated for YOUR machine."

---

## 8. Key Differences Table

| Dimension | BeraTech CNC | CutLog |
|-----------|-------------|--------|
| **Core approach** | AI assistant (LLM chat) | Data-driven community + ML |
| **Parameter source** | AI-generated | Real verified cuts from operators |
| **Per-machine learning** | No | Yes (planned v2) |
| **Feedback loop** | No | Yes (3-button + star ratings) |
| **LightBurn integration** | No | Yes (.clb import/export) |
| **Network effects** | None | More users = better data = better for all |
| **Scope** | Broad CNC (laser+milling+turning+plasma) | Deep laser cutting specialization |
| **Platform** | Native mobile (Flutter) | Web PWA (installable) |
| **Pricing** | $14.99/mo | TBD (similar range expected) |
| **Traction** | ~1,900 downloads | 0 users (pre-launch) |
| **Team** | Solo developer (Turkey) | Solo developer (US) |
| **Domain expertise** | Genuine (aerospace mfg) | Learning (AI/ML background) |

---

## 9. Bottom Line

BeraTech CNC validates the market thesis: someone else independently identified the same gap ("combine technical knowledge, practical guidance, and educational tools into a single platform for laser operators"). However, their approach (broad AI assistant) is fundamentally different from ours (deep, data-driven, community-powered, per-machine optimization).

The fact that they exist is **validating, not threatening**. They prove demand. Their weaknesses (no community data, no per-machine learning, no feedback loop, broad scope) are exactly our strengths.

**Action items:**
1. Download and test BeraTech CNC (free tier) — assess parameter recommendation quality
2. Note any user engagement/comments on his Facebook post (are people interested?)
3. Continue executing on our roadmap — our moat is built through data and community, not AI chat
