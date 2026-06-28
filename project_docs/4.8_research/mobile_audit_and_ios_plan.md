# CutLog — Mobile / PWA Audit & Native-iOS Plan

**Auditor:** Mobile/PWA UX engineer (read-only audit)
**Date:** 2026-06-28
**Scope:** `src/app/*`, `src/components/PWAInstallBanner.tsx`, `public/manifest.json`, icons, `tailwind.config.ts`, `next.config.mjs`, `globals.css`, and the `migration_to_app` branch (Capacitor).
**Context:** Operators stand at a machine, on a phone, often in bright light, sometimes on poor shop wifi. Competitors are desktop-web-only, so mobile-first is the differentiator. The audit below is a punch-list for a coding agent.

> NOTE: This is a documentation-only deliverable. No source files were modified.

---

## TL;DR — Recommended native-iOS trigger

**Do NOT build the native app yet. Stay PWA-first and fix the punch-list below.**

Build the native iOS app (the Capacitor wrapper already scaffolded on `migration_to_app`) when **ALL THREE** of these are true:

1. **≥ 150 weekly active operators** (currently the landing page claims "50+ operators"), AND
2. **4-week retention ≥ 30%** (i.e., the product is sticky enough that App Store distribution compounds rather than papering over a leaky funnel), AND
3. **A concrete native-only need is validated by ≥ 5 paying/active users** — the most likely one is **camera-based cut-photo logging** (snap a photo of the cut edge, attach to the log entry) or **push reminders** ("you logged a 3-star cut on 6mm acrylic — re-test?").

**Single headline number: 150 WAU + 30% 4-week retention.** Until then, every native-app hour is better spent on the PWA punch-list, because (a) the iOS wrapper just loads `https://cutlog-two.vercel.app` in a WebView (see `capacitor.config.ts`), so it inherits every PWA bug verbatim, and (b) App Store review will reject a thin WebView wrapper unless it has real native capability. Reasoning detail in §3.

---

## 1. Mobile UX punch-list (prioritized)

Severity key: **P0** = hurts core daily use / data entry in the shop, fix now. **P1** = noticeable friction or install/quality gap. **P2** = polish.

### P0 — fix immediately

**P0-1. No `inputMode` on numeric fields → wrong/default keyboard on mobile.**
Every numeric parameter uses `type="number"` but **none** set `inputMode`. On iOS Safari `type="number"` shows a keyboard with a tiny number row plus letters, not the big numeric/decimal pad an operator wants while standing at a machine. Confirmed: `grep inputMode src/` returns nothing.
- Affected (every numeric input): `src/app/log/page.tsx` (18 number inputs — thickness ~234, power ~256, speed ~266, line interval ~283/378, q-pulse ~294/427, pulse freq ~309/417, passes ~321/473, gas pressure ~350, focus ~367, nozzle dia ~392, nozzle dist ~403, frequency ~460, scan angle ~485/531); `src/app/suggest/page.tsx:720` (thickness); `src/app/machine/page.tsx` (wattage ~326, lens ~366, hours ~393); `src/app/history/page.tsx` (13 edit-form number inputs).
- **Fix:** Add `inputMode="decimal"` to all dimension/parameter inputs that accept decimals (thickness, speed, power, focus, line interval, gas pressure, nozzle, scan angle, q-pulse). Use `inputMode="numeric"` for integer-only fields (wattage, hours, frequency Hz, passes). Keep `type="text"` + `inputMode="decimal"` for the decimal fields if you want to avoid the locale comma/period parsing pitfalls of `type="number"` (`parseFloat` is already used everywhere, so this is safe), OR keep `type="number"` and just add `inputMode`. Either works; adding `inputMode` is the one-line minimum.

**P0-2. `maximumScale: 1` + `userScalable: false` blocks pinch-zoom (accessibility + bright-shop legibility).**
`src/app/layout.tsx:22-23` sets `maximumScale: 1` and `userScalable: false`. This is an accessibility regression (WCAG 1.4.4) and actively hurts the target user: an operator in a bright shop or with imperfect eyesight cannot zoom to read a small parameter. It also does not reliably stop iOS input-focus zoom anyway.
- **Fix:** Remove `maximumScale` and `userScalable` (let `width=device-width, initial-scale=1` stand alone). Prevent the iOS focus-zoom the correct way instead — see P0-3.

