# App Icon and Splash Screen Resources

This directory holds source assets for generating native app icons and splash screens.

## Requirements

### App Icon
- **Source file:** `icon.png` (place in this directory)
- **Size:** 1024x1024 pixels minimum
- **Format:** PNG with no transparency (iOS rejects transparent icons)
- **Shape:** Square — iOS and Android will apply their own rounding/shaping
- **Design tips:**
  - Keep key elements within the center 80% (safe zone)
  - Use bold, simple shapes that are recognizable at small sizes
  - Test at 29x29px to ensure legibility

### Splash Screen
- **Source file:** `splash.png` (place in this directory)
- **Size:** 2732x2732 pixels (covers all iPad/tablet sizes)
- **Format:** PNG
- **Design:** Centered logo on solid background (#09090b to match app theme)

## Generating Platform Assets

Once you have the source files, run:

```bash
# Install the Capacitor assets generator
npm install -D @capacitor/assets

# Generate all platform icons and splash screens
npx capacitor-assets generate
```

This will create properly sized variants in:
- `android/app/src/main/res/` (mipmap-* directories)
- `ios/App/App/Assets.xcassets/`

## Current Status

- [ ] Design 1024x1024 app icon
- [ ] Design 2732x2732 splash screen
- [ ] Generate platform assets
- [ ] Add adaptive icon for Android (foreground + background layers)
