import { useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { PlaylistHeader } from './components/PlaylistHeader'
import { PlaylistTrackRow } from './components/PlaylistTrackRow'
import { useGetPlaylistQuery, useRemoveTrackFromPlaylistMutation } from './playlistsApi'

export function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>()
  const currentUserId = useAppSelector((state) => state.auth.user?.id)
  const { data: playlist, isLoading, isError } = useGetPlaylistQuery(playlistId ?? '', { skip: !playlistId })
  const [removeTrack] = useRemoveTrackFromPlaylistMutation()

  if (isLoading) {
    return <p className="p-6 text-spotify-gray">Loading playlist…</p>
  }

  if (isError || !playlist) {
    return <p className="p-6 text-red-400">Couldn't load this playlist.</p>
  }

  const canEdit = playlist.collaborative || playlist.owner.id === currentUserId

  return (
    <div>
      <PlaylistHeader playlist={playlist} />

      <div className="flex flex-col gap-1 px-6 pb-8">
        {playlist.tracks.items.map((item, index) => (
          <PlaylistTrackRow
            key={`${item.track.id}-${index}`}
            track={item.track}
            index={index}
            playlistUri={playlist.uri}
            canEdit={canEdit}
            onRemove={() => removeTrack({ playlistId: playlist.id, uri: item.track.uri })}
          />
        ))}
        {playlist.tracks.items.length === 0 && <p className="text-spotify-gray">This playlist is empty so far.</p>}
      </div>
    </div>
  )
}
