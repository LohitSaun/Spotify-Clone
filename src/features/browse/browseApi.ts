import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyAlbum, SpotifyCategory, SpotifyPaging, SpotifyPlaylist, SpotifyRecentlyPlayedItem } from '@/types/spotify'

const browseApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewReleases: builder.query<SpotifyPaging<SpotifyAlbum>, { limit?: number } | void>({
      query: (args) => ({
        url: '/browse/new-releases',
        params: { limit: args?.limit ?? 12 },
      }),
      transformResponse: (response: { albums: SpotifyPaging<SpotifyAlbum> }) => response.albums,
    }),

    // Spotify restricted this endpoint (along with categories) to apps
    // granted "extended quota mode" some time back — a newly created app
    // may get a 403/404 here. We treat that as "section unavailable"
    // rather than an error, see HomePage's use of `isError`.
    getFeaturedPlaylists: builder.query<SpotifyPaging<SpotifyPlaylist>, { limit?: number } | void>({
      query: (args) => ({
        url: '/browse/featured-playlists',
        params: { limit: args?.limit ?? 12 },
      }),
      transformResponse: (response: { playlists: SpotifyPaging<SpotifyPlaylist> }) => response.playlists,
    }),

    getCategories: builder.query<SpotifyPaging<SpotifyCategory>, { limit?: number } | void>({
      query: (args) => ({
        url: '/browse/categories',
        params: { limit: args?.limit ?? 12 },
      }),
      transformResponse: (response: { categories: SpotifyPaging<SpotifyCategory> }) => response.categories,
    }),

    // Requires a real user token (user-read-recently-played scope) — always
    // 401s on the anonymous app token, which is fine: HomePage only renders
    // this query while authenticated.
    getRecentlyPlayed: builder.query<SpotifyRecentlyPlayedItem[], { limit?: number } | void>({
      query: (args) => ({
        url: '/me/player/recently-played',
        params: { limit: args?.limit ?? 10 },
      }),
      transformResponse: (response: { items: SpotifyRecentlyPlayedItem[] }) => response.items,
    }),
  }),
})

export const { useGetNewReleasesQuery, useGetFeaturedPlaylistsQuery, useGetCategoriesQuery, useGetRecentlyPlayedQuery } = browseApi
