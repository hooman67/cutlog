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

### Mike AJ Guindon (POSITIVE — Easy Convert)

**His reply**:
```
hi there Matt, just waking up, let me re-read your message and I'll get back to you, because after I wake up, I need to go for a walk and then shower and then go open our Small Business later this morning at 9am, we are EST zone, where abouts in the world are you?

hey Matt, I'm going to be a bit busy today, but I'm up for a chat or two regarding your AI Idea....ttys
```

**Signal**: Very positive. Has small business (EST). Calls it "AI Idea" = tech-aware.

---

### Nate Keen (GOLD MINE — Deep Technical Insight)

**His reply**:
```
Hi Matt,
Yeah the machine varies for sure even the exact same model.  For instance  if you run it at 100% Power it's whole life you may only get 5 good years out of it.  
If you reduce it down to around 85-90 max you'll have a 40 year machine easy.   This one factor alone makes everyone's machine perform very differently.  Then you've got different brand / quality lenses, quite often not everyone has calibrated perfect focus, the Galvo head is out by 1-2mm compared to the bed and the list goes on.   

But once you've mastered your particular machine and settings it's just a matter of making small adjustments - line interval actually has more relevance than anything else.  Frequency is just how rough your sandpaper is and Power is just how hard you're pushing on the sandpaper.  

But line interval can be the difference from making a clean cut or engraving to  having cut weld itself  back together again, doesn't matter what power or frequency it's set on.    Other than that I don't think I can really give you much more information, I'm probably not the best teacher it's kind of all in my head from years of experience.  

I've probably got some ideas on some other tools you could make today that would make people's life easier.   

Personally I'd  love to have a simple tool that I can integrate into my website or maybe an app that I can load in all my custom fonts into it so customers can try them out.   Maybe even see what they look like on their items by uploading a photo.   I've seen a few websites that do this like on YETI bottles I just don't have any idea how to make it.
```

**Key Insights**:
- Per-machine variation is MASSIVE (100% power = 5 years, 85-90% = 40 years)
- Multiple drift sources: lens quality, Galvo misalignment (1-2mm), focus calibration
- **Line interval is most critical parameter** (more than power/frequency)
- Tacit knowledge problem: "It's all in my head from years of experience"
- Entrepreneurial (wants custom font tool for his website)
- Potential co-founder, not just customer

---

### Sean BeardyWeirdo (SKEPTICAL but OPEN)

**His reply**:
```
Absolutely. I am keen to hear how testing could be achieved by someone else. 
I'm all for change and moving along with technology. 
But I also have reservations on how this could be achieved by another person. 

But never say never right?
```

**Core objection raised**: "How can someone else's test results on THEIR machine help ME with MY machine?"
This is THE critical question the product must answer.

---

## Follow-Up Messages Sent (2026-06-11)

All 3 received full product explanation with the per-machine ML concept. Key points covered:
- Two-layer model (general + machine-specific)
- Resonator degradation tracking
- Calibration drift detection
- Historical success patterns
- Environmental quirk learning
- Drift detection / alarms

### Reply sent to Sean:
```
100% specially in the age of AI :) 

My idea is to build a per-machine learning model. Other people's data trains the general model. Your machine's history trains a custom calibration layer. So you get both community knowledge AND machine-specific tuning.

There is so much that's common between machines. The general model will understand how machines generally work, what different parameters do, material properties. 

The machine-specific model knows all the quirks and quirks—how YOUR specific machine has aged, drifted, and performs differently than the day it came out of the box:

- Resonator degradation — after 5,000 hours, your tube doesn't produce the same power at "100%" as a new machine. The model learns YOUR machine's actual efficiency curve.
- Calibration drift — Galvo head misalignment, focus position drift, nozzle wear. These change how parameters translate to cut quality on YOUR specific setup.
- Historical success patterns — What cutting speeds actually worked for stainless on your machine vs. generic recommendations. The model learns from your past wins.
- Environmental quirks — Maybe your shop runs hot in summer, or your gas line has pressure variation. The model learns these patterns.
- Drift detection — If your machine starts drifting out of spec, the model catches it before you waste material on bad cuts.

The key insight: When you ask "what parameters for 3mm stainless," the model doesn't just say "use 3500W, 4m/min" (that's what lasertips.org does). It says "use 3200W, 4.2m/min, 12-bar gas" — calibrated for YOUR machine's specific age, calibration state, and history.

So yes, someone else's data helps. But only after it's personalized for YOUR setup. Does that address the concern?

— Matt
```

