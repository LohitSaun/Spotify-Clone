import { formatTotalDuration } from '@/lib/format'
import { usePlayTrack } from '@/features/player/usePlayTrack'
import { PlayIcon } from '@/components/icons/PlayerIcons'
import type { SpotifyPlaylistDetail } from '@/types/spotify'

export function PlaylistHeader({ playlist }: { playlist: SpotifyPlaylistDetail }) {
  const playTrack = usePlayTrack()
  const image = playlist.images[0]?.url
  const totalMs = playlist.tracks.items.reduce((sum, item) => sum + item.track.duration_ms, 0)

  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-12 pb-8 text-center sm:flex-row sm:items-end sm:text-left">
      {image ? (
        <img src={image} alt="" className="h-48 w-48 shrink-0 rounded object-cover shadow-2xl" />
      ) : (
        <div className="h-48 w-48 shrink-0 rounded bg-spotify-black-highlight" />
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-spotify-gray">
          {playlist.collaborative ? 'Collaborative playlist' : 'Playlist'}
        </p>
        <h1 className="mb-4 text-3xl font-black sm:text-5xl">{playlist.name}</h1>
        {playlist.description && <p className="mb-3 text-sm text-spotify-gray">{playlist.description}</p>}
        <p className="mb-4 text-sm text-spotify-gray">
          <span className="font-semibold text-white">{playlist.owner.display_name ?? 'Spotify'}</span> ·{' '}
          {playlist.tracks.total} songs
          {playlist.tracks.items.length > 0 && `, ${formatTotalDuration(totalMs)}`}
        </p>
        <button
          type="button"
          onClick={() => playTrack({ contextUri: playlist.uri, offset: { position: 0 } })}
          disabled={playlist.tracks.items.length === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify-green text-black transition hover:scale-105 disabled:opacity-40"
          aria-label={`Play ${playlist.name}`}
        >
          <PlayIcon className="ml-0.5" width={20} height={20} />
        </button>
      </div>
    </div>
  )
}
