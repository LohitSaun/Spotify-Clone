import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import { refreshSession } from '@/features/auth/authSlice'
import { getAnonymousAccessToken } from './anonymousToken'

const rawBaseQuery = fetchBaseQuery({ baseUrl: 'https://api.spotify.com/v1' })

function withAuthHeader(args: string | FetchArgs, token: string | null): FetchArgs {
  const base: FetchArgs = typeof args === 'string' ? { url: args } : { ...args }
  if (!token) return base
  return {
    ...base,
    headers: { ...(base.headers as Record<string, string> | undefined), Authorization: `Bearer ${token}` },
  }
}

/**
 * Picks which token to send: the logged-in user's access token if we have
 * one, otherwise an anonymous app-only token (see anonymousToken.ts) so
 * logged-out visitors can still search and browse public data.
 */
async function resolveAccessToken(getState: () => unknown): Promise<string | null> {
  const state = getState() as RootState
  if (state.auth.accessToken) return state.auth.accessToken
  return getAnonymousAccessToken()
}

/**
 * Wraps the plain fetch base query with one retry-after-refresh: if a
 * request comes back 401 while we're using a *user* token (expired
 * mid-session, or the proactive refresh timer hasn't fired yet), refresh
 * once and replay the exact same request rather than surfacing the
 * failure to the UI. A 401 on an anonymous token just means the endpoint
 * needed a real user — that's surfaced as-is so the UI can show a login
 * prompt.
 */
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const token = await resolveAccessToken(api.getState)
  let result = await rawBaseQuery(withAuthHeader(args, token), api, extraOptions)

  const hadUserToken = Boolean(token) && (api.getState() as RootState).auth.accessToken === token
  if (result.error?.status === 401 && hadUserToken) {
    const refreshResult = await api.dispatch(refreshSession())
    if (refreshSession.fulfilled.match(refreshResult)) {
      const newToken = (api.getState() as RootState).auth.accessToken
      result = await rawBaseQuery(withAuthHeader(args, newToken), api, extraOptions)
    }
  }

  return result
}

/**
 * Single RTK Query API instance shared by every feature. Individual
 * features (search, browse, playlists, library…) call `.injectEndpoints`
 * on this rather than creating their own `createApi` instance, so they all
 * share one cache, one set of tags, and this auth/retry behavior for free.
 */
export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Playlist', 'PlaylistTracks', 'SavedTracks', 'SavedAlbums', 'FollowedArtists', 'Devices'],
  endpoints: () => ({}),
})
