import { useState } from 'react'
import { PlusIcon } from '@/components/icons/CommonIcons'
import { useAppSelector } from '@/app/hooks'
import { useLoginPrompt } from '@/features/auth/LoginPromptContext'
import { useAddTracksToPlaylistMutation, useGetCurrentUserPlaylistsQuery } from '../playlistsApi'

export function AddToPlaylistButton({ trackUri }: { trackUri: string }) {
  const { requireAuth } = useLoginPrompt()
  const [isOpen, setOpen] = useState(false)
  const userId = useAppSelector((state) => state.auth.user?.id)
  const { data: playlists } = useGetCurrentUserPlaylistsQuery(undefined, { skip: !isOpen })
  const [addTracks] = useAddTracksToPlaylistMutation()

  const editablePlaylists = playlists?.items.filter((p) => p.collaborative || p.owner.id === userId) ?? []

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Add to playlist"
        onClick={() => requireAuth(() => setOpen((open) => !open))}
        className="text-spotify-gray opacity-0 hover:text-white group-hover:opacity-100"
      >
        <PlusIcon />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg bg-spotify-black-highlight p-2 shadow-2xl">
            <p className="mb-1 px-2 pt-1 text-xs font-semibold uppercase text-spotify-gray">Add to playlist</p>
            {!playlists && <p className="px-2 py-2 text-sm text-spotify-gray">Loading…</p>}
            {playlists && editablePlaylists.length === 0 && (
              <p className="px-2 py-2 text-sm text-spotify-gray">No editable playlists yet.</p>
            )}
            {editablePlaylists.map((playlist) => (
              <button
                key={playlist.id}
                type="button"
                onClick={() => {
                  addTracks({ playlistId: playlist.id, uris: [trackUri] })
                  setOpen(false)
                }}
                className="block w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-white/10"
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
