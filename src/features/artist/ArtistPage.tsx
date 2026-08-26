import { useParams } from 'react-router-dom'
import { AlbumCard } from '@/components/media/AlbumCard'
import { ArtistCard } from '@/components/media/ArtistCard'
import { MediaShelf } from '@/components/media/MediaShelf'
import { TrackRow } from '@/components/media/TrackRow'
import { useMarket } from '@/hooks/useMarket'
import { ArtistHeader } from './components/ArtistHeader'
import { useGetArtistAlbumsQuery, useGetArtistQuery, useGetArtistTopTracksQuery, useGetRelatedArtistsQuery } from './artistApi'

export function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>()
  const market = useMarket()

  const artist = useGetArtistQuery(artistId ?? '', { skip: !artistId })
  const topTracks = useGetArtistTopTracksQuery({ artistId: artistId ?? '', market }, { skip: !artistId })
  const albums = useGetArtistAlbumsQuery({ artistId: artistId ?? '', market }, { skip: !artistId })
  const relatedArtists = useGetRelatedArtistsQuery(artistId ?? '', { skip: !artistId })

  if (artist.isLoading) {
    return <p className="p-6 text-spotify-gray">Loading artist…</p>
  }

  if (artist.isError || !artist.data) {
    return <p className="p-6 text-red-400">Couldn't load this artist.</p>
  }

  return (
    <div>
      <ArtistHeader artist={artist.data} />

      <div className="px-6 pb-8">
        {topTracks.data && topTracks.data.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xl font-bold">Popular</h2>
            <div className="flex flex-col gap-1">
              {topTracks.data.slice(0, 5).map((track) => (
                <TrackRow key={track.id} track={track} />
              ))}
            </div>
          </section>
        )}

        {albums.data && albums.data.items.length > 0 && (
          <MediaShelf title="Discography">
            {albums.data.items.map((album) => (
              <div key={album.id} className="w-40 shrink-0">
                <AlbumCard album={album} />
              </div>
            ))}
          </MediaShelf>
        )}

        {relatedArtists.data && relatedArtists.data.length > 0 && (
          <MediaShelf title="Fans also like">
            {relatedArtists.data.map((related) => (
              <div key={related.id} className="w-40 shrink-0">
                <ArtistCard artist={related} />
              </div>
            ))}
          </MediaShelf>
        )}
      </div>
    </div>
  )
}
