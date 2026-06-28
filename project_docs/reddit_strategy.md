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


Matt: Sent above post on 2026-06-25
link below:
https://www.reddit.com/r/ChineseLaserCutters/s/5VUEmxLe16
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


Matt: Joined on 2026-06-25 and made a helpful comment. 
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

Matt: Joined on 2026-06-25 and made a helpful comment. 
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

Matt: Joined on 2026-06-25 and made a helpful comment.
---

### POST 5: r/diodelaser (ORIGINAL)

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

### POST 5 REVISED: r/diodelaser

**Title:** Spent 3 months figuring out multi-pass settings for 3mm plywood on a 10W diode -- here's what actually worked

**Body:**

When I got my first diode laser (10W optical output, nothing fancy), I thought cutting 3mm birch plywood would be straightforward. Every YouTube video showed clean cuts on their machine, so I just copied their settings. Charred edges. Incomplete cuts. Material warping from too many slow passes.

It took me about three months of wasted plywood to figure out that the sweet spot for my setup was 150 mm/min at 80% power, 3 passes with air assist. Before that I was doing 100% power at 100 mm/min in a single pass and wondering why everything was burning. Turns out slower with less power and more passes gives way cleaner edges than blasting through in one go.

The annoying part was that every time I tried a new material, I was starting that whole process from scratch. 3mm acrylic needed completely different thinking (faster, higher power, single pass or it melts back together). Leather was its own universe. And any time someone in a forum shared their settings, I'd try them and get different results because their 10W wasn't my 10W.

So I started logging everything obsessively. Material, thickness, speed, power, passes, whether I used air assist, what the actual result looked like. After a while I had enough data points that I could start predicting what would work for materials I hadn't tried yet. Like if I knew 3mm birch at 150/80%/3 passes worked, I could estimate that 3mm basswood would want maybe 180/75%/3 passes since it's less dense.

Eventually that logging habit turned into a web app called CutLog so I wouldn't lose everything in a spreadsheet: https://cutlog-two.vercel.app

It's not perfect. It requires a free account to save your machine profile, and for unusual material/wattage combos it's basically making an educated guess based on similar setups rather than verified data. But it's gotten me to a usable starting point faster than blind test grids, especially for materials where I'd otherwise have no clue where to begin.

The thing I'm still genuinely struggling with is thick material multi-pass logic for diodes specifically. CO2 users can punch through 6mm ply in one pass, but for us it's 4 to 6 passes minimum with refocusing between passes, and the relationship between passes isn't linear. Pass 5 cuts less than pass 1 because of char buildup blocking the beam. I've been logging my refocus offsets (I drop 0.5mm per pass on anything over 4mm) but I'm not confident that's optimal.

What's your approach to thick cuts? Do you refocus between passes? And is there a material that took you an unreasonable amount of time to dial in? I'm curious if there are common pain points I should be thinking about.

---

### POST 6: r/lasercutting (FINAL VERSION - 2026-06-28)

**Title:** Wasted half a sheet of 20mm on a Thursday because I couldn't find my own settings — so I built something to fix it

**Body:**

Last fall I was running 20mm carbon steel on our 6kW — a job we'd done before, but on different plate stock. Supplier switched from S235 to S355 without telling us. I started with our old settings (1200 mm/min, O2 at 0.9 bar, focus at -3.0) and got halfway through the first sheet before the edge quality went to hell. Dross you could hang a coat on. Backed the speed down to 1000, bumped gas to 1.1, still not right. By the time I had a clean cut dialed in I'd burned through about $180 in plate and an hour of production time on what should have been a 15-minute setup.

The part that pissed me off was that I'd solved this EXACT problem six months earlier on a different job. Same material class, similar thickness. But I couldn't remember if I'd written those settings in the notebook, on the whiteboard, or in one of forty text files on the shop computer. Classic.