### Reply sent to Nate (included co-founder exploration):
```
Hey Nate,

I really appreciate your reply man, this kind of insight is exactly what I'm looking for. Someone with years of experience that can call BS on what I'm saying to make sure I'm not wasting my time :) 

What I'm thinking is a machine-specific learning model that captures exactly the kind of expertise you've developed over years. Here's how it'd work:

The general model (trained on thousands of cuts across different machines) understands how laser cutting generally works — material properties, parameter relationships, etc. There is so much that's common between all machines after all. But YOUR machine has aged. The resonator is degraded. Your Galvo head might be slightly misaligned. Your gas line has pressure variation.

The machine-specific layer learns all of that. It knows YOUR machine's actual efficiency curve, YOUR calibration quirks, YOUR environmental conditions. So when someone asks for parameters, the system doesn't give them generic "3500W, 4m/min". It gives them "3200W, 4.2m/min, 12-bar gas" — personalized for their specific machine's age and state. And also the things that you're not even thinking about like how your shop runs hot in summer, or your gas line has pressure variation. The model learns these patterns too.

It'll also catch the calibration drift. Like Galvo head misalignment, focus position drift, nozzle wear. Like if your machine starts drifting out of spec, the model catches it before you waste material on bad cuts. 

I'm hoping we can get some feedback from the operators too like what cutting speeds actually worked for stainless on your machine vs. generic recommendations. So the model learns from your past wins.   

Real talk though:

I'm an AI engineer at Adobe. So I cant totally help you set up the tool you wanted for customers to try our your customer fonts on images. You can already try it with Nano banana (Google's image gen model) to see how far the free version will get you. Basically, upload your font (or a photo of it), the photo of the thing you wanna see the font on, and ask Nano Banana to put the font from first image into the object (or whatever) from scond images. It'll make mistake and you'll have to play around with the prompt (has a learning curve like any other machine). 

That being said, I'm wondering if you'd be interested in building this together? I'm strong on the AI/software side. You've got the laser domain expertise, the operator network, and you clearly understand the problem space deeply.

This could be something bigger than just a SaaS tool. It could be a whole platform for capturing and codifying manufacturing expertise.

Curious if that's interesting to you? Either way, I'd love 30 minutes to talk through what you're seeing in the market and explore this further. Most importantly, I wanna make sure I'm not missing something obvious.

Free this week / weekend?

— Matt
```

### Reply sent to Mike (included scheduling + idea pitch):
Full idea pitch with time slot options (Tuesday-Thursday, 8:15am or 6pm EST).

---

## Round 1 Final Status (as of 2026-06-14)

| Name | Initial Reply | Follow-up Sent | Call Booked? |
|------|--------------|----------------|--------------|
| Mike AJ Guindon | ✅ Positive | ✅ Full pitch + scheduling | ❌ No response to follow-up |
| Nate Keen | ✅ Gold mine insights | ✅ Co-founder exploration | ❌ No response to follow-up |
| Sean BeardyWeirdo | ✅ Cautiously positive | ✅ Per-machine ML explanation | ❌ No response to follow-up |
| John Stegenga | ❌ Never responded | — | — |
| Mariah Corfield | ❌ Never responded | — | — |

**Outcome**: Strong initial engagement (3/5 replied) but none converted to calls yet.

---
## Replies Received (2026-06-13)
These are some more replies that I received later
DIY Fiber Laser
Joshua Scott
If it’s something I’ve never cut but I know it bends like a certain metal then I’ll start with a setting that seems close. But I’ve got settings to cut most stuff under 1in at this point Even got 24ga ss to be baby smooth like it’s been debured with a bob

## Replies Received (2026-06-15)

### Fiber Laser Cutting Machine | Metal Laser Cutter Users (Round 2 post — Chinese machines)

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

### Additional New Replies (2026-06-15)

**Bradley Andlovec** (CNC Fiber Laser Ninja):
> "You can't really use other people's parameters. You really have to learn how to dial in your laser. Otherwise it's just guessing. There are some starting points out there but for the most part. Every machine's going to operate a little bit different, so learning how to read your cut is the most important part"

