import { useAppSelector } from '@/app/hooks'
import { useLoginPrompt } from '@/features/auth/LoginPromptContext'
import { usePremiumGate } from './PremiumGateContext'
import { useStartPlaybackMutation } from './playerApi'

interface PlayArgs {
  /** An ad-hoc list of track URIs, OR… */
  uris?: string[]
  /** …a whole album/playlist context, so next/previous continue through it. */
  contextUri?: string
  offset?: { position: number }
}

/** The single entry point every "play" button in the app should call — layers auth, Premium, and device-readiness checks in front of actually starting playback. */
export function usePlayTrack() {
  const { requireAuth } = useLoginPrompt()
  const { requirePremium } = usePremiumGate()
  const deviceId = useAppSelector((state) => state.player.deviceId)
  const [startPlayback] = useStartPlaybackMutation()

  return (args: PlayArgs) => {
    requireAuth(() => {
      requirePremium(() => {
        if (!deviceId) {
          // SDK is still connecting (usually only takes a second or two after
          // login) — nothing better to do here than wait for the next click.
          console.warn('Playback device is not ready yet')
          return
        }
        startPlayback({ deviceId, ...args })
      })
    })
  }
}
