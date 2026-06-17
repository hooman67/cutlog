# CutLog Launch Checklist: Week 1 (June 17-23)

**Created**: 2026-06-17  
**Status**: Ready to execute  
**Target completion**: June 23, 2026

---

## Overview

This is the 5-step execution checklist for **Week 1 of the Hybrid Launch** (Option C). Each step has a clear owner, deadline, and rollback plan.

**Success criteria**: All 5 steps complete by end of Week 1. If any step is not complete by deadline, execute rollback plan immediately and escalate.

---

## Step 1: Landing Page Built and Deployed

**Objective**: Public-facing landing page live on the web. Visitors understand the value prop and can sign up for waitlist in <1 min.

**Owner**: You  
**Deadline**: Friday, June 21, 2026 (EOD)  
**Effort**: 2-3 hours

### Deliverable
A live page at `https://cutlog-two.vercel.app` or custom domain, with:

**Sections**:
1. **Header** (Hero)
   - Headline: "Stop keeping parameters in your head. Let your machine remember."
   - Subheadline: "CutLog predicts laser cutting speeds for YOUR machine using community data + personal history."
   - CTA button: "Join Waitlist" (primary, blue)

2. **Problem Section**
   - 2-3 sentences explaining pain: Every laser machine is different. Speeds vary. Trial and error wastes time.
   - Optional: 1 quote from Facebook validation (e.g., "Every machine is different" — John Stegenga)

3. **Solution Section**
   - How it works: 1 paragraph + visual
     - "Log a cut. CutLog suggests speeds based on your machine's history + 900+ community parameters."
     - "3-button feedback system refines suggestions over time."

4. **Features** (3 bullet points)
   - Per-machine learning (YOUR machine, YOUR data)
   - LightBurn integration (import .clb files, export suggestions)
   - Free to start (no credit card required)

5. **Demo Video** (30 sec, embedded)
   - Screen recording of `/suggest` page showing:
     - Input: "3mm stainless, 40W CO2"
     - Output: "Recommended speed: 4.2 mm/min"
     - Feedback buttons: "Too Slow / Perfect / Too Fast"
   - Audio (optional): "Get personalized speeds in seconds."

6. **Waitlist Form**
   - Email field + "Join Waitlist" button
   - Success message: "Thanks! You'll hear from us when beta opens."
   - Backend: Supabase or Carrd form (if using Carrd)

7. **Footer**
   - Email contact: `cutlog@yourmail.com` (or your email)
   - GitHub link: `https://github.com/hooman67/cutlog`
   - Optional: Social links (LinkedIn, etc.)

### Success Criteria
- [ ] Page is live and publicly accessible (no login required)
- [ ] "Join Waitlist" button works (email captured to database or form service)
- [ ] Demo video plays without errors
- [ ] Page loads in <3 sec on 4G
- [ ] Mobile-responsive (looks good on iPhone)
- [ ] No typos or broken links

### Tools
- **Option A (Preferred)**: Next.js page
  - Create `/app/pages/landing.tsx` or update `/app/pages/index.tsx` to be the landing page
  - Use Tailwind for styling (matches existing CutLog design)
  - Form submission → Supabase `waitlist` table (new table, 2 cols: email, created_at)
  - Deploy: `git push origin main` → Vercel auto-deploys
  - Time: 1-2 hours

- **Option B (Quick fallback)**: Carrd.co
  - Create static page in Carrd ($15/mo or free)
  - Drag-and-drop builder, no coding
  - Embed demo video, email form
  - Time: 30 min

### Rollback Plan
- **If page not live by Friday 5pm**: 
  1. Use Carrd fallback (quick, ready by Saturday morning)
  2. Launch with Carrd URL instead of custom domain
  3. Migrate to Next.js page after Week 1 (not critical path)

---

## Step 2: Demo Video (30 sec) Recorded

**Objective**: 30-second screen recording showing `/suggest` feature in action. Viewers understand value in one watch.

**Owner**: You  
**Deadline**: Thursday, June 20, 2026 (EOD)  
**Effort**: 30 min

### Deliverable
Video file (.mp4 or .webm) showing:

**Scene 1** (10 sec):
- App loads on `/suggest` page
- User enters: Material = "Stainless Steel", Thickness = "3mm"
- Page shows: "Recommended speed: 4.2 mm/min" (big, green text)

**Scene 2** (10 sec):
- Highlight the recommendation details:
  - Power: 40% (suggested)
  - Gas type: O2 (suggested)
  - Confidence: HIGH (3+ data points)
- Show 3-button feedback: "Too Slow / Perfect / Too Fast"