**Scott Wasson** (CNC Fiber Laser Ninja):
> "I have a couple Chinese machines. Once you know lasers, you know how to dial them in for the most part. Until you have the skills, questions here with videos to help."

**Lobo Lightbringer** (DIY Fiber Laser):
> "Experimenting. In general, speed parameter is almost the same across brands for each laser source output power. Your first approach would be to find the right focus distance. Then you can work your cut quality by tweaking gas pressure, frequency, etc.."

**Sara Simpson** (CNC Fiber laser machine):
> "I dont cut anything that's not on my manufacturers list, I've had enough trouble with it, not pushing my luck"



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

## Results

For those of you running Chinese fiber lasers (HSG, Bodor, Raytools, others), which don't usually come with the best documentation in English, how do you find the right cutting parameters when you get a material the machine manual doesn't cover? 

Are you:
- Translating Chinese docs?
- Asking forums?
- Just experimenting?
- Comparing to similar materials?

Any tips/tricks would be really appreciated. 




1. That Laser Dude Community - Laser Engraving & Cutting for All 🔥
Shannon Brown Rinehart
Ramp test

Christine Tripp
Even for my Mira, I run a material test cut and save the piece to refer to later.
CNC Fiber Laser Ninja (Fiber Laser Cutters)


2. CNC Fiber Laser Ninja (Fiber Laser Cutters)
Bradley Andlovec
You can't really use other people's parameters. You really have to learn how to dial in your laser. Otherwise it's just guessing. There are some starting points out there but for the most part. Every machine's going to operate a little bit different, so learning how to read your cut is the most important part
4h
Reply

Scott Wasson
I have a couple Chinese machines.
Once you know lasers, you know how to dial them in for the most part.
Until you have the skills, questions here with videos to help.

Les Strickland
The senfeng I bought came with installation. They worked out the parameters during installation. They asked me prior to installation to get a list of all the materials I typically run. I got all that material and they developed it while there
1d
Reply
Scott Wasson
I have a couple Chinese machines.
Once you know lasers, you know how to dial them in for the most part.
Until you have the skills, questions here with videos to help.
1d
Reply
George Diffey
We have had a hsg ts2 tube laser for the last 18 months. When it was installed they set up parameters for whatever materials we asked. There is also a library of default ones. When we have had a material that wasnt in a library or wasnt cutting as expected, we contacted hsg through WhatsApp and they helped us dial it in. Now with experience we can do it ourselves but they wete very helpful when we needed it
1d
Reply
Joshua Scott
Mostly experienced tests



3. CNC Fiber laser machine
Sara Simpson
I dont cut anything that's not on my manufacturers list, I've had enough trouble with it, not pushing my luck

Chaz Simpson
By purchasing a table from Texas CNC LLC instead


4. Laser Engraver Group for Beginner ✅
Masked_helper_👮
Matt St When you are operating a heavy-duty industrial Chinese fiber laser (like an HSG or Bodor) running a Raytools or Precitec cutting head, missing documentation is practically a rite of passage. Because these machines rely on massive power outputs and specialized assist gases (O_2, N_2, or compressed air), guessing blindly can quickly lead to ruined nozzles, cracked protective windows, or dangerous laser back-reflection.
When facing an uncovered material, experienced operators generally use a strategic combination of all your points, leaning heavily into a structured experimentation workflow:
Never Blindly Experiment—Establish a Baseline First: Instead of guessing from scratch, always look for a "closest sibling" material in your existing manual to use as a starting point. For example, if you need to cut a specialized high-strength steel alloy that isn't listed, start with your documented parameters for standard Carbon Steel or Mild Steel of the exact same thickness.
The Translation Trick: If your machine came with a digital USB drive or a hidden directory on the CNC controller cabinet containing Chinese-only PDF parameter tables, do not ignore them. The documentation written for the domestic Chinese market is almost always significantly more detailed than the rushed English translations. Drop those files into a free visual document translator (like Google Translate or DeepL Document Translator); they will instantly translate the text while keeping the technical grid layouts intact.
Leverage Nozzle and Gas Fundamentals: Remember that the material thickness dictates your mechanics more than the brand of the machine. For thin materials under 3mm using Nitrogen (N_2) or Air, you will almost always use a fast, high-pressure evaporative cut with a small nozzle size (e.g., 1.2mm to 1.5mm) and a negative focal point pushed slightly inside the material. For thick carbon steels using Oxygen (O_2), you will shift to a slow, low-pressure exothermic reaction cut using a larger double nozzle (e.g., 2.0mm to 3.0mm) and a positive focal point floating above the surface.
Run a Step-Down Line Test: When you are ready to experiment, cut a scrap piece of the target material using a series of 100mm straight lines. Keep your power and gas pressure locked at your baseline, but adjust the speed downward by 10% on each consecutive line. Inspect the bottom edge of the cuts—the line that produces the cleanest edge with the absolute minimum amount of hanging dross (slag) represents your optimal cutting speed.
I highly recommend the book "Laser Engraving for Beginners: The Complete Guide to CO2 and Diode Lasers, Materials, Settings, and Projects" by Ethan Blake, as it is available on Amazon and it has been a game changer for me. While it focuses heavily on introductory workshop principles, it is an excellent book for mastering the core foundational physics of focal depth alignment, gas pressure regulation, and systematic material testing grids that apply across all laser operating platforms.
1d
Reply
Share
Rocinante Quixote
Just experimenting