**P0-3. Inputs render at <16px effective size in places → iOS auto-zooms on focus.**
iOS Safari zooms the viewport whenever a focused input's font-size is < 16px. The base body font is fine, but the inline edit form in `src/app/history/page.tsx` uses `text-sm` (14px) on its inputs (e.g. lines ~310, ~321, ~333, ~345, etc.), and many labels/values are `text-xs`. Combined with P0-2 being removed, focusing these will jump-zoom and disorient.
- **Fix:** Ensure all `<input>/<select>/<textarea>` have an effective `font-size ≥ 16px` (`text-base` on inputs, or a global rule `input,select,textarea{font-size:16px}` in `globals.css`). This is the proper replacement for `userScalable:false`.

**P0-4. PWA icons are SVG files mislabeled as `.png` → install/home-screen icon may be blank or rejected.**
`public/icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` are all actually **SVG content** (verified with `file`: "SVG Scalable Vector Graphics image"), but `manifest.json` declares them `"type": "image/png"` at 192/512. iOS "Add to Home Screen" does **not** render SVG apple-touch-icons, and Android/Chrome installability checks expect real PNG raster at the declared type. This is the single biggest install-quality bug.
- **Fix:** Generate genuine raster PNGs at exactly 192×192 and 512×512 (and a 180×180 `apple-touch-icon.png`). Keep manifest `type:"image/png"`. Verify with `file` that output is `PNG image data, 192 x 192`.

### P1 — high-value, do this sprint

**P1-1. Manifest is missing maskable icon, scope, orientation, and id.**
`public/manifest.json` has name/short_name/start_url/display/colors/192/512 — good baseline — but is missing:
- a **maskable** icon variant (`"purpose": "maskable"`) → Android adaptive icons get letterboxed/clipped;
- `"scope": "/"`;
- `"id": "/"` (stabilizes the install identity);
- `"orientation": "portrait"` (this is a one-handed-at-the-machine app);
- no `screenshots[]` (not required, but improves the Chrome rich install prompt).
- **Fix:** Add a third icons entry `{ "src":"/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable" }` (ideally a separate, safe-zone-padded asset), plus `scope`, `id`, `orientation`.

**P1-2. No service worker → zero offline, and no "installed app" feel.**
Confirmed: no `sw.js`, no `next-pwa`/Workbox in `package.json`, no `serviceWorker` registration anywhere. Installed PWA on flaky shop wifi shows the browser offline/dino screen. The most valuable offline case for this audience is **read-only access to already-fetched cut history and the active machine profile** while standing at a machine with bad signal.
- **Fix:** Add `next-pwa` (or a hand-rolled Workbox SW) with: (a) precache the app shell + static assets; (b) `NetworkFirst` for `/api/search` & page navigations with a cache fallback; (c) stale-while-revalidate for `/history`. Even a minimal "app shell + offline page" SW dramatically improves the installed feel. Pair with a tiny localStorage/IndexedDB cache of the last successful `/api/search` result and the machine profile so the suggestion screen degrades gracefully.

**P1-3. Sub-44px touch targets on primary daily actions.**
Apple HIG / Material both want ≥44×44px tap targets. Several frequently-tapped controls are smaller:
- Back arrow buttons (`router.back()`) are bare glyphs with no padding: `suggest/page.tsx:658`, `log/page.tsx:158`, `machine/page.tsx:211`, `history/page.tsx:235`, `import/page.tsx:176`. The hit area is roughly the glyph only (~20px).
- Edit/Delete/Confirm/Cancel buttons in history are `px-2 py-1 text-xs` (`history/page.tsx:632, 641, 654`) → ~24px tall. These are destructive actions on a phone.
- Material-dropdown dismiss X in the install banner is fine (`p-2`), but the dropdown rows in suggest/log are OK (`py-3`).
- **Fix:** Give icon/text buttons `min-h-[44px] min-w-[44px]` (or `p-2.5`+). For back arrows, wrap in a `p-2 -ml-2` tap target. Bump history Edit/Delete to at least `px-3 py-2`.

