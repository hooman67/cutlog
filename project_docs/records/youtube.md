# CutLog — YouTube & Creators (Running Log)

> One file for ALL YouTube comment work AND creator/influencer outreach. Trusted record of what we
> actually did. Real operator feedback = ground truth; prior-agent narrative = untrusted (marked).
> See `4.8_research/OUTREACH_STRATEGY.md` for the authoritative strategy. Update every session.

**Last updated:** 2026-06-28

## Strategy (pointer)

**YouTube comments (highest-intent, lowest-cost).** Leave genuinely helpful comments on
laser-cutting/engraving videos where viewers ask "what settings?" — the comment IS the value;
CutLog is cited as the source, never a pitch.
- **Target video types:** fiber cutting tutorials (thick steel/stainless), "my new fiber laser"
  unboxings, galvo engraving how-tos (tumblers/coins/cards), "laser settings for [material]" videos.
  (Legacy doc also lists xTool/diode, LightBurn tutorials, K40/CO2 acrylic/wood/MDF/plywood — useful
  but lower priority than industrial fiber per the June-26 focus pivot.)
- **Cadence:** 2–3 comments/day. Lead with the actual numbers (power/speed/gas/focus), then the link
  as the source. Comments age well and keep pulling traffic.
- **Numbers-then-link, but mind the spam filter:** YouTube shadow-deletes link-bearing comments from
  newer accounts (confirmed below). Current practice = no inline URL; "From CutLog… link on my
  channel" sign-off, CutLog link on the channel About page.

