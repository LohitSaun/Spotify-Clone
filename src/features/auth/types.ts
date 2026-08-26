export interface SpotifyUser {
  id: string
  display_name: string | null
  email: string
  /** 'premium' | 'free' | 'open' — the Web Playback SDK only works for 'premium'. */
  product: 'premium' | 'free' | 'open'
  /** ISO 3166-1 alpha-2 — used as the `market` param on catalog endpoints (top tracks, availability). */
  country: string
  images: { url: string; width: number | null; height: number | null }[]
  external_urls: { spotify: string }
  uri: string
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  /** In-memory only — never persisted, so a hard reload always wipes it. */
  accessToken: string | null
  /** Epoch ms; used to proactively refresh before the token actually expires. */
  expiresAt: number | null
  user: SpotifyUser | null
  error: string | null
}
