import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyAlbum, SpotifyArtist, SpotifyPaging, SpotifyTrack } from '@/types/spotify'

const artistApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtist: builder.query<SpotifyArtist, string>({
      query: (artistId) => `/artists/${artistId}`,
    }),

    getArtistTopTracks: builder.query<SpotifyTrack[], { artistId: string; market: string }>({
      query: ({ artistId, market }) => ({
        url: `/artists/${artistId}/top-tracks`,
        params: { market },
      }),
      transformResponse: (response: { tracks: SpotifyTrack[] }) => response.tracks,
    }),

    getArtistAlbums: builder.query<SpotifyPaging<SpotifyAlbum>, { artistId: string; market: string }>({
      query: ({ artistId, market }) => ({
        url: `/artists/${artistId}/albums`,
        // One entry per release group, not per regional re-release/deluxe reissue.
        params: { market, include_groups: 'album,single', limit: 20 },
      }),
    }),

    // Deprecated for apps without "extended quota mode" (see browseApi.ts) —
    // best-effort, ArtistPage hides the section on error rather than erroring.
    getRelatedArtists: builder.query<SpotifyArtist[], string>({
      query: (artistId) => `/artists/${artistId}/related-artists`,
      transformResponse: (response: { artists: SpotifyArtist[] }) => response.artists,
    }),
  }),
})

export const { useGetArtistQuery, useGetArtistTopTracksQuery, useGetArtistAlbumsQuery, useGetRelatedArtistsQuery } = artistApi
