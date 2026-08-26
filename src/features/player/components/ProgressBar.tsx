import { useRef } from 'react'
import { formatDuration } from '@/lib/format'
import { playerControls } from '../spotifyPlayerService'
import { usePlaybackProgress } from '../usePlaybackProgress'

export function ProgressBar({ durationMs }: { durationMs: number }) {
  const positionMs = usePlaybackProgress()
  const trackRef = useRef<HTMLDivElement>(null)

  const progressRatio = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0

  function seekToClientX(clientX: number) {
    const track = trackRef.current
    if (!track || durationMs <= 0) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    playerControls.seek(Math.round(ratio * durationMs))
  }

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right text-xs text-spotify-gray tabular-nums">{formatDuration(positionMs)}</span>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={positionMs}
        tabIndex={0}
        onClick={(e) => seekToClientX(e.clientX)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') playerControls.seek(Math.min(positionMs + 5000, durationMs))
          if (e.key === 'ArrowLeft') playerControls.seek(Math.max(positionMs - 5000, 0))
        }}
        className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/20"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white group-hover:bg-spotify-green"
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>
      <span className="w-10 text-xs text-spotify-gray tabular-nums">{formatDuration(durationMs)}</span>
    </div>
  )
}
