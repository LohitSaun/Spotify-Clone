import { useAppSelector } from '@/app/hooks'
import { DevicePicker } from './DevicePicker'
import { NowPlayingInfo } from './NowPlayingInfo'
import { PlayerControls } from './PlayerControls'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'

/**
 * Nothing to show until something is actually loaded on this device — same
 * as Spotify's own web player, the bar simply isn't there until a first
 * track has been started (via a play button somewhere, or a device
 * transfer — see the device-switching feature).
 */
export function PlaybackBar() {
  const track = useAppSelector((state) => state.player.currentTrack)
  const durationMs = useAppSelector((state) => state.player.durationMs)

  if (!track) return null

  return (
    <footer className="grid grid-cols-3 items-center gap-4 border-t border-white/10 bg-spotify-black-elevated px-4 py-3">
      <NowPlayingInfo track={track} />

      <div className="flex flex-col items-center gap-2">
        <PlayerControls />
        <ProgressBar durationMs={durationMs} />
      </div>

      <div className="flex items-center justify-end gap-4">
        <DevicePicker />
        <VolumeControl />
      </div>
    </footer>
  )
}
