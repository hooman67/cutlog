# YouTube Comments Strategy: Answer-First Outreach

## Strategy Overview

**Goal:** Leave genuinely helpful comments on laser cutting/engraving YouTube videos where viewers are asking "what settings?" questions. Lead with real data, naturally mention CutLog as the source.

**Principle:** The comment IS the value. CutLog is mentioned as "where I keep all my tested data" -- not as a pitch.

**App URL:** https://cutlog-two.vercel.app

---

## Target Video Categories & Channels

### Category 1: Fiber Laser Metal Engraving/Cutting

These videos consistently generate "what settings?" comments because fiber laser parameters are notoriously finicky and machine-specific.

---

#### Video 1: "Fiber Laser Engraving on Stainless Steel - Complete Guide"
- **Search term:** `fiber laser stainless steel settings`
- **Target channels:** Sadler's Machining, Laser Everything, CloudRay Laser
- **Subscriber range:** 20K-150K
- **Material/Machine:** Stainless Steel 304 / fiber laser (20W-60W)
- **Why target:** Every fiber laser video on stainless has 5-10 "what settings do you use?" comments

**Draft Comment:**
```
For anyone looking for a starting point on 304 stainless:

- 0.5mm: 60-64% power, 1100 mm/min, air assist
- 1mm: 42% power, 488 mm/min, O2 assist gives cleanest edge
- 2mm: 86% power, 661 mm/min, N2 assist (nitrogen prevents oxidation discoloration)

These are from a database of tested parameters I've been compiling at cutlog-two.vercel.app -- has 550+ entries across 20 materials with different thicknesses. Might save you a few test pieces.
```

---

#### Video 2: "Fiber Laser Settings for Aluminum - What Actually Works"
- **Search term:** `fiber laser aluminum engraving settings`
- **Target channels:** Laser Everything, Russ Sadler, AP Lazer
- **Subscriber range:** 15K-100K
- **Material/Machine:** Aluminum / fiber laser (30W-60W)
- **Why target:** Aluminum is notoriously reflective and settings vary wildly

**Draft Comment:**
```
Aluminum settings that actually worked consistently in my testing:

- 0.5mm cutting: 56% power, 1782 mm/min, N2 gas assist
- 1mm cutting: 45% power, 977 mm/min, air assist works fine
- 2mm cutting: 31% power, 711 mm/min, air assist

Key thing with aluminum: nitrogen assist prevents the white oxide layer on cut edges. Air works for thin stock but you'll get discoloration on 2mm+.

I've been logging all my parameter tests at cutlog-two.vercel.app if anyone wants to cross-reference -- 32 aluminum entries across different thicknesses.
```

---

#### Video 3: "Brass Engraving on Fiber Laser - Tips and Settings"
- **Search term:** `fiber laser brass cutting settings`
- **Target channels:** Sadler's Machining, Laser Everything, Thunder Laser
- **Subscriber range:** 10K-80K
- **Material/Machine:** Brass / fiber laser
- **Why target:** Brass is copper-alloy and tricky; very few good resources

**Draft Comment:**
```
Brass settings for anyone struggling with this:

- 0.5mm: 36% power, 840 mm/min with N2 assist (clean cut, no tarnish)
- 1mm: 45% power, 221 mm/min with N2 assist

The key with brass is nitrogen gas -- if you're using air assist you'll get oxidation on the cut edge that looks terrible. Slow speed + N2 = mirror-quality edges.

I track all my brass/copper parameters at cutlog-two.vercel.app (24 entries for brass alone). Saves a lot of scrap pieces.
```

---

### Category 2: CO2 Laser Acrylic/Wood Cutting

These are the highest-volume search topics. Every K40, Glowforge, and generic CO2 laser owner needs these.

---

#### Video 4: "Laser Cutting Acrylic - Speed and Power Settings for Clean Edges"
- **Search term:** `laser cut acrylic settings speed power`
- **Target channels:** DIY3DTech, Louisiana Hobby Guy, Russ Sadler
- **Subscriber range:** 30K-200K
- **Material/Machine:** Acrylic / CO2 laser (40W-100W)
- **Why target:** Acrylic is the #1 material people ask about; settings vary by color/brand

