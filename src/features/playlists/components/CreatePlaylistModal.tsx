import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { useCreatePlaylistMutation } from '../playlistsApi'

export function CreatePlaylistModal({ onClose }: { onClose: () => void }) {
  const userId = useAppSelector((state) => state.auth.user?.id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !name.trim()) return

    const playlist = await createPlaylist({ userId, name: name.trim(), description: description.trim() || undefined }).unwrap()
    onClose()
    navigate(`/playlist/${playlist.id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-spotify-black-elevated p-6"
      >
        <h2 className="mb-4 text-xl font-bold">Create playlist</h2>

        <label className="mb-3 block text-left">
          <span className="mb-1 block text-xs font-semibold uppercase text-spotify-gray">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            placeholder="My Playlist"
            className="w-full rounded bg-spotify-black-highlight px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white"
          />
        </label>

        <label className="mb-5 block text-left">
          <span className="mb-1 block text-xs font-semibold uppercase text-spotify-gray">Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded bg-spotify-black-highlight px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-sm text-spotify-gray hover:underline">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="rounded-full bg-spotify-green px-6 py-2 text-sm font-bold text-black hover:bg-[#1ed760] disabled:opacity-40"
          >
            {isLoading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
