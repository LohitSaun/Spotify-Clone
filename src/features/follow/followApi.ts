import { spotifyApi } from '@/lib/spotify/apiSlice'

const followApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    // Cache key is the artist id — same one-per-entity pattern as
    // isTrackSaved in likedSongsApi.ts, for the same reason (simple,
    // RTK-Query-cacheable per row; batching is a possible optimization).
    isFollowingArtist: builder.query<boolean, string>({
      query: (artistId) => ({
        url: '/me/following/contains',
        params: { type: 'artist', ids: artistId },
      }),
      transformResponse: (response: boolean[]) => response[0] ?? false,
      providesTags: (_result, _error, artistId) => [{ type: 'FollowedArtists', id: artistId }],
    }),

    followArtist: builder.mutation<void, string>({
      query: (artistId) => ({
        url: '/me/following',
        method: 'PUT',
        params: { type: 'artist', ids: artistId },
      }),
      invalidatesTags: (_result, _error, artistId) => [{ type: 'FollowedArtists', id: artistId }],
    }),

    unfollowArtist: builder.mutation<void, string>({
      query: (artistId) => ({
        url: '/me/following',
        method: 'DELETE',
        params: { type: 'artist', ids: artistId },
      }),
      invalidatesTags: (_result, _error, artistId) => [{ type: 'FollowedArtists', id: artistId }],
    }),
  }),
})

export const { useIsFollowingArtistQuery, useFollowArtistMutation, useUnfollowArtistMutation } = followApi