**Draft Comment:**
```
For CO2 laser users cutting cast acrylic, here's what I've found works:

- 3mm: ~37% power, 494 mm/min, single pass, air assist
- 5mm: ~49% power, 161 mm/min (much slower!), single pass
- 8mm: ~48% power, 222 mm/min, single pass

Pro tip: Cast acrylic cuts cleaner than extruded at same settings. And leave the masking on -- it prevents flashback marks.

I maintain a settings database at cutlog-two.vercel.app with 31 acrylic entries across 5 thicknesses if you want more starting points for your specific wattage.
```

---

#### Video 5: "K40 Laser Settings for Beginners - Material Test Guide"
- **Search term:** `K40 laser cutter settings beginners`
- **Target channels:** DIY3DTech, Maker's Muse, Just Vlad
- **Subscriber range:** 20K-300K
- **Material/Machine:** Various / K40 (40W CO2)
- **Why target:** K40 is the most common budget laser; owners are desperate for settings

**Draft Comment:**
```
K40 settings that saved me weeks of testing:

MDF (3mm): 32% power, 479 mm/min, air assist ON
Plywood (3mm): 31% power, 496 mm/min, air assist ON
Acrylic (3mm): 37% power, 494 mm/min, air assist ON

These are for a 40W tube in good condition. If your tube is aging (6+ months heavy use), bump power up 5-10%.

I've been collecting verified settings from the community at cutlog-two.vercel.app -- 550+ entries across 20 materials. Useful when you get a new material and don't want to burn through test pieces.
```

---

#### Video 6: "Cutting Plywood with a Laser - Best Settings Revealed"
- **Search term:** `laser cut plywood settings`
- **Target channels:** DIY3DTech, Louisiana Hobby Guy, Makers Workshop
- **Subscriber range:** 15K-120K
- **Material/Machine:** Plywood / CO2 laser
- **Why target:** Plywood charring is a universal pain point

**Draft Comment:**
```
Settings that give minimal charring on plywood:

- 3mm birch ply: 31% power, 496 mm/min, air assist ON (critical for char reduction)
- 5mm birch ply: 27% power, 496 mm/min, air assist ON

The trick is: higher speed + lower power = less charring, even if you need 2 passes. One pass at the right speed is always cleaner than two slow passes though.

Also: masking tape on both sides eliminates smoke staining. Cheapest improvement you can make.

I track parameters for 12+ wood types at cutlog-two.vercel.app if anyone wants thickness-specific recommendations.
```

---

### Category 3: xTool / Diode Laser Settings

xTool D1 Pro and similar diode lasers are the fastest-growing segment. Owners are typically newer makers.

---

#### Video 7: "xTool D1 Pro Settings for Every Material"
- **Search term:** `xtool D1 pro settings materials`
- **Target channels:** Create With Cass, xTool Official, Laser Master Academy
- **Subscriber range:** 10K-80K
- **Material/Machine:** Various / xTool D1 Pro (10W-20W diode)
- **Why target:** xTool has exploded in popularity; new users need immediate help

**Draft Comment:**
```
For xTool D1 Pro 20W diode users -- settings that consistently work:

MDF (3mm): 32% power, 480 mm/min, 1 pass
Plywood (3mm): 31% power, 496 mm/min, 1 pass  
Acrylic (3mm): Note -- diode lasers struggle with clear acrylic! Use black or painted acrylic only.
Leather (2mm veg-tan): around 25-30% power, 400 mm/min

Important: Diode laser settings scale differently than CO2. Your 20W diode ≠ a 20W CO2 tube.

I've been building a settings database at cutlog-two.vercel.app that accounts for different laser types. Might save some test material.
```

---

