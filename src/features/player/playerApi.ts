import { spotifyApi } from '@/lib/spotify/apiSlice'
import type { SpotifyDevice } from '@/types/spotify'
import type { RepeatMode } from './types'

interface StartPlaybackArgs {
  deviceId: string
  /** Play a whole album/playlist context (enables proper next/prev through it)… */
  contextUri?: string
  /** …or an ad-hoc list of track URIs with no context. */
  uris?: string[]
  offset?: { position: number }
}

const REPEAT_MODE_TO_API: Record<RepeatMode, string> = { off: 'off', context: 'context', track: 'track' }

const playerApi = spotifyApi.injectEndpoints({
  endpoints: (builder) => ({
    // Starting playback of a specific track/context has no equivalent on
    // the SDK Player class — it's REST-only. Once playing, pause/resume/
    // seek/skip go through the SDK directly (see spotifyPlayerService.ts).
    startPlayback: builder.mutation<void, StartPlaybackArgs>({
      query: ({ deviceId, contextUri, uris, offset }) => ({
        url: '/me/player/play',
        method: 'PUT',
        params: { device_id: deviceId },
        body: contextUri ? { context_uri: contextUri, offset } : { uris, offset },
      }),
    }),

    setShuffle: builder.mutation<void, { deviceId: string; shuffle: boolean }>({
      query: ({ deviceId, shuffle }) => ({
        url: '/me/player/shuffle',
        method: 'PUT',
        params: { device_id: deviceId, state: shuffle },
      }),
    }),

    setRepeatMode: builder.mutation<void, { deviceId: string; mode: RepeatMode }>({
      query: ({ deviceId, mode }) => ({
        url: '/me/player/repeat',
        method: 'PUT',
        params: { device_id: deviceId, state: REPEAT_MODE_TO_API[mode] },
      }),
    }),

    getDevices: builder.query<SpotifyDevice[], void>({
      query: () => '/me/player/devices',
      transformResponse: (response: { devices: SpotifyDevice[] }) => response.devices,
      providesTags: ['Devices'],
    }),

    // Moves playback to a different Spotify Connect device — this browser
    // tab's SDK device, a phone, a speaker, whatever else is online.
    transferPlayback: builder.mutation<void, { deviceId: string; play?: boolean }>({
      query: ({ deviceId, play = true }) => ({
        url: '/me/player',
        method: 'PUT',
        body: { device_ids: [deviceId], play },
      }),
      invalidatesTags: ['Devices'],
    }),
  }),
})

export const {
  useStartPlaybackMutation,
  useSetShuffleMutation,
  useSetRepeatModeMutation,
  useGetDevicesQuery,
  useTransferPlaybackMutation,
} = playerApi