5. UV laser and fiber laser community group
Terry Jones
What he said
1d
Reply


Jeremy Hubert
Material test everything, no two machines are the same, and each lens will have its unique signature as it is ground and polished (they are really close to all being the same tho) so my 60 watt with a 220 lens and a blue on stainless won't necessarily be the same settings as yours...so test test test



6. Fiber Laser Tips, Tricks & Sales
Warren Eales
use the lightburn built in test tool
1d
Reply
Tony Cox
Testing
1d
Reply
Michael Stanislawczyk
You shouldn't really use anyone else's libraries - they ALL come with a disclaimer that any given setting is a starting point. You need to essentially make your own since everyone uses different laser source brands, lenses, etc...
You can use the Material Library tab in Lightburn (bottom/right for me) so you don't need to use a million pen/layer colors...
Also, check out the LaserParams Converter tool from GitHub to be able to convert from power/lens differences 😉👍


7. CNC Fiber Laser Ninja (Fiber Laser Cutters)
Joshua Scott
Mostly experienced tests
1d
Reply


Scott Wasson
I have a couple Chinese machines.
Once you know lasers, you know how to dial them in for the most part.
Until you have the skills, questions here with videos to help.
1d
Reply
Les Strickland
The senfeng I bought came with installation. They worked out the parameters during installation. They asked me prior to installation to get a list of all the materials I typically run. I got all that material and they developed it while there
1d
Reply
George Diffey
We have had a hsg ts2 tube laser for the last 18 months. When it was installed they set up parameters for whatever materials we asked. There is also a library of default ones. When we have had a material that wasnt in a library or wasnt cutting as expected, we contacted hsg through WhatsApp and they helped us dial it in. Now with experience we can do it ourselves but they wete very helpful when we needed it


8. Fiber Laser Cutting Machine | Metal Laser Cutter Users
Mehmet Açıkgöz                                                                                                                
  We are proud to announce the launch of our new CNC Fiber Laser Assistant application, now available on both iOS and Android.  
  This project was created to fill a gap in the CNC laser cutting industry by combining technical knowledge, practical          
  guidance, and educational tools into a single platform.                                                                       
  The application provides laser operators, programmers, and technicians with instant access to technical information,          
  troubleshooting guidance, cutting parameters, nozzle selection, focus calculations, gas settings, and many other learning     
  resources.                                                                                                                    
  Our goal is to make laser cutting knowledge more accessible, improve operational efficiency, and support continuous learning  
  within the manufacturing industry.                                                                                            
  The app is now live and available for download on iOS and Android.                                                            
  You can find and download our application by searching for "BeraTech CNC" on the App Store and Google Play.                   
  We would love to hear your feedback and suggestions as we continue to improve and expand the platform.                        
  #CNCLaser #FiberLaser #Manufacturing #Industry40 #Engineering #Automation #CNC #LaserCutting #IndustrialTechnology #BeraTech
  
Emily Xue
I will provide you the information about Translate，if you want.
1d
Reply
Share
Tinker Withit
We deal with this quite often and use the closest parameters that we have and begin to make changes. It’s usually just about speed at that point. Everything else is dialed in pretty close.


