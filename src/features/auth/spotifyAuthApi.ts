import { generateCodeChallenge, generateCodeVerifier, generateState } from './pkce'
import { pkceStorage } from './authStorage'
import { SPOTIFY_SCOPE_STRING } from './scopes'
import type { SpotifyUser } from './types'

const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const ME_URL = 'https://api.spotify.com/v1/me'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

export interface TokenResponse {
  access_token: string
  token_type: 'Bearer'
  scope: string
  expires_in: number
  /** Only present on the very first exchange, and sometimes on refresh if Spotify rotates it. */
  refresh_token?: string
}

/**
 * Kicks off the login flow: generates a fresh verifier/challenge pair,
 * stashes the verifier (and a CSRF `state`) for the callback step, then
 * hard-navigates to Spotify's consent screen. There's no return value
 * because the browser is about to leave this page entirely.
 */
export async function redirectToSpotifyAuthorize() {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const state = generateState()

  pkceStorage.save(verifier, state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    scope: SPOTIFY_SCOPE_STRING,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.assign(`${AUTHORIZE_URL}?${params.toString()}`)
}

/**
 * Redeems the authorization `code` Spotify put on the callback URL for an
 * access/refresh token pair. `state` must match what we generated before
 * the redirect, or this is rejected as a possible CSRF attempt.
 */
export async function exchangeCodeForToken(code: string, receivedState: string): Promise<TokenResponse> {
  const stored = pkceStorage.consume()
  if (!stored || stored.state !== receivedState) {
    throw new Error('Login could not be verified (state mismatch). Please try signing in again.')
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: stored.verifier,
  })

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed (${response.status})`)
  }

  return response.json()
}

/**
 * Silently trades a refresh token for a new access token — this is what
 * lets a reload restore the session without bouncing the user back through
 * Spotify's consent screen. Spotify may rotate the refresh token itself,
 * in which case the response includes a new one that must replace the old.
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed (${response.status})`)
  }

  return response.json()
}

export async function fetchSpotifyProfile(accessToken: string): Promise<SpotifyUser> {
  const response = await fetch(ME_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Spotify profile (${response.status})`)
  }

  return response.json()
}
