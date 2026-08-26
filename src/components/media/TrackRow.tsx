import { Link } from 'react-router-dom'
import { LikeButton } from '@/features/library/components/LikeButton'
import { AddToPlaylistButton } from '@/features/playlists/components/AddToPlaylistButton'
import { usePlayTrack } from '@/features/player/usePlayTrack'
import { formatDuration } from '@/lib/format'
import type { SpotifyTrack } from '@/types/spotify'

export function TrackRow({ track }: { track: SpotifyTrack }) {
  const playTrack = usePlayTrack()
  const albumArt = track.album.images.at(-1)?.url

  return (
    <div className="group flex items-center gap-3 rounded px-2 py-2 hover:bg-white/10">
      <button
        type="button"
        onClick={() => playTrack({ uris: [track.uri] })}
        className="shrink-0"
        aria-label={`Play ${track.name}`}
      >
        {albumArt ? (
          <img src={albumArt} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 rounded bg-spotify-black-highlight" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="truncate text-xs text-spotify-gray">
          {track.artists.map((artist, i) => (
            <span key={artist.id}>
              {i > 0 && ', '}
              <Link to={`/artist/${artist.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                {artist.name}
              </Link>
            </span>
          ))}
        </p>
      </div>
      <LikeButton trackId={track.id} />
      <AddToPlaylistButton trackUri={track.uri} />
      <span className="text-xs text-spotify-gray">{formatDuration(track.duration_ms)}</span>
    </div>
  )
}