9. Fiber Laser The Next Level
Chris Savar
But from Haotian Laser. They have the best support and quality machines. Bella Wang will send you a starter material Library with your machine! I've bought 4 machines from her so far. 😃🤩⚡🇨🇦
1d
Reply


UnfilteredReality
Lightburn Material test is the only guaranteed way
1d
Reply
Cory Ryker
You really never go by the manual from any company for ideal settings. Maybe use them as a base and adjust or start with material tests.
1d
Reply
Sebastian Fernandez
Experimenting. It's the only way. Nothing can guarantee that the material you get is the same exact one they tested in their factory
1d
Reply
Aaron Kostuch
Haotian laser Pascal Liu 
Ask4Designs provides full support Australian based global reach
1d
Reply
John Lifer
There are ONLY starting points. NOTHING with lasers is push to play. NOTHING. It's where folks who don't have any idea what they are doing get fooled into buying this technology. (And it isnt just lasers, cnc anything advertising makes it seem like push play and product falls out perfect.)


10. Fiber Laser Engraving Club
Nate Keen
Look up material test in the group search (also YouTube)
Settings in a user manual will maybe get you in the ballpark but there’s no better way than testing on the actual material you are using and saving it to your library. There’s lots of info already in the group on this. Good luck 🤞🏻
If that fails hook up with an expert for some lessons like Victor Wolansky / Chance Lawson


11. DIY Fiber Laser
Lobo Lightbringer
Experimenting. In general, speed parameter is almost the same across brands for each laser source output power. Your first approach would be to find the right focus distance. Then you can work your cut quality by tweaking gas pressure, frequency, etc..

George Leonard Hess
Hi Matt, depending on the manufacturer, you should certainly have access to their engineering support team that will be happy to help. Normally connect via wechat or WhatsApp. If you need help connecting, let me know and i can help🤷‍♂️ will need to know manufacturer and also machine plate showing serial numbers.


12. Free Laser Files
Matthew Olds
The manual is useless since every single material is different. Take the time and run speed and power tests. There built into lightburn for a reason
1d
Reply
Share
Lea Ann Duncan
Matthew Olds have been circulating this for weeks. 🙂
May be an image of text that says 'CREALITY LASER PHOTO ENGRAVING THE RIGHT WAY MATC YOUR IMAGE To YOUR LASER DPI, SIZE & SETTINGS MACHINE CR FALCON 10W 22W LASER SPOT DPI CREALITY 0.08 mm mitfor SHARE SWEET SPOT 0.06 mm GREAT 318 DPI DETAILISLIMTEDBY/SPOTSIZE. ROUND =423DP 423 SIZE CHEAT SHEET 4INCHES) engraving slate, Range:3 423D DPI point. BINCHES) IMAGE 423DP 92：1692px ightness, aAeAnr repixelsdoes MISTAKES Musdydark oe&cinedetall OK dotted Increase ดกฎู LCNe Oner creasepomer Lower Dither RECOMMENDED STARTINGSETTINGS PASST ROUGH RESIZEa GOODSTARTING 350DPI 140.072mmineIntervail) 10W PRO TIPS ค Detar Passes: 22W Dusmval.ereptes belaneunghe 12000 Passes: CharquONEsatting whatactu:llyteloed RIGHT RIGH RESULTS'
1d
Reply
Share
Lea Ann Duncan
Works on all material not just wood
1d
Reply
Share
Matthew Olds
Lea Ann Duncan not accurate since all woods are different even same wood from different suppliers. Run a test every time
1d
Reply
Share
Lea Ann Duncan
Matthew Olds this is a test file to burn on the item and help with settings. DO YOU HAVE ONE BETTER
1d
Reply
Share
Matthew Olds
Lea Ann Duncan lightburn litterly has then built in. the one you provided is laser specific. the op does not have a creality laser..
1d
Reply
Share
John Collings
I do a lot of testing. But find I get there reasonably quickly using some of my other lasers principles
1d
Reply
Share
Klaus Wojczykowski
Agree, lightburn test pattern for each new material. Then if I want to make something that is similar to something I already made with that material I will use that old Lightburn file as template. Documentation has not a lot do with it no matter if Chinese or English.
1d
Reply
Share
Shaun Prinsloo
Buy a ComMarker laser, every machine comes with a detailed material settings library. Just love ComMarker they are simply the best....


