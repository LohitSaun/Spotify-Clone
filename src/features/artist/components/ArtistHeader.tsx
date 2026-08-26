import { FollowButton } from '@/features/follow/components/FollowButton'
import type { SpotifyArtist } from '@/types/spotify'

export function ArtistHeader({ artist }: { artist: SpotifyArtist }) {
  const image = artist.images?.[0]?.url

  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-12 pb-8 text-center sm:flex-row sm:items-end sm:text-left">
      {image ? (
        <img src={image} alt="" className="h-48 w-48 shrink-0 rounded-full object-cover shadow-2xl" />
      ) : (
        <div className="h-48 w-48 shrink-0 rounded-full bg-spotify-black-highlight" />
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-spotify-gray">Artist</p>
        <h1 className="mb-4 text-4xl font-black sm:text-6xl">{artist.name}</h1>
        {artist.followers && (
          <p className="mb-4 text-sm text-spotify-gray">{artist.followers.total.toLocaleString()} followers</p>
        )}
        <FollowButton artistId={artist.id} />
      </div>
    </div>
  )
}
