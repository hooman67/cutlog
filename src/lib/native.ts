/**
 * Native Plugins Wrapper for Capacitor
 *
 * This module provides helper functions that work in both native (Capacitor)
 * and web (browser) environments. Each function gracefully falls back to a
 * no-op when running in a web browser, so the same codebase works everywhere.
 *
 * Uses dynamic imports to avoid breaking the web build — Capacitor plugins
 * are only loaded when actually running in a native context.
 */

/**
 * Detect if the app is running inside a Capacitor native shell (iOS/Android)
 * vs a regular web browser.
 */
export function isNative(): boolean {
  if (typeof window === 'undefined') return false;
  // Capacitor injects this object when running in the native shell
  return !!(window as any).Capacitor?.isNativePlatform?.();
}

/**
 * Get the current platform: 'ios', 'android', or 'web'
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  const cap = (window as any).Capacitor;
  if (!cap?.isNativePlatform?.()) return 'web';
  return cap.getPlatform?.() ?? 'web';
}

/**
 * Trigger a light haptic feedback (impact style).
 * Used for confirming successful actions like saving a cut or giving feedback.
 * No-op on web — only vibrates on native iOS/Android.
 */
export async function triggerHaptic(): Promise<void> {
  if (!isNative()) return;

  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Silently fail — haptics are a nice-to-have, not critical
  }
}

/**
 * Trigger a medium haptic feedback.
 * Used for more significant interactions.
 */
export async function triggerHapticMedium(): Promise<void> {
  if (!isNative()) return;

  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Silently fail
  }
}

/**
 * Request push notification permission and register the device.
 * Returns the device token if granted, null otherwise.
 * No-op on web (returns null).
 */
export async function requestPushPermission(): Promise<string | null> {
  if (!isNative()) return null;

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return null;

    // Register with APNs / FCM
    await PushNotifications.register();

    // Wait for the registration token
    return new Promise((resolve) => {
      PushNotifications.addListener('registration', (token) => {
        resolve(token.value);
      });
      PushNotifications.addListener('registrationError', () => {
        resolve(null);
      });
      // Timeout after 10 seconds
      setTimeout(() => resolve(null), 10000);
    });
  } catch {
    return null;
  }
}

/**
 * Take a picture using the device camera.
 * Returns a base64-encoded image string, or null if cancelled/failed.
 * No-op on web (returns null).
 */
export async function takePicture(): Promise<string | null> {
  if (!isNative()) return null;

  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    return photo.base64String ?? null;
  } catch {
    // User cancelled or camera unavailable
    return null;
  }
}

/**
 * Store a key-value pair in native preferences (persists across app restarts).
 * Falls back to localStorage on web.
 */
export async function setPreference(key: string, value: string): Promise<void> {
  if (!isNative()) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
    return;
  }

  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key, value });
  } catch {
    // Fall back to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
}

/**
 * Get a value from native preferences.
 * Falls back to localStorage on web.
 */
export async function getPreference(key: string): Promise<string | null> {
  if (!isNative()) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  try {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }
}
