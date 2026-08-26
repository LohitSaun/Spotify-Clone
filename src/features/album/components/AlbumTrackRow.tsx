import { Link } from 'react-router-dom'
import { LikeButton } from '@/features/library/components/LikeButton'
import { AddToPlaylistButton } from '@/features/playlists/components/AddToPlaylistButton'
import { usePlayTrack } from '@/features/player/usePlayTrack'
import { formatDuration } from '@/lib/format'
import type { SpotifyAlbumTrack } from '@/types/spotify'

interface AlbumTrackRowProps {
  track: SpotifyAlbumTrack
  /** The album's own URI — passed so playback continues through the rest of the album via next/previous, rather than stopping after this one track. */
  albumUri: string
}

export function AlbumTrackRow({ track, albumUri }: AlbumTrackRowProps) {
  const playTrack = usePlayTrack()

  return (
    <div className="group grid grid-cols-[2rem_1fr_auto_auto_auto] items-center gap-3 rounded px-2 py-2 hover:bg-white/10">
      <button
        type="button"
        onClick={() => playTrack({ contextUri: albumUri, offset: { position: track.track_number - 1 } })}
        className="text-left text-sm text-spotify-gray"
        aria-label={`Play ${track.name}`}
      >
        {track.track_number}
      </button>
      <span className="min-w-0">
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
      </span>
      <LikeButton trackId={track.id} />
      <AddToPlaylistButton trackUri={track.uri} />
      <span className="text-xs text-spotify-gray">{formatDuration(track.duration_ms)}</span>
    </div>
  )
}
