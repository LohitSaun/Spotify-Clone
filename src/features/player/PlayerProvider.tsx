import { useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { store } from '@/app/store'
import { refreshSession } from '@/features/auth/authSlice'
import {
  deviceNotReady,
  deviceReady,
  playbackStateChanged,
  playerErrorOccurred,
  playerReset,
  sdkStatusChanged,
} from './playerSlice'
import { createPlayer, destroyPlayer } from './spotifyPlayerService'

/**
 * Called by the SDK whenever it needs a token — on connect, and
 * periodically to stay authenticated. Reads the store directly (not a
 * prop/closure token) so it always sees the latest, and proactively
 * refreshes if the access token isn't there yet rather than failing.
 */
function getOAuthToken(callback: (token: string) => void) {
  const token = store.getState().auth.accessToken
  if (token) {
    callback(token)
    return
  }

  store.dispatch(refreshSession()).then((result) => {
    if (refreshSession.fulfilled.match(result)) {
      callback(result.payload.accessToken)
    }
  })
}

/**
 * Owns the Web Playback SDK's lifecycle for this tab. Only initializes for
 * Premium accounts — the SDK requires Premium to actually play anything,
 * so there's nothing useful it can do for a free account beyond producing
 * an `account_error`. Mounted once near the app root; tears the player
 * down on logout or if the account isn't (or stops being) Premium.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')
  const isPremium = useAppSelector((state) => state.auth.user?.product === 'premium')

  useEffect(() => {
    if (!isAuthenticated || !isPremium) {
      destroyPlayer()
      dispatch(playerReset())
      return
    }

    let cancelled = false
    dispatch(sdkStatusChanged('loading'))

    createPlayer(getOAuthToken)
      .then((player) => {
        if (cancelled) {
          player.disconnect()
          return
        }

        player.addListener('ready', ({ device_id }) => {
          dispatch(deviceReady({ deviceId: device_id }))
        })
        player.addListener('not_ready', () => {
          dispatch(deviceNotReady())
        })
        player.addListener('player_state_changed', (state) => {
          dispatch(playbackStateChanged(state))
        })
        player.addListener('initialization_error', ({ message }) => {
          dispatch(sdkStatusChanged('unavailable'))
          dispatch(playerErrorOccurred(message))
        })
        player.addListener('account_error', ({ message }) => {
          dispatch(sdkStatusChanged('unavailable'))
          dispatch(playerErrorOccurred(`Playback requires Spotify Premium (${message})`))
        })
        player.addListener('authentication_error', ({ message }) => {
          dispatch(sdkStatusChanged('error'))
          dispatch(playerErrorOccurred(message))
        })
        player.addListener('playback_error', ({ message }) => {
          dispatch(playerErrorOccurred(message))
        })

        player.connect()
      })
      .catch((err: Error) => {
        if (cancelled) return
        dispatch(sdkStatusChanged('unavailable'))
        dispatch(playerErrorOccurred(err.message))
      })

    return () => {
      cancelled = true
      destroyPlayer()
      dispatch(playerReset())
    }
  }, [isAuthenticated, isPremium, dispatch])

  return children
}