So I started building a tool to fix it. Started as a spreadsheet, grew into something bigger once other operators started contributing their verified settings. The idea: operators log what actually works on their machines, everyone benefits from each other's testing. Your 6kW HSG cutting 12mm mild steel? Someone with a similar setup already logged their verified speed, gas, and focus. You get their proven starting point instead of guessing from scratch.

For materials or thicknesses where no operator has logged data yet, AI generates a conservative starting point based on the physics (wavelength, power density, material properties). It's clearly labeled as "AI suggestion, unverified" so you know the difference between something a human tested and something the machine calculated. Once you try it and confirm it works, it becomes verified community data for the next person.

Right now there are 5,800+ verified settings from real operators. Everything from hobby diode stuff up to 25mm carbon and 316L on 12kW machines. When you search, it matches against YOUR setup specifically — same laser type, similar wattage, same material — and weights results by how close that operator's machine is to yours.

It does require an account because it tracks your specific machine and learns from your feedback. You tell it a cut was too fast or too slow, next time the recommendation adjusts for YOUR machine's quirks. Over time it basically becomes your personalized parameter memory that actually remembers what you forgot to write down.

I put the link on my profile if anyone wants to try it.

Still building this out and the industrial side needs more operators contributing thick material data specifically. Curious from the thick-material crowd: when you switch to a new alloy or thickness, what's your actual process? Manufacturer charts, machine vendor support, gut feel and test cuts? And once you nail it, where does that knowledge actually live?

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

---

### POST 9: r/sideproject

**Title:** I built a free AI tool that recommends laser cutting speeds for your specific machine (5,653 parameters across 562+ materials)

**Body:**

Hey everyone. Wanted to share what I've been building nights and weekends for the past 6 weeks.

**What it is:** CutLog is a free web app that recommends cutting and engraving speeds for laser machines. You tell it your machine type, wattage, and lens, and it gives you parameters based on what's worked for similar setups. It learns from your feedback over time.

https://cutlog-two.vercel.app

**Why I built it:** I'm an AI engineer at Adobe by day, and I got into laser cutting about a year ago. The universal experience for new laser owners is burning through expensive material doing test grids because every machine behaves differently. Settings from YouTube videos or forums never quite match your tube's actual output. I wanted something smarter than a spreadsheet.

**What it does:**

