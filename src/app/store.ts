import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '@/features/auth/authSlice'
import playerReducer from '@/features/player/playerSlice'
import { spotifyApi } from '@/lib/spotify/apiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    [spotifyApi.reducerPath]: spotifyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Spotify.PlaybackState (held in player.currentTrack's SDK source data
      // momentarily during the reducer) isn't plain-serializable-checked
      // data we persist or need time-travel debugging on — skip the check
      // for this slice rather than deep-cloning SDK objects on every event.
      serializableCheck: { ignoredActions: ['player/playbackStateChanged'] },
    }).concat(spotifyApi.middleware),
})

// Enables refetchOnFocus/refetchOnReconnect behavior for RTK Query hooks.
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
