import { HeartIcon } from '@/components/icons/CommonIcons'
import { PlayIcon } from '@/components/icons/PlayerIcons'
import { TrackRow } from '@/components/media/TrackRow'
import { usePlayTrack } from '@/features/player/usePlayTrack'
import { useGetLikedSongsQuery } from './likedSongsApi'

export function LikedSongsPage() {
  const { data, isLoading, isError } = useGetLikedSongsQuery()
  const playTrack = usePlayTrack()

  if (isLoading) {
    return <p className="p-6 text-spotify-gray">Loading Liked Songs…</p>
  }

  if (isError || !data) {
    return <p className="p-6 text-red-400">Couldn't load Liked Songs.</p>
  }

  const uris = data.items.map((item) => item.track.uri)

  return (
    <div>
      <div className="flex flex-col items-center gap-6 px-6 pt-12 pb-8 text-center sm:flex-row sm:items-end sm:text-left">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-white/10 shadow-2xl">
          <HeartIcon filled width={64} height={64} className="text-white" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-spotify-gray">Playlist</p>
          <h1 className="mb-4 text-3xl font-black sm:text-5xl">Liked Songs</h1>
          <p className="mb-4 text-sm text-spotify-gray">{data.total} songs</p>
          <button
            type="button"
            onClick={() => uris.length > 0 && playTrack({ uris })}
            disabled={uris.length === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify-green text-black transition hover:scale-105 disabled:opacity-40"
            aria-label="Play Liked Songs"
          >
            <PlayIcon className="ml-0.5" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-6 pb-8">
        {data.items.map((item) => (
          <TrackRow key={item.track.id} track={item.track} />
        ))}
        {data.items.length === 0 && <p className="text-spotify-gray">Songs you like will show up here.</p>}
      </div>
    </div>
  )
}
