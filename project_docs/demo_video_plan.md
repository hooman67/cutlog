# CutLog 30-Second Demo Video Plan

**Last updated**: 2026-06-21  
**Target platform**: Social media (Facebook, email, landing page)  
**Format**: 30-second landscape video (1440x900 or higher, downscaled for social)  
**Hosting**: YouTube (unlisted) or Vimeo (embeds on landing page)

---

## Core Message

**Tagline**: "AI recommendations. Human-verified."

**Positioning**: Unlike other AI tools that just guess, CutLog shows you whether a recommendation comes from verified community data or AI inference. You get the speed of AI with the trust of real operator verification. Plus it learns YOUR specific machine over time.

**Value prop in 30 seconds**: Show how CutLog gives you AI-powered recommendations that are transparently labeled (AI vs human-verified), auto-scaled for your specific lens, and continuously improved by your feedback.

---

## Equipment & Setup (Mac-Specific)

### Screen Recording Tools
- **Option A: QuickTime Player (Free)**
  - Built-in to macOS
  - Simple, reliable
  - Limited editing capabilities
  - Recommended for straightforward screen capture

- **Option B: ScreenFlow ($99)**
  - Better post-recording editing
  - Smoother output, audio sync
  - Recommended if you want professional-grade edit-in-post capability

### Audio Capture
- **Built-in Mac mic**: Adequate but picks up keyboard clicks
- **AirPods Pro**: Clear audio, recommended for voiceover
- **USB condenser mic** (e.g., Blue Yeti): Professional quality
- **Recommendation**: Record screen silent, add voiceover in iMovie/ScreenFlow post-production

### Video Settings
- **Resolution**: Record at 1440x900 or 1920x1080 (will be downscaled for social)
- **Frame rate**: 30 FPS (standard for web)
- **Format**: MP4 (H.264)
- **Final export**: 720p (1280x720) for Facebook/email, 1080p for landing page embed

### Screen Preparation
- Close all notifications and system alerts
- Set system volume to 50% (for voice recording)
- Zoom in browser to 110-120% (easier to read on small screens)
- Use Chrome or Safari (not Firefox — rendering slightly different)
- Clear browser tabs and bookmarks from view

---

## Pre-Recording Checklist

- [ ] **Deploy latest code** — Ensure main branch is pushed and deployed to https://cutlog-two.vercel.app
- [ ] **Test the app** — Load it in browser, verify /suggest, /machine, /import all working
- [ ] **Create a test machine profile** — Register a machine (e.g., "Demo CO2 50W") so the app has context
- [ ] **Prepare test search inputs**:
  - Material: "Stainless Steel"
  - Thickness: "3mm"
  - (These should return a confidence=HIGH recommendation)
- [ ] **Test the speed recommendation** — Run a search, verify the hero card displays (speed number + confidence badge)
- [ ] **Close all other apps** — Mail, Slack, Messages, etc.
- [ ] **Set desktop to clean background** — Remove clutter
- [ ] **Test mic input** — Record 10 seconds of test audio
- [ ] **Prepare voiceover script** — See "Narration Script" section below
- [ ] **Have stopwatch ready** — Use iPhone timer app or online stopwatch to hit timings exactly

---

## Shot List (30 Seconds Total)

Follow this script exactly. Each shot has specific timing and narration.

### SHOT 1: HOOK [0:00-0:05] (5 seconds)

**Visual**:
- Screen shows CutLog `/suggest` page with search form
- User types "Stainless Steel" into material field, "3mm" into thickness
- Hit search

**Narration**: 
"Every AI tool guesses your laser parameters. CutLog actually verifies them."

**Action**: 
1. Material field already focused — type "Stainless Steel" (0:00-0:03)
2. Tab to thickness, type "3" (0:03-0:04)
3. Hit search button (0:04-0:05)

**Why this works**: Opens with a bold claim that differentiates from BeraTech and every other AI tool. Viewer immediately sees the app in action.

---

### SHOT 2: VERIFIED BADGE [0:05-0:12] (7 seconds)

