/**
 * Spotify requires a bearer token on every Web API call, including plain
 * search — there's no truly "unauthenticated" request. For a logged-out
 * visitor we can't use the user's PKCE token (there isn't one yet), and we
 * can't run the Client Credentials flow directly from the browser either,
 * because it needs a client secret that would sit in plain sight in the JS
 * bundle. The fix is a one-endpoint serverless function (`/api/token`,
 * mirrored in dev by a Vite middleware — see vite.config.ts) that holds the
 * secret server-side and hands back a short-lived app-only token. This
 * module fetches and caches that token in memory for anonymous browsing
 * (search, browse, public playlists/artists); it's never used once a real
 * user is logged in.
 */

interface CachedToken {
  token: string
  expiresAt: number
}

let cached: CachedToken | null = null
let inFlight: Promise<string | null> | null = null

export async function getAnonymousAccessToken(): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now() + 5_000) {
    return cached.token
  }

  if (!inFlight) {
    inFlight = fetchAnonymousToken().finally(() => {
      inFlight = null
    })
  }

  return inFlight
}

async function fetchAnonymousToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/token')
    if (!response.ok) return null

    const data: { access_token: string; expires_in: number } = await response.json()
    cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
    return cached.token
  } catch {
    return null
  }
}