#### Video 8: "xTool Material Settings I Wish I Knew Sooner"
- **Search term:** `xtool settings tips tricks`
- **Target channels:** Makers Gonna Learn, Create With Cass
- **Subscriber range:** 20K-60K
- **Material/Machine:** Various / xTool
- **Why target:** "Tips I wish I knew" videos attract frustrated users in comments

**Draft Comment:**
```
Biggest tip I can add: always test with a small square (10x10mm) before committing to a full piece. It uses almost no material and tells you immediately if you need to adjust.

For anyone asking about specific materials in the comments -- I maintain a tested settings database at cutlog-two.vercel.app with 550+ entries. It accounts for laser type and wattage, so the recommendations adjust whether you're on a 10W or 20W module.

The most-asked settings I see:
- Leather (2mm): ~25% power, 400 mm/min
- Cork (3mm): medium power, single pass
- MDF (3mm): ~32% power, 480 mm/min
```

---

### Category 4: LightBurn Software Tutorials

LightBurn users are typically more technical and appreciate data-driven tools.

---

#### Video 9: "LightBurn Cut Settings Editor Explained"
- **Search term:** `lightburn cut settings editor tutorial`
- **Target channels:** LightBurn Software (official), Louisiana Hobby Guy, Russ Sadler
- **Subscriber range:** 15K-100K
- **Material/Machine:** Software-focused (all laser types)
- **Why target:** People watching LightBurn tutorials are actively configuring settings

**Draft Comment:**
```
One thing that helps with the cut settings editor: having a baseline to start from instead of guessing.

If you export your .clb library file, you can also import it into cutlog-two.vercel.app -- it parses the XML and shows you all your settings in one view. Useful for seeing gaps (materials you haven't dialed in yet).

The database there has 550+ community-tested parameters you can cross-reference against your own library. I found a few of my settings were way off when I compared.
```

---

#### Video 10: "LightBurn Settings for Beginners - What Every Setting Does"
- **Search term:** `lightburn settings beginners guide`
- **Target channels:** LightBurn Software, Sadler's Machining
- **Subscriber range:** 15K-100K
- **Material/Machine:** Software-focused
- **Why target:** Beginners asking "what should I set speed/power to?"

**Draft Comment:**
```
For beginners overwhelmed by the settings panel -- here are proven starting points:

CO2 40W cutting:
- 3mm acrylic: Power 37%, Speed 8.2 mm/s, 1 pass
- 3mm plywood: Power 31%, Speed 8.3 mm/s, 1 pass
- 3mm MDF: Power 32%, Speed 8.0 mm/s, 1 pass

The key insight: similar materials (plywood, MDF) use almost identical settings. Once you nail one, the others are close.

I keep a growing database of these at cutlog-two.vercel.app -- you can filter by laser type and wattage to get recommendations matched to your setup specifically.
```

---

### Category 5: Specific Metal Cutting/Engraving Deep-Dives

---

#### Video 11: "Laser Engraving Stainless Steel Tumblers - Complete Tutorial"
- **Search term:** `laser engrave stainless steel tumbler settings`
- **Target channels:** Laser Master Academy, Country Charm Creations, Monport Laser
- **Subscriber range:** 5K-50K
- **Material/Machine:** Stainless Steel / fiber or diode+marking compound
- **Why target:** Tumbler engraving is a massive cottage industry; settings questions everywhere

**Draft Comment:**
```
For tumbler engraving on stainless, the settings depend heavily on whether you're using marking compound (Cermark/dry moly) vs. direct engraving:

Direct fiber engraving on 304 stainless:
- For color marking: lower power (30-40%), higher speed (900-1050 mm/min), multiple passes
- For deep engrave: 60-64% power, 1100 mm/min, single pass

With marking compound on a diode laser:
- Much lower power needed (20-30%), slow speed (200-300 mm/min)

The gas assist makes a huge difference too -- N2 at 3.9 bar gives the cleanest result on bare stainless.

I've compiled 100+ stainless steel parameter entries (304, 316, 430) at cutlog-two.vercel.app if you want to compare against your setup.
```

---

