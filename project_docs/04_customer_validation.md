# Customer Validation: Laser Cutting Parameter Optimization

---

# SECTION 1: INITIAL PLAN

## Strategy Overview

**Goal**: Validate demand for AI laser cutting parameter optimization SaaS
**Method**: Facebook group polls → DM outreach → Discovery calls
**Cost**: $0
**Timeline**: 4 weeks

---

## First 5 Customers to Approach

| # | Profile | How to Find | Why Them |
|---|---------|-------------|----------|
| 1 | **High-mix job shop** (10-30 people, 2-3 fiber lasers, 50+ different jobs/week) | Facebook "Fiber Laser Cutting Network" group (20K+ members) — post asking "who struggles with new material setups?" | High variety = maximum pain from parameter search. They'd use the tool daily |
| 2 | **Newer shop that bought a Chinese fiber laser** (HSG, Bodor, Raytools) | Facebook groups, AliExpress buyer forums, r/lasercutting | Chinese machines come with minimal parameter support — these operators NEED external help most |
| 3 | **Shop that recently lost an experienced operator** (to retirement or job change) | LinkedIn: search for laser shops posting "hiring experienced operator" — that's the signal | Their tribal knowledge just walked out the door. Maximum pain moment |
| 4 | **Metal fabrication educator** (community college, trade school with laser lab) | Google: "laser cutting certificate program" | They need structured parameter data for teaching. Would share with all their students (growth vector) |
| 5 | **Multi-location fabricator** (3-5 locations with different machine brands) | LinkedIn, industry directories (FMA members list) | Their pain: "parameters that work on our Trumpf don't transfer to our Bystronic at the other plant" |

---

## Demand Signals

| Signal | Strength | What It Means |
|--------|----------|---------------|
| "I'd use that TODAY — where do I sign up?" | STRONGEST | Build it, they'll come |
| "I already share parameters in Facebook groups but it's impossible to find anything" | STRONG | Validates the problem AND proves willingness to contribute |
| "We waste 2-3 sheets per new material — that's $50-150 per job" | STRONG | Quantified pain, self-selling ROI |
| "I'd pay $200/month if it actually worked" | STRONG | Validated pricing |
| "I'd share my parameters if I got something back" | MODERATE | Community model will work |
| "My OEM already gives me good parameters" | NEGATIVE | Wrong customer (probably only cuts standard materials) |
| "I don't trust other people's parameters — every machine is different" | CAUTION | Valid concern — need to address with machine-specific adjustment |

**Minimum signal to proceed**: 3 out of 5 conversations produce STRONG signals AND at least 2 people say they'd share parameters.

---

## Cold Outreach Plan

### Where These Buyers Hang Out (In Order of Density)

| Channel | Size | Approach | Expected Yield |
|---------|------|----------|----------------|
| **Facebook: Fiber Laser Cutting Network** | 20K+ members | Post with genuine question about parameter challenges; DM respondents | 5-10 conversations from one well-crafted post |
| **Facebook: Laser Cutting & Engraving** | 15K+ members | Same approach | 3-5 conversations |
| **PracticalMachinist.com** (forum) | Large, active metalworking community | Search threads about "laser parameters" → DM active posters | 2-3 conversations |
| **LinkedIn** | Search "laser cutting" + "shop owner" or "fabrication" | Cold DMs with research angle | 1-2 conversations (lower response rate) |
| **YouTube** | Channels doing laser cutting tutorials | Comment on videos about parameter tuning; reach out to creators | 1-2 potential beta testers + marketing channel |
| **Reddit: r/Metalfab, r/machinists** | Smaller but engaged | Post asking about cutting challenges | Background research + 1-2 leads |

### The Facebook Group Strategy (Fastest Path to Validation)

**Week 1**: Join "Fiber Laser Cutting Network" and observe for 3-5 days
- Note: What questions get asked? What problems recur?
- Find posts where people share parameters or ask for help with new materials

**Week 2**: Post a "research poll" in the group
- "Quick poll: How do you figure out cutting parameters for a new material? A) OEM tables, B) Trial and error, C) Ask someone, D) Online search"
- This generates comments + DMs from engaged members

**Week 3**: DM the 10-15 most engaged respondents for 1-on-1 calls
- "Thanks for your response to my poll. I'm building something to solve this — would love 10 minutes of your time to make sure I get it right."

