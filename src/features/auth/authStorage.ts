/**
 * Where each piece of the auth handshake lives, and why:
 *
 * - PKCE verifier + state: sessionStorage. They only need to survive the
 *   single browser navigation to Spotify and back, and sessionStorage
 *   auto-clears per tab, so there's nothing left to clean up or leak later.
 * - Refresh token: localStorage. This is the one real tradeoff in this app.
 *   A refresh token has to persist across reloads for the "stay logged in"
 *   requirement, and a pure static SPA has no server-controlled, httpOnly
 *   cookie to put it in. localStorage is readable by any script on the
 *   page, so an XSS bug elsewhere in the app (or a compromised dependency)
 *   could exfiltrate it. In production this is normally solved with a thin
 *   backend-for-frontend that holds the refresh token server-side and
 *   issues the SPA only short-lived access tokens — out of scope for a
 *   pure-frontend portfolio project, but worth knowing the mitigation. The
 *   *access* token never touches storage; it lives only in Redux state, so
 *   a full page reload always discards it.
 */

const REFRESH_TOKEN_KEY = 'spotify_refresh_token'
const PKCE_VERIFIER_KEY = 'spotify_pkce_verifier'
const PKCE_STATE_KEY = 'spotify_pkce_state'

export const pkceStorage = {
  save(verifier: string, state: string) {
    sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier)
    sessionStorage.setItem(PKCE_STATE_KEY, state)
  },
  consume(): { verifier: string; state: string } | null {
    const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY)
    const state = sessionStorage.getItem(PKCE_STATE_KEY)
    sessionStorage.removeItem(PKCE_VERIFIER_KEY)
    sessionStorage.removeItem(PKCE_STATE_KEY)
    if (!verifier || !state) return null
    return { verifier, state }
  },
}

export const refreshTokenStorage = {
  get(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  set(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
