import { Link } from 'react-router-dom'
import type { SpotifyAlbum } from '@/types/spotify'

export function AlbumCard({ album }: { album: SpotifyAlbum }) {
  const image = album.images[0]?.url

  return (
    <Link
      to={`/album/${album.id}`}
      className="block rounded-lg bg-spotify-black-elevated p-4 transition hover:bg-spotify-black-highlight"
    >
      {image ? (
        <img src={image} alt="" className="mb-3 aspect-square w-full rounded object-cover" />
      ) : (
        <div className="mb-3 aspect-square w-full rounded bg-spotify-black-highlight" />
      )}
      <p className="truncate text-sm font-semibold">{album.name}</p>
      <p className="truncate text-xs text-spotify-gray">
        {album.release_date.slice(0, 4)} · {album.artists.map((a) => a.name).join(', ')}
      </p>
    </Link>
  )
}