**Scene 3** (10 sec):
- Text overlay or voiceover:
  - "Get personalized speeds in seconds."
  - "Learn from YOUR machine + the community."
  - "Try it free at cutlog.app"

### Success Criteria
- [ ] Video is 25-35 seconds (not too long, not too short)
- [ ] Resolution is 1080p or higher (clear text)
- [ ] No background noise (silent or light background music OK)
- [ ] Exported as .mp4 (most compatible)
- [ ] File size < 20MB (fast to embed on web)

### Tools
- **Mac**: QuickTime Player (built-in)
  1. File → New Screen Recording
  2. Record app at `/suggest` page
  3. Export as .mp4
- **Linux**: SimpleScreenRecorder or ffmpeg
- **Windows**: OBS or built-in Screen Recording app

### Rollback Plan
- **If no time for recording**: Use a static image + text instead
  - Screenshot of `/suggest` page with arrows pointing to key UI elements
  - Add text: "Get personalized laser speeds in seconds"
  - Still works, just less polished

---

## Step 3: Waitlist Form Functional

**Objective**: Visitors can enter email and sign up. Emails are captured and stored.

**Owner**: You  
**Deadline**: Friday, June 21, 2026 (EOD)  
**Effort**: 1-2 hours

### Deliverable
A working email capture system. Two options:

**Option A (Preferred): Supabase Table**
1. Create new table `waitlist`:
   ```sql
   CREATE TABLE waitlist (
     id SERIAL PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
2. Create API route `/api/subscribe` that inserts email into `waitlist` table
3. Form on landing page POSTs to `/api/subscribe`
4. Success response: "Thanks! You're on the waitlist."

**Option B (Quick): Carrd Form**
1. Use Carrd's built-in email form
2. Emails go to your email (auto-captured)
3. Set up forwarding or export manually

### Success Criteria
- [ ] Form accepts email input
- [ ] Clicking "Join Waitlist" button works (no errors)
- [ ] Success message appears (e.g., "Thanks! Check your inbox.")
- [ ] Email is actually saved somewhere (you can see it later)
- [ ] Form prevents duplicate emails (error: "Already signed up")
- [ ] No sensitive data exposed (no API keys in frontend)

### Implementation (Supabase)
```javascript
// /app/pages/api/subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }]);
    
    if (error) {
      if (error.message.includes('duplicate')) {
        return res.status(409).json({ error: 'Already signed up' });
      }
      throw error;
    }
    
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
```

### Rollback Plan
- **If Supabase setup too complex**: Use simple email forwarding
  - Form submits via `mailto:` link (basic, but works)
  - Or use Formspree.io (free form backend, emails go to your inbox)

---

## Step 4: Facebook Posts Drafted and Scheduled

**Objective**: 3 Facebook posts ready to post to laser cutting groups. Designed to attract visitors to landing page and warm up power users.

**Owner**: You  
**Deadline**: Thursday, June 20, 2026 (EOD)  
**Effort**: 1 hour

### Deliverable
3 posts, each ~100-150 words, designed for different groups/timing:

**Post 1 (Informational)** — Post in "Laser Cutting Enthusiasts" group
```
Title: We built something for laser operators (looking for feedback)

Ever wish you didn't have to trial-and-error every time you change materials?

A few of us are working on a tool called CutLog that learns YOUR machine's cutting parameters.

How it works:
1. Log a cut (30 seconds)
2. CutLog suggests speeds based on your machine + 900+ community parameters
3. Tell us if it's right, and it gets smarter

It's free to try. We're looking for operators willing to test it and give feedback.

Anyone interested?

[Link to landing page]
```

**Post 2 (Educational)** — Post in "CO2 Laser Users" group (Day 2-3)
```
Title: Question: Why does everyone's machine cut at different speeds?

I'm curious about something. When I ask 3 different laser shops "what speed for 3mm stainless?", I get 3 different answers:

- Shop A: 4 mm/min
- Shop B: 5 mm/min
- Shop C: 3.5 mm/min

They're all right. Because every machine is different.

Resonator age, alignment, gas type, environment... it all affects speed.

The way most operators handle it: trial and error. But what if your machine could remember its own patterns?

That's what we're exploring with a tool called CutLog. Would love to hear if this resonates with anyone.

[Link]
```

**Post 3 (Value Prop)** — Post in "LightBurn Community" group (Day 4-5)
```
Title: How much time do you waste testing parameters?

Just curious: for each new material or thickness you cut, how long does it usually take you to dial in the right speed?

For most of us: 15 minutes to 2 hours.