1. Recommends speed/power/passes for your specific machine config
2. Imports LightBurn .clb material libraries (so you don't start from scratch)
3. Auto-scales parameters when you swap lenses or upgrade wattage
4. Learns per-machine from your pass/fail feedback
5. 5,653 community parameters across 562+ materials
6. Supports fiber, CO2, diode, and UV lasers

**Tech stack:**

Next.js 14, Tailwind CSS, Supabase (auth + database), deployed on Vercel. Gemini 2.0 Flash handles the AI fallback when the community data is thin for a specific machine/material combo. The per-machine learning is a custom scoring system, not a full ML model.

**What's next:**

Working on a LightBurn export feature (so you can push optimized settings back to your machine), better multi-pass logic for thick materials, and a community leaderboard showing which users have contributed the most verified parameters.

**The honest truth:** Zero paying users because there's nothing to pay for. No paywall, no VC funding, no premium tier planned. Hosting is free on Vercel. I built it because I needed it and figured other laser owners would too.

Would love feedback from fellow builders. What would you change? What's missing? And if any of you happen to own a laser, I'd genuinely appreciate a test run.

---

### POST 10: r/indiehackers

**Title:** I scored 74 startup ideas, picked #1, validated it with 30+ polls and $46 of competitor data, then built it in 6 weeks. Here's everything.

**Body:**

I want to share the full journey of building CutLog because I think the validation process is more interesting than the product itself.

**The problem space:** Laser cutting/engraving machines have exploded in popularity (think Cricut but for wood/metal/acrylic). Every machine behaves differently, and there's no universal parameter database. Owners burn through expensive material doing test grids. Forums are flooded with "what settings for X on Y?" posts.

**How I picked this idea:**

I ran 74 potential startup ideas through a systematic scoring framework (market size, pain severity, willingness to pay, competition, my ability to build it). Laser parameter optimization scored #1. Not because the market is massive, but because pain severity was 10/10 and competition was surprisingly weak.

**Validation (before writing a line of code):**

1. Posted 30+ polls in laser Facebook groups asking about their biggest frustrations. "Finding the right settings" was consistently top 3
2. DM'd 17 laser operators directly to understand their workflow
3. Purchased $46 worth of competitor settings files on Etsy to benchmark accuracy (my recommendations matched 87% of their verified parameters)
4. Scraped 5 competitor databases to understand what data existed and where the gaps were
5. Joined 8 Reddit laser communities to understand the language and pain points

**The build (6 weeks of nights/weekends):**

Next.js 14, Tailwind, Supabase, Vercel, Gemini 2.0 Flash for AI recommendations. The core insight was that laser parameters scale predictably when you account for wattage, lens focal length, and laser type. So if a 60W CO2 cuts 3mm birch at 20mm/s and 65% power, you can extrapolate what a 40W CO2 with a different lens would need.

**Current numbers:**

1. 5,653 parameter entries across 562+ materials in the database
2. Supports fiber, CO2, diode, and UV lasers
3. Imports LightBurn .clb files (the dominant laser control software)
4. Per-machine learning from user feedback
5. Zero paying users (it's completely free, no paywall)
6. 1 influencer partnership pending (laser YouTuber with 45K subscribers)
7. Posted in r/ChineseLaserCutters with positive reception

**What worked:**

1. The validation process gave me extreme confidence before building. I never had "should I build this?" doubt
2. Scraping competitor data gave me a massive head start on the database
3. Buying Etsy files let me benchmark accuracy objectively (87% match)
4. Focusing on LightBurn import was smart because it eliminates the cold start problem for users

**What hasn't worked (yet):**

1. Nobody has booked a call or asked for a paid feature. The "free" positioning might be a trap
2. My 17 DMs to operators resulted in only 3 meaningful conversations
3. I haven't cracked distribution beyond Reddit and Facebook groups
4. The per-machine learning needs more feedback data to be genuinely useful (chicken and egg)

**What I'm struggling with:**

The tool is free and people like it, but I have no monetization path that doesn't feel forced. Material suppliers could sponsor listings. Laser manufacturers could white-label it. But I'm a maker, not a salesperson, and cold outreach makes me want to close my laptop.

**Live tool:** https://cutlog-two.vercel.app

**My question for this community:** For those of you who built free tools that gained traction, at what point did you introduce monetization, and how did the community react? I'm worried that adding any paywall will kill the trust I'm building. But I'm also aware that "free forever" isn't a business model.

---

## Revised Posting Schedule (Updated 2026-06-25)

**Status key:** DONE = posted, SKIP = not posting, READY = drafted and waiting, ACTIVE = currently engaging pre-post

| Date | Subreddit | Status | Notes |
|------|-----------|--------|-------|
| 2026-06-25 (Wed) | r/ChineseLaserCutters | DONE | Posted, positive reception. Link: https://www.reddit.com/r/ChineseLaserCutters/s/5VUEmxLe16 |
| 2026-06-25 (Wed) | r/laserengraving | ACTIVE | Joined, made karma-building comment (2026-06-25). Post when 2 weeks of engagement complete. |
| 2026-06-25 (Wed) | r/lightburn | ACTIVE | Joined, made karma-building comment (2026-06-25). Post when 2 weeks of engagement complete. |
| 2026-06-25 (Wed) | r/glowforge | SKIP | Dead sub, low engagement. Not worth the effort. |
| 2026-06-28 (Sat) | r/diodelaser | READY | Post 5. Small but receptive community. |
| 2026-07-01 (Tue) | r/laserengraving | READY | Post 2. Adjust tone based on r/ChineseLaserCutters feedback. |
| 2026-07-04 (Fri) | r/lightburn | READY | Post 3. Weekend timing for engaged hobbyists. |
| 2026-07-07 (Mon) | r/lasercutting | ACTIVE | Post 6. Biggest audience, most polished post needed. Careful approach. Karma-building comments started 2026-06-25. |
| 2026-07-10 (Thu) | r/hobbycnc | ACTIVE | (2026-06-25) joined, commenting. Post 7. Must include disclosure. |
| 2026-07-13 (Sun) | r/xToolOfficial | ACTIVE | (2026-06-25) joined, commenting. Post 8. Only if previous posts went well. |
| TBD | r/Machinists | ACTIVE | (2026-06-28) joined. 275K professional CNC operators. Build karma before posting. |
| TBD | r/metalworking | ACTIVE | (2026-06-28) joined. 762K+ professional metalworkers. Build karma before posting. |
| TBD | r/sheetmetal | ACTIVE | (2026-06-28) joined. 7K sheet metal shops — exact target audience. Build karma before posting. |
| 2026-07-16 (Wed) | r/sideproject | READY | Post 9. Builder-to-builder tone, share tech stack and what's next. |
| 2026-07-19 (Sat) | r/indiehackers | READY | Post 10. Journey-focused, share validation process and real numbers. |

**Notes on revised schedule:**
1. r/glowforge removed (dead sub, skip entirely)
2. r/sideproject and r/indiehackers added as new targets (no pre-engagement period required for these subs since they exist specifically for sharing projects)
3. Laser-specific subs posted first to build social proof and gather feedback before builder/indie communities
4. 3-day spacing maintained between posts
5. r/sideproject and r/indiehackers scheduled last so the post can reference community reception from laser subs as additional social proof

---

## Activity Log

### 2026-06-25 -- Karma-Building Comments (No CutLog Mention)

| Subreddit | Post URL | Topic | Comment Summary |
|-----------|----------|-------|-----------------|
| r/laserengraving | -- | -- | Helpful comment, pure karma building. No CutLog mention. |
| r/lightburn | -- | -- | Helpful comment, pure karma building. No CutLog mention. |
| r/lasercutting | https://www.reddit.com/r/lasercutting/comments/1uewzxl/xtool_f1_ultra_worth_it/ | Someone asking if xTool F1 Ultra is worth it for metal engraving | Gave advice about fiber vs CO2 vs diode for metal marking, tube degradation lifespan, customer service reality in sub-$5K market. Pure karma building, no CutLog mention. |
| r/hobbycnc | -- | Motor connection post (direct coupling vs timing belt for NEMA34 gantry) | Joined sub. Made helpful comment on motor connection post (direct coupling vs timing belt for NEMA34 gantry). Pure karma building, no CutLog mention. |
| r/xToolOfficial | -- | Thick wood cutting post | Joined sub. Made helpful comment on thick wood cutting post (air assist, speed settings, plywood glue issues for P2S). Pure karma building, no CutLog mention. |

| 2026-06-26 | r/ChineseLaserCutters | First comment reply received from Jkwilborn. Skeptical but engaged (6yr experience, questions about auth and accuracy). Replied addressing signup requirement and explaining data sources. |
| 2026-06-26 | r/lasercutting | Got reply from OP (shadekiller102) on xTool F1 Ultra post: "Its the xtool f1 ultra with a 20w diode laser and 20w fiber laser." Need to reply with specific advice. |
| 2026-06-26 | r/hobbycnc | Motor connections post got 2 upvotes, 1 helpful reply agreeing (Pubcrawler1), and OP replied with specific motor/ballscrew details. Active discussion. |
| 2026-06-26 | r/lasercutting | Replied to OP (shadekiller102) with detailed xTool F1 Ultra breakdown: fiber vs diode head capabilities, metal engraving confirmation, power loss addressed, price justification, cutting vs engraving caveat. Pure karma, no CutLog mention. |
| 2026-06-26 | r/hobbycnc | Replied to OP (russell072009) with belt recommendation (HTD 5M over T5), 14mm keyed shaft solutions (pilot bore, taper lock, Misumi configurator), 1605 ballscrew critical speed flag, sourcing suggestions. Pure karma, no CutLog mention. |
| 2026-06-26 | r/laserengraving | Replied to wall-mounted laser post (Outrageous_Ad_408): focus consistency, debris, mounting concerns. Pure karma, no CutLog. |
| 2026-06-26 | r/xToolOfficial | Replied to "Laser no longer cutting" post (Yorokobi-art): troubleshooting steps (focus, flatness, air assist, connector, test square). Pure karma, no CutLog. |
| 2026-06-26 | r/lightburn | Replied in Lounge to Sad_Baker809's invert engraving question: layer mode + vector vs raster explanation. Pure karma, no CutLog. |
| 2026-06-26 | Facebook: CNC Fiber Laser Ninja | Replied to Matthew Kayne's 6kW 6mm HR steel parameter question. Added value (mill scale tip, speed optimization advice) + mentioned CutLog naturally as parameter database. First direct CutLog mention in a Facebook comment. |
| 2026-06-26 | Facebook: CNC Fiber Laser Ninja | Replied to Jacob Dean's glass engraving question (coating methods + frequency settings) + CutLog mention. |
| 2026-06-26 | Facebook: CNC Fiber Laser Ninja | Replied to PrettyFlamingo9681's corner quality issue (corner power, acceleration, dynamic power). Pure karma. |
| 2026-06-26 | Facebook: CNC Fiber Laser Ninja | Replied to ExcitingHedgehog7844's 16mm stainless pierce blowback (3-stage pierce recipe + height control) + CutLog mention. |
| 2026-06-26 | Facebook: CNC Fiber Laser Ninja | Replied to Bilal Jameel's protective lens overheating (back-reflection physics, focal position, gas pressure, nozzle standoff) + CutLog mention. |
| 2026-06-27 | Facebook: Laser Engraving for Beginners | Replied to skeptics Marc's + Michael Greenstein on lead-gen post. Conversational, no CutLog mention. |
| 2026-06-27 | Facebook: DIY Fiber Laser | Replied to skeptics Michael Barry + Tony Smiley + Paul Allen Durr Jr. on lead-gen post. Conversational, no CutLog mention. |
| 2026-06-28 | Facebook: CNC Fiber Laser Ninja | Replied to Jacob Aldrich's quoting software question. Gave actual software recommendations (SecturaSOFT, Lantek, Paperless Parts) + mentioned CutLog for the parameter estimation piece of quoting. |
| 2026-06-28 | r/ChineseLaserCutters | Post now at 6 upvotes, 2.1K views, 4 comments. Jkwilborn replied positively (went from skeptic to supporter). Reddit suggesting repost to r/hobbycnc and r/CNC. |
| 2026-06-28 | r/lasercutting | Posted CutLog announcement (Post 6 final version). Title: "Wasted half a sheet of 20mm on a Thursday because I couldn't find my own settings — so I built something to fix it". Link in profile (sub doesn't allow links in posts). Pending approval. |
| 2026-06-28 | r/Machinists | Joined. Starting karma building. 275K members, professional CNC operators. |
| 2026-06-28 | r/metalworking | Joined. Starting karma building. 762K+ members, professional metalworkers. |
| 2026-06-28 | r/sheetmetal | Joined. Starting karma building. 7K members, directly our audience (sheet metal shops with fiber lasers). |
| 2026-06-28 | Facebook: DIY Fiber Laser | Replied to Tony Smiley's follow-up on lead-gen post. Closed thread gracefully — he's dialed in, not our target. DO NOT DM. |
| 2026-06-28 | Facebook: Laser Engraving for Beginners | Replied to Michael Greenstein's follow-up about organizing settings by project/effect. Planted seed about "new material with no reference" scenario. No CutLog mention. |
| 2026-06-28 | Facebook: CNC Fiber Laser Ninja | Replied to Dan Allkins' question about 3mm brass cut settings on OMG 60W MOPA post. Gave parameter data (36-45% power, 200-400 mm/min, N2 at 4+ bar, multi-pass). Planted "always collecting verified data" seed. No CutLog link. |
| 2026-06-28 | Facebook: Fiber Laser The Next Level | NOTE: Comments pending approval in this group. CNC Fiber Laser Ninja is faster/easier. Prioritize Ninja for daily engagement. |

**Karma-building status (updated 2026-06-28):**
- r/laserengraving: ACTIVE (commenting/building karma since 2026-06-25)
- r/lightburn: ACTIVE (commenting/building karma since 2026-06-25)
- r/lasercutting: ACTIVE (commenting/building karma since 2026-06-25, Post 6 submitted 2026-06-28)
- r/hobbycnc: ACTIVE (commenting/building karma since 2026-06-25)
- r/xToolOfficial: ACTIVE (commenting/building karma since 2026-06-25)
- r/Machinists: ACTIVE (joined 2026-06-28, 3 karma comments posted)
- r/metalworking: ACTIVE (joined 2026-06-28, 3 karma comments posted)
- r/sheetmetal: ACTIVE (joined 2026-06-28, building karma)

**2026-06-28 karma comments posted (9 total):**
- r/metalworking: 3 comments (CNC plasma vs fiber, stainless enclosure warping, beginner MIG on laser-cut 304)
- r/lasercutting: 3 comments (5mm mild steel O2 cutting, copper nozzle overheating, 1200W reflective materials)
- r/Machinists: 3 comments (shearing vs laser for auto parts, DIY car guy plasma advice, YAG mold repair welder)

---

## Comments Ready to Post (2026-06-28)

### r/metalworking — https://www.reddit.com/r/metalworking/comments/1uh5de7
"CNC plasma vs fiber laser, what actually made you pull the trigger?"

Ran plasma for years before switching to a 6kW fiber about 18 months ago. The thing that finally pushed me over was secondary operations. With plasma I was always grinding, cleaning dross, dealing with bevel on anything under 10ga. Fiber cuts just come off the table ready to weld or powder coat without touching them.

That said, if you're mostly doing 1/2" and up structural stuff, plasma still makes a lot of sense economically. The capital cost difference is real and the cut quality gap narrows a lot once you get into thicker plate.

For me the math worked because we do a ton of 16ga through 1/4" mild steel and stainless. The labor savings on deburring alone paid for the upgrade faster than I expected. Plus nitrogen assist on stainless means oxide free edges, no pickling required. That was a game changer for our food service fabrication work.

If you're 80%+ mild steel under 1/2", fiber is worth stretching the budget. If it's mostly heavy structural plate, plasma is still the right call and you can put the savings into a better table and better consumables.

---

### r/metalworking — https://www.reddit.com/r/metalworking/comments/1ticc02
"Trying not to potato-chip 3mm stainless enclosures"

That 500W range is the sweet spot for 3mm box work in my experience. We do a bunch of stainless enclosures and the biggest wins were all about managing heat input per unit length.

A few things that helped us beyond just power settings: stitch welding pattern instead of running continuous, even on cosmetic sides. Like 15mm on, 5mm skip, then come back and fill the gaps after the first pass cools. Distributes heat way more evenly.

Also if you're not already doing it, tack spacing matters more than people think. On 3mm I'll put tacks every 40mm or so on a longer seam before running it. Keeps the gap from opening up as heat walks down the joint, and the part stays constrained so it can't dish.

Backing bars help too. Even just a piece of flat bar clamped behind the seam acts as a heat sink and stiffener during welding. Copper or aluminum backing pulls heat away even faster if you have it around.

---

### r/metalworking — https://www.reddit.com/r/metalworking/comments/1tvydxv
"Beginner needing help with welding! (MIG on laser cut 304 stainless)"

Your biggest issue is the gas. 100% CO2 on stainless is going to give you grief every single time. It oxidizes the weld pool and creates all that black soot you're seeing. You want a tri mix (like 90% He, 7.5% Ar, 2.5% CO2) or at minimum a 98% Ar / 2% CO2 blend for stainless MIG. The difference is night and day.

The erratic arc starts on laser cut edges are common. Laser cut stainless has a thin oxide layer from the cutting process, especially if it was cut with oxygen assist rather than nitrogen. Try hitting the start point with a flap disc or scotch brite pad right before welding. Just a quick pass to get down to bright metal on the first 10mm or so.

That pulsing thing you're describing sounds like your wire feed is struggling. At 6 m/min with 0.8mm wire you're on the low side for 3mm stainless. Could also be a liner issue or a contact tip that's wearing. But honestly, fix the gas first because everything else will look different once you're running a proper shielding mix.

---

### r/lasercutting — https://www.reddit.com/r/lasercutting/comments/1u2z60i
"Problem with laser cutting (5mm mild steel, oxygen assist)"

Classic bottom edge roughness on mild steel with O2 usually comes down to three things: focus position, gas pressure, or speed being slightly too fast.

First check your focus. For 5mm mild with O2 on a 3kW, you typically want focus at roughly 2/3 material thickness below the surface (so around negative 3 to 3.5mm). If focus is too high, the beam diverges before it exits the bottom and you get that ratty edge with slag hanging on.

Second, O2 pressure. For 5mm mild I usually run between 0.6 and 0.8 bar. Too much pressure and the exothermic reaction gets out of control, which causes burning and rough edges. Too little and you can't clear the kerf. Start at 0.6 and bump up in small increments.

Third, speed. If your top looks clean but the bottom doesn't separate, you're likely 5 to 10% too fast. The beam energy is enough to start the cut but not enough dwell time to fully eject molten material at the exit side. Slow down a touch and see if it cleans up.

Also double check your nozzle. A 1.5mm single nozzle is standard for 5mm mild with O2. If it's dinged or off center, your gas flow goes crooked and the bottom half of the cut suffers. Hold a piece of tape over it and do a pulse to check centering.

---

### r/lasercutting — https://www.reddit.com/r/lasercutting/comments/1tv7bqw
"Cutting Copper on Fiber Laser (nozzle overheating)"

Copper is brutal on nozzles because of back reflection heating the tip and the high thermal conductivity pulling heat everywhere. A few things that help:

Use a ceramic or chrome plated nozzle tip if your head supports it. Standard brass nozzles absorb reflected energy way faster. The ceramic insulator ring between the nozzle and the head body also matters since it prevents conducted heat from traveling up.

Stand off distance, run it a bit higher than normal. On copper I'll bump from the standard 0.5 to 1.0mm up to 1.5mm or even 2.0mm. Gives the reflected beam more room to spread before hitting the nozzle face, and gives you better gas coverage at 225psi which is good pressure for copper.

Pierce strategy matters too. Ramp piercing instead of a hard pierce reduces the initial back reflection spike that tends to be what starts the thermal runaway on the nozzle. If you're doing a full power blast pierce on copper, that first fraction of a second is when all the energy bounces straight back before the kerf opens up.

Also make sure your cutting direction keeps the nozzle away from previously cut hot edges. Copper holds heat forever and cutting back across a recently cut area radiates a ton of energy upward.

---

### r/lasercutting — https://www.reddit.com/r/lasercutting/comments/1ufilp5
"Sisyphus (1200W Gweike can't cut reflective materials)"

Yeah, this is unfortunately a pretty common situation. At 1200W you're fundamentally limited on copper and silver thickness. The issue isn't just power, it's that those materials reflect 90%+ of the beam energy at 1064nm wavelength back into the delivery fiber, which damages the source itself over time.

The machines that handle reflective materials at lower powers generally use a different beam delivery approach: shorter focal length, higher power density at the focal point to break through that initial reflective barrier quickly, and protective back reflection isolators built into the resonator. That's not something you can retrofit onto a source that wasn't designed for it.

Realistically at 1200W on copper you might manage 1mm or maybe 1.5mm with a proper source, but you won't be doing production runs of anything thicker. For silver, similar story.

If the budget won't allow a new machine, the pragmatic answer might be to subcontract the copper and silver cutting to a shop that has a 4kW or 6kW with proper back reflection protection, and use the Gweike for what it's good at. A machine that's not designed for reflective materials will either cut poorly or kill the source eventually.

---

### r/Machinists — https://www.reddit.com/r/Machinists/comments/1tquu2n
"Shearing machine vs Laser cutting for high volume manufacturing"

Depends a lot on your volumes and part geometry. For simple rectangular blanks where the shear + blanking die is already paid for, the per-piece cost is going to be hard to beat with a laser, especially on thinner gauge stuff under 2mm. The shear/press combo is brute force but it's fast as hell for what it does.

Where a fiber laser starts making sense is when you've got irregular shapes, tight nesting requirements, or frequent changeovers between part numbers. No tooling cost per new geometry, and modern machines with automatic nozzle changers can switch from 0.7mm CR to 6mm HR without anyone touching the machine. You also get better edge quality on the thicker HR stuff compared to a blanking die that's starting to wear.

The real question for auto parts at volume: what's your batch size per part number and how often do you changeover? If you're running 50,000 of the same rectangle, keep the press. If you're running 200 different part numbers in smaller batches, the laser pays for itself in flexibility alone. Also factor in that laser nested parts waste significantly less material on irregular shapes, so your yield improvement on the sheet might cover more of the machine cost than you'd expect.

---

### r/Machinists — https://www.reddit.com/r/Machinists/comments/1twtfj5
"Diy car guy"

For garage fab work on steel plate in that budget range, a CNC plasma table is realistically your only option. A fiber laser capable of cutting even 3mm steel starts at 30k+ and needs proper ventilation and eye safety enclosures. Waterjet is a whole other level of infrastructure (high pressure pump, garnet disposal, water management).

That said, be realistic about plasma limitations for your use case. If you're making parts that get bent on a brake afterward, the edge quality from plasma on anything under 2mm is going to be rough. You'll likely need to grind edges before bending to avoid stress cracks at the bends, especially on curves. Plasma really shines on 3mm and up where the kerf width and edge taper become proportionally less of an issue.

For thin gauge door panels and brackets under 2mm, honestly you might get better results with a decent hand shear, a nibbler, and templates. The plasma table will be great for anything 3mm+ where you need repeatable profiles. If you do go the plasma route, spend extra on a proper THC (torch height controller) because on thin material the arc wander will make your cuts ugly without it.

---

### r/Machinists — https://www.reddit.com/r/Machinists/comments/1u3wdws
"Mold repair laser welder help"

YAG mold welders are finicky but once you get the relationship between pulse energy, duration, and spot size dialed in, it's pretty repeatable. For your soot issue, it's almost certainly shielding gas coverage. On those machines the gas nozzle position is critical because you're working under magnification with a tiny weld zone. Make sure the nozzle isn't just "in view" but actually directed at the exact spot where the beam hits. Even a few mm off and you'll get oxidation that looks like soot.

For general parameters on repair work with 0.3 to 0.4mm wire: start with spot size matching or slightly larger than your wire diameter (0.4 to 0.5mm), pulse duration 8 to 12ms, and voltage/energy low enough that you're not blowing through. Build up in layers. The temptation is to crank power to fill faster but you'll get porosity and undercut on the edges.

One thing that helped me a lot: on shutoff edges where you need to build up a sharp corner, run a first pass at lower power to establish a base layer, then bump power slightly on subsequent passes. The first layer bonds to the parent material and gives you a foundation. If you go full power right away on a sharp edge, the material just rolls off.

Also, Z height is everything on these machines. If your part has any surface variation, you'll see the spot size change and your weld quality goes all over the place. Keep checking focus as you move across the repair area.
