import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyPaging, SpotifyPlaylistTrackItem } from '@/types/spotify'

const likedSongsApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    getLikedSongs: builder.query<SpotifyPaging<SpotifyPlaylistTrackItem>, { limit?: number } | void>({
      query: (args) => ({
        url: '/me/tracks',
        params: { limit: args?.limit ?? 50 },
      }),
      providesTags: ['SavedTracks'],
    }),

    // Cache key is the track id itself (a plain string, so RTK Query can
    // dedupe/cache per-track) rather than batching — simpler, at the cost
    // of one request per track row rendered. Fine at portfolio scale; a
    // real app would batch visible track ids into one /contains call.
    isTrackSaved: builder.query<boolean, string>({
      query: (trackId) => ({
        url: '/me/tracks/contains',
        params: { ids: trackId },
      }),
      transformResponse: (response: boolean[]) => response[0] ?? false,
      providesTags: (_result, _error, trackId) => [{ type: 'SavedTracks', id: trackId }],
    }),

    saveTrack: builder.mutation<void, string>({
      query: (trackId) => ({
        url: '/me/tracks',
        method: 'PUT',
        body: { ids: [trackId] },
      }),
      invalidatesTags: (_result, _error, trackId) => [{ type: 'SavedTracks', id: trackId }, 'SavedTracks'],
    }),

    removeSavedTrack: builder.mutation<void, string>({
      query: (trackId) => ({
        url: '/me/tracks',
        method: 'DELETE',
        body: { ids: [trackId] },
      }),
      invalidatesTags: (_result, _error, trackId) => [{ type: 'SavedTracks', id: trackId }, 'SavedTracks'],
    }),
  }),
})

export const { useGetLikedSongsQuery, useIsTrackSavedQuery, useSaveTrackMutation, useRemoveSavedTrackMutation } = likedSongsApi
