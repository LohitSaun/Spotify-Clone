import { PauseIcon, PlayIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from '@/components/icons/PlayerIcons'
import { useAppSelector } from '@/app/hooks'
import { useSetRepeatModeMutation, useSetShuffleMutation } from '../playerApi'
import { playerControls } from '../spotifyPlayerService'
import type { RepeatMode } from '../types'

const NEXT_REPEAT_MODE: Record<RepeatMode, RepeatMode> = { off: 'context', context: 'track', track: 'off' }

export function PlayerControls() {
  const deviceId = useAppSelector((state) => state.player.deviceId)
  const isPaused = useAppSelector((state) => state.player.isPaused)
  const shuffle = useAppSelector((state) => state.player.shuffle)
  const repeatMode = useAppSelector((state) => state.player.repeatMode)

  const [setShuffle] = useSetShuffleMutation()
  const [setRepeatMode] = useSetRepeatModeMutation()

  const RepeatIconComponent = repeatMode === 'track' ? RepeatOneIcon : RepeatIcon

  return (
    <div className="flex items-center justify-center gap-5">
      <button
        type="button"
        aria-label="Toggle shuffle"
        aria-pressed={shuffle}
        disabled={!deviceId}
        onClick={() => deviceId && setShuffle({ deviceId, shuffle: !shuffle })}
        className={`transition ${shuffle ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'} disabled:opacity-40`}
      >
        <ShuffleIcon />
      </button>

      <button
        type="button"
        aria-label="Previous track"
        disabled={!deviceId}
        onClick={() => playerControls.previousTrack()}
        className="text-spotify-gray hover:text-white disabled:opacity-40"
      >
        <SkipBackIcon />
      </button>

      <button
        type="button"
        aria-label={isPaused ? 'Play' : 'Pause'}
        disabled={!deviceId}
        onClick={() => playerControls.togglePlay()}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
      >
        {isPaused ? <PlayIcon className="ml-0.5" /> : <PauseIcon />}
      </button>

      <button
        type="button"
        aria-label="Next track"
        disabled={!deviceId}
        onClick={() => playerControls.nextTrack()}
        className="text-spotify-gray hover:text-white disabled:opacity-40"
      >
        <SkipForwardIcon />
      </button>

      <button
        type="button"
        aria-label="Toggle repeat"
        aria-pressed={repeatMode !== 'off'}
        disabled={!deviceId}
        onClick={() => deviceId && setRepeatMode({ deviceId, mode: NEXT_REPEAT_MODE[repeatMode] })}
        className={`transition ${repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'} disabled:opacity-40`}
      >
        <RepeatIconComponent />
      </button>
    </div>
  )
}