**Micro-YouTuber plan (the real influencer play).** Target ~20 micro-YouTubers (500–5K subs):
hungry for content, authentic, targeted. Offer **exclusive data for their video** (e.g., "here's a
verified starting-point grid for the 3mm brass video you're planning") — no ask, just make it useful.
Realistic target: **3–5 mentions in 90 days.** Use template E.

Authoritative strategy: `4.8_research/OUTREACH_STRATEGY.md` (YouTube §2, influencers §4, templates C & E).

## What we've actually done

### YouTube comments — DONE (verified from legacy activity log)

**2026-06-26 — Batch 1 (5 comments, stainless steel):**
| # | Video | Topic | Status |
|---|-------|-------|--------|
| 1 | "How to Perfectly Cut Stainless Steel with a Fiber Laser" (`watch?v=VeNtxuPtRtA`) | 304 stainless by thickness | Posted (no link) |
| 2 | "30w Fibre laser. JET BLACK settings on Stainless Steel" (`watch?v=_8pJU5AxjXg`) | Black marking + oxide layer | Posted (no link) |
| 3 | "Get black markings on stainless steel with 20w ComMarker B6" (`watch?v=SKHaJ9Kxh1s`) | 20W marking params | Posted (no link) |
| 4 | "How to cut 0.5 mm stainless steel with 30 watt fiber laser" (`watch?v=YPpaf78S_Gs`) | 0.5mm cutting, air assist | Posted (no link) |
| 5 | "Aurora LITE 50W Fiber Laser. Stainless Steel: Jewelry" (`watch?v=SFziZi3bzZc`) | 50W jewelry-scale settings | Posted (no link) |

- **Confirmed learning (ground truth, not narrative):** first attempt WITH `cutlog-two.vercel.app`
  links was shadow-deleted (visible to poster, gone on refresh). All 5 re-posted WITHOUT URLs and
  persist. **Rule going forward: no inline links in YT comments.**

**2026-06-27 — Batch 2 (5 comments, diversified materials):**
| # | Video | Topic |
|---|-------|-------|
| 1 | "15W UV vs 100W Fiber Laser - Aluminum Marking Test" (`watch?v=rFsjETMzlT0`) | Aluminum engraving by thickness |
| 2 | "DEEP ENGRAVE BRASS w/ Monport 60W Fiber Laser" (`watch?v=DF5YonfNYi0`) | Brass marking + deep engrave, line interval |
| 3 | "Acrylic Engraving & Cutting Tips - CO2 Lasers" (`watch?v=F3Cgcyrk6iM`) | Acrylic cutting/frosting |
| 4 | "3D Engraving on Wood - 30w Diode Laser LightBurn" (`watch?v=gayh5DXx9Sc`) | Wood cutting, focus tips |
| 5 | "Color Laser Marking MOPA - Copper, Glass & Titanium" (`watch?v=QpH0mJwnKb4`) | Copper/titanium MOPA color marking |

- All no-link; sign-off "From CutLog — community-verified settings from real operators + AI. Link on
  my channel."
- **Running total: 10 YT comments across 2 days** (5 stainless + 1 aluminum + 1 brass + 1 acrylic +
  1 wood + 1 copper/titanium).

### Creator/influencer outreach — DONE (status as of legacy logs)

These are *claimed by prior-agent logs* (sent counts/dates plausible but the engagement framing is
narrative — treat replies quoted below as the verifiable part):
- **2026-06-21:** emailed **Laser Everything (Alex)**, **OMG Laser (Richard)**; submitted **Justin
  Laser** website form. No replies recorded.
- **2026-06-22:** Instagram DM to **Jessie Jones / Jones Laser Craft** → real reply "Hey Matt, I'll
  take a look. Thanks." (warm, polite, no follow-through recorded). Follow-up sent 2026-06-23.
- **2026-06-25:** Instagram DMs to **Alisha Pate (Laser Lounge)** and **Chance Lawson (Beam
  Squadron)** — no replies recorded. Facebook DM to **Victor Wolansky** → real reply "I'll take a
  look after classes." (warm, not yet tried).
- **Not yet contacted (queue):** Mike Kartchner (OMG/FB), Russ Sadler, Laser Livestream, McCarty's
  Creations (TikTok).

> Caveat: prior-agent assessments calling these "WARM" / "building relationship" are **claimed,
> unverified** — the only ground truth is the short replies above (Jessie, Victor). No creator has
> confirmed trying the app except Nate Keen (below).

## Creators & real feedback (ground truth)

### Nate Keen — the one creator who actually used the app

- **Reach:** 20K YouTube + 225K TikTok (combined; "mainly just do YouTube these days"). One laser
  video ~14K views. Wants to do more laser tutorial content. Sample: `youtu.be/EKpd3QfnWuk`.
- **Machines:** Galvo / MOPA fiber **engraving** (NOT cutting). Explicitly: *"We don't use gas
  either… that sounds a bit more like proper expensive laser cutting which isn't my area."*
- **His deep technical insight (GROUND TRUTH):** per-machine variation is huge — run at 100% power →
  ~5-year machine life; 85–90% → ~40 years, so every machine performs differently. Plus lens quality,
  focus calibration, galvo head out 1–2mm. **"Line interval actually has more relevance than anything
  else"** (more than power/frequency). Knowledge is "all in my head from years of experience." Also:
  galvos **don't drift** and are "very reliable" — directly contradicts the product's per-machine
  drift-learning pitch for the engraving segment.
- **The key endorsement quote (most important in the whole corpus):** *"It would definitely be cool
  to grab hundreds of settings to see what works, but you'd need a massive amount of verified tests…
  It sounds like a great project though and even if it gets people in the ballpark for material
  testing that's 90% there!"*
- **What he actually did with the app (2026-06-25):** tried it. Reported, verbatim:
  1. **".clb import not working"** — *"Doesn't seem to recognise .clb files."* (his sole onboarding
     path; it broke on the one committed power user).
  2. *"Settings input looks pretty good."* (positive).
  3. *"Doesn't look like I can open a stored setting and edit other than speed and frequency."* (edit
     too limited).
  4. (2026-06-27) **Q-pulse missing** — *"does it have q pulse in the settings? I don't remember
     seeing that"* — critical MOPA/galvo param (pulse width, ns).
  5. Cutting terminology / brand list don't apply to his galvo world.
- **Fixes shipped in response (claimed deployed by prior agent):** .clb galvo-format import fix +
  full-field edit form (2026-06-26); **Q-pulse field + galvo mode** that hides gas/nozzle/focus
  clutter (2026-06-27). Nate's re-test of these fixes is **not yet confirmed** (he's been on service
  calls). His "ballpark/90% there" quote predates the fixes.
