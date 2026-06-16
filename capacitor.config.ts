import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for CutLog
 *
 * ARCHITECTURE DECISION: Hosted URL (WebView) Approach
 * =====================================================
 * This app uses API routes (/api/import-clb, /api/export-clb) that require a
 * server runtime. Rather than converting these to client-side Supabase calls,
 * we use the "hosted URL" approach where the native app loads the deployed
 * Vercel URL in a WebView.
 *
 * Benefits:
 * - Always up to date (no app store update needed for web changes)
 * - API routes work (they run on Vercel's serverless functions)
 * - Simpler deployment pipeline
 *
 * Trade-offs:
 * - Requires internet connection (acceptable for v1)
 * - Offline mode will be a future enhancement
 *
 * TO SWITCH TO LOCAL STATIC FILES:
 * 1. Remove the `server.url` property below
 * 2. Set `output: 'export'` in next.config.mjs
 * 3. Run `npx next build` to generate the /out directory
 * 4. Convert API routes to client-side Supabase calls
 * 5. The app will then load from bundled static files (works offline)
 */
const config: CapacitorConfig = {
  appId: 'com.cutlog.app',
  appName: 'CutLog',
  webDir: 'out',

  // Load the hosted Vercel app in production.
  // Remove this block to use local static files instead (see comments above).
  server: {
    url: 'https://cutlog-two.vercel.app',
    cleartext: false, // HTTPS only
  },

  plugins: {
    SplashScreen: {
      // Dark theme splash screen matching the app's zinc-950 background
      backgroundColor: '#09090b', // zinc-950
      launchAutoHide: true,
      launchShowDuration: 2000,
      showSpinner: false,
      // TODO: Add splash screen image once app icons are created
      // splashFullScreen: true,
      // splashImmersive: true,
    },
    StatusBar: {
      // Dark status bar to match the app's dark theme
      style: 'DARK', // Light text on dark background
      backgroundColor: '#09090b', // zinc-950
    },
    PushNotifications: {
      // Push notification configuration
      // Requires Apple Developer account (APNs) and Firebase (FCM) setup
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