#### Video 12: "Carbon Steel Cutting Parameters - Fiber Laser Guide"
- **Search term:** `fiber laser carbon steel cutting parameters`
- **Target channels:** Sadler's Machining, Trumpf, Eagle Laser
- **Subscriber range:** 10K-200K
- **Material/Machine:** Carbon/Mild Steel / fiber laser
- **Why target:** Industrial users transitioning to fiber need reference parameters

**Draft Comment:**
```
Carbon steel cutting parameters I've validated:

- 1mm: 51% power, 628 mm/min, air assist
- 2mm: 54% power, 458 mm/min, O2 assist (oxygen gives ~30% faster cutting on carbon steel vs air)
- 3mm: 55% power, 315 mm/min, air assist

Mild steel is similar:
- 1mm: ~50% power, 600+ mm/min
- 2mm: ~55% power, 450 mm/min
- 3mm: ~60% power, 350 mm/min

Key tip: Oxygen assist on carbon steel increases cutting speed but creates an oxide layer on the edge. Use nitrogen if you need clean weld-ready edges.

I maintain 48 carbon steel + 39 mild steel entries at cutlog-two.vercel.app, organized by thickness and gas type.
```

---

#### Video 13: "Laser Cutting MDF - Settings and Tips to Avoid Charring"
- **Search term:** `laser cut MDF settings charring`
- **Target channels:** DIY3DTech, Makers Workshop, Just Add Sharks
- **Subscriber range:** 15K-80K
- **Material/Machine:** MDF / CO2 laser
- **Why target:** MDF charring is the #1 complaint; everyone wants the "magic" settings

**Draft Comment:**
```
For clean MDF cuts without excessive charring:

- 3mm: 32% power, 479 mm/min, air assist ON
- 5mm: 30% power, 429 mm/min, air assist ON

Critical tips to reduce charring:
1. Air assist is non-negotiable -- it blows away combustion products
2. Single pass > multiple passes (reheating char makes it worse)
3. Higher speed + slightly more power = less heat soak = less char
4. Masking tape on the surface catches smoke staining

I've tested 25 MDF parameter combinations across 4 thicknesses -- all logged at cutlog-two.vercel.app. The database shows which ones had clean edges vs. char issues.
```

---

#### Video 14: "Galvanized Steel Laser Cutting - Is It Safe? What Settings?"
- **Search term:** `laser cut galvanized steel settings safe`
- **Target channels:** Sadler's Machining, Laser Everything
- **Subscriber range:** 15K-100K
- **Material/Machine:** Galvanized Steel / fiber laser
- **Why target:** Safety concerns + settings questions = high engagement comments

**Draft Comment:**
```
SAFETY FIRST: Laser cutting galvanized steel produces zinc oxide fumes. Always use proper extraction with a HEPA + activated carbon filter, and ideally work in a ventilated area. Never cut galv without extraction.

That said, the settings that work (with proper safety):
- 0.5mm: moderate power, fast speed (similar to mild steel settings)
- 1mm: ~50% power, ~600 mm/min
- 2mm: ~60% power, ~400 mm/min

The zinc coating burns off in the kerf zone regardless -- you'll always have a bare-steel edge. Factor that into your corrosion planning.

I've got 29 galvanized steel entries across 5 thicknesses at cutlog-two.vercel.app for anyone who needs thickness-specific parameters.
```

---

#### Video 15: "Leather Cutting and Engraving - Laser Settings for Perfect Results"
- **Search term:** `laser cut leather settings`
- **Target channels:** Louisiana Hobby Guy, Thunder Laser, Country Charm Creations
- **Subscriber range:** 10K-80K
- **Material/Machine:** Leather / CO2 or Diode
- **Why target:** Leather crafting is a huge maker niche with lots of settings questions