We built a tool that cuts that down. It's called CutLog. It's free to try.

You log cuts, it learns YOUR machine, and suggests speeds next time.

Integrates with LightBurn .clb files (you can export your parameter library and load it).

Early testers wanted us to share it. So here we are.

Anyone want to try it?

[Link]
```

### Success Criteria
- [ ] 3 posts written (no typos)
- [ ] Each post has clear CTA (link to landing page)
- [ ] Posts are NOT salesy (read like genuine questions or updates, not ads)
- [ ] Posts mention pain points (trial and error, time waste, machine differences)
- [ ] Posts are formatted for readability (short paragraphs, not wall of text)
- [ ] Links are working (check before posting)

### Posting Strategy
- **Post 1**: Monday or Tuesday (June 17-18) in first group
- **Post 2**: Wednesday (June 19) in second group (different audience)
- **Post 3**: Thursday-Friday (June 20-21) in third group
- **Spacing**: 1-2 posts per day (don't spam, don't look desperate)
- **Monitor**: Check for comments, reply to questions same day

### Rollback Plan
- **If posts get flagged**: Posts are generic enough to be allowed. If not:
  1. Focus on DMs instead (power users only)
  2. Pause group posts, shift to Reddit or other channels
  3. Don't fight platform rules

---

## Step 5: Email Templates Ready

**Objective**: 3 email templates drafted and ready to send. Send to waitlist as they sign up.

**Owner**: You  
**Deadline**: Friday, June 21, 2026 (EOD)  
**Effort**: 30 min

### Deliverable
3 email templates (plain text or HTML):

**Template 1: Welcome Email** (send immediately upon signup)
```
Subject: Welcome to CutLog waitlist! 👋

Hi [Name or Friend],

Thanks for joining the CutLog waitlist!

Here's what we're building:
CutLog is a tool that learns YOUR laser machine's cutting parameters. Instead of guessing or trial-and-error, you get personalized speed recommendations based on your machine + community data.

Why it matters:
- Every machine is different. Your machine has unique characteristics that standard guides miss.
- We're building a system that learns from your cuts and gets smarter over time.

What's next:
Beta opens in early July. You'll be first to try it.

In the meantime, check out the app (link below) — it's live and free to play with.

Questions? Reply to this email.

CutLog Team