**P1-4. No safe-area-inset handling → notch/home-indicator overlap when installed.**
Confirmed: no `env(safe-area-inset-*)` and no `viewport-fit=cover` anywhere. When installed standalone on a notched iPhone, the fixed bottom controls collide with the home indicator:
- PWA install banner `fixed bottom-4` (`PWAInstallBanner.tsx:158`),
- `sticky bottom-4` submit buttons in `log/page.tsx:624` and `import/page.tsx:333`,
- the global footer.
- **Fix:** Add `viewport-fit=cover` (via `viewport.viewportFit = "cover"` in layout) and use `pb-[env(safe-area-inset-bottom)]` (or `mb-[max(1rem,env(safe-area-inset-bottom))]`) on the fixed/sticky bottom elements. Add top inset padding to the landing `fixed` nav.

**P1-5. Install banner shows on iOS even when it cannot prompt, and triggers fast/aggressively.**
`PWAInstallBanner.tsx:65-74` shows the banner on iOS unconditionally and again via a 2s timeout. For iOS the banner can only show manual "Share → Add to Home Screen" steps. Showing it after 2s, before the user has done anything valuable, is a classic interruption pattern and can read as spammy. The icon/PNG bug (P0-4) also means the iOS instructions point at a feature that produces a broken icon.
- **Fix:** Gate the banner behind an engagement signal (e.g., after first successful suggestion or first logged cut — both already write localStorage keys like `cutlog-cuts-logged`). Keep the 7-day dismiss. Don't show within the first session/2s.

**P1-6. `export-clb` uses Web Share / `window.open` fallback that is brittle on installed iOS.**
`history/page.tsx:201-225`: on mobile it uses `navigator.share({ files })`. iOS standalone PWAs have historically restricted file-share; the fallback is `window.open(url)` which in a standalone PWA opens a new Safari window and breaks the installed-app illusion. This is exactly the kind of file-IO that motivates the native wrapper (§3).
- **Fix (PWA-side):** Feature-detect `navigator.canShare?.({ files:[file] })` before attempting; on failure, render a visible "Download / Open file" link the user taps, rather than auto-`window.open`. Document this as a known PWA limitation.

### P2 — polish

**P2-1. Inconsistent active/tap feedback.** Some buttons have `active:scale-95` (e.g. suggest feedback buttons `suggest/page.tsx:835/841/1231`), most navigation/card buttons have only `hover:` (no `active:`). On touch, `hover:` is unreliable. **Fix:** add `active:` states (scale or bg) to the primary nav cards (`page.tsx:108-173`) and form submit buttons for tactile feedback. (Capacitor Haptics on the native path later.)

**P2-2. Color-only state for required-field errors / confidence.** Confidence badges and edge-quality selections rely on color (red/yellow/green) which washes out in bright sunlight and excludes color-blind users. **Fix:** pair color with a glyph/label (already partly done with ✓/⚠️; extend to confidence badge text weight + icon).