**Expected outcome**: 5+ validated discovery calls within 3 weeks, $0 spent.

---

## Pre-launch Strategy

After validation, before full build:

1. **Create a landing page** (Carrd or simple Next.js page): "The community-powered laser cutting parameter database. Coming soon."
2. **Post in all laser cutting communities**: "We're building [thing]. Join the waitlist to get early access + lifetime discount."
3. **Target: 200 waitlist signups** before writing a single line of production code
4. **If you get 200 signups**: Build it. You have validated demand at scale.
5. **If you get <50 signups after 2 weeks of promotion**: Re-evaluate positioning or pivot.

This costs $0 and takes 1 weekend to set up.

---

## Observation Phase (Week 1)

### What to Look For
- Posts asking about parameter problems: "How do I cut [material]?" "What settings for [thickness]?"
- Posts about wasted materials or scrap
- Discussions about losing experienced operators
- People sharing parameters informally
- Frequency of "new material" problems
- Tone of community (helpful, gatekeeping, commercial, etc.)

---

## Poll Post Templates (Week 2)

### POST 1: General Poll (Posted in all 16 groups)

```
Quick poll: When you get a new material or thickness you've never cut before on your fiber laser, how do you usually figure out the right parameters?

A) Use the manufacturer's parameter tables (TruTops, BySoft, etc.)
B) Trial and error on scrap material
C) Ask someone (colleague, friend, experienced operator)
D) Search online (Facebook groups, forums, YouTube)
E) Mix of the above

I'm asking because I'm working on something to make this process faster, and I want to understand what actually works (or doesn't) in the real world. Would love to hear what's most painful about it today.

React with your letter or comment below!
```

---

## Discovery Call Questions

1. "Tell me about the last time you had to figure out parameters for a material you'd never cut before. Walk me through what you actually did."
2. "How many new materials/thicknesses do you encounter in a typical month?"
3. "What was the cost of that last one — in terms of wasted material, time, or frustration?"
4. "If you could search a database of parameters that other shops have verified — would you use that?"
5. "Would you be willing to share your successful parameters if it meant getting access to everyone else's?"
6. "What would something like that be worth to you per month?"
7. "Who else should I talk to about this?"

---

## Post-Call Notes Template

- **Name / Company / Location**
- **Pain level (1-5)**: How acute is the parameter problem?
- **Frequency (1-5)**: How often do they hit this?
- **Current workaround**: What are they doing today?
- **Willingness to share data**: Would they contribute parameters to a community?
- **Willingness to pay**: Amount they mentioned
- **Strongest signal**: Most compelling quote
- **Referrals**: Who to talk to next?

---

## Parallel Channels (Lower Priority)

### PracticalMachinist Forum
- Search "laser parameters" in existing threads
- Find active posters (people with 1000+ posts, helpful tone)

### Reddit
- r/Metalfab (smaller, more professional tone)
- r/machinists (general but some laser folks)

---
---

# SECTION 2: OUTREACH ROUND 1 (2026-06-10 to 2026-06-12)

## Poll Results (2026-06-10)

### Groups Tested: 16 total

| # | Group Name | Responses | Key Findings |
|---|------------|-----------|--------------|
| 1 | Fiber Laser Tips, Tricks & Sales | 1 vote | Mix of above |
| 2 | Fiber Laser Cutting Machine \| Metal Laser Cutter Users | 2 votes | 1 manufacturer, 1 mix |
| 3 | Fiber laser engraving and cutting | 0 | No response |
| 4 | CNC Fiber laser machine | 1 vote | Search online |
| 5 | Fiber Laser Engraving Club | 1 vote + 2 comments | Trial & error; *Nate Keen: "Depends which material... doesn't usually change much"*; *John Stegenga: "Trying it yourself is the only way to get it right"* |
| 6 | Laser Engraving And Cutting | 0 | No response |
| 7 | Laser Engraver Group for Beginner | 1 comment | Negative: *Alric Gazzo: "Dude you posted this 3 times. Fuck off"* — SKIP |
| 8 | Fiber Laser Engraving Club | 1 comment | *Nate Keen: "If it's metal its all very much similar"* |
| 9 | Free Laser Files | 0 | No response |
| 10 | UV laser and fiber laser community group | 6 votes + share | *Mike AJ Guindon shared https://www.lasertips.org/*; 4 trial&error, 1 search, 1 mix, 1 new option |
| 11 | DIY Fiber Laser | 8 votes | 4 trial&error, 2 manufacturer, 1 search, 1 each other |
| 12 | Fiber laser engraving and cutting | 0 | No response |
| 13 | Laser Engraver Group for Beginner | 3 votes + 2 comments | 2 test on scrap, 1 manufacturer; *Sean BeardyWeirdo: "I test, test, test"*; *Mariah Corfield mentions LightBurn test grids* |

