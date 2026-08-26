import { Link } from 'react-router-dom'
import type { SpotifyPlaylist } from '@/types/spotify'

export function PlaylistCard({ playlist }: { playlist: SpotifyPlaylist }) {
  const image = playlist.images[0]?.url

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="block rounded-lg bg-spotify-black-elevated p-4 transition hover:bg-spotify-black-highlight"
    >
      {image ? (
        <img src={image} alt="" className="mb-3 aspect-square w-full rounded object-cover" />
      ) : (
        <div className="mb-3 aspect-square w-full rounded bg-spotify-black-highlight" />
      )}
      <p className="truncate text-sm font-semibold">{playlist.name}</p>
      <p className="truncate text-xs text-spotify-gray">By {playlist.owner.display_name ?? 'Spotify'}</p>
    </Link>
  )
}