**P2-3. `grid-cols-4` data rows can crowd on narrow phones.** `history/page.tsx:613` (cut summary) and `import/page.tsx:317` pack 4 columns of params into a ~340px width → cramped `text-xs`. **Fix:** `grid-cols-2 sm:grid-cols-4` or allow wrap. (Low risk of horizontal scroll since they're grid, not nowrap, but legibility suffers.)

**P2-4. Native-feel niceties absent.** No `autoComplete`/`autoCapitalize="none"` on the email field (`auth/page.tsx:69`) — iOS may capitalize. No `enterKeyHint` on search inputs. **Fix:** `autoComplete="email"`, `autoCapitalize="none"`, `inputMode="email"` on auth; `enterKeyHint="search"` on material/thickness search.

**P2-5. `100vh` not used (good), but `min-h-screen` is everywhere.** Tailwind's `min-h-screen` = `100vh`, which on mobile Safari includes the dynamic toolbar and can cause a slight jump. **Fix (optional):** switch hot pages to `min-h-[100dvh]` once dvh support is acceptable.

---

## 2. PWA install-quality verification

| Check | Status | Notes |
|---|---|---|
| `name` / `short_name` | ✅ | "CutLog" / "CutLog" |
| `description` | ✅ | present |
| `start_url` | ✅ | `/` (consider `/?source=pwa` for analytics) |
| `display: standalone` | ✅ | good |
| `theme_color` / `background_color` | ✅ | `#0a0a0a` matches dark UI |
| icon 192 | ⚠️ **broken** | declared PNG, file is SVG (P0-4) |
| icon 512 | ⚠️ **broken** | same |
| maskable icon | ❌ missing | P1-1 |
| `scope` / `id` / `orientation` | ❌ missing | P1-1 |
| apple-touch-icon | ⚠️ **broken** | SVG masquerading as PNG; iOS won't render (P0-4). No explicit `<link rel="apple-touch-icon">` either — relies on file convention, which only works if the file is real PNG |
| `apple-mobile-web-app-*` meta | ❌ missing | No `appleWebApp` in Next metadata. Add `appleWebApp: { capable:true, statusBarStyle:"black-translucent", title:"CutLog" }` for a clean iOS standalone status bar |
| viewport-fit / safe-area | ❌ missing | P1-4 |
| Service worker | ❌ none | P1-2 — no offline at all |
| Offline read of saved settings | ❌ none | High value for poor shop wifi; not implemented |
| Install prompt UX | ⚠️ | Works on Android via `beforeinstallprompt`; iOS is manual-instructions only and fires too eagerly (P1-5) |

**Net:** The manifest baseline is decent, but the **icons are functionally broken** (SVG-as-PNG) and there is **no service worker**, so install quality is currently poor: an installed app may show a blank/garbled home-screen icon and has zero offline resilience. Fixing P0-4 + P1-1 + P1-2 + P1-4 gets CutLog to a genuinely installable, professional PWA — which is the prerequisite for the native wrapper to be worth shipping.

---

## 3. Trigger + plan for a FULL native iOS app

### What already exists (`migration_to_app` branch)
- `capacitor.config.ts` — `appId: com.cutlog.app`, **hosted-URL/WebView approach** (`server.url = https://cutlog-two.vercel.app`). It loads the live site in a WebView rather than bundling static files (because the app relies on `/api/*` serverless routes). Splash screen, dark StatusBar, and PushNotifications presentation options are pre-configured.
- `package.json` adds Capacitor 8 + plugins: `@capacitor/camera`, `push-notifications`, `haptics`, `preferences`, `splash-screen`, `status-bar`, `app`.
- `next.config.mjs` has commented-out `output:'export'` for an eventual local-static mode.
- **Not yet present:** no `ios/` Xcode project committed, no app icon assets, no APNs/Firebase setup. So this is scaffolding, not a buildable app.

### Recommended trigger (decisive)
**Trigger native build at 150 weekly active operators AND ≥30% 4-week retention AND one validated native-only need (≥5 users).** Rationale:
- The current public claim is "50+ operators." At ~50, App Store presence does almost nothing — discovery there is pay-to-play and saturated; you'd spend weeks on review + APNs/Apple Developer ($99/yr) setup to reach an audience you can already reach via a URL. **150 WAU** is the point where (a) you have enough signal to know what native feature actually matters, and (b) App Store search/"laser settings" discovery starts returning compounding installs.
- **30% 4-week retention** is the gate that says "this is a habit, not a curiosity." Wrapping a leaky funnel in a native shell just moves the leak behind a 1.5MB download.
- The **validated native-only need** prevents a thin-wrapper rejection (see gotchas) and ensures the app does something the PWA can't.

### What native unlocks that the PWA cannot (or does poorly)
1. **Camera-based cut-photo logging** — `@capacitor/camera`. Snap the cut edge, attach to the log entry. This is the strongest native differentiator and a natural visual-quality record. PWA `getUserMedia` is clunky and iOS-restricted in standalone mode.
2. **Push notifications** — `@capacitor/push-notifications` + APNs. iOS web-push exists since 16.4 but only for installed PWAs and is unreliable; native is the dependable path for "re-test this material" or "community added data for your machine" nudges.
3. **Reliable file save/share of `.clb` exports** — fixes the brittle `navigator.share`/`window.open` path (P1-6) via native share sheet → Files app.
4. **Haptics** on log/feedback confirmation (`@capacitor/haptics`) — small but makes the at-the-machine taps feel deliberate with gloves.
5. **App Store discoverability + trust** — "laser cut settings" search presence; a real install badge for a tradesperson audience that trusts the App Store more than a URL.
6. **Persistent secure storage** (`@capacitor/preferences`) and proper standalone status-bar/splash control.

### Cost / effort estimate
- **Wrapper-only (hosted WebView, what's scaffolded): ~3–5 dev-days** to a TestFlight build: add the `ios/` project (`npx cap add ios`), real app icons (depends on P0-4 being fixed first), splash assets, Apple Developer enrollment, signing, TestFlight. Low ongoing cost since web content updates without resubmission.
- **+ Camera photo logging: ~1 week** (camera plugin + DB column + Supabase storage bucket + UI in `log`/`history`). This is also the feature that justifies the app to Apple reviewers.
- **+ Push notifications: ~1 week** (APNs cert, FCM if cross-platform later, device-token registration, a backend trigger). Highest ops overhead.
- **Total to a defensible v1 native app: ~2–3 weeks** of focused work, plus $99/yr Apple Developer.

### App Store review gotchas (PWA-wrapper specific)
1. **Guideline 4.2 "Minimum Functionality."** Apple rejects apps that are "just a website in a wrapper." Mitigation: ship at least one real native capability at launch (camera photo logging is the cleanest), use the native status bar/splash, and ideally cache enough for limited offline use so it isn't pure-online webview.
2. **Hosted-URL WebView risk.** `server.url` pointing at the live Vercel site is allowed but draws extra 4.2 scrutiny; reviewers may flag "content loads remotely." Having native features and a branded shell reduces risk. Consider the `output:'export'` static-bundle path (already commented in `next.config.mjs`) for the shell + native API calls long-term — but that requires converting `/api/import-clb` & `/api/export-clb` to client-side Supabase, which is non-trivial.
3. **Account deletion (Guideline 5.1.1(v)).** Any app with account creation must offer in-app account deletion. CutLog has a "Reset My Data" (`machine/page.tsx` Danger Zone) but not full account deletion — add it before submission.
4. **Privacy nutrition label + `NSCameraUsageDescription`** (Info.plist purpose string) required for camera. Push needs `NSUserNotificationsUsageDescription` / aps-environment entitlement.
5. **Sign in with Apple (4.8/5.x):** if you add any third-party social login later, Apple requires offering Sign in with Apple too. Current email/password (`auth/page.tsx`) is fine and avoids this.
6. **External payment / web links:** no monetization today, so no IAP concerns yet — but a "Try CutLog Free" funnel to a paid web tier later would hit Guideline 3.1.1.

---

## 4. Five highest-impact, lowest-effort quick wins (do now)

1. **Add `inputMode` to every numeric input** (P0-1). One attribute per input. Instantly gives operators the right keypad — the single biggest day-to-day data-entry win. `inputMode="decimal"` for measurements, `inputMode="numeric"` for integers.
2. **Replace the fake-PNG icons with real 192/512 + 180 PNGs and add a maskable variant** (P0-4 + P1-1). Fixes the broken/blank home-screen icon that undermines every "Install CutLog" prompt. ~30 min with any icon generator.
3. **Drop `maximumScale:1` / `userScalable:false` and force inputs to ≥16px font** (P0-2 + P0-3). Two small edits in `layout.tsx` + one `globals.css` rule. Restores pinch-zoom (legibility in bright shop) and kills iOS focus-zoom jump.
4. **Add `viewport-fit=cover` + `env(safe-area-inset-bottom)` padding** to the install banner, the two `sticky bottom-4` submit buttons (log/import), and the footer (P1-4). Stops the home-indicator overlap that makes the installed app look unfinished.
5. **Bump sub-44px touch targets** — back arrows and history Edit/Delete buttons (P1-3). Wrap glyph buttons in `p-2` and raise the destructive buttons to `px-3 py-2 min-h-[44px]`. Pure Tailwind class changes, high tactile payoff for gloved/standing use.

(Bonus near-zero-effort: add `autoComplete="email" autoCapitalize="none" inputMode="email"` to the auth email field — P2-4.)