**Visual**:
- Recommendation appears with speed hero number (e.g., "3500 mm/min")
- KEY MOMENT: The BLUE "COMMUNITY" badge is visible on the result
- Confidence badge shows "HIGH"
- Hover cursor near the badge to draw attention to it

**Narration**:
"See that badge? A real operator tested this on a similar machine."

**Action**:
1. Let recommendation load (0:05-0:07)
2. Pause — let viewer absorb the speed number (0:07-0:09)
3. Move cursor to highlight the blue badge/tier label (0:09-0:12)

**Why this works**: This is the trust differentiator. BeraTech gives you a number. We give you a number + proof of where it came from.

---

### SHOT 3: SCALING NOTE [0:12-0:18] (6 seconds)

**Visual**:
- Show the reference parameters grid (Power, Gas, Focus, Nozzle pills)
- Show the "Scaled for your 150mm lens" note (or similar auto-scaling indicator)
- The scaling note should be clearly visible

**Narration**:
"AI auto-scales for YOUR specific lens. No manual tweaking."

**Action**:
1. The reference params should already be visible below the hero card (0:12-0:14)
2. If scaling note is visible, hover near it briefly (0:14-0:16)
3. Pause to let viewer read the params (0:16-0:18)

**Why this works**: Shows personalization is automatic — not "set up a complex profile" but "it just knows your lens." This is the $32 LaserSecrets product, for free.

---

### SHOT 4: FEEDBACK LOOP [0:18-0:25] (7 seconds)

**Visual**:
- Show the 3-button feedback system ("Too Slow" / "Perfect ✓" / "Too Fast")
- Tap the "Perfect" button — it highlights in emerald green
- Success animation/state change visible

**Narration**:
"Your feedback trains the AI for YOUR machine over time."

**Action**:
1. Scroll to feedback buttons if needed (0:18-0:20)
2. Tap "Perfect" button deliberately (0:20-0:22)
3. Let the highlight/ring animation play (0:22-0:25)

**Why this works**: Shows the loop — data goes IN, recommendations get BETTER. This is machine-specific learning in action. BeraTech's AI doesn't get better with use. Yours does.

---

### SHOT 5: CTA [0:25-0:30] (5 seconds)

**Visual**:
- Cut to landing page (`/landing`) showing the hero section
- "AI learns your machine" headline visible
- "Join 50+ Operators on the Beta Waitlist" CTA button visible
- OR: Overlay text on screen: "AI recommendations. Human-verified. cutlog-two.vercel.app/landing"

**Narration**:
"AI recommendations. Human-verified. Join the beta."

**Action**:
1. Navigate to landing page (or use a pre-recorded clip) (0:25-0:27)
2. Show the CTA button clearly (0:27-0:30)
3. Freeze final frame

**Why this works**: Tagline lands the positioning. Viewer knows exactly what to do next.

---

## Narration Script

Record these lines. You can do them in one take or piece them together in post-production.

```
[0:00-0:05]
"Every AI tool guesses your laser parameters. CutLog actually verifies them."

[0:05-0:12]
"See that badge? A real operator tested this on a similar machine."

[0:12-0:18]
"AI auto-scales for YOUR specific lens. No manual tweaking."

[0:18-0:25]
"Your feedback trains the AI for YOUR machine over time."

[0:25-0:30]
"AI recommendations. Human-verified. Join the beta."
```

### Key Messaging Beats

| Shot | Message | Differentiator |
|------|---------|---------------|
| Hook | "CutLog verifies" | vs. BeraTech: they guess, we verify |
| Badge | "Real operator tested this" | Trust layer — you can SEE the source |
| Scaling | "YOUR specific lens" | Personalization — not generic tables |
| Feedback | "Trains for YOUR machine" | Gets smarter — BeraTech is static |
| CTA | "Human-verified" | Tagline that sticks |

### Voiceover Recording Notes

- **Tone**: Confident but conversational — like explaining to a colleague, not pitching on a stage
- **Pace**: Speak slightly slower than normal — viewers are reading on phones
- **Emphasis**: Stress "verifies" (shot 1), "real operator" (shot 2), "YOUR" (shots 3+4), "human-verified" (shot 5)
- **Equipment**: Record in quiet room, use AirPods Pro or USB mic
- **File format**: Export as .wav or .m4a, import into ScreenFlow or iMovie
- **Sync**: Align audio to video frames in post-production

