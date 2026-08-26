import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/app/hooks'

/**
 * The SDK only fires `player_state_changed` on real transitions (play,
 * pause, seek, track change) — not continuously. To animate a seek bar
 * smoothly, this ticks the last known position forward locally between
 * those events (position + elapsed since the last real update), correcting
 * itself the instant a genuine update lands. While paused there's nothing
 * to tick, so the Redux position is returned as-is.
 */
export function usePlaybackProgress(): number {
  const isPaused = useAppSelector((state) => state.player.isPaused)
  const positionMs = useAppSelector((state) => state.player.positionMs)
  const positionUpdatedAt = useAppSelector((state) => state.player.positionUpdatedAt)
  const durationMs = useAppSelector((state) => state.player.durationMs)

  const [tickedPosition, setTickedPosition] = useState(positionMs)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (isPaused) return

    const tick = () => {
      const elapsed = Date.now() - positionUpdatedAt
      setTickedPosition(Math.min(positionMs + elapsed, durationMs))
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isPaused, positionMs, positionUpdatedAt, durationMs])

  return isPaused ? positionMs : tickedPosition
}