### Overall Statistics
- **Response rate**: 13/16 groups responded (81%)
- **Total responses**: ~30 votes + comments
- **Dominant approach**: Trial & error on scrap metal (40%+ of votes)
- **Secondary**: Manufacturer parameter tables (15-20%)

### Groups to Skip
- Group 7: Hostile
- Groups 3, 6, 9, 12: No engagement

---

## Competitor Analysis: lasertips.org (2026-06-10)

**Status**: ANALYZED — NOT A THREAT (3/10)

| Question | Answer |
|----------|--------|
| **Database** | 100+ material/app combos |
| **Pricing** | FREE |
| **Community-driven?** | No — admin-maintained, static |
| **Cross-brand** | Chinese OEMs only (Raycus, JPT, Max, Tykma). Misses Trumpf/Bystronic/Amada |
| **Per-machine calibration** | NO — static tables only |
| **UX** | Very limited: collapsible tables, NO search, NO ratings |

**Your SaaS opportunity**: lasertips.org is the "yellow pages" — your product is "Google Maps with real-time traffic."

---

## DM Outreach Round 1 (2026-06-10)

### 5 People Targeted

| Name | Group | Initial DM Sent | Response |
|------|-------|-----------------|----------|
| Nate Keen | 5 & 8 | ✅ 2026-06-10 | ✅ Detailed reply (2026-06-11) |
| Mike AJ Guindon | 10 | ✅ 2026-06-10 | ✅ Positive reply (2026-06-11) |
| John Stegenga | 5 | ✅ 2026-06-10 | ❌ No response |
| Sean BeardyWeirdo | 13 | ✅ 2026-06-10 | ✅ Cautiously positive (2026-06-11) |
| Mariah Corfield | 13 | ✅ 2026-06-10 | ❌ No response |

---

## Replies Received (2026-06-11)
/mnt/localssd/laser_log/app/project_docs/round1_dms_and_replies.md



All 3 received full product explanation with the per-machine ML concept. Key points covered:
- Two-layer model (general + machine-specific)
- Resonator degradation tracking
- Calibration drift detection
- Historical success patterns
- Environmental quirk learning
- Drift detection / alarms

## Follow-Up Messages Sent (2026-06-11)
/mnt/localssd/laser_log/app/project_docs/round1_dms_and_replies.md


---

## Round 1 Final Status (as of 2026-06-16)

| Name | Initial Reply | Follow-up Sent | App Link Sent | Latest Reply |
|------|--------------|----------------|---------------|--------------|
| Mike AJ Guindon | ✅ Positive | ✅ Full pitch | ✅ Option A (2026-06-15) | ✅ "Swamped, will try this week" — WARM, busy but willing |
| Nate Keen | ✅ Gold mine insights | ✅ Co-founder exploration | ✅ Option A (2026-06-15) | ✅ Detailed reply — will try it, but notes Galvo lasers don't use gas/don't drift. Says "getting people in the ballpark is 90% there!" |
| Sean BeardyWeirdo | ✅ Cautiously positive | ✅ Per-machine ML explanation | ✅ Option A (2026-06-15) | ❌ No reply to app link yet |
| John Stegenga | ❌ No initial response | — | — | ✅ Late reply (2026-06-15): "I have 3 of the same machines, and they all are different" — validates per-machine thesis |
| Mariah Corfield | ❌ Never responded | — | — | — |

### Key New Insights from Round 1 Follow-up Replies (2026-06-15)

