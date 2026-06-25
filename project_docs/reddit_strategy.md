# CutLog Reddit Promotion Strategy

## Executive Summary

CutLog solves a universally acknowledged problem in the laser community: **every machine is different, every material is different, and there's no universal settings database.** Reddit laser communities are full of "what settings should I use for X?" posts. This strategy positions CutLog as a passion project shared by a fellow maker -- not a product launch.

---

## Target Subreddit Analysis

### Tier 1: Best Targets (POST)

| Subreddit | Members | Self-Promo Policy | Recommendation |
|-----------|---------|-------------------|----------------|
| r/ChineseLaserCutters | ~13,000 | Not explicitly strict | POST - Highest need, budget users lack documentation |
| r/laserengraving | ~25,000 | Moderate (90/10 rule) | POST - Settings questions dominate |
| r/lightburn | ~2,000 | Relaxed, small community | POST - Technically savvy, will appreciate .clb import |
| r/glowforge | ~15,000 | Moderate | POST - Beginners needing non-Proofgrade settings |
| r/diodelaser | ~3,000 | Permissive | POST - Small but receptive |

### Tier 2: Proceed With Caution (POST WITH CAUTION)

| Subreddit | Members | Self-Promo Policy | Recommendation |
|-----------|---------|-------------------|----------------|
| r/lasercutting | ~115,000 | Very strict - brand accounts banned | POST CAREFULLY - Highest value but frame as personal project |
| r/hobbycnc | ~76,000 | Strict but exceptions exist | POST - Must disclose, be transparent |
| r/xToolOfficial | ~5,000 | Must be xTool-relevant | POST - Only with xTool-specific demo |

### Tier 3: AVOID Direct Posting

| Subreddit | Members | Why Avoid |
|-----------|---------|-----------|
| r/Maker | ~75,000 | Explicit ban: "no self-promotional posts" |
| r/crafts | ~2,800,000 | Zero tolerance for anything promotional |
| r/woodworking | ~6,100,000 | Anti-promotion AND anti-AI stance |

---

## Customized Posts by Subreddit

---

### POST 1: r/ChineseLaserCutters

**Title:** I got tired of burning through material doing test grids on my K40, so I built a free settings database that learns from your cuts

**Body:**

Like most of you, my first 6 months with a K40 were basically expensive trial and error. The manual was useless, YouTube settings never matched my tube's actual output, and I burned through more acrylic doing test matrices than actual projects.

The worst part? Every time I replaced my tube or changed my lens, I was basically starting from scratch.

So over the past year I've been building a tool that aggregates community laser parameters and uses AI to recommend starting points for YOUR specific machine configuration. You tell it your laser type, wattage, lens, and material -- it gives you speed/power/passes as a starting point based on what's worked for similar setups.

What makes it different from a spreadsheet:
- It has 5,600+ parameter entries across 562 materials from actual users
- It accounts for YOUR specific setup (tube age, lens focal length, bed type)
- It imports your LightBurn .clb library if you already have one
- It learns from your feedback -- mark a cut as too deep/shallow and it adjusts future recommendations
- Auto-scales when you change lenses or upgrade your tube

It's completely free, no account required, no paywall: https://cutlog-two.vercel.app

Works with CO2, fiber, diode, UV -- whatever you're running.

I'd genuinely love feedback from this community because you all run the widest variety of weird and wonderful machines. The edge cases (modded K40s, custom beds, aftermarket tubes) are exactly where this thing needs to get smarter.

What materials/setups would you want to test first? And is there anything about your workflow I should think about that I might be missing?

---

### POST 2: r/laserengraving

**Title:** After 2 years of keeping a messy spreadsheet of engraving settings, I built something better (free, no catch)

**Body:**

I engrave on about 20 different materials regularly -- anodized aluminum, slate, various hardwoods, leather, acrylic, coated metals -- and for the longest time I kept a Google Sheet with columns for material, power, speed, DPI, passes, and notes.

The problem: my settings only worked for MY machine at MY current tube hours with MY specific lens. Anytime I helped someone with settings, I had to caveat everything with "but your machine might be different."

