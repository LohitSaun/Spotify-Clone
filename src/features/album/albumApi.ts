import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyAlbumDetail } from '@/types/spotify'

const albumApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlbum: builder.query<SpotifyAlbumDetail, { albumId: string; market: string }>({
      query: ({ albumId, market }) => ({
        url: `/albums/${albumId}`,
        params: { market },
      }),
    }),
  }),
})

export const { useGetAlbumQuery } = albumApi