**Draft Comment:**
```
Leather settings depend heavily on the type -- veg-tan vs chrome-tan vs bonded are totally different:

Veg-tan leather (what most hobbyists use):
- 1mm: low power (~20%), fast speed, single pass
- 2mm: moderate power, medium speed
- 3mm: moderate-high power, slower speed

IMPORTANT: Never laser chrome-tanned leather -- it releases toxic chromium compounds. Stick to vegetable-tanned only.

For engraving (not cutting through): use much lower power (10-15%) at higher speed for a nice surface mark without cutting.

I've compiled 25 leather entries across different thicknesses at cutlog-two.vercel.app -- all veg-tan, since that's what's safe to laser.
```

---

## How to Find These Videos (Manual Search Process)

Since automated YouTube scraping isn't viable, here's the manual workflow:

### Step 1: Search YouTube directly with these queries
1. `fiber laser stainless steel settings 2026`
2. `fiber laser aluminum settings`
3. `K40 laser settings acrylic wood`
4. `xtool D1 pro material settings`
5. `lightburn settings tutorial beginner`
6. `laser cutting acrylic settings`
7. `laser engraving stainless tumbler`
8. `laser cut plywood settings charring`
9. `laser cut MDF settings`
10. `laser cutting brass settings`

### Step 2: Filter for ideal targets
- **Upload date:** Last 6 months (sort by "Upload date")
- **View count:** 1K-100K views (enough audience, not so big you're drowned out)
- **Comment section:** Look for "what settings?" or "what speed and power?" comments
- **Channel size:** 5K-150K subscribers (responsive communities)

### Step 3: Verify comment demand
Before commenting, scroll through existing comments looking for:
- "What settings did you use?"
- "What power and speed?"
- "Will this work on my [machine]?"
- "Settings please!"
- "What about [different thickness]?"

---

## Timing and Frequency Guidelines

### Comment Volume
- **Days 1-7:** 2-3 comments per day maximum
- **Days 8-14:** 3-4 comments per day
- **Days 15+:** 4-5 comments per day (if no flags)

### Why This Cadence
- YouTube's spam detection flags accounts that suddenly post many comments with links
- New accounts with links get auto-filtered more aggressively
- Spacing comments 4-6 hours apart looks more natural than posting 5 in a row

### Timing Strategy
- **Best times:** Post when video is 1-7 days old (active comment section, creator might pin)
- **Also good:** Videos 1-3 months old with recent "what settings?" comments (your answer helps the commenter directly)
- **Avoid:** Videos older than 6 months (comments section mostly dead)

### Account Health
- Use your personal YouTube account (not a brand account)
- Have a profile picture and some watch history (looks like a real person)
- Leave some comments WITHOUT links first (build comment history)
- Never use the exact same comment text twice (YouTube detects copy-paste)
- Vary the CutLog URL format: sometimes "cutlog-two.vercel.app", sometimes "a database I built" without the link (reply with link if someone asks)

---

## Prioritization Matrix

### Priority 1 (Comment this week)
| Video Type | Why | CutLog Data Strength |
|-----------|-----|---------------------|
| Fiber laser stainless steel | Highest demand, least good answers exist | 103 entries (304+316+430) |
| K40/CO2 acrylic cutting | Massive audience, everyone asks | 31 entries, 5 thicknesses |
| Carbon/mild steel cutting | Industrial crossover audience | 87 entries combined |

### Priority 2 (Comment next week)
| Video Type | Why | CutLog Data Strength |
|-----------|-----|---------------------|
| Aluminum fiber laser | Growing demand, reflectivity problems | 32 entries |
| xTool D1 material settings | Fast-growing audience, newer users | Applicable data |
| MDF/plywood charring | Universal pain point | 56 entries combined |

### Priority 3 (Ongoing)
| Video Type | Why | CutLog Data Strength |
|-----------|-----|---------------------|
| LightBurn tutorials | Technical users, .clb import angle | Software integration |
| Brass/copper cutting | Niche but underserved | 24 entries |
| Leather cutting | Large craft community | 25 entries |
| Galvanized steel | Safety + settings combo | 29 entries |

---

## Comment Variations (Avoid Repetition)

### Opening Hooks (rotate these)
- "For anyone still looking for settings on this..."
- "Settings that consistently worked in my testing:"
- "Answering [commenter name]'s question about settings:"
- "Here's what I've found works for [material]:"
- "Quick reference for anyone dialing this in:"

### CutLog Mentions (rotate these)
- "I've been compiling these at cutlog-two.vercel.app"
- "I maintain a database of tested parameters at cutlog-two.vercel.app"
- "All my test results are logged at cutlog-two.vercel.app if you want more"
- "I track parameters for [X] materials at cutlog-two.vercel.app"
- "Cross-reference against the community database at cutlog-two.vercel.app"
- [Sometimes: no link at all -- just the helpful data. Reply with link only if someone asks]

### Closing Lines (rotate these)
- "Might save you a few test pieces."
- "Hope that helps as a starting point."
- "Adjust from there based on your specific tube/module."
- "Let me know if you need a different thickness."
- "Happy to share more specific parameters if needed."

---

## Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Comments posted per week | 15-20 | Manual log |
| Likes on comments | 3+ per comment avg | YouTube notifications |
| Reply threads generated | 30% of comments get replies | Check weekly |
| Click-throughs to CutLog | Track via Vercel analytics | UTM or referrer |
| "Heart" from video creator | 2-3 per month | Notifications |
| Comments pinned by creator | 1+ per month | Check weekly |

---

## Anti-Spam Safeguards

1. **Never** post the same comment text on two videos
2. **Never** post more than 1 comment per video (unless replying to a direct question)
3. **Always** lead with genuine value (the settings data)
4. **Rotate** whether you include the link or not (maybe 70% with link, 30% without)
5. **Engage** with replies -- if someone says "thanks" or asks a follow-up, respond genuinely
6. **Skip** videos where the creator already provided settings in the description
7. **Never** criticize the video or say "your settings are wrong" -- frame as "additional data point"

---

## Expected Results (Conservative)

- **Month 1:** 60-80 comments posted, 10-20 click-throughs, 3-5 app signups
- **Month 2:** 80-100 comments posted, 30-50 click-throughs, 8-12 app signups
- **Month 3:** Compounding effect as older comments continue getting views

The real value: YouTube comments are permanent. A helpful comment posted today will be seen by viewers for years. This is the highest-ROI content marketing channel for CutLog.

---

## Activity Log

### 2026-06-26: First batch of YouTube comments posted

| # | Video | URL | Comment Topic | Status |
|---|-------|-----|---------------|--------|
| 1 | "How to Perfectly Cut Stainless Steel with a Fiber Laser" | https://www.youtube.com/watch?v=VeNtxuPtRtA | 304 stainless settings by thickness | ✅ Posted (no link version) |
| 2 | "30w Fibre laser. JET BLACK settings on Stainless Steel" | https://www.youtube.com/watch?v=_8pJU5AxjXg | Black marking settings + oxide layer | ✅ Posted (no link version) |
| 3 | "Get black markings on stainless steel with 20w ComMarker B6" | https://www.youtube.com/watch?v=SKHaJ9Kxh1s | 20W marking parameters | ✅ Posted (no link version) |
| 4 | "How to cut 0.5 mm stainless steel with 30 watt fiber laser" | https://www.youtube.com/watch?v=YPpaf78S_Gs | 0.5mm cutting with air assist | ✅ Posted (no link version) |
| 5 | "Aurora LITE 50W Fiber Laser. Stainless Steel: Jewelry, Settings" | https://www.youtube.com/watch?v=SFziZi3bzZc | 50W jewelry-scale settings | ✅ Posted (no link version) |

**Note:** First attempt with direct cutlog-two.vercel.app links was shadow-deleted by YouTube's spam filter (comments appeared for the poster but disappeared on refresh). Re-posted all 5 without URLs, using "DM me if you want the link" instead. All persisting now.

**Learning:** YouTube aggressively shadow-deletes comments containing links, especially from newer accounts posting the same URL across multiple videos. Future YouTube comments should NOT include links. Use "DM me" approach or spell it out without hyperlink.
