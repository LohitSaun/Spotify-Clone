import { Link } from 'react-router-dom'
import type { SpotifyArtist } from '@/types/spotify'

export function ArtistCard({ artist }: { artist: SpotifyArtist }) {
  const image = artist.images?.[0]?.url

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="block rounded-lg bg-spotify-black-elevated p-4 transition hover:bg-spotify-black-highlight"
    >
      {image ? (
        <img src={image} alt="" className="mb-3 aspect-square w-full rounded-full object-cover" />
      ) : (
        <div className="mb-3 aspect-square w-full rounded-full bg-spotify-black-highlight" />
      )}
      <p className="truncate text-sm font-semibold">{artist.name}</p>
      <p className="text-xs text-spotify-gray">Artist</p>
    </Link>
  )
}
