import { useParams } from 'react-router-dom'
import { useMarket } from '@/hooks/useMarket'
import { useGetAlbumQuery } from './albumApi'
import { AlbumHeader } from './components/AlbumHeader'
import { AlbumTrackRow } from './components/AlbumTrackRow'

export function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const market = useMarket()
  const { data: album, isLoading, isError } = useGetAlbumQuery({ albumId: albumId ?? '', market }, { skip: !albumId })

  if (isLoading) {
    return <p className="p-6 text-spotify-gray">Loading album…</p>
  }

  if (isError || !album) {
    return <p className="p-6 text-red-400">Couldn't load this album.</p>
  }

  return (
    <div>
      <AlbumHeader album={album} />

      <div className="flex flex-col gap-1 px-6 pb-8">
        {album.tracks.items.map((track) => (
          <AlbumTrackRow key={track.id} track={track} albumUri={album.uri} />
        ))}
      </div>
    </div>
  )
}
