export type RepeatMode = 'off' | 'context' | 'track'

export interface NowPlayingTrack {
  id: string | null
  uri: string
  name: string
  artists: { name: string; uri: string }[]
  albumName: string
  albumArt: string | null
  durationMs: number
}

export type SdkStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  /** Browser can't run the SDK (unsupported), or the account isn't Premium. */
  | 'unavailable'
  | 'error'

export interface PlayerState {
  sdkStatus: SdkStatus
  /** This browser tab's Spotify Connect device id, once the SDK connects. */
  deviceId: string | null
  /** Whether *this* device is the one Spotify is actively playing through (vs. some other Connect device). */
  isActive: boolean
  isPaused: boolean
  currentTrack: NowPlayingTrack | null
  durationMs: number
  /** Position as of `positionUpdatedAt` — see usePlaybackProgress for how the UI ticks this forward locally between real updates. */
  positionMs: number
  positionUpdatedAt: number
  shuffle: boolean
  repeatMode: RepeatMode
  volume: number
  error: string | null
}
