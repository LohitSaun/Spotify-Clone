import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyPaging, SpotifyPlaylist, SpotifyPlaylistDetail } from '@/types/spotify'

const playlistsApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUserPlaylists: builder.query<SpotifyPaging<SpotifyPlaylist>, { limit?: number } | void>({
      query: (args) => ({
        url: '/me/playlists',
        params: { limit: args?.limit ?? 50 },
      }),
      providesTags: ['Playlist'],
    }),

    getPlaylist: builder.query<SpotifyPlaylistDetail, string>({
      query: (playlistId) => `/playlists/${playlistId}`,
      providesTags: (_result, _error, playlistId) => [{ type: 'PlaylistTracks', id: playlistId }],
    }),

    createPlaylist: builder.mutation<SpotifyPlaylist, { userId: string; name: string; description?: string; isPublic?: boolean }>({
      query: ({ userId, name, description, isPublic = false }) => ({
        url: `/users/${userId}/playlists`,
        method: 'POST',
        body: { name, description, public: isPublic },
      }),
      invalidatesTags: ['Playlist'],
    }),

    addTracksToPlaylist: builder.mutation<void, { playlistId: string; uris: string[] }>({
      query: ({ playlistId, uris }) => ({
        url: `/playlists/${playlistId}/tracks`,
        method: 'POST',
        body: { uris },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'PlaylistTracks', id: playlistId }, 'Playlist'],
    }),

    // Removes by URI (all occurrences) rather than by position — simpler,
    // and fine unless the same track appears twice in one playlist.
    removeTrackFromPlaylist: builder.mutation<void, { playlistId: string; uri: string }>({
      query: ({ playlistId, uri }) => ({
        url: `/playlists/${playlistId}/tracks`,
        method: 'DELETE',
        body: { tracks: [{ uri }] },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'PlaylistTracks', id: playlistId }, 'Playlist'],
    }),
  }),
})

export const {
  useGetCurrentUserPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useAddTracksToPlaylistMutation,
  useRemoveTrackFromPlaylistMutation,
} = playlistsApi
