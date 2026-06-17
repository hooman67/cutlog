# CutLog 30-Second Demo Video Plan

**Last updated**: 2026-06-17  
**Target platform**: Social media (Facebook, email, landing page)  
**Format**: 30-second landscape video (1440x900 or higher, downscaled for social)  
**Hosting**: YouTube (unlisted) or Vimeo (embeds on landing page)

---

## Core Message

**Tagline**: "Stop guessing parameters. CutLog learns your machine."

**Value prop in 30 seconds**: Show how CutLog takes material + thickness input, returns a personalized speed recommendation calibrated for YOUR specific machine, and collects feedback to improve over time.

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

### SHOT 1: HERO SHOT [0:00-0:03] (3 seconds)

**Visual**:
- Screen shows CutLog home page (`/`)
- UI should show "Get Recommendation" button prominently
- Cursor clicks "Get Recommendation"
- Page transitions to `/suggest` or search input

**Narration**: 
"Stop guessing parameters. CutLog learns your machine."

**Action**: Single click on "Get Recommendation" button. Keep motion smooth and deliberate.

---

### SHOT 2: SEARCH INPUT [0:03-0:10] (7 seconds)

**Visual**:
- Suggestion page with search form visible
- User interacts with dropdowns:
  - Material dropdown: select "Stainless Steel"
  - Thickness dropdown: select "3mm"
- Show the form filling out
- Do NOT hit submit yet

**Narration**:
"Tell CutLog your material and thickness."

**Action**:
1. Click Material dropdown (0:03-0:05)
2. Type "Stainless" or scroll to "Stainless Steel", click (0:05-0:07)
3. Click Thickness dropdown (0:07-0:08)
4. Select "3mm" (0:08-0:10)

Keep dropdown interactions visible on screen. Avoid rapid clicking.

---

### SHOT 3: RECOMMENDATION HERO [0:10-0:17] (7 seconds)

**Visual**:
- Large speed number appears (e.g., "3500 mm/min" or similar)
- Confidence badge displays (should show "HIGH" if machine has data)
- Color-coded badge (green = HIGH, yellow = MEDIUM, red = LOW)
- Range displayed below speed (e.g., "3200-3800 mm/min")
- Hero card is the dominant visual element

**Narration**:
"Get a personalized speed recommendation in one second, calibrated for your specific machine."

**Action**:
1. Hit submit/search (0:10-0:11)
2. Let page load and display hero card (0:11-0:12)
3. Pause for 5 seconds to let viewers see the recommendation (0:12-0:17)

This shot should feel like the "wow moment" — viewers see the recommendation appear.

---

### SHOT 4: FULL PARAMETERS [0:17-0:25] (8 seconds)

**Visual**:
- Scroll down to show collapsible "Full Parameters" section
- Expand it to show:
  - Power (%)
  - Frequency (kHz)
  - Gas Type (e.g., N2, Air)
  - Gas Pressure (bar)
  - Focus Position (mm)
  - Nozzle Diameter (mm)
  - Nozzle Distance (mm)
- Show badge or note like "Auto-scaled for your lens"
- Optional: Show "Conservative / Fast" toggle if visible on page

**Narration**:
"All parameters auto-scale for your lens. No manual tweaking."

**Action**:
1. Scroll down smoothly (0:17-0:19)
2. Click "Full Parameters" or similar to expand (0:19-0:20)
3. Pause for 5 seconds to show all parameters visible (0:20-0:25)

Keep scrolling smooth and deliberate. Don't rush through the parameters.

---

### SHOT 5: FEEDBACK & CTA [0:25-0:30] (5 seconds)

**Visual**:
- Show the 3-button feedback system:
  - "Too Slow" (left button)
  - "Perfect" (center button)
  - "Too Fast" (right button)
- OR show the landing page with "Join Beta" / "Join Waitlist" CTA button
- Final frame should have call-to-action visible

**Narration**:
"Use your feedback to improve recommendations over time. Join the waitlist today."

**Action**:
1. Scroll down to feedback buttons (0:25-0:27)
2. Highlight buttons by hovering cursor over them (optional) (0:27-0:28)
3. Pan to landing page or stay on feedback section (0:28-0:30)
4. Freeze final frame with CTA visible

---

## Narration Script

Record these lines. You can do them in one take or piece them together in post-production.

```
[0:00-0:03]
"Stop guessing parameters. CutLog learns your machine."

[0:03-0:10]
"Tell CutLog your material and thickness."

[0:10-0:17]
"Get a personalized speed recommendation in one second, 
calibrated for your specific machine."

[0:17-0:25]
"All parameters auto-scale for your lens. No manual tweaking."

[0:25-0:30]
"Use your feedback to improve recommendations over time. 
Join the waitlist today."
```

### Voiceover Recording Notes

- **Tone**: Calm, confident, professional (not sales-y)
- **Pace**: Speak slightly slower than normal — viewers are reading on phones
- **Emphasis**: Emphasize "YOUR machine" (personalization), "one second" (speed), "no tweaking" (ease)
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
0:00-0:03   →  HERO SHOT (click Get Recommendation)
0:03-0:10   →  SEARCH (select material + thickness)
0:10-0:17   →  RECOMMENDATION (see hero card + speed)
0:17-0:25   →  PARAMETERS (scroll down, show full params)
0:25-0:30   →  FEEDBACK & CTA (show 3-button feedback or landing page)
```

Use a second device (iPhone) to run a timer in background. You can even use online stopwatch: https://www.online-stopwatch.com/

---

## Post-Production Checklist

- [ ] Video is exactly 30 seconds long (trim if needed)
- [ ] Audio and video are in sync (no lip-sync delay)
- [ ] No stray cursor clicks or browser artifacts visible
- [ ] Voiceover is clear and audible (no background noise)
- [ ] Video starts with home page, ends with CTA
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
3. Add caption text (videos play muted by default): "Stop guessing parameters. CutLog learns your machine. 🔗 [link]"
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