**Nate Keen's reply is CRITICAL for product direction:**
> "Most of those parameters don't actually apply to our setups though. (We don't use gas either, that sounds a bit more like proper expensive laser cutting which isn't my area). We mostly use Galvo lasers, and they don't really drift out of spec either they are very reliable."
> "It would definitely be cool to grab hundreds of settings to see what works, but you'd need a massive amount of verified tests, there are just so many variables at play"
> "even if it gets people in the ballpark for material testing that's 90% there!"

**Implications:**
1. **Galvo laser operators (engraving) vs CNC laser cutters (sheet metal cutting) are DIFFERENT markets** — Nate runs a Galvo laser for engraving, not a CNC fiber for cutting. Different parameters matter (no gas, no nozzle, no focus drift).
2. **"90% there" is a strong validation** — even a skeptical experienced operator says "ballpark = 90% of the value." This is our value prop.
3. **He still wants to try it** — "I'll certainly take a look and I'm happy to give you some feedback." Beta tester secured.
4. **Font preview tool** — He wants a font visualization app. We can't build this now but could offer to help later as relationship currency.

**Mike AJ Guindon:**
> "Apologies, we have been swamped... will try this week"

**Signal:** Still engaged, still intending to try. Just busy running a real shop. This is normal — operators have 0 slack time. Follow up in 5-7 days if no activity.

**John Stegenga (late reply to original Round 1 post):**
> "I have 3 of the same machines, and they all are different as far as settings to get the same output."

**Signal:** Strong validation of per-machine variation thesis. Same brand, same model = different settings. But he's also invested "hundreds, probably thousands" in test material — high pain, already resigned to it.
| Mariah Corfield | ❌ Never responded | — | — |

**Outcome**: Strong initial engagement (3/5 replied) but none converted to calls yet.


# Round 1 Follow-Up Messages (2026-06-14)
/mnt/localssd/laser_log/app/project_docs/round1_dms_and_replies.md



## Status Log

| Name | Message Sent | Option | Date |
|------|-------------|--------|------|
| Mike AJ Guindon | ✅ | Option A (direct link) | 2026-06-15 |
| Nate Keen | ✅ | Option A (direct link) | 2026-06-15 |
| Sean BeardyWeirdo | ✅ | Option A (direct link) | 2026-06-15 |


## Replies for the followup messages (2026-06-15)
/mnt/localssd/laser_log/app/project_docs/round1_dms_and_replies.md


---
## Replies Received (2026-06-13)
/mnt/localssd/laser_log/app/project_docs/round1_dms_and_replies.md




---

# SECTION 3: OUTREACH ROUND 2 (2026-06-12 onwards)

## Strategy

**Rationale**: Round 1 leads are promising but slow to commit. Generate parallel leads to hedge against ghosting.
**Target**: Chinese laser owners (highest pain, least documentation)
**Angle**: More specific than generic poll — targets specific pain point

## Post (Posted in all 16 groups, 2026-06-12)

```
For those of you running Chinese fiber lasers (HSG, Bodor, Raytools, others), which don't usually come with the best documentation in English, how do you find the right cutting parameters when you get a material the machine manual doesn't cover? 

Are you:
- Translating Chinese docs?
- Asking forums?
- Just experimenting?
- Comparing to similar materials?

Any tips/tricks would be really appreciated. 
```

## Results from the post (2026-06-14)
/mnt/localssd/laser_log/app/project_docs/round2_dms_and_replies.md




---

## Round 2 Analysis (2026-06-14)
**Mehmet Açıkgöz** — COMPETITOR ANNOUNCEMENT:
```
We are proud to announce the launch of our new CNC Fiber Laser Assistant application, now available on both iOS and Android.
This project was created to fill a gap in the CNC laser cutting industry by combining technical knowledge, practical guidance, and educational tools into a single platform.
The application provides laser operators, programmers, and technicians with instant access to technical information, troubleshooting guidance, cutting parameters, nozzle selection, focus calculations, gas settings, and many other learning resources.
Our goal is to make laser cutting knowledge more accessible, improve operational efficiency, and support continuous learning within the manufacturing industry.
The app is now live and available for download on iOS and Android.
You can find and download our application by searching for "BeraTech CNC" on the App Store and Google Play.
```

**Analysis**: See full competitive analysis in `beratech_cnc_competitive_analysis.md`. This is the first direct competitor announcement observed in our target Facebook groups. Threat level: 4/10.

