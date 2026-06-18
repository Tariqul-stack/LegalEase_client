/**
 * Google Identity Services (GSI) auth client
 *
 * This module provides a Promise-based wrapper around Google's
 * accounts.google.com/gsi/client browser SDK. It pops the native
 * Google One-Tap / OAuth picker and resolves with the decoded user
 * profile (name, email, picture).
 *
 * The returned profile is then sent to our own backend endpoint
 * POST /api/auth/google-login which issues a JWT — keeping all
 * auth state in localStorage exactly like email/password login.
 *
 * Why not better-auth server? better-auth v1.x needs its OWN
 * database adapter and session tables. Since we already have an
 * Express + MongoDB backend with JWT, using GSI directly is the
 * correct architecture — no duplicate auth layer needed.
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Dynamically loads the Google GSI script if not already present.
 */
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Server side'));
    if (window.google?.accounts) return resolve();

    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.head.appendChild(script);
  });
}

/**
 * Decodes a JWT ID token payload without verification.
 * Verification happens on the backend via the Google public keys.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Opens the Google Sign-In picker and resolves with user profile.
 * @returns {Promise<{ name: string, email: string, photo: string }>}
 */
export function signInWithGoogle() {
  return new Promise(async (resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      return reject(new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in .env.local'));
    }

    try {
      await loadGoogleScript();
    } catch (err) {
      return reject(err);
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (!response.credential) {
          return reject(new Error('Google sign-in was cancelled or failed.'));
        }

        const payload = decodeJwtPayload(response.credential);
        if (!payload) {
          return reject(new Error('Failed to decode Google credential.'));
        }

        resolve({
          name: payload.name,
          email: payload.email,
          photo: payload.picture,
          idToken: response.credential, // raw token for server-side verification if needed
        });
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Prompt One Tap
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap not available — fall back to the popup flow
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-fallback'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    });
  });
}

/**
 * Revokes the Google session and clears the One Tap state.
 * Call this alongside your own localStorage cleanup on logout.
 * @param {string} email - The email of the user to sign out
 */
export function signOutGoogle(email) {
  if (typeof window === 'undefined' || !window.google?.accounts) return;
  window.google.accounts.id.revoke(email, () => {
    window.google.accounts.id.disableAutoSelect();
  });
}
