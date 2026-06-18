# Launch Strategy: Option C (Hybrid — Go Public + Parallel Deep Dives)

**Document created**: 2026-06-17  
**Last updated**: 2026-06-17  
**Owner**: CutLog Team

---

## Executive Summary

Instead of a slow private beta or a wide-open public launch, CutLog will execute a **hybrid launch**: go public immediately on a free landing page while simultaneously running focused deep-dive conversations with 6 hand-picked power users in Facebook laser groups. This approach combines the efficiency of viral reach with the credibility of real-world validation, allowing us to build credibility with proof before scaling acquisition.

**Key principle**: Real users solving real problems > theoretical interest signals. By coupling public visibility with private validation, we can prove the two-layer ML model works *in practice*, collect early data, and convert hot leads into case studies.

---

## Overview

### What We're Doing
1. **Week 1**: Launch a simple public landing page (free, no ads, no paywalls). Add CutLog to laser cutting Facebook groups as a resource. Start collecting waitlist signups.
2. **Week 2-3**: In parallel, run deep 1:1 DM conversations with 6 power users (Nate Keen, Mike AJ Guindon, Sean BeardyWeirdo, Jeremy Hubert, Tinker Withit, Lobo Lightbringer). Goal: get 2-3 to actively log cuts and give feedback. Collect case studies.
3. **Ongoing**: Monitor public landing page traffic, analyze group engagement, iterate on messaging based on real questions.

### Why This Works
- **Speed**: Launch this week, not next month
- **Credibility**: Case studies > impressions. One operator saying "this saved me 2 hours" > 100 "I'm interested"
- **Low cost**: Landing page is free (Next.js host or Carrd). No ads, no paid tools yet
- **Feedback loop**: Deep dives with power users inform product improvements before mass scaling
- **Parallel validation**: Quantitative (landing page views, signups) + qualitative (DM feedback, logged cuts)

---

## Timeline: Week 1-3 (June 17-July 1)

### Week 1 (June 17-23): Public Launch + Setup

#### Monday-Wednesday (June 17-19)
- **Landing page deployed** (or Carrd page created if Next.js not ready)
  - Headline: "Stop keeping parameters in your head. Let your machine remember."
  - 3 core sections:
    1. Problem: Every laser machine is different. Trial and error wastes time.
    2. Solution: CutLog learns YOUR machine. Suggests personalized speeds based on your hardware history + community data.
    3. CTA: "Join waitlist" → Supabase form or Carrd form
  - Demo video (30 sec): Screen recording of `/suggest` page showing speed recommendation feature
  - GitHub link (optional): `git@github.com:hooman67/cutlog.git`
  - Email: `cutlog@yourmail.com` for questions
  - Owner: **You**
  - Status: **CRITICAL PATH**

- **Facebook group posts drafted** (3 groups: Laser Cutting Enthusiasts, CO2 Laser Users, LightBurn Community)
  - Post 1 (Informational): "We built a tool that learns YOUR machine's parameters. Free to try. Any interest?"
  - Post 2 (Educational): "Here's why speed varies so much machine-to-machine: [link to blog post or doc]"
  - Post 3 (Value prop): "How much time do you waste testing parameters? We're trying to cut that down."
  - Owner: **You**
  - Status: **READY TO POST**

- **Email templates drafted** (for waitlist follow-ups)
  - Template 1 (Welcome): "Thanks for joining. Here's what we're building + when beta opens"
  - Template 2 (Beta invite): "You're in! Download the app. Log 1 cut to test the flow."
  - Template 3 (Feedback request): "How's the experience? What's missing?"
  - Owner: **You**
  - Status: **DRAFT**

#### Thursday-Sunday (June 20-23)
- **Deep-dive DMs sent** to all 6 power users (final 2 if not sent: Klaus, Lobo)
  - Message format: "Hey [Name], saw your comment on [thread]. Curious about something. We built a tool that predicts speeds for YOUR machine's specific characteristics. Would you try it and tell us if it's helpful?"
  - Include direct app link + landing page link
  - Owner: **You** (rate limit on Facebook = 2-3 per day)
  - Status: **IN PROGRESS**