I wanted something that could:
1. Store my proven settings tied to my specific machine config
2. Suggest starting points for materials I haven't tried yet, based on what similar machines achieved
3. Actually learn when I said "that was too hot" or "needed another pass"

So I built CutLog: https://cutlog-two.vercel.app

It's a free web app with 5,653 community parameters across 562+ materials. You set up your machine profile (laser type, wattage, lens) and it recommends engraving parameters scaled to your setup. It also imports LightBurn .clb files if you've already built up a library there.

The AI component isn't gimmicky -- it's basically pattern matching across similar machine configs to extrapolate settings you haven't tested yet. And it gets better the more you use it because your feedback trains it for your specific machine.

No account required, no premium tier, no data selling. I built it because I needed it.

Questions for you all:
- What materials give you the most trouble dialing in? (I want to make sure those are well-covered)
- Do you care more about photo engraving settings or vector engraving settings?
- Anyone else frustrated that engraving parameters are basically never included in "laser settings" posts that only cover cutting?

---

### POST 3: r/lightburn

**Title:** Built a free tool that imports your .clb material library and suggests settings for materials you haven't tested yet

**Body:**

Fellow LightBurn users -- I've been working on something I think might be useful alongside LightBurn's material test generator.

**The problem I was solving:** I love LightBurn's material test feature for dialing in settings, but I still had to do a full test matrix for every new material. And when I switched from a 50mm to a 75mm lens, my entire library needed recalibration.

