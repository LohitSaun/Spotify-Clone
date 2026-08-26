import { VolumeIcon, VolumeMuteIcon } from '@/components/icons/PlayerIcons'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { volumeChanged } from '../playerSlice'
import { playerControls } from '../spotifyPlayerService'

export function VolumeControl() {
  const volume = useAppSelector((state) => state.player.volume)
  const dispatch = useAppDispatch()

  function handleChange(next: number) {
    dispatch(volumeChanged(next))
    playerControls.setVolume(next)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        onClick={() => handleChange(volume === 0 ? 0.5 : 0)}
        className="text-spotify-gray hover:text-white"
      >
        {volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => handleChange(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 w-24 cursor-pointer accent-white"
      />
    </div>
  )
}
