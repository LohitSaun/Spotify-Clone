import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { NowPlayingTrack, PlayerState, RepeatMode, SdkStatus } from './types'

const initialState: PlayerState = {
  sdkStatus: 'idle',
  deviceId: null,
  isActive: false,
  isPaused: true,
  currentTrack: null,
  durationMs: 0,
  positionMs: 0,
  positionUpdatedAt: 0,
  shuffle: false,
  repeatMode: 'off',
  volume: 0.5,
  error: null,
}

// SDK repeat_mode is numeric: 0 = off, 1 = repeat context (album/playlist), 2 = repeat single track.
const REPEAT_MODE_MAP: Record<0 | 1 | 2, RepeatMode> = { 0: 'off', 1: 'context', 2: 'track' }

function trackFromSdkState(state: Spotify.PlaybackState): NowPlayingTrack {
  const track = state.track_window.current_track
  return {
    id: track.id,
    uri: track.uri,
    name: track.name,
    artists: track.artists.map((artist) => ({ name: artist.name, uri: artist.uri })),
    albumName: track.album.name,
    albumArt: track.album.images[0]?.url ?? null,
    durationMs: state.duration,
  }
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    sdkStatusChanged(state, action: PayloadAction<SdkStatus>) {
      state.sdkStatus = action.payload
    },
    deviceReady(state, action: PayloadAction<{ deviceId: string }>) {
      state.deviceId = action.payload.deviceId
      state.sdkStatus = 'ready'
      state.error = null
    },
    deviceNotReady(state) {
      state.isActive = false
    },
    /** Mirrors the SDK's 'player_state_changed' event — the source of truth whenever it fires. */
    playbackStateChanged(state, action: PayloadAction<Spotify.PlaybackState | null>) {
      const sdkState = action.payload
      if (!sdkState) {
        state.isActive = false
        state.currentTrack = null
        return
      }

      state.isActive = true
      state.isPaused = sdkState.paused
      state.durationMs = sdkState.duration
      state.positionMs = sdkState.position
      state.positionUpdatedAt = Date.now()
      state.shuffle = sdkState.shuffle
      state.repeatMode = REPEAT_MODE_MAP[sdkState.repeat_mode]
      state.currentTrack = trackFromSdkState(sdkState)
    },
    /** Optimistic local tick between real SDK updates so the seek bar moves smoothly — see usePlaybackProgress. */
    positionTicked(state, action: PayloadAction<number>) {
      state.positionMs = action.payload
      state.positionUpdatedAt = Date.now()
    },
    volumeChanged(state, action: PayloadAction<number>) {
      state.volume = action.payload
    },
    playerErrorOccurred(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    playerReset() {
      return initialState
    },
  },
})

export const {
  sdkStatusChanged,
  deviceReady,
  deviceNotReady,
  playbackStateChanged,
  positionTicked,
  volumeChanged,
  playerErrorOccurred,
  playerReset,
} = playerSlice.actions
export default playerSlice.reducer