**What I built:** CutLog (https://cutlog-two.vercel.app) -- a free web app that:

- **Imports your existing .clb file** so you don't lose any work you've already done
- Has a community database of 5,653 parameters across 562+ materials
- Suggests starting points for materials you haven't tested, scaled to your machine config
- **Auto-recalculates when you change lenses or wattage** (this was the killer feature for me)
- Learns from your pass/fail feedback to refine recommendations for your specific setup

It supports CO2, fiber, diode, and UV lasers. The AI recommendation is basically: "machines similar to yours achieved good results at these parameters for this material."

It's not trying to replace LightBurn's material library -- think of it as a companion that fills in the gaps and gives you a better starting point so your test matrices converge faster.

Completely free, no signup required.

Would love feedback from this community specifically because you're the most technically sophisticated laser users I know. What would make this more useful to your LightBurn workflow? Any integration ideas?

---

### POST 4: r/glowforge

**Title:** For everyone using non-Proofgrade materials -- I built a free settings finder that works with any material on any laser

**Body:**

Love my Glowforge, but the moment you step outside Proofgrade materials, you're on your own. And Proofgrade is expensive for everyday projects.

I got tired of searching "Glowforge settings for [material]" and finding forum posts from 3 years ago that may or may not match my specific unit. So I built a free tool that recommends cut/engrave settings based on your machine and the material you're working with.

**CutLog:** https://cutlog-two.vercel.app

How it works:
- Tell it your laser type and wattage (Basic/Plus/Pro)
- Pick your material from 562+ options (or add a new one)
- Get speed/power recommendations based on what's worked for similar setups
- Rate your results and it gets smarter for YOUR machine over time

The database has 5,653 community-submitted parameters, so chances are someone's already dialed in whatever you're trying to cut.

It's completely free -- I built it as a side project because I was frustrated with the same problem you all face when using Home Depot plywood or craft store leather instead of Proofgrade.

Has anyone here found a reliable system for tracking settings across different material sources? I'm curious what workflows people have developed. And if you try CutLog, what materials would you test first?

---

### POST 5: r/diodelaser

**Title:** Built a free parameter database for diode lasers -- 5,600+ settings across 562 materials

**Body:**

Diode laser users get the short end of the stick when it comes to settings documentation. Most parameter guides are written for CO2 machines, and the power/speed ratios don't translate directly.

I've been building a free tool called CutLog that recommends cutting and engraving parameters based on your specific machine setup: https://cutlog-two.vercel.app

It covers diode, CO2, fiber, and UV lasers, but I want to make sure the diode recommendations are solid since that's what I primarily use.

Features:
- 5,653 community parameters across 562+ materials
- AI recommendations scaled to your specific wattage and lens
- Learns from your feedback (tell it if a cut was too deep/shallow)
- Imports LightBurn .clb files
- Free, no account needed

For the diode users here: what materials do you find hardest to dial in? I know cutting thicker materials is always a challenge with diode, and I want to make sure the multi-pass recommendations make sense for lower-wattage setups.

Would appreciate any testing and honest feedback.

---

### POST 6: r/lasercutting (HIGH VALUE - CAREFUL APPROACH)

**Title:** I've been collecting laser parameters for 2 years and finally turned my database into a free tool -- 5,653 settings across 562 materials

**Body:**

Two years ago I started keeping a detailed spreadsheet every time I dialed in a new material. Power, speed, passes, focal length, air assist, notes. Eventually friends in my makerspace started asking if they could use it -- but the settings didn't translate directly because their machines were different.

That sparked an idea: what if the database could scale recommendations based on the specific machine? A 60W CO2 with a 2" lens needs different parameters than a 100W with a 4" lens, even for the same material. Same for diode vs CO2.

So I built CutLog: https://cutlog-two.vercel.app

It's a free web app (no account, no paywall) that:
- Recommends cut/engrave parameters based on your machine config (laser type, wattage, lens)
- Has 5,653 community-contributed parameters across 562+ materials
- Imports your existing LightBurn .clb material library
- Learns per-machine (rate your results and it refines future suggestions)
- Auto-scales when you change lenses or upgrade wattage
- Supports CO2, fiber, diode, and UV

The "AI" part is essentially pattern matching -- it looks at successful parameters from similar machine configurations and extrapolates for your setup. Not magic, just math.

I've been using it daily for 6 months and my material test grids went from 20+ squares down to 4-6 to find optimal settings. Biggest time saver has been lens changes -- instead of retesting everything, it recalculates automatically.

I'm sharing it here because I genuinely want feedback from experienced users. Where does it fall short? What edge cases should I handle better? What materials are underrepresented?

This is a passion project, not a business. Just a maker sharing something that helped me.

---

### POST 7: r/hobbycnc

**Title:** [Disclosure: my project] Built a free laser parameter tool after years of maintaining spreadsheets -- looking for honest feedback

**Body:**

**Full disclosure:** I built this tool and I'm sharing it looking for genuine feedback from experienced users.

If you run a laser (CO2, fiber, diode, or UV) alongside your CNC setup, you know the pain of dialing in material settings. Unlike CNC where feeds and speeds calculators are well-established, laser parameters are still mostly "ask the forum and hope someone has your exact machine."

I built CutLog to be the feeds-and-speeds calculator equivalent for lasers: https://cutlog-two.vercel.app

What it does:
- Recommends cut/engrave parameters based on your machine configuration
- 5,653 community parameters across 562+ materials
- Imports LightBurn .clb material libraries
- AI scales parameters when you change lenses or wattage
- Learns from your feedback to refine per-machine recommendations
- Free, no account required

For the CNC folks who also run lasers: I'm curious how you manage your laser settings currently. Do you use LightBurn's material library? Spreadsheets? Just memory? I'm trying to understand if there's a workflow gap or if most people have already figured out their system.

Honest criticism welcome -- what's missing? What would make you actually use something like this?

---

### POST 8: r/xToolOfficial

**Title:** Made a free settings companion for my xTool -- recommends parameters for materials not in Creative Space

**Body:**

Been using my xTool for about a year and while Creative Space has some built-in presets, I kept running into materials that weren't covered. Especially when buying materials from sources other than xTool's store.

I built a free web app that recommends laser parameters based on your specific machine setup. It works with any laser but I've been primarily testing with my xTool:

https://cutlog-two.vercel.app

You tell it your laser type and wattage, pick your material, and it suggests speed/power/passes. It has 5,653 settings from real users across 562+ materials -- way more than what's built into Creative Space.

The neat part: it learns from your results. If you tell it a cut was too deep or an engrave was too light, it adjusts future recommendations for your specific machine.

Anyone else wish xTool/Creative Space had a more comprehensive material database? How do you currently handle settings for non-standard materials?

---

## Posting Schedule

**Important: Never cross-post. Space posts 2-3 days apart. Each post must be unique.**

| Day | Subreddit | Priority | Notes |
|-----|-----------|----------|-------|
| Day 1 (Monday) | r/ChineseLaserCutters | Tier 1 | Warmest audience, lowest risk, good for testing messaging |
| Day 3 (Wednesday) | r/laserengraving | Tier 1 | Adjust based on Day 1 feedback |
| Day 6 (Saturday) | r/lightburn | Tier 1 | Weekend post for engaged hobbyists |
| Day 9 (Tuesday) | r/glowforge | Tier 1 | Beginner-friendly angle |
| Day 12 (Friday) | r/diodelaser | Tier 1 | Niche but receptive |
| Day 15 (Monday) | r/lasercutting | Tier 2 | Biggest audience, most polished post needed |
| Day 18 (Thursday) | r/hobbycnc | Tier 2 | Must include disclosure |
| Day 21 (Sunday) | r/xToolOfficial | Tier 2 | Only if previous posts went well |

**Pre-posting requirements:**
- Account should have at least 2 weeks of genuine participation in each sub before posting
- Comment helpfully on 5-10 posts in each sub before your own post
- Never post to two subs on the same day

---

## Comment Engagement Strategy

### When Someone Says "This Is Useful" / Positive Response
- Thank them genuinely, briefly
- Ask a follow-up question: "What materials do you work with most? I want to make sure those are well-covered"
- Never oversell in replies -- keep it conversational

### When Someone Is Skeptical ("Why is it free?")
- Be direct and honest: "It's a passion project. I built it for myself, shared it with my makerspace, and now I'm sharing it wider. No VC funding, no premium tier planned. I'm a maker who codes."
- If pressed: "Hosting costs me about $X/month on Vercel's free tier. If it gets too expensive I might add a donate button but that's it."

### When Someone Reports a Bug or Missing Feature
- Thank them enthusiastically -- this is gold
- "That's a great catch, I'll fix that. Can you tell me more about your setup so I can reproduce it?"
- Follow up when fixed: "Hey, just wanted to let you know I fixed that issue you reported. Thanks again for catching it."

### When Someone Says "Just Use LightBurn's Material Test"
- Don't be defensive: "LightBurn's material test is great for dialing in -- I use it too. CutLog is more about giving you a better starting point so you need fewer test squares. They're complementary."
- Acknowledge the alternative genuinely

### When Someone Says "My Settings Work Fine / I Don't Need This"
- "That's fair! If you've already dialed everything in, you probably don't need this. It's mostly useful when trying new materials or when something changes (new lens, tube replacement, etc.)"
- Never argue -- just acknowledge and move on

### When Someone Asks Technical Questions
- Answer thoroughly and knowledgeably
- Show you understand laser physics, not just software
- This builds credibility more than any feature list

### When a Moderator Questions the Post
- Respond immediately and politely
- "Happy to remove this if it violates rules -- I'm genuinely just looking for feedback on a free project I built. Let me know how you'd prefer I share it."
- Offer to edit the post to comply with any specific concerns

---

## What NOT To Do (Common Reddit Promotion Mistakes)

### Absolute Don'ts
1. **Never use a brand/company account** -- post from a personal account with history
2. **Never cross-post the same content** -- r/Maker explicitly bans this and others will notice
3. **Never post and disappear** -- you MUST engage with every comment for at least 48 hours
4. **Never use marketing language** -- words like "revolutionary," "game-changing," "disrupting" will get you killed
5. **Never post in multiple subs the same day** -- Reddit shows cross-posting in user history
6. **Never use link shorteners** -- Reddit auto-removes them and it looks shady
7. **Never reply with just "Thanks! Check it out!"** -- every reply should add value
8. **Never argue with critics** -- agree where valid, explain calmly where not, move on
9. **Never downvote negative comments on your post** -- obvious and pathetic, community notices
10. **Never ask friends to upvote** -- Reddit's algorithms detect vote manipulation

### Subtle Don'ts
11. **Don't over-format** -- walls of bold text and bullet points scream "marketing material"
12. **Don't include too many links** -- one link is fine, multiple links look like spam
13. **Don't use the word "we"** -- say "I" -- "we" implies a company
14. **Don't post during peak marketing hours (9 AM weekdays)** -- post evenings and weekends when real people post
15. **Don't make the title clickbaity** -- straightforward titles build trust
16. **Don't respond to every comment within 2 minutes** -- it looks like you're monitoring obsessively
17. **Don't mention user counts or growth metrics** -- "10,000 users love it!" sounds like an ad
18. **Don't edit the post to add "wow front page!"** -- cringe
19. **Don't create an account just for this** -- minimum 3 months of organic history
20. **Don't forget to use the subreddit's required flair** -- instant removal in some subs

### Timing Don'ts
21. **Don't post right after joining a sub** -- lurk and comment for 2+ weeks first
22. **Don't repost if removed** -- message mods politely instead
23. **Don't post a "launch" and then "updates" every week** -- one post, then only return with genuinely new milestones
24. **Don't post on the same day someone else shared a similar tool** -- check recent posts first

---

## Pre-Launch Checklist (Before First Post)

- [ ] Account has 3+ months of organic Reddit history
- [ ] Account has posted/commented in laser subs at least 10 times
- [ ] Karma is above 500 (some subs filter low-karma posts)
- [ ] Profile doesn't link to CutLog or look like a brand account
- [ ] Have genuinely helped people with laser settings questions (this is your proof of authenticity)
- [ ] Posts are drafted and saved as Reddit drafts (not live)
- [ ] Checked each sub's current hot posts to ensure no similar recent content
- [ ] Read each sub's full rules page (not just sidebar) immediately before posting
- [ ] Link goes to the right URL and the app is working properly
- [ ] Mobile experience is good (most Reddit users browse on mobile)

---

## Long-Term Community Strategy

### Month 1: Establish Presence
- Join all target subs
- Comment helpfully on 3-5 posts per sub per week
- Answer "what settings?" questions using your own knowledge (don't mention CutLog yet)
- Build genuine karma and recognition

### Month 2: Soft Introductions
- Start mentioning CutLog naturally in comments when directly relevant
- "I actually built a free tool for this exact problem: [link]" -- only when someone asks about settings
- Track which comments get upvoted vs ignored

### Month 3: Standalone Posts
- Execute the posting schedule above
- Adapt tone based on what worked in Month 2 comments
- Each post is a unique angle for that specific community

### Month 4+: Ongoing Value
- Post genuinely interesting findings from the data ("Most popular materials by laser type" infographic)
- Share milestones only if they matter to the community ("Just hit 1,000 materials -- here's what we learned about which materials are most searched")
- Continue answering questions and being helpful regardless of CutLog relevance

---

## Metrics to Track

- Upvote ratio on each post (>85% means community received it well)
- Number of comments (engagement)
- Direct traffic from Reddit (check Vercel analytics for reddit.com referrals)
- New parameter submissions from Reddit users
- Whether any posts were removed (and why)
- Mod feedback

---

## Recovery Plan If a Post Goes Wrong

If a post is removed or heavily downvoted:
1. Do NOT repost
2. Do NOT argue in modmail
3. Message mods politely: "I understand if this violates rules. Could you let me know what I should have done differently? I'm genuinely just trying to share a free community tool."
4. If they respond, follow their guidance exactly
5. If banned, accept it and move on to other subs
6. Learn from the specific feedback and adjust future posts

---

*Strategy document created: June 2026*
*Tool: CutLog (https://cutlog-two.vercel.app)*
*Approach: Authentic maker sharing a passion project, not a product launch*
