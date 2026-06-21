# Prototype 1 Testing Plan — Complete Workflows

**For:** Matt  
**Purpose:** Manual end-to-end testing of every workflow in CutLog  
**Goal:** Catch bugs before beta users do, understand UX friction points, validate all features work  
**Time to complete:** ~2 hours (can be done in sessions)

---

## Overview

This document lists every workflow in CutLog so you can systematically test each feature end-to-end. Use this as your testing checklist — go through each workflow in order, log any bugs or UX issues you find, and note what works well.

The app is deployed at: **https://cutlog-two.vercel.app**

---

## Workflow 1: Sign Up & Auth

**Goal:** Test user registration and login flows  
**Time:** 10 minutes  
**Prerequisite:** None

### Steps

1. Go to https://cutlog-two.vercel.app
2. You should see a landing page or auth screen
3. Click "Sign Up" (or "Create Account")
4. Enter a test email (e.g., `testuser+1@example.com`) and a password (e.g., `TestPassword123`)
5. Submit the form
6. Check if:
   - A confirmation email arrives (check spam folder)
   - Or if email verification is required before login
7. Verify email (if prompted)
8. Log in with the same email/password
9. Verify you're in the app (should see a dashboard or home screen, not auth screen)
10. Log out (find logout button, usually in settings or user menu)
11. Verify you're back at the auth screen
12. Log in again to confirm session works

### Expected Results