13. Laser Engraving And Cutting
Carole Krieghoff Scott
Having service is really important. Rabbit Laser sets up and trains you onsite how to use the Fiber machine. I am not aware of any factory providing documentation for the laser machines.
1d
Reply
Share
Richard Hughes
Carole Krieghoff Scott Gweike have a very good user manual with material settings. I think it's because they're Hong Kong based so have good English language skills.
1d
Reply
Share


Brandon Dalton
People with similar lasers can help with starting parameters, but material tests are always the best way to find your parameters. There are built in tests with Lightburn and LaserGRBL.
Someone with the exact same laser may find different optimal settings from you.
1d
Reply
Share
Benjamin H Long Sr.
Y'all's came with manuals? I just figured stuff out by trial and error.
1d
Reply
Share
Stephen Walker
By doing material tests. Watch utube, it's not hard it burns a pattern on the material at various speeds and power settings then you use the one you like best......if you you use lightburn it's in the laser tools menu
1d
Reply
Share
Michael Bergeron
Check Etsy I found a couple people who sell setting files for fiber lasers. They are pretty good for starting points but every last and material behave differently and need to be tested.
1d
Reply
Share



14. Laser Engraver Group for Beginner ✅
Miranda Courtney
Checkout this for help

(shared image of book called "The complete laser mastry guide by Grace T Girth")




15. Fiber Laser Metal Engraving
Mike Kartchner
he runs a 1on1 training service for engraving

Steve Froud
Run a material test and you'll then get the best settings for the material and your machine. Simple to set up the test with Lightburn. Paracordia UK
1d
Reply
Mike Kartchner
OMG Laser is the only Chinese Laser Builder who doesn’t downgrade Component when a cheaper, lower quality one becomes available. Only Raycus QB, JPT EM7 60 Watt, M7 80 to 200 Watts. No low quality QS, EM7 80-200 Watts or E2M7 Modules. 10000mm/s High Temp Coated Quartz Mirrors, no K9 Glass Mirrors . High quality Aluminum Cases, heavy duty Tower Construction with 20mm Polished Stainless Steel Guide Shafts with Linear Bearings. The Tower is an 11mm Thick Extrusion, some are 3mm with Steal Rollers riding on Aluminum. Quality Crystal & Quartz JG Brand Lenses. 3 Year Warranty.

Mike Kartchner
https://omglaser.com/laser-settings/
Laser Settings | Fiber Laser Engraver Parameters | OMG Laser
OMGLASER.COM
Laser Settings | Fiber Laser Engraver Parameters | OMG Laser
Laser Settings | Fiber Laser Engraver Parameters | OMG Laser
1d
Reply
Mike Kartchner
https://omglaser.com/products/
Best Mopa Fiber Laser Engraving Machine | Topa Value Laser Machines For Engraving, Marking, Cutting Metal, Plastic, Wood, Glass, Leather, Stone | OMG Laser
OMGLASER.COM
Best Mopa Fiber Laser Engraving Machine | Topa Value Laser Machines For Engraving, Marking, Cutting Metal, Plastic, Wood, Glass, Leather, Stone | OMG Laser

---

## Round 2 Analysis (2026-06-14)

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

## Next Steps (As of 2026-06-14)

### Immediate (This Week)

1. **Follow up on Round 1 leads** — Gentle bump to Mike, Nate, Sean
2. **DM new Round 2 high-value respondents**:
   - Jeremy Hubert (technical depth, "no two machines are the same")
   - Michael Stanislawczyk (knows LaserParams Converter, tech-savvy)
   - Tinker Withit ("just about speed" = experienced insight)
   - George Diffey (HSG tube laser, practical operator)
   - Klaus Wojczykowski (templates from old files = proto-database user)
3. **Research LightBurn .clb file format** — integration path

### Short-Term (Next 2 Weeks)

4. **Pivot messaging**: Stop "parameter database" → Start "machine intelligence that learns YOUR setup"
5. **Investigate Beam Squadron** (beamsquadron.com) — sign up, see what they offer
6. **Buy 1-2 Etsy parameter files** — see format, content, gaps. Validates pricing

### Medium-Term (Building Phase)

7. **LightBurn integration is NON-NEGOTIABLE** — MVP must import/export .clb files
8. **"Speed recommendation" as MVP** — v1 just recommends speed for material/thickness/machine
9. **Partner with Victor Wolansky or Chance Lawson** — they have your target audience

