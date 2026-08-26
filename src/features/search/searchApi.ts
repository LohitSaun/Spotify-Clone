import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyAlbum, SpotifyArtist, SpotifyPaging, SpotifyPlaylist, SpotifyTrack } from '@/types/spotify'

export interface SearchResponse {
  tracks?: SpotifyPaging<SpotifyTrack>
  artists?: SpotifyPaging<SpotifyArtist>
  albums?: SpotifyPaging<SpotifyAlbum>
  playlists?: SpotifyPaging<SpotifyPlaylist>
}

export const SEARCH_TYPES = ['track', 'artist', 'album', 'playlist'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]

interface SearchArgs {
  query: string
  types?: readonly SearchType[]
  limit?: number
}

const searchApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchArgs>({
      query: ({ query, types = SEARCH_TYPES, limit = 8 }) => ({
        url: '/search',
        params: {
          q: query,
          type: types.join(','),
          limit,
        },
      }),
      // Public data — search doesn't require the user to be logged in
      // (Spotify's client-credentials-equivalent scope), only a valid
      // access token, which our app always has once bootstrapped.
    }),
  }),
})

export const { useSearchQuery } = searchApi