### Overall Statistics
- **15 groups responded** (up from 13 in Round 1)
- **35+ comments** (deeper engagement than Round 1's 30 votes)
- **Dominant theme**: "Testing is the ONLY way" (80%+ of respondents)

### Key Quotes That Validate Your Product

| Quote | Who | Implication |
|-------|-----|-------------|
| "No two machines are the same, and each lens will have its unique signature" | Jeremy Hubert | Per-machine learning is essential |
| "You shouldn't really use anyone else's libraries — they ALL come with a disclaimer" | Michael Stanislawczyk | Current solutions acknowledge they're insufficient |
| "NOTHING with lasers is push to play. NOTHING." | John Lifer | Market has resigned itself to manual testing |
| "Someone with the exact same laser may find different optimal settings from you" | Brandon Dalton | Machine-specific calibration is the gap |
| "It's usually just about speed at that point. Everything else is dialed in pretty close." | Tinker Withit | Most parameters are stable; speed is the key variable |

### Resources/Competitors Mentioned (Researched 2026-06-14)

| Resource | Type | Threat Level | Notes |
|----------|------|-------------|-------|
| **LightBurn material test tool** | Built-in test grid generator | **LOW** — complementary | Helps RUN tests faster, doesn't ELIMINATE testing |
| **LaserParams Converter** (GitHub, shark92651) | Wattage/lens conversion calculator | **NONE** | Solo hobby project, 46 stars, dormant since 2022. Converts settings between configs, no ML |
| **OMG Laser settings page** | Static parameter database (130+ entries) | **LOW** — same as lasertips.org | Free, no ML, no community. Sales funnel for their hardware |
| **Victor Wolansky** | Expert trainer (courses) | **NONE** — potential partner | Laser guru, teaches technique. No software product |
| **Chance Lawson / Beam Squadron** (beamsquadron.com) | Training platform + file library | **LOW-MEDIUM** — closest to competitor | Subscription model, "thousands of laser files." Education-focused, no ML |
| **ComMarker** | OEM with detailed library | **NONE** — brand-locked | Only for ComMarker machines |
| **Haotian Laser / Bella Wang** | OEM support via WhatsApp | **NONE** — brand-locked | Starter library with purchase |
| **Gweike** | OEM with good English docs | **NONE** — brand-locked | Hong Kong based |
| **Etsy settings files** | Paid parameter files | **LOW** — proves willingness to pay! | People PAY for parameter data = validates pricing |
| **"Complete Laser Mastery Guide"** (Grace T Girth) | Book | **NONE** | Educational, not interactive |

### Critical Strategic Insights from Round 2

**1. LightBurn is the Ecosystem**
- Mentioned 8+ times across all responses
- Dominant software for fiber laser operators
- Has built-in "material test" tool + "Material Library" for saving settings
- **Your product MUST integrate with LightBurn** (import/export .clb files)

**2. "Testing is the Only Way" = Market Has Given Up**
- 80%+ say testing is unavoidable
- They've accepted this as reality
- **Risk**: If people believe nothing can help, you need dramatic proof (not incremental improvement)

**3. OEM Support is Better Than Expected for Chinese Machines**
- HSG, Senfeng, Haotian provide WhatsApp/WeChat support during first year
- They dial in parameters during installation
- **Your target is operators 1+ years post-purchase** (OEM support fades)

**4. People Already Pay for Parameters on Etsy**
- Michael Bergeron confirmed people sell settings files
- **Willingness to pay is PROVEN** — your product is a better version of what's on Etsy

**5. Speed is the Key Variable for Experienced Operators**
- Tinker Withit: "usually just about speed... everything else is dialed in pretty close"
- **MVP simplification**: v1 might just recommend SPEED for material/thickness/machine

### Updated Competitive Landscape (All Sources)

| Competitor | Threat | Why |
|-----------|--------|-----|
| lasertips.org | 3/10 | Free static tables, Chinese OEMs only |
| OMG Laser settings | 2/10 | Free static page, sales funnel |
| LaserParams Converter | 1/10 | Narrow calculator, dormant |
| Beam Squadron (Chance Lawson) | 4/10 | Closest — subscription + files. Education, not intelligence |
| Etsy parameter sellers | 2/10 | Proves WTP but terrible UX |
| **LightBurn Material Library** | **5/10** | NOT competitor but the PLATFORM you must integrate with |
| OEM WhatsApp support | 3/10 | Works first year, fades over time |
| **BeraTech CNC** (Mehmet Açıkgöz) | **4/10** | AI-powered mobile app (iOS/Android) with cutting params, troubleshooting, calculators. Solo Turkish developer, ~1,900 downloads. Broad CNC tool (laser+milling+turning), no community data or per-machine learning. First direct competitor announcement in our target groups. |

---

## Round 2 DM Status (as of 2026-06-17)

| Name | DM Sent | Reply? | Key Takeaway |
|------|---------|--------|-------------|
| Jeremy Hubert | ✅ | ✅ "I use the materials test and save the test in LightBurn's materials library" | Uses LightBurn material library — validates .clb import feature. Systematic tester. |
| Michael Stanislawczyk | ✅ | ❌ No reply yet | — |
| Tinker Withit | ✅ (thread reply) | ✅ "We have Raytool and there are a lot of parameters on the web, and we also have a book" | Has reference material (book + web) that gives starting points, then adjusts speed. Confirms starting-point value. |
| George Diffey | ✅ | ❌ No reply yet | — |
| Klaus Wojczykowski | ✅ (sent 2026-06-17) | ❌ No reply yet | — |
| Lobo Lightbringer | ✅ (sent 2026-06-17) | ❌ No reply yet | — |

### Nate Keen Video Partnership Offer (2026-06-17)

**His reply:**
> "Once all the bugs are sorted out and it's fine tuned then you can worry about the feature advertising side of it. I can make a video as well I've got a couple of YouTube channels with combined 20k subs and TikTok 225k (mainly just do YouTube these days) the one I put a bit of laser stuff on it almost got 14k. When I've got time, I want to do a bit more tutorial stuff with lasers."
>
> https://youtu.be/EKpd3QfnWuk?si=y0vsP_2z33Cca4fY

**Signal:** MASSIVE. This changes the go-to-market strategy entirely. One Nate video to his audience = potentially 500-2000 qualified views from laser operators who trust him. Far more effective than 16 cold Facebook group posts.

---

## Distribution Partnership: Nate Keen

### What He Offered
- A dedicated video about CutLog on his YouTube channel(s) (combined 20K subscribers)
- Promotion on his TikTok (225K followers)
- His laser-focused YouTube channel has almost 14K subscribers alone
- Tutorial-style content ("when I've got time, I want to do a bit more tutorial stuff with lasers")

### His Condition
- "Once all the bugs are sorted out and it's fine tuned"
- He wants to promote something polished, not something janky
- This is his reputation on the line with his audience

### What This Means for Strategy
1. **Deprioritize cold Facebook outreach** — Nate's single video delivers more qualified traffic than 16 group posts combined
2. **Prioritize polish** — Every bug fix and UX improvement directly unlocks the Nate video
3. **Font preview tool = relationship investment** — Building what he asked for cements the partnership
4. **His .clb import = first real user data** — Getting his library into CutLog proves the onboarding flow
5. **His video endorsement = replaces need for paid ads in Phase 1** — Organic, credible, from a trusted voice in the community

### Risk Management
- Do NOT rush him. Let him decide when the app is ready.
- Do NOT ask "is it ready yet?" repeatedly. Ship improvements, let him see them.
- His timeline > our timeline. A premature video with a buggy app = reputational damage for both.

### YouTube Link
- https://youtu.be/EKpd3QfnWuk?si=y0vsP_2z33Cca4fY

### Key Insights from Round 2 DM Replies (2026-06-15)

**Jeremy Hubert:**
> "I use the materials test and usually keep that on hand for reference, as well as saving the test, in the test program in lightburn....then yeah if I like something I save the setting in the setting library (materials library?)"

**Implication:** He's our ideal user workflow — runs tests, saves to LightBurn library. Our .clb import feature would instantly onboard his entire accumulated library. Follow-up: ask if he'd share his library in exchange for community settings he hasn't tested.

**Tinker Withit:**
> "so we have Raytool and there is a lot of parameters on the web, and we also have book that shows speed pressure height and such for various metals and thicknesses…so from there we can fill in the gaps"

**Implication:** Confirms operators use external references (books, web) as starting points. CutLog replaces the book + web search with a single searchable, machine-specific tool. His workflow is exactly: "get starting point → adjust speed → done."

### New Post Comments (2026-06-15)

**Joe Marx** (re: HSG): "Use their customer service chat. Should be a QR code on the machine."
- No action needed — confirms OEM support exists but only for their brand.

**Keith E. Fleming** (DIY Fiber Laser): "I think part of the fun of owning industrial class equipment is that there's some Expectation on the part of the user to already be well versed... published parameters online as a good starting point."
- Validates "starting point" framing. Notes there's an EXPECTATION of expertise — which means non-experts are underserved.

---

## Next Steps (Updated 2026-06-17)

### Strategy: Hybrid Launch (Option C) — Go Public + Parallel Deep Dives

We are now executing a **hybrid launch strategy** starting Week of June 17, 2026:
- **Phase 1 (This week)**: Test all 11 workflows (prototype_1_workflows.md) → Deploy → Post in 3 Facebook groups → Send 6 personal DMs
- **Phase 2 (Week 2-3)**: Collect deep-dive feedback from power users. Build case studies. Iterate landing page messaging.
- **Phase 3 (Week 4+)**: Scale based on proof points (target: 100+ waitlist signups, 2-3 active users).

Landing page URL: `https://cutlog-two.vercel.app/landing`

### Immediate (This Week — June 17-23)

1. ~~**Follow up on Round 1 leads**~~ — ✅ DONE (2026-06-15). Mike will try this week. Nate will give feedback. Sean no reply yet.
2. ~~**DM Round 2 targets**~~ — ✅ 6/6 sent (Klaus sent, Lobo sent as of 2026-06-17).
3. ~~**Research LightBurn .clb format**~~ — ✅ DONE + import/export feature BUILT
4. ~~**Buy Etsy parameter files**~~ — ✅ DONE (2026-06-17). Purchased 3 products ($46 total): LaserSecrets ($32, 188 entries/48 materials), BenMyersWoodshop ($9, 19 entries), HolsterGeek ($5, 10 PMAG entries). **Key finding: LaserSecrets sells math, not testing. 87% accuracy validated.** Lens files use pure power scaling math (not independent testing) — same approach as our LaserParams Converter. See `etsy_files_analysis.md` and `speed_validation_report.md`.
5. **[PREREQUISITE] Test all 11 workflows** — `prototype_1_workflows.md`. Fix all bugs before deploy.
6. **Deploy to Vercel** — Push to main, verify landing page + waitlist live.
7. **Facebook posts in 3 groups** — Link to `https://cutlog-two.vercel.app/landing`. Spaced 1-2/day (Deadline: June 21).
8. **Send DMs to power users** — Nate, Mike, Sean, Jeremy, Tinker, Lobo. Personal message + landing page link (Deadline: June 19).
9. **Follow up with Jeremy Hubert** — ask if he'd share his .clb library in exchange for community settings
10. **Follow up with Mike** — if no activity by 2026-06-20, gentle bump
11. **Reply to Nate** — acknowledge his Galvo laser insight, ask if he'd try the engraving params (OMG Laser data covers his use case)

### Short-Term (June 24-July 7): Hybrid Launch Phase 2-3

12. ~~**Pivot messaging**~~ — ✅ DONE (speed-first UX implemented)
13. **Deep-dive follow-ups** — 1:1 DMs with power users. Ask what material/thickness they want to test.
14. **Collect feedback** — Interview active users. Did suggestions make sense? Would you pay? What's missing?
15. **Compile case studies** — Write 2-3 testimonials with specific wins from active testers.
16. **Investigate Beam Squadron** partnership opportunity
17. **Consider market segmentation**: Galvo engraving operators (Nate's world) vs CNC cutting operators (industrial). Both are valid but have different parameter needs.

### Medium-Term (Month 2-3)

18. ~~**LightBurn integration**~~ — ✅ DONE
19. ~~**Speed recommendation MVP**~~ — ✅ DONE
20. **Get 5 beta users logging cuts** — Mike, Nate, Jeremy are closest to converting
21. **Native app (Capacitor)** — code ready on `migration_to_app` branch, trigger at 5+ active users. Will merge after threshold met.
22. **Partner with Victor Wolansky or Chance Lawson** — they have your target audience