- **Group posts scheduled** (or posted manually if scheduling not available)
  - Spread across 2-3 groups over 4 days (don't spam)
  - Owner: **You**
  - Status: **READY**

- **Waitlist form monitored**
  - Check signups daily. If 0 by Friday, investigate messaging.
  - Owner: **You**
  - Status: **MONITORING**

---

### Week 2 (June 24-30): Deep Dives + Iterate

#### Daily (June 24-30)
- **DM follow-ups with power users** (3-4 DMs sent June 20-23, await replies)
  - If replied: encourage them to try the app. Ask what material/thickness they want to test first.
  - If no reply by Wednesday: send one follow-up. "Did the link work? Happy to help you get started."
  - Owner: **You**
  - Status: **ACTIVE**

- **Landing page analytics review**
  - Weekly check: traffic, signup conversion, top referrers (Facebook vs organic)
  - Owner: **You**
  - Status: **MONITORING**

#### Thursday (June 27) — Mid-week Checkpoint
- **Collect early feedback** from any power users who've tried the app
  - Questions:
    1. Did you understand what to do on first visit?
    2. Did the speed recommendation make sense?
    3. What would make you actually use this regularly?
    4. Would you pay for this? How much?
  - Owner: **You** (1-on-1 DMs)
  - Status: **EXECUTION**

- **Iterate on landing page** if needed
  - If low signup rate: test new headline / value prop / demo video
  - Owner: **You**
  - Status: **CONDITIONAL**

---

### Week 3 (July 1-7): Case Studies + Scale Prep

#### Early week (July 1-3)
- **Compile case studies** from deep dives (target: 2-3 active users with 5+ logged cuts each)
  - Case study template:
    ```
    [Operator Name] — [Machine Type] — [Time saved]
    "I usually spend 1-2 hours testing speeds. CutLog got me in the ballpark in 15 minutes."
    — Before: [pain point]. After: [improvement].
    ```
  - Owner: **You**
  - Status: **EXECUTION**

- **Update landing page** with case studies + screenshot of app
  - Add testimonials section
  - Owner: **You**
  - Status: **EXECUTION**

#### Mid-week (July 4-5)
- **Analyze Week 1-2 data**
  - Waitlist size: target 50+
  - Landing page visitors: target 50+
  - App trial users: target 5+
  - If below targets: pause and diagnose. If above targets: prep for Week 4 expansion.
  - Owner: **You**
  - Status: **ANALYSIS**

- **Plan Week 4+ strategy** (beyond this sprint)
  - Option A: Keep momentum with more Facebook posts (scaled outreach)
  - Option B: Pause public campaign, double-down on getting 5 trial users to active status
  - Option C: Reach out to Beam Squadron (Chance Lawson) for partnership co-launch
  - Owner: **You**
  - Status: **PLANNING**

---

## Success Metrics by Phase

### Week 1: **Setup & Validation**
| Metric | Target | Owner | Notes |
|--------|--------|-------|-------|
| Landing page live | ✅ Yes | You | Free hosting (Vercel or Carrd) |
| Demo video recorded | ✅ Yes | You | 30 sec min, shows `/suggest` speed recommendation |
| Waitlist form functional | ✅ Yes | You | 1-click signup to email list |
| DMs to 6 power users | ✅ Yes (6/6) | You | Personal, not generic blasts |
| Facebook posts drafted | ✅ Yes (3+) | You | Value prop + educational + question-style |
| Email templates drafted | ✅ Yes (3) | You | Welcome, Beta, Feedback |

### Week 2: **Early Traction & Feedback**
| Metric | Target | Owner | Notes |
|--------|--------|-------|-------|
| Landing page signups | 30+ | You | Waitlist growth |
| App trial users | 3+ | You | From deep dives or referrals |
| Active users (5+ cuts logged) | 1-2 | You | Quality over quantity |
| DM reply rate | 50%+ | You | 3 of 6 power users respond |
| Session duration on landing page | 1+ min | You | People reading, not bouncing |
| Positive feedback on speed feature | 50%+ | You | "Made sense" or "helpful" or "close" |

### Week 3: **Proof Points & Scale Readiness**
| Metric | Target | Owner | Notes |
|--------|--------|-------|-------|
| Case studies written | 2-3 | You | Real testimonials with specifics |
| Cumulative waitlist | 100+ | You | Public + private combined |
| Cumulative trial users | 5-10 | You | People who clicked link and tried |
| Active users (logging regularly) | 2-3 | You | Proof of habit formation |
| Net sentiment (DMs + posts) | 60%+ positive | You | No "this won't work" pushback |
| Landing page traffic (cumulative) | 300+ | You | From all sources combined |
| GitHub stars (optional) | 10+ | You | If shared with dev community |

### Launch Success Criteria (All Phases Combined)
- ✅ **All three docs (landing page, demo video, email templates) ready for scale-up**
- ✅ **2-3 power users actively giving feedback**
- ✅ **1-2 written case studies with specific wins**
- ✅ **100+ waitlist signups (proof of demand)**
- ✅ **Landing page messaging validated (A/B tested or iterated once)**
- ✅ **Product messaging is clear (no confusion about value prop in feedback)**

---

## Why This Approach (vs Options A & B)

### Option A: Private Beta (Slow)
- ✗ Requires 5-10 committed testers upfront
- ✗ Takes 4+ weeks to recruit + onboard
- ✗ No public proof of demand = harder to raise awareness later
- ✗ Feedback comes slowly
- **Hybrid is better because**: We get feedback faster AND prove public demand simultaneously

### Option B: Wide Public Launch (Risky)
- ✗ Launch with 900 baseline params but zero user data = cold start problem
- ✗ No proof that recommendation engine works = users confused
- ✗ 10,000 signups on Day 1 = 9,990 ghosts (no logging = no learning)
- ✗ Can't handle scale, no feedback to improve from
- **Hybrid is better because**: We get proof with 2-3 real users BEFORE scaling acquisition

### Option C: Hybrid (This Plan) — Best of Both
- ✅ **Speed**: Launch this week, not next month
- ✅ **Proof**: Get 2-3 real users logging real cuts = proof of concept
- ✅ **Scale path**: Once proven, expand via Facebook groups / partnerships
- ✅ **Cost**: Free ($0 if using Vercel/Next.js; $15/mo if using Carrd)
- ✅ **Credibility**: Case studies before asking for more users
- ✅ **Feedback loop**: Deep dives inform product fixes before mass scaling

---

## Risk Mitigation

### Risk 1: Landing page gets no signups
**Mitigation**: 
- Test headline on one Facebook post first ("Did I get the pain point right?")
- If flatline, iterate messaging within 24 hours
- Fallback: Offer alternative CTA ("Try the app," "Read how it works," "Watch demo")

### Risk 2: Power users don't respond to DMs
**Mitigation**:
- Spread DMs over multiple days (Facebook rate limits + don't look spammy)
- If 2+ don't reply by Day 5, follow up with 1 additional message
- Fallback: Reach out to alternative candidates (Klaus, Lobo, or others from Facebook groups)

### Risk 3: Users try app but don't understand it / don't log cuts
**Mitigation**:
- Onboarding UX is already in place (first-visit overlay, contextual hints, empty state messaging)
- If user doesn't log after 1 week: send DM "How's the experience? Anything blocking you?"
- Fallback: Offer to do a Zoom walkthrough (hands-on 15 min call)

### Risk 4: Speed recommendations are off / users say "this is wrong"
**Mitigation**:
- We've already validated speeds against Etsy expert data (87% accuracy, 60% within 5%)
- If 2+ users say "way off," investigate:
  - Is their machine different from our baseline? (e.g., old resonator, different gas)
  - Are they testing correctly? (material thickness, power setting)
- Fallback: Add a "Let's calibrate" flow in the app (manual overrides + feedback)

### Risk 5: Facebook groups ban us for promotional posts
**Mitigation**:
- DMs to individuals = personal conversation, not promotion
- Public posts follow group rules: ask questions, share knowledge, don't hard-sell
- If banned: shift to partnership outreach (reach out to Beam Squadron, LightBurn community lead, etc.)

### Risk 6: No time to execute all 3 weeks
**Mitigation**:
- **Minimum viable launch** (Week 1 only):
  - ✅ Landing page + demo video + waitlist form (Friday June 21)
  - ✅ 6 DMs to power users (Wednesday June 19)
  - = Ready for feedback, can iterate later
- If Week 2-3 delayed: extend to 4 weeks, but don't compromise quality on deep dives

---

## Budget

| Item | Cost | Notes |
|------|------|-------|
| Landing page hosting | **$0** | Vercel (free tier, auto-deploys from GitHub) |
| Domain (optional) | $0-10 | Use `cutlog-two.vercel.app` or buy custom domain later |
| Carrd (if not using Next.js) | $15/mo | Optional. Static landing page builder, works too. |
| Email service (Supabase + Vercel) | $0 | Free tier covers 1000 emails/month |
| Demo video software | $0 | Use screen recorder (Mac QuickTime, Linux SimpleScreenRecorder) |
| Zoom (for 1:1 calls if needed) | $0 | Free tier = 40 min limit, OK for callouts |
| **Total** | **$0-15/mo** | Free if using Vercel; $15/mo if using Carrd instead |

---

## Rollout Checklist (Weekly)

### Week 1 Completion Checklist
- [ ] Landing page deployed to production (live URL)
- [ ] Demo video (30 sec) recorded and embedded on landing page
- [ ] Waitlist form functional (email capture working)
- [ ] 6 DMs sent to power users (Nate, Mike, Sean, Jeremy, Tinker, Lobo)
- [ ] 3 Facebook posts drafted (ready to schedule or post)
- [ ] 3 Email templates drafted (Welcome, Beta, Feedback)
- [ ] GitHub link (if sharing) updated with landing page link
- [ ] Slack/personal note: "Week 1 launch complete, monitoring signups"

### Week 2 Completion Checklist
- [ ] Landing page signups tracked (number of emails collected)
- [ ] 50%+ of power users replied to DMs or clicked app link
- [ ] 3+ trial users in app, at least 1 trying `/suggest`
- [ ] 1-on-1 feedback collected from active users (written in notes)
- [ ] Landing page messaging tested or iterated once if needed
- [ ] Email template 1 (Welcome) sent to first 10 waitlist signups
- [ ] Slack note: "Week 2 checkpoint: X signups, Y trial users, Z feedback themes"

### Week 3 Completion Checklist
- [ ] 2-3 case studies written (with operator name, machine type, specific win)
- [ ] Landing page updated with case studies + screenshots
- [ ] Cumulative analysis: 100+ signups, 5+ trial users, 2+ active loggers
- [ ] Week 4+ plan decided (scale, iterate, pivot, or pause)
- [ ] Final report: "Launch hybrid validated. Ready for next phase or needs adjustment."
- [ ] GitHub/docs updated with launch results

---

## What Success Looks Like (End of Week 3)

**By July 7, 2026, we will have:**

1. ✅ A live, public landing page with a working waitlist (proof of demand)
2. ✅ A 30-second demo video showing the core feature (proof of product)
3. ✅ 2-3 power users actively testing the app (proof of concept)
4. ✅ 2-3 written case studies with specific wins (proof of value)
5. ✅ 100+ waitlist signups (proof of scalability)
6. ✅ Clear, validated messaging for the next phase (proof of go-to-market)
7. ✅ A decision point: "Ready to scale acquisition" or "Need to fix X first"

**If we achieve this**, we can confidently move into Month 2:
- Scale Facebook outreach (10+ groups)
- Reach out to Beam Squadron for partnership
- Start recruiting 5+ active users for the next phase (ML model training)
- Plan App Store release (Capacitor wrap)

**If we fall short**, we'll have clear data on what to fix (landing page messaging, demo video clarity, app UX, or product-market fit issue).

---

## Post-Launch (Week 4+)

Once Week 1-3 proves the concept, the next phases are:

1. **Month 2 (Scale Acquisition)**
   - Expand to 10+ Facebook groups (weekly posts)
   - Pitch Beam Squadron for partnership co-launch
   - Reach out to LightBurn community leads
   - Target: 20+ active users

2. **Month 3 (Train ML Model)**
   - Once 5+ users log 20+ cuts each, train XGBoost model
   - Speed prediction accuracy improves from heuristic baseline
   - Target: RMSE < 0.5 mm/min (validated on user data)

3. **Month 4+ (Scale & Monetize)**
   - Wrap in Capacitor for App Store release
   - Introduce freemium pricing ($0 for solo, $5/mo for analytics)
   - Target: 100+ active users, viral coefficient > 1.2

---

## Questions for Decision Makers

Before proceeding, confirm:

1. **Timeline**: Can we ship landing page by Friday, June 21?
2. **Messaging**: Does "Stop keeping parameters in your head" resonate, or should we test alternatives?
3. **Demo video**: Can we record a 30-sec screen capture of `/suggest` by Thursday?
4. **Email list**: Supabase form or Carrd form? (Prefer Supabase for integration)
5. **Rollback**: If no signups by end of Week 1, do we pivot to paid ads, or iterate messaging?

---

## Next Steps (Immediate)

1. **Today (June 17)**: Review this plan. Decide: Go / No-Go / Modify.
2. **By Wednesday (June 19)**: Landing page deployed. Demo video recorded. DMs sent to 6 power users.
3. **By Sunday (June 23)**: Week 1 checkpoint. Review signups + DM replies + engagement.
4. **June 24-30 (Week 2)**: Deep-dive follow-ups + iterate messaging.
5. **July 1-7 (Week 3)**: Compile case studies + plan scale-up.