[App link: https://cutlog-two.vercel.app]
[GitHub: https://github.com/hooman67/cutlog]
```

**Template 2: Beta Invite Email** (send Week 2, when ready for testers)
```
Subject: You're in! Beta access to CutLog

Hi [Name],

You're invited to beta test CutLog!

Here's how it works:
1. Go to https://cutlog-two.vercel.app
2. Sign up with your email (takes 30 sec)
3. Set up your machine info (brand, model, power — 1 min)
4. Log your first cut or import a .clb file from LightBurn
5. Get a speed recommendation for your next job

What we need from you:
- Try it with a real cut (not just browsing)
- Tell us: Did the recommendation make sense?
- Any bugs? UI confusing? Let us know.

Your feedback directly shapes what we build next.

Reply to this email with questions or feedback.

CutLog Team

[App link: https://cutlog-two.vercel.app]
```

**Template 3: Feedback Request Email** (send Week 2-3, after user has tried app)
```
Subject: Quick question: How's CutLog working for you?

Hi [Name],

We saw you tried CutLog. Would love your feedback!

Quick questions:
1. Did you understand what to do on first visit? (yes/no/confusing)
2. Did the speed recommendation make sense? (yes/close/way off)
3. Would you use this regularly? (yes/maybe/no)
4. What would make it better?

Honest feedback (even if critical) helps us build something real.

Reply here, or jump on a 15-min Zoom if you want to chat.

Thanks for testing,
CutLog Team

[Calendar link if desired]
```

### Success Criteria
- [ ] 3 emails drafted (complete, not skeleton)
- [ ] Each email has clear subject line
- [ ] Links are included and tested
- [ ] Tone is friendly and honest (not overly salesy)
- [ ] No typos
- [ ] Stored in a document (shared sheet, Notion, or email templates in Supabase)

### Implementation
**Option A**: Store in Google Docs or Notion (manual sending, OK for <100 signups)
**Option B**: Store in Supabase table `email_templates` and send via API (more scalable)
**Option C**: Use Mailgun or SendGrid (but adds cost, not needed yet)

### Rollback Plan
- **If time is short**: Write 1 email (Welcome) only. Send manually. Other 2 can follow later.

---

## Daily Execution Tracker (Week 1)

### Monday, June 17
- [ ] Read this checklist
- [ ] Decide: Next.js landing page or Carrd?
- [ ] Start demo video planning (which parts of app to show?)
- Deadline: By EOD, start on landing page

### Tuesday, June 18
- [ ] Landing page layout drafted or built (50%)
- [ ] Demo video recorded or planned (script written)
- [ ] 3 Facebook posts drafted (email templates optional)
- Deadline: By EOD, landing page is 75% done

### Wednesday, June 19
- [ ] Landing page nearly done (design + copy + demo video embedded)
- [ ] Demo video completed (exported .mp4)
- [ ] 3 Facebook posts final (ready to post)
- [ ] Supabase waitlist table created (if using Option A)
- [ ] 6 DMs to power users sent (Nate, Mike, Sean, Jeremy, Tinker, Lobo) 
- **Checkpoint**: Landing page ready to go live tomorrow

### Thursday, June 20
- [ ] Landing page deployed (LIVE)
- [ ] Supabase form tested (email submission works)
- [ ] 3 Facebook posts posted or scheduled
- [ ] Email templates drafted
- [ ] Monitor: Any signups? Any DM replies?

### Friday, June 21
- [ ] Verify landing page still live
- [ ] Check waitlist (how many signups?)
- [ ] Check DM replies (2+ responded? 0? investigate)
- [ ] Send Welcome email to first batch of signups
- **End of Week 1**: All 5 steps complete ✅

---

## Troubleshooting / FAQ

### Q: What if I run out of time?
**A**: Prioritize in this order:
1. Landing page (MUST have)
2. Demo video (NICE to have, can replace with screenshot)
3. Waitlist form (MUST have)
4. Facebook posts (CAN DO later)
5. Email templates (CAN DRAFT later, send manually)

### Q: What if landing page gets no signups by Friday?
**A**: 
1. Check: Did Facebook posts go out? (If no, post them)
2. Check: Did DMs go to power users? (If no, send them)
3. Check: Is landing page messaging clear? Ask a friend to read it. Does value prop make sense?
4. If messaging seems wrong: iterate headline/copy on Saturday, re-post Sunday
5. If DMs + posts were sent but zero signups: OK, that's data. Move to Week 2 (deep dives might convert better than random signups)

### Q: Can I use Carrd instead of Next.js?
**A**: Yes! Carrd is faster to build ($15/mo or free tier). Trade-off: Less integrated with CutLog app, but fine for MVP landing page.

### Q: Should I post in Facebook groups or just DM?
**A**: Both. DMs to power users are personal (higher response rate). Group posts build credibility (many people see it, some will click even if they don't comment). Do both.

### Q: What if a power user doesn't reply?
**A**: Normal. 50% reply rate is good. If 2+ don't reply by Day 5, send 1 follow-up (not desperate, just "Did this work for you?"). If still no reply, move on.

### Q: What if the video is boring / people don't watch it?
**A**: That's OK for Week 1. Video is a nice-to-have. The landing page + sign-up form are must-haves. Iterate video in Week 2 if needed.

---

## Definition of "Done" (Week 1 Complete)

All 5 steps are complete when:

1. ✅ **Landing page**: Live, publicly accessible, no errors
2. ✅ **Demo video**: 30 sec, embedded on landing page (or screenshot fallback)
3. ✅ **Waitlist form**: Works, captures emails, user sees success message
4. ✅ **Facebook posts**: Posted to 3 groups, visible, getting engagement or at least no errors
5. ✅ **Email templates**: 3 templates written, stored, ready to send

**Stretch goal**: 30+ waitlist signups, 2+ DM replies, 1+ power user trying app by end of Week 1

**Minimum bar**: All 5 steps done, landing page live, form working. Signups can be 0 (you'll investigate + iterate Week 2)

---

## Owners & Escalation

All steps owned by: **You**

If blocked:
- Landing page build: Ask for code review or help from engineering
- Demo video: Use screenshot fallback or record manually
- Waitlist form: Use Carrd or Formspree fallback
- Facebook posting: Shift to DMs only if groups are problematic
- Email templates: Ask friend for feedback on copy

---

## After Week 1: What to Monitor

- **Landing page traffic**: Check Vercel analytics daily
- **Waitlist growth**: Check Supabase `waitlist` table for new emails
- **DM replies**: Check Facebook DMs for responses from 6 power users
- **Facebook group feedback**: Check for comments, replies, questions on posts
- **App usage**: Check Vercel logs for `/suggest` page visits from new users

**Goal for Week 2**: Compile data (X signups, Y DMs replied, Z people tried app) and decide: keep momentum or iterate?
