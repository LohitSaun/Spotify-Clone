import { Link } from 'react-router-dom'
import { idFromUri } from '@/lib/spotifyUri'
import type { NowPlayingTrack } from '../types'

export function NowPlayingInfo({ track }: { track: NowPlayingTrack }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {track.albumArt ? (
        <img src={track.albumArt} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded bg-spotify-black-highlight" />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="truncate text-xs text-spotify-gray">
          {track.artists.map((artist, i) => (
            <span key={artist.uri}>
              {i > 0 && ', '}
              <Link to={`/artist/${idFromUri(artist.uri)}`} className="hover:underline">
                {artist.name}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