---

## Recording Steps (Mac with QuickTime)

### QuickTime Method (Simplest)

1. Open QuickTime Player (Cmd+Space → type "QuickTime")
2. Select **File → New Screen Recording**
3. Choose mic input (Built-in Microphone or AirPods Pro)
4. Click record button (red dot)
5. Start narrating or stay silent (we'll add voiceover later)
6. Follow the shot list exactly — time each segment with iPhone timer
7. Click stop when finished (or press Cmd+Ctrl+Esc)
8. **File → Export As → MP4** (choose 720p or 1080p)
9. Save as `cutlog_demo_30sec_raw.mp4`
10. **Edit → Trim** to exactly 30 seconds (trim tool shows time codes)
11. **File → Save** (or export again if needed)

### ScreenFlow Method (More Control)

1. Open ScreenFlow
2. Set resolution to 1440x900 or 1920x1080
3. Choose audio source (Built-in or AirPods)
4. Click record
5. Follow shot list exactly
6. Stop recording
7. Edit → Add audio track (import voiceover .wav file)
8. Sync voiceover to timeline
9. Trim to 30 seconds exactly
10. Export as MP4 (720p for social, 1080p for web)
11. Save as `cutlog_demo_30sec.mp4`

---

## Audio/Voiceover Workflow (Recommended)

### Option A: Silent Screen Record + Post-Production Voiceover (RECOMMENDED)

1. **Record screen silently** (no narration, just UI interactions)
   - Use QuickTime or ScreenFlow, mute mic or don't record audio
   - Timing still matters — follow shot list exactly
   - Save as `cutlog_demo_30sec_silent.mov` or `.mp4`

2. **Record voiceover separately**
   - Use Voice Memos app (Mac) or Audacity (free)
   - Record in quiet room with AirPods Pro or USB mic
   - Speak slightly slower than normal
   - Record each sentence once, keep takes where you don't stutter
   - Export as `.wav` or `.m4a`

3. **Combine in iMovie or ScreenFlow**
   - Import screen recording
   - Import voiceover audio
   - Drag audio to timeline, sync to video
   - Trim any gaps or silence
   - Export final video as MP4

**Advantages**: Easier to re-record audio if you mess up narration. Cleaner audio (no keyboard clicking).

### Option B: Live Narration While Recording (Simpler)

1. **Record screen + voiceover at same time**
   - Open QuickTime, select mic input
   - Hit record, start narrating immediately
   - Follow shot list exactly, speak continuously
   - This is harder to get right — takes 3-5 tries typically

2. **Edit in QuickTime or ScreenFlow**
   - Trim to 30 seconds
   - Export as MP4

**Advantages**: Faster, one-pass. **Disadvantages**: Harder to get right, harder to fix audio issues.

---

## Timing Guide (Use iPhone Timer)

Print this or have it open on second monitor while recording:

```
0:00-0:05   →  HOOK (search material + thickness, bold claim)
0:05-0:12   →  VERIFIED BADGE (recommendation + blue community badge)
0:12-0:18   →  SCALING (reference params + "Scaled for your lens" note)
0:18-0:25   →  FEEDBACK LOOP (tap "Perfect", show it learning)
0:25-0:30   →  CTA (landing page or overlay text)
```

Use a second device (iPhone) to run a timer in background. You can even use online stopwatch: https://www.online-stopwatch.com/

---

## Post-Production Checklist

- [ ] Video is exactly 30 seconds long (trim if needed)
- [ ] Audio and video are in sync (no lip-sync delay)
- [ ] No stray cursor clicks or browser artifacts visible
- [ ] Voiceover is clear and audible (no background noise)
- [ ] Video starts with search input, ends with CTA/landing page
- [ ] Resolution is at least 720p
- [ ] File format is MP4 (H.264)
- [ ] File size is < 50 MB (compress if needed)
- [ ] Saved as `cutlog_demo_30sec_final.mp4`

---

## Distribution & Deployment

### Landing Page
- Embed video on hero section: `<video controls width="100%" src="...">` 
- Alternative: Embed from YouTube (unlisted) or Vimeo

### YouTube Upload
1. Upload to YouTube (unlisted, so only accessible via link)
2. Title: "CutLog — Smart laser parameters in 30 seconds"
3. Description: Include tagline + waitlist link
4. Share link in emails, Slack, GitHub README

### Vimeo Upload
1. Upload to Vimeo (better control, no ads)
2. Set privacy to "Only people with the link can watch"
3. Get embed code, paste into landing page

### Facebook
1. Upload video directly to Facebook (don't embed YouTube)
2. Facebook prioritizes native video uploads
3. Add caption text (videos play muted by default): "Every AI tool guesses. CutLog verifies. 🔗 cutlog-two.vercel.app/landing"
4. Use Square format (1:1) or landscape (16:9)

### Email
1. Include video link in confirmation email
2. Add thumbnail screenshot for preview
3. Encourage reply with feedback ("Reply with your thoughts")

---

## Asset Checklist

### Before Recording
- [ ] Test app is live at https://cutlog-two.vercel.app
- [ ] Machine profile created
- [ ] Material/thickness search tested
- [ ] Recommendation displays correctly
- [ ] Full parameters visible when scrolled
- [ ] Feedback buttons visible or clickable

### For Recording Session
- [ ] QuickTime or ScreenFlow installed
- [ ] Mic tested (AirPods Pro or USB mic)
- [ ] Stopwatch app or online timer ready
- [ ] Script printed or on second device
- [ ] Browser zoomed to readable size (110-120%)
- [ ] All other apps closed
- [ ] System volume at 50%

### Post-Recording
- [ ] Raw video file saved
- [ ] Voiceover audio file (if separate)
- [ ] ScreenFlow or iMovie project saved (for re-edits)
- [ ] Final MP4 exported and tested
- [ ] Video plays on phone and desktop
- [ ] Audio synced correctly
- [ ] Timing is exactly 30 seconds

---

## Troubleshooting

### Video is too long or too short
- Use QuickTime or iMovie trim tool
- Drag handles to set exact 30-second range
- Use frame-by-frame scrubbing for precision

### Audio is out of sync
- In iMovie: drag audio track left/right to resync
- In ScreenFlow: use timeline to align audio to video
- Re-record if necessary

### Voiceover is quiet or muffled
- Check Mac System Preferences → Sound → Input level
- Use USB mic instead of built-in mic
- Re-record closer to mic
- Amplify in iMovie: Audio → Enhance Audio

### Screen recording is choppy
- Quit other apps running in background
- Restart Mac if needed
- Record at 30 FPS instead of 60 FPS
- Use ScreenFlow instead of QuickTime if issue persists

### Browser renders differently on playback
- Record at 1440x900 native resolution
- Export at same resolution
- Test playback on multiple devices (phone, tablet, desktop)

---

## Success Criteria

After recording, the video should demonstrate:

1. **Speed**: Shows recommendation appearing in < 1 second of search ✓
2. **Personalization**: Mentions "your machine" and "calibrated for you" ✓
3. **Simplicity**: Takes only 3 clicks to get a recommendation ✓
4. **Full parameters**: Shows that more detail is available if needed ✓
5. **Feedback loop**: Demonstrates the 3-button rating system ✓
6. **Call to action**: Ends with clear next step ("Join the waitlist") ✓
7. **Clarity**: Voiceover is audible, text is readable at 720p ✓
8. **Timing**: Exactly 30 seconds, paced so viewer can follow ✓

---

## Next Steps After Recording

1. **Export final video** as MP4 (720p and 1080p versions)
2. **Upload to YouTube (unlisted)** and get share link
3. **Test embed** on landing page
4. **Share in Slack** for team feedback ("Does this land our value prop?")
5. **Post on Facebook** with caption
6. **Include in waitlist confirmation email**
7. **Add link to GitHub README** under "Demo" section

---

## Reference

**CutLog live app**: https://cutlog-two.vercel.app  
**GitHub repo**: git@github.com:hooman67/cutlog.git  
**Deployment**: Auto-deploys from main branch to Vercel