- **Other Nate threads:** offered to make a video for his channels *after* the tool is polished
  ("Once all the bugs are sorted out… then you can worry about feature advertising… I can make a
  video"). Separately wants a custom-font preview tool for his customers (a prototype at
  `/tools/font-preview` was built and iterated for him). Manual .clb→CSV is "quite tedious… hundreds
  of times… that's just one laser and lens combination."

> **RULE — DO NOT MESSAGE NATE KEEN. Leave him alone; let him return on his own.** A video to his
> audience is worth more than all FB posts combined, but pushing risks it. (Per current
> OUTREACH_STRATEGY.md.)

### Other creators referenced in feedback (not contacted as "creators" / not real CutLog users)

- **Victor Wolansky** and **Chance Lawson** — named by operators as paid 1-on-1 trainers; also DM'd
  in influencer outreach (see above). Victor replied "I'll take a look after classes"; no app use
  confirmed.
- **Mike Kartchner (OMG Laser)** — shares the OMG settings page (`omglaser.com/laser-settings/`) in
  FB groups; CutLog scraped ~177 OMG entries into the DB. In outreach queue, not yet contacted.

## Open action items

- **Leave Nate Keen alone.** Do not message him. Let him re-test the .clb/Q-pulse/galvo-mode fixes
  and return on his own. (Highest-leverage relationship; do not jeopardize.)
- **Micro-YouTuber outreach:** target **3–5 mentions over 90 days** from ~20 micro-YouTubers
  (500–5K subs). Offer exclusive verified-data grids for videos they already have planned (template
  E). Per strategy timeline this ramps in **Month 2–3**.
- **YT comment cadence:** **2–3/day**, lead with numbers, **no inline links** (shadow-delete risk) —
  link via channel About page / "DM me." Prioritize fiber cutting + galvo engraving videos.
- **Vary comment text** (never reuse verbatim) and rotate openings/sign-offs to avoid bot-like
  patterns (legacy lesson from first 10 comments).

## Templates / assets

**YouTube comment templates (from OUTREACH_STRATEGY.md, condensed):**

- **C1 — cutting tutorial:** "Great breakdown. For anyone asking what to start at on [material]
  [thickness]: ~[speed] mm/min, [gas] at ~[pressure] bar, focus ~[focus]mm — then confirm with a
  material test since every machine varies. I keep verified starting points in a free tool I built:
  [link]."
- **C2 — galvo engraving how-to:** "Nice results. If you're dialing this in: line interval matters
  more than almost anything on galvo — start around [value] and tune frequency/Q-pulse from there.
  Free starting-point tool with a galvo mode (no cutting clutter): [link]."
- **C3 — "what settings did you use?" reply:** "For [material] on a [wattage] [type], a solid
  starting point is [speed] / [power] / [passes] — then test on a scrap, every machine's a bit
  different. Free tool where I keep these by machine: [link]."

> Note: include the inline link only where the spam filter tolerates it (replies / older accounts);
> default to no-link + "link on my channel" per the 2026-06-26 shadow-delete finding.

**Influencer outreach DM (template E — micro-YouTuber):**

- "hey [name] — really liked your [specific video]. I run a free laser starting-point database
  (5,800+ verified settings, .clb import, galvo mode) and I'm putting together exclusive data sets
  for creators. if you've got a [material/machine] video planned I'll build you a verified
  starting-point grid you can show on screen — no ask, just want it to be useful. happy to send a
  sample: [link]."

**Voice (memorize):** honest "starting point, fewer test squares" — never plug-and-play, never "zero
competition," never AI-as-the-hero. Solve the problem first; tool is the source, not the pitch.
