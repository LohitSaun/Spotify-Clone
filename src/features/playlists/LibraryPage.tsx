import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon } from '@/components/icons/CommonIcons'
import { useAppSelector } from '@/app/hooks'
import { PlaylistCard } from '@/components/media/PlaylistCard'
import { LoginButton } from '@/features/auth/LoginButton'
import { CreatePlaylistModal } from './components/CreatePlaylistModal'
import { useGetCurrentUserPlaylistsQuery } from './playlistsApi'

function LikedSongsTile() {
  return (
    <Link
      to="/liked-songs"
      className="block rounded-lg bg-spotify-black-elevated p-4 transition hover:bg-spotify-black-highlight"
    >
      <div className="mb-3 flex aspect-square w-full items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-white/10">
        <HeartIcon filled width={40} height={40} className="text-white" />
      </div>
      <p className="truncate text-sm font-semibold">Liked Songs</p>
      <p className="truncate text-xs text-spotify-gray">Playlist</p>
    </Link>
  )
}

export function LibraryPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')
  const [isCreating, setCreating] = useState(false)
  const { data: playlists, isLoading } = useGetCurrentUserPlaylistsQuery(undefined, { skip: !isAuthenticated })

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-start gap-3 p-6">
        <p className="text-spotify-gray">Log in to see and manage your playlists.</p>
        <LoginButton />
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Library</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold hover:border-white"
        >
          Create playlist
        </button>
      </div>

      {isLoading && <p className="text-spotify-gray">Loading your playlists…</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <LikedSongsTile />
        {playlists?.items.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {isCreating && <CreatePlaylistModal onClose={() => setCreating(false)} />}
    </div>
  )
}
