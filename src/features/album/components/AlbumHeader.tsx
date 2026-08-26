import { Link } from 'react-router-dom'
import { formatTotalDuration } from '@/lib/format'
import type { SpotifyAlbumDetail } from '@/types/spotify'

export function AlbumHeader({ album }: { album: SpotifyAlbumDetail }) {
  const image = album.images[0]?.url
  const totalMs = album.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0)
  const totalDuration = formatTotalDuration(totalMs)
  const year = album.release_date.slice(0, 4)

  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-12 pb-8 text-center sm:flex-row sm:items-end sm:text-left">
      {image ? (
        <img src={image} alt="" className="h-48 w-48 shrink-0 rounded object-cover shadow-2xl" />
      ) : (
        <div className="h-48 w-48 shrink-0 rounded bg-spotify-black-highlight" />
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-spotify-gray">
          {album.album_type === 'single' ? 'Single' : album.album_type === 'compilation' ? 'Compilation' : 'Album'}
        </p>
        <h1 className="mb-4 text-3xl font-black sm:text-5xl">{album.name}</h1>
        <p className="text-sm text-spotify-gray">
          {album.artists.map((artist, i) => (
            <span key={artist.id}>
              {i > 0 && ', '}
              <Link to={`/artist/${artist.id}`} className="font-semibold text-white hover:underline">
                {artist.name}
              </Link>
            </span>
          ))}
          {' · '}
          {year} · {album.total_tracks} songs, {totalDuration}
        </p>
      </div>
    </div>
  )
}