- [ ] Sign up succeeds without errors
- [ ] Confirmation email arrives (or verification link works)
- [ ] Login works with correct credentials
- [ ] Incorrect credentials are rejected with clear error
- [ ] Session persists after login (refresh page, still logged in)
- [ ] Logout clears session (you're back at auth screen)
- [ ] Login works again after logout

### Bugs Found

- (list any issues here)

---

## Workflow 2: Machine Setup

**Goal:** Test machine registration and profile persistence  
**Time:** 10 minutes  
**Prerequisite:** Logged in (Workflow 1)

### Steps

1. From the home screen, navigate to **Settings** or **Machine Setup**
2. Fill in the machine registration form:
   - **Brand:** Select "Raycus" from dropdown (or another brand if available)
   - **Model:** Type "50W Fiber" (or similar)
   - **Wattage:** Enter `50`
   - **Laser Source Type:** Select "Fiber" (or default if only one option)
   - **Lens Focal Length:** Enter `110` (or use default)
   - **Speed Profile:** Select "Auto" (default)
   - **Gas Types:** Check "Nitrogen" if available
   - **Controller Software:** Leave blank or select "None"
   - **Shop Location:** Select your country/region (optional)
   - **Machine Nickname:** Type "Test Laser" (optional)
3. Click **"Save Machine"** or **"Save Settings"**
4. You should see a success message
5. Refresh the page (Cmd+R or Ctrl+R)
6. Verify that all machine settings persisted (you can see them again)
7. Click **"Edit Machine"** and change:
   - **Lens Focal Length:** Change to `150mm`
   - **Speed Profile:** Change to "Conservative" (if available)
8. Click **"Save"** again
9. Refresh the page
10. Verify the new values are still there

### Expected Results

- [ ] Machine profile saves without errors
- [ ] Success message appears after save
- [ ] All fields persist after page refresh
- [ ] Editing machine profile works
- [ ] Changed values persist after second save + refresh
- [ ] Lens focal length change affects scaling (you'll verify this in Workflow 5)

### Bugs Found

- (list any issues here)

---

## Workflow 3: Log a Cut (Cutting)

**Goal:** Test cut logging for standard fiber lasers  
**Time:** 10 minutes  
**Prerequisite:** Logged in + machine set up (Workflows 1-2)

### Steps

1. Navigate to **"Log a Cut"** or **"New Cut"** page
2. You should see a form with cutting parameters
3. Fill in:
   - **Material:** Search for and select "Stainless Steel" (or similar)
   - **Thickness:** Enter `3` (mm)
   - **Power:** Enter `80` (%)
   - **Speed:** Enter `3500` (mm/min)
   - **Gas Type:** Select "Nitrogen"
   - **Gas Pressure (optional):** Enter `15` (bar) if field exists
   - **Quality Rating:** Click the 4th star (out of 5) to select "Good"
   - **Edge Quality (optional):** Select "Clean" if available
4. Click **"Save Cut"** or **"Log Cut"**
5. You should see a success message (e.g., "Cut logged successfully")
6. Navigate to **"History"** page
7. Verify your new cut appears at the top of the list with:
   - Material: Stainless Steel
   - Thickness: 3mm
   - Power: 80%
   - Speed: 3500 mm/min
   - Rating: 4 stars
   - Date/time (should be today)

### Expected Results

- [ ] Cut form loads with smart defaults (pre-fills last-used values if any)
- [ ] Material search works (you can find and select a material)
- [ ] All parameters save correctly
- [ ] Success message appears
- [ ] Cut appears in history with correct values
- [ ] Date/time is correct (today's date)
- [ ] Rating displays as stars

### Bugs Found

- (list any issues here)

---

## Workflow 4: Log an Engraving (Galvo/Fiber Engraving)

**Goal:** Test engraving-specific parameters  
**Time:** 10 minutes  
**Prerequisite:** Machine set up (Workflow 2)

### Steps

1. Go back to **Machine Setup**
2. Change **Laser Source Type** to **"Fiber Engraving"** (or "Galvo" if available)
3. Save the machine setup
4. Navigate to **"Log a Cut"**
5. The form should now show **additional engraving-specific fields**:
   - Frequency (Hz)
   - Passes (number of passes)
   - Operation Type (dropdown: Engrave / Cut)
   - Scan Angle (degrees, if available)
   - Cross-hatch (checkbox, if available)
6. Fill in the form:
   - **Material:** Select "Stainless Steel"
   - **Operation Type:** Select **"Engrave"**
   - **Thickness:** Enter `2` (mm)
   - **Frequency:** Enter `80000` (Hz)
   - **Passes:** Enter `2`
   - **Scan Angle:** Enter `45` (degrees) if available
   - **Cross-hatch:** Check "Yes" if available
   - **Power:** Enter `50` (%)
   - **Speed:** Enter `1000` (mm/min) — typically slower for engraving
   - **Quality Rating:** 4 stars
7. Click **"Save Cut"**
8. Navigate to **"History"**
9. Verify the engraving cut appears with all fields (including Frequency, Passes, Scan Angle)

### Expected Results

- [ ] Laser Source Type can be changed to "Fiber Engraving"
- [ ] After changing to engraving, the log form shows engraving-specific fields
- [ ] Frequency, Passes, Scan Angle fields appear and accept input
- [ ] Engraving parameters save correctly
- [ ] History view displays engraving-specific fields when viewing an engraving cut
- [ ] Cutting and engraving cuts have different field sets

### Bugs Found

- (list any issues here)

---

## Workflow 5: Get Speed Recommendation

**Goal:** Test the core recommendation engine  
**Time:** 15 minutes  
**Prerequisite:** Machine set up + at least one cut logged (Workflows 2-3)

### Steps

1. Navigate to **"Get Suggestions"** or **"Recommendations"** page
2. You should see a search form
3. Fill in:
   - **Material:** Search for "Stainless Steel"
   - **Thickness:** Enter `3` (mm)
4. Click **"Get Recommendation"** or **"Search"**
5. Wait up to 2 seconds for results to load
6. You should see a recommendation card that displays:
   - **Large speed number** (e.g., "3500 mm/min") prominently at the top
   - **Confidence badge** (e.g., "HIGH", "MEDIUM", or "LOW")
   - **Source** (e.g., "From your history" or "From community")
   - **"Scaled for your 110mm lens"** note (showing it considers your machine)
   - **Speed range** (e.g., "3000-4000 mm/min")
   - Other parameters: Power, Gas, Pressure, etc.
7. Scroll down to see full recommendation details
8. Change **Speed Profile** to **"Conservative"** (if available)
9. Get the recommendation again
10. Verify speed **decreases to ~50%** (e.g., if it was 3500, now ~1750)
11. Change back to **"Fast"**
12. Get the recommendation again
13. Verify speed returns to original value

### Expected Results

- [ ] Recommendation search works
- [ ] Results appear within 2 seconds
- [ ] Large speed number is prominently displayed
- [ ] Confidence badge is visible
- [ ] Scaling note appears (mentions your lens focal length)
- [ ] Speed range is shown
- [ ] Changing Speed Profile to "Conservative" reduces speed by ~50%
- [ ] Changing back to "Fast" restores original speed
- [ ] "From your history" appears if you logged a matching cut in Workflow 3
- [ ] Recommendation includes Power, Gas, and other parameters

### Bugs Found

- (list any issues here)

---

## Workflow 6: Test 3-Button Feedback

**Goal:** Test feedback collection for optimization  
**Time:** 10 minutes  
**Prerequisite:** Recommendation available (Workflow 5)

### Steps

1. Get a recommendation (from Workflow 5)
2. Below the speed recommendation, you should see **3 buttons**:
   - "Too Slow" (speed needs to increase)
   - "Perfect" (this was right on)
   - "Too Fast" (speed needs to decrease)
3. Click the **"Perfect"** button
4. The button should **highlight** (change color or show selected state)
5. You should see a **success message** (e.g., "Feedback recorded")
6. Refresh the page (Cmd+R or Ctrl+R)
7. Get the same recommendation again (Material: Stainless Steel, Thickness: 3mm)
8. Verify the **"Perfect"** button is still highlighted
9. Try clicking **"Too Slow"** on the same recommendation
10. The button should change to "Too Slow" (your previous feedback is overwritten)
11. Refresh again
12. Get the recommendation one more time
13. Verify **"Too Slow"** is now highlighted

### Expected Results

- [ ] All 3 buttons appear below recommendation
- [ ] Clicking a button highlights it
- [ ] Success message appears after clicking
- [ ] Feedback persists after page refresh (stored in localStorage)
- [ ] Feedback is tied to the specific material/thickness combination
- [ ] Can change feedback (button switches from "Perfect" to "Too Slow", etc.)
- [ ] No errors when clicking buttons

### Bugs Found

- (list any issues here)

---

## Workflow 7: Import LightBurn .clb File

**Goal:** Test .clb file import functionality  
**Time:** 15 minutes  
**Prerequisite:** Logged in (Workflow 1)

### Steps

1. Obtain a .clb file:
   - **Option A:** Download from the test data: `/mnt/localssd/laser_log/app/data/params/etsy/BenMyersWoodshop/30w_OMTech_Fiber_Laser_Library.clb`
   - **Option B:** Use any existing LightBurn .clb file you have
   - **Option C:** Export one from LightBurn if you have access
2. Navigate to **"Import"** or **"Import Materials"** page
3. You should see an upload area
4. Drag and drop the .clb file onto the upload area, OR click to open file picker and select the file
5. Wait for the file to parse (should take 2-5 seconds)
6. After parsing, you should see:
   - A **preview** of entries from the .clb file
   - A list of materials (should show 20-50+ entries depending on file size)
   - A **checkbox** or **toggle** next to each entry to select which ones to import
7. Select **5-10 entries** to import (check their boxes)
8. Click **"Import Selected"** or **"Import"**
9. You should see a **success message** (e.g., "Imported 8 cuts successfully")
10. Navigate to **"History"**
11. Verify the imported cuts appear in your history with:
    - Material names from the .clb file
    - Parameters from the .clb file
    - Date/time showing import date (or original date if preserved)
12. Navigate to **"Get Suggestions"**
13. Search for one of the **imported materials** (e.g., if you imported "Cherry 0.5"")
14. Verify you get a recommendation
15. Check if the source badge says **"From your library"** or **"From your history"** (indicating it came from the import)

### Expected Results

- [ ] File upload accepts .clb files
- [ ] File parsing succeeds without errors
- [ ] Preview shows materials from the file
- [ ] Can select/deselect specific materials to import
- [ ] Import succeeds with success message
- [ ] Imported cuts appear in history
- [ ] All parameters from .clb are preserved (material, power, speed, etc.)
- [ ] Can get recommendations for imported materials
- [ ] Imported materials appear with correct source badge

### Bugs Found

- (list any issues here)

---

## Workflow 8: Export LightBurn .clb File

**Goal:** Test .clb file export functionality  
**Time:** 15 minutes  
**Prerequisite:** History with cuts logged or imported (Workflows 3, 7)

### Steps

1. Navigate to **"History"** page
2. Look for an **"Export"** button or menu option (might be "⋮" menu or top-right button)
3. Click **"Export as LightBurn .clb"** or similar
4. A file should **download** to your Downloads folder (usually named `cutlog_export.clb` or similar)
5. Open the downloaded file with a **text editor** (VS Code, Notepad, etc.)
6. Verify the file is **valid XML** (you should see `<?xml version="1.0"?>` at the top)
7. Verify the file contains your logged cuts as **material entries** (look for `<Material>` tags or similar)
8. Verify cuts you logged appear in the file with correct parameters
9. **Optional:** If you have LightBurn installed:
   - Open LightBurn
   - Import the exported .clb file into LightBurn's material library
   - Verify materials appear in LightBurn with correct parameters
10. **Alternative (no LightBurn):**
    - Use an **online XML validator** to confirm the file is valid XML
    - Or send the file to someone with LightBurn to test import

### Expected Results

- [ ] Export button is visible and clickable
- [ ] File downloads successfully
- [ ] Downloaded file is named something like `cutlog_export.clb`
- [ ] File is valid XML (readable in text editor)
- [ ] File contains material entries for each cut
- [ ] Parameters are included (power, speed, material, etc.)
- [ ] If tested in LightBurn: materials appear in library with correct values
- [ ] Exported file can be re-imported (cycle: export → import → export)

### Bugs Found

- (list any issues here)

---

## Workflow 9: PWA Install & Offline Access

**Goal:** Test progressive web app installation on mobile/desktop  
**Time:** 15 minutes  
**Prerequisite:** Logged in (Workflow 1)

### Option A: Mobile (iPhone/Android)

1. On your **mobile phone**, open a browser (Safari on iPhone, Chrome on Android)
2. Navigate to https://cutlog-two.vercel.app
3. Wait **2-3 seconds**
4. You should see an **"Install" banner** appear (usually bottom of screen)
5. Tap **"Install"** or **"Add to Home Screen"**
6. Follow the prompts to add the app to your home screen
7. The app icon should appear on your home screen
8. Tap the icon to open the app
9. Verify it loads and you're logged in
10. Navigate around (log a cut, view history, get a recommendation)
11. Turn your phone to **Airplane Mode** (disable WiFi and cellular)
12. Try navigating to a page you've already visited
13. Verify the page still loads (offline support working)
14. Try loading a NEW page you haven't visited
15. You should see either cached version or offline message

### Option B: Desktop (Chrome)

1. On your **laptop/desktop** in Chrome, navigate to https://cutlog-two.vercel.app
2. Look for an **install icon** in the address bar (might be a small icon on the right side)
3. Or right-click the page and look for **"Install app"** option
4. Click to install as PWA
5. Follow the prompts
6. The app should install and open in a separate window (not a browser tab)
7. Verify it opens and works like the web version
8. Close and reopen the app to confirm it persists

### Expected Results

- [ ] Install banner appears on mobile (or install option on desktop)
- [ ] App can be installed to home screen / app menu
- [ ] App opens successfully from home screen / app menu
- [ ] App works offline for previously visited pages
- [ ] Offline pages display cached content (or clear offline message)
- [ ] No browser UI elements visible (standalone mode)
- [ ] Navigation works within the app

### Bugs Found

- (list any issues here)

---

## Workflow 10: Font Preview Tool (Bonus Feature for Nate)

**Goal:** Test the font preview tool for engraving text on products  
**Time:** 15 minutes  
**Prerequisite:** Logged in (Workflow 1)

### Steps

1. Navigate to **"Tools"** or look for **"Font Preview"** in the menu
2. Go to **"/tools/font-preview"** (or find it via navigation)
3. You should see a preview interface with:
   - A **text input field** (default text: "CUTLOG" or similar)
   - A **font selector** (dropdown with fonts)
   - **Sliders/inputs** for size, rotation, position
   - **Color picker** or color buttons
   - **Product template selector** (tumbler, dog tag, etc.)
   - A **preview area** showing the text on a product mockup
   - A **"Download as PNG"** button
4. Customize the preview:
   - Type in the text field: `"NATE'S LASER"`
   - Select a **font** from dropdown (e.g., "Great Vibes", "Courier", "Serif")
   - Adjust **font size** slider (drag or input)
   - Change **text color** (click color button or use picker)
   - Adjust **rotation** slider (should go -180° to +180°)
   - Select **position** (top/center/bottom)
   - **Drag the text** directly on the preview to reposition (if interactive)
5. Select a **product template**:
   - Look for template selector (might be tabs or dropdown)
   - Choose **"Tumbler"**, **"Dog Tag"**, **"Knife"**, or **"Flat"**
   - Preview should update to show text on the selected product
6. Once satisfied with preview:
   - Click **"Download as PNG"** or **"Export as PNG"**
   - File should download (usually `cutlog-font-preview.png` or similar)
7. Open the downloaded PNG in an image viewer
8. Verify it shows:
   - Your custom text
   - The selected font
   - The text positioned correctly on the product
   - Colors and rotation applied correctly

### Expected Results

- [ ] Font preview page loads without errors
- [ ] Can type custom text in text field
- [ ] Font dropdown populated with fonts
- [ ] Font size slider adjusts text size in preview
- [ ] Color buttons/picker work (text color changes)
- [ ] Rotation slider changes text angle
- [ ] Position selector (top/center/bottom) works
- [ ] Product template selector updates preview
- [ ] Preview updates in real-time as you adjust controls
- [ ] Download button creates valid PNG file
- [ ] Downloaded PNG shows all customizations

### Bugs Found

- (list any issues here)

---

## Workflow 11: Onboarding & Discovery Features (First Visit)

**Goal:** Test first-visit UX and contextual nudges  
**Time:** 10 minutes  
**Prerequisite:** None (new account)

### Steps

1. **Sign out** if logged in
2. Open a **Private/Incognito browser window** (so you're a new user)
3. Navigate to https://cutlog-two.vercel.app
4. You should see a **landing page** with app capabilities listed
5. Look for an **onboarding overlay/modal** that appears within 2-3 seconds
6. The overlay should show:
   - A welcome message (e.g., "Welcome to CutLog")
   - 5 key capabilities (cut logging, recommendations, sharing, etc.)
   - A **"Get Started"** button
7. Click **"Get Started"** to dismiss the overlay
8. The overlay should **not appear again** (dismissed)
9. Sign up for a new account
10. Navigate to **Machine Setup**
11. You should see a **"Getting Started" card** or **nudge** with 3 steps:
    - Step 1: Set up your machine
    - Step 2: Log your first cut
    - Step 3: Get a recommendation
12. Complete Step 1 (Machine Setup) — fill in and save
13. The card should update to show Step 1 as ✓ Complete
14. Navigate to **Log a Cut** page
15. You should see a **nudge** (e.g., "Log your first cut to get personalized recommendations")
16. Log a cut (follow Workflow 3)
17. Navigate to **Get Suggestions**
18. You should see a **nudge** (e.g., "Try 'Conservative' profile for more precision")
19. Search for a material
20. If the material has limited data, you might see a **nudge** (e.g., "This material has limited community data. Conservative profile recommended.")
21. Log an **engraving operation** (follow Workflow 4)
22. You should see a **nudge** (e.g., "Engraving uses different parameters. Log frequency and passes.")

### Expected Results

- [ ] Onboarding modal appears on first visit
- [ ] Modal shows 5 key capabilities
- [ ] "Get Started" button dismisses modal
- [ ] Modal doesn't appear again (remembered via localStorage)
- [ ] Machine Setup shows "Getting Started" card
- [ ] Card tracks progress (marks steps as complete)
- [ ] Nudges appear in relevant contexts (after setup, before first cut, etc.)
- [ ] Each nudge appears once (not repeated unnecessarily)
- [ ] Nudges don't interfere with normal workflow
- [ ] Nudges are dismissible (either auto-hide or have close button)

### Bugs Found

- (list any issues here)

---

## Cross-Workflow Checks

These tests span multiple workflows and catch integration issues:

### Check A: Data Consistency
- [ ] Log a cut in Workflow 3
- [ ] Get a recommendation in Workflow 5 for the same material/thickness
- [ ] Verify recommendation shows your cut in the source
- [ ] Export in Workflow 8
- [ ] Import the exported file
- [ ] Verify the imported cut has the same parameters as the original

### Check B: Session Persistence
- [ ] Complete Workflow 1 (log in)
- [ ] Navigate to multiple pages (machine setup, log cut, history, suggestions)
- [ ] Refresh the page (Cmd+R / Ctrl+R) at each page
- [ ] Verify you remain logged in
- [ ] Verify page data persists (machine setup still there, history still shows cuts)

### Check C: Form Validation
- [ ] Go to Machine Setup (Workflow 2)
- [ ] Try to save with blank required fields
- [ ] Verify error message appears (doesn't allow save)
- [ ] Fill in required fields, leave optional fields blank
- [ ] Verify save succeeds
- [ ] Repeat for Log Cut form (Workflow 3)

### Check D: Mobile Responsiveness
- [ ] Open the app on a **mobile device** or use **browser dev tools** (F12 → Device Mode)
- [ ] Go through Workflows 1-5 on mobile view
- [ ] Check:
  - [ ] Text is readable (not too small)
  - [ ] Buttons are clickable (large enough for finger)
  - [ ] Forms don't overflow off-screen
  - [ ] No horizontal scrolling needed
  - [ ] Dark theme is applied (if used)
  - [ ] Input fields are accessible on phone keyboard

### Check E: Error Handling
- [ ] Go to a page that needs data (e.g., History, Suggestions)
- [ ] If no data exists, verify you see a **helpful empty state** message (not just blank page)
- [ ] Try invalid inputs (e.g., negative power percentage, text in number field)
- [ ] Verify error messages are clear and helpful
- [ ] Try actions that might fail (e.g., import invalid file)
- [ ] Verify error message guides you to fix it

---

## Performance Checks

### Load Times
- [ ] Measure time to load each page (aim for <2 seconds):
  - [ ] Landing page: __ sec
  - [ ] Auth page: __ sec
  - [ ] Machine setup: __ sec
  - [ ] Log cut form: __ sec
  - [ ] History: __ sec
  - [ ] Get suggestions: __ sec
  - [ ] Import page: __ sec

### API Response Times
- [ ] Get a recommendation (Workflow 5) — should return in <2 seconds
- [ ] Import a .clb file (Workflow 7) — parsing should take <5 seconds
- [ ] Search materials in Log Cut form — autocomplete should show results instantly

---

## New Features Added 2026-06-21

### Workflow 12: Material Alias Resolution

**Goal:** Test that searching by alias finds the same results as canonical name
**Time:** 3 min
**Prerequisite:** Database has materials with aliases populated

**Steps:**
1. Go to /suggest
2. Search for "304 Stainless" (this is an alias for "Stainless Steel")
3. Verify you get recommendations (should match "Stainless Steel" data)
4. Note: you may see "Also matched: Stainless Steel, 316 SS" text
5. Search for "Inox" (another common alias for stainless)
6. Verify you get the same or similar recommendations
7. Search for "Mild Steel" — should return Carbon Steel/Mild Steel results
8. Try a material with no aliases (e.g., "Acrylic") — should work as before

**Expected:** Aliases resolve correctly. Searching by any known name for a material returns the same parameter set.

---

### Workflow 13: Fuzzy Thickness Fallback

**Goal:** Test that when exact thickness has no data, nearby thicknesses are shown
**Time:** 3 min
**Prerequisite:** Database has data for Stainless Steel at 3mm and 5mm (or similar)

**Steps:**
1. Go to /suggest
2. Search "Stainless Steel" at "3mm" — should return exact match (no fallback indicator)
3. Search "Stainless Steel" at "4mm" — this used to return "no results"
4. Verify you now see recommendations with a note like "Showing data for nearby thicknesses (±1.5mm)" or similar
5. The speed shown should be reasonable (between 3mm and 5mm speeds)
6. Search "Stainless Steel" at "25mm" — likely no data even with ±3mm
7. Verify you see the empty state (no false data shown for extreme thicknesses)
8. Search a thickness that has exact data again — verify the fallback indicator is NOT shown

**Expected:** Nearby thicknesses are found and displayed with clear indication. Extreme thicknesses still show empty state. Exact matches show no fallback indicator.

---

### Workflow 14: Operation Type Filtering

**Goal:** Test that cutting and engraving recommendations don't mix
**Time:** 3 min
**Prerequisite:** Machine is set to "Fiber Cutting" or "Fiber Engraving" type

**Steps:**
1. Set machine type to "Fiber Cutting" (via /machine)
2. Go to /suggest, search "Stainless Steel 3mm"
3. Verify results are cutting-focused (higher speeds, gas parameters visible)
4. Change machine type to "Fiber Engraving" (via /machine)
5. Go to /suggest, search "Stainless Steel 3mm"
6. Verify results differ — engraving speeds should be different from cutting speeds
7. If engraving data exists, verify engraving parameters show (frequency, passes)

**Expected:** Operation type filters results appropriately. Cutting machines get cutting speeds. Engraving machines get engraving speeds.

---

### Workflow 15: Source Tier Weighting (if implemented)

**Goal:** Test that user's own cuts are weighted higher than AI baseline
**Time:** 5 min
**Prerequisite:** User has logged at least 1 cut for a material

**Steps:**
1. Log a cut for "Aluminum" at 3mm with speed 2000 mm/min (go to /log)
2. Go to /suggest, search "Aluminum 3mm"
3. Note the recommended speed
4. The speed should be pulled toward YOUR logged value (2000) rather than the AI baseline average
5. If AI baseline suggests 3000 mm/min but you logged 2000, the recommendation should be closer to 2000 (weighted toward your data)
6. Log a second cut for the same material with speed 1800 mm/min
7. Search again — speed should pull even more toward your values

**Expected:** Your own cuts influence the recommendation more heavily than community/AI data.

---

### Workflow 16: Confidence Based on Consistency (if implemented)

**Goal:** Test that confidence reflects data consistency, not just count
**Time:** 3 min

**Steps:**
1. Search a material with many data points that agree (e.g., "Stainless Steel 3mm")
2. Verify confidence shows "HIGH" (many entries, consistent speeds)
3. Search a material where data points vary widely (if identifiable)
4. Verify confidence shows "MEDIUM" even if count is high (data disagrees)
5. Search a material with only 1-2 data points
6. Verify confidence shows "LOW"

**Expected:** Confidence badge reflects both quantity AND consistency of data.

---

### Workflow 17: AI Suggestion Fallback (Gemini)

**Goal:** Test that Gemini 2.0 Flash generates a suggestion when no database data exists
**Time:** 5 min
**Prerequisite:** GEMINI_API_KEY set in environment variables

**Steps:**
1. Go to /suggest
2. Search for an obscure material that definitely has no data (e.g., "Inconel 718" at "7mm")
3. Wait for "Asking AI for a starting point..." loading state to appear
4. Verify AI suggestion appears with GRAY badge and "AI SUGGESTION (Unverified)" label
5. Verify warning text: "Not verified by any operator"
6. Verify Gemini's confidence_note is shown (its reasoning for the suggested parameters)
7. Tap "Was this helpful? Yes" — verify it saves (success message appears)
8. Search the same material again ("Inconel 718" at "7mm") — verify it now shows from database with orange "AI BASELINE" badge (promoted from AI suggestion)
9. Test with a material that DOES have data (e.g., "Stainless Steel" at "3mm") — verify Gemini is NOT called (only triggers on empty results). The recommendation should show green/blue/orange badges as usual with no gray badge.

**Expected:**
- Gemini fallback only triggers when ALL database queries return nothing
- Loading state is visible while waiting for Gemini response
- AI suggestion displays with gray badge, warning text, and confidence reasoning
- "Was this helpful? Yes" promotes the suggestion to the database (source = 'ai_baseline')
- Subsequent searches for the same material find the promoted data in the database
- Materials with existing data never trigger the Gemini fallback

---

## Bug Catch Checklist

As you go through all workflows, note any:

### Copy & Content
- [ ] Typos in button labels, headings, or instructions
- [ ] Grammatical errors in help text
- [ ] Confusing or unclear instructions
- [ ] Inconsistent terminology (e.g., "Speed Profile" vs "Profile Speed")
- [ ] Missing or empty labels on form fields

### Functionality
- [ ] Buttons that don't do anything
- [ ] Form fields that don't accept input
- [ ] Form fields that accept invalid input (e.g., negative values)
- [ ] Data not persisting after refresh
- [ ] Search not finding results that should match
- [ ] Recommendations appearing slowly (>2 seconds)
- [ ] Export/import creating invalid files

### Mobile & Layout
- [ ] Text too small to read on mobile
- [ ] Buttons too small to tap (should be ≥48px tall)
- [ ] Overflow or horizontal scrolling needed
- [ ] Form labels misaligned
- [ ] Dark mode (if used) has contrast issues
- [ ] Images/icons broken or missing

### Navigation
- [ ] Links going to wrong pages
- [ ] Back button not working
- [ ] Can't navigate to all features
- [ ] URL structure is confusing (very long URLs, non-descriptive)
- [ ] Browser back button doesn't work as expected

### Error States
- [ ] No error message when something fails
- [ ] Error messages are unhelpful (e.g., "Error: null")
- [ ] Error messages suggest impossible fixes
- [ ] Can't recover from error state

### Performance
- [ ] Page takes >2 seconds to load
- [ ] Autocomplete search is slow
- [ ] Recommendation engine is slow (>2 seconds)
- [ ] App becomes unresponsive
- [ ] Lots of console errors (check browser DevTools)

---

## Success Criteria

Mark these as complete when all workflows pass:

- [ ] **Workflow 1 (Auth):** Sign up, login, logout all work
- [ ] **Workflow 2 (Machine Setup):** Machine profile saves and persists
- [ ] **Workflow 3 (Log Cut):** Cutting cuts logged and appear in history
- [ ] **Workflow 4 (Engraving):** Engraving-specific fields appear and save correctly
- [ ] **Workflow 5 (Recommendation):** Speed recommendations appear with confidence badge and scaling note
- [ ] **Workflow 6 (Feedback):** 3-button feedback records and persists
- [ ] **Workflow 7 (Import):** .clb files import without errors, materials appear in history
- [ ] **Workflow 8 (Export):** .clb export creates valid XML file, can be imported
- [ ] **Workflow 9 (PWA):** App installs to home screen, works offline
- [ ] **Workflow 10 (Font Tool):** Font preview works, downloads PNG with customizations
- [ ] **Workflow 11 (Onboarding):** Onboarding appears once, contextual nudges work
- [ ] **Cross-Workflow A:** Data is consistent across import/export/recommend cycles
- [ ] **Cross-Workflow B:** Session persists across page refreshes
- [ ] **Cross-Workflow C:** Forms validate inputs (no saving blank required fields)
- [ ] **Cross-Workflow D:** Mobile responsive (readable, clickable, no overflow)
- [ ] **Cross-Workflow E:** Error states show helpful messages
- [ ] **Performance:** All pages load in <2 seconds, recommendations in <2 seconds
- [ ] **Bug Catch:** No critical bugs (crashes, data loss, broken links)

---

## Testing Log

Use this section to record your progress:

| Workflow | Status | Notes | Bugs Found |
|----------|--------|-------|-----------|
| 1. Auth | ⬜ |  |  |
| 2. Machine Setup | ⬜ |  |  |
| 3. Log Cut | ⬜ |  |  |
| 4. Engraving | ⬜ |  |  |
| 5. Recommendation | ⬜ |  |  |
| 6. Feedback | ⬜ |  |  |
| 7. Import .clb | ⬜ |  |  |
| 8. Export .clb | ⬜ |  |  |
| 9. PWA Install | ⬜ |  |  |
| 10. Font Tool | ⬜ |  |  |
| 11. Onboarding | ⬜ |  |  |
| 17. AI Suggestion Fallback | ⬜ |  |  |

**Status key:** ⬜ = Not started | 🟨 = In progress | ✅ = Complete | ❌ = Failed

---

## Notes for Matt

- **Time estimate:** 2-3 hours total (can break into sessions)
- **Priority:** Start with Workflows 1-5 (core flows) before the bonus features (7-10)
- **Testing tips:**
  - Open browser DevTools (F12) to check for console errors
  - Test on mobile device or use Chrome mobile emulation (F12 → Device Mode)
  - Test on different browsers if possible (Chrome, Safari, Firefox)
  - Take screenshots of any bugs you find
  - Refresh pages frequently to test data persistence
- **When you find a bug:**
  - Note what you did (step-by-step)
  - Note what happened vs. what should have happened
  - Take a screenshot if helpful
  - Check the browser console (F12) for error messages
- **Send feedback to:** [Your communication channel]

---

## Document History

| Date | Version | Notes |
|------|---------|-------|
| 2026-06-17 | 1.0 | Initial comprehensive testing plan created for Prototype 1 |

---

**End of Testing Plan**

Return to this document after each testing session and mark your progress. Your feedback will help identify which features are ready for beta users and which need polish before launch.
