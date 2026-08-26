import { Link } from 'react-router-dom'
import { LikeButton } from '@/features/library/components/LikeButton'
import { usePlayTrack } from '@/features/player/usePlayTrack'
import { formatDuration } from '@/lib/format'
import type { SpotifyTrack } from '@/types/spotify'

interface PlaylistTrackRowProps {
  track: SpotifyTrack
  index: number
  playlistUri: string
  canEdit: boolean
  onRemove: () => void
}

export function PlaylistTrackRow({ track, index, playlistUri, canEdit, onRemove }: PlaylistTrackRowProps) {
  const playTrack = usePlayTrack()
  const albumArt = track.album.images.at(-1)?.url

  return (
    <div className="group grid grid-cols-[2rem_1fr_auto_auto_auto] items-center gap-3 rounded px-2 py-2 hover:bg-white/10">
      <button
        type="button"
        onClick={() => playTrack({ contextUri: playlistUri, offset: { position: index } })}
        className="text-left text-sm text-spotify-gray"
        aria-label={`Play ${track.name}`}
      >
        {index + 1}
      </button>

      <div className="flex min-w-0 items-center gap-3">
        {albumArt ? (
          <img src={albumArt} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded bg-spotify-black-highlight" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{track.name}</p>
          <p className="truncate text-xs text-spotify-gray">
            {track.artists.map((artist, i) => (
              <span key={artist.id}>
                {i > 0 && ', '}
                <Link to={`/artist/${artist.id}`} className="hover:underline">
                  {artist.name}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>

      <LikeButton trackId={track.id} />

      <span className="text-xs text-spotify-gray">{formatDuration(track.duration_ms)}</span>

      {canEdit ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${track.name} from this playlist`}
          className="px-2 text-spotify-gray opacity-0 hover:text-white group-hover:opacity-100"
        >
          ×
        </button>
      ) : (
        <span />
      )}
    </div>
  )
}
