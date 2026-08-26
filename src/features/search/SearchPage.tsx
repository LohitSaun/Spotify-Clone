import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { AlbumCard } from '@/components/media/AlbumCard'
import { ArtistCard } from '@/components/media/ArtistCard'
import { PlaylistCard } from '@/components/media/PlaylistCard'
import { TrackRow } from '@/components/media/TrackRow'
import { LoginButton } from '@/features/auth/LoginButton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { ResultSection } from './components/ResultSection'
import { SearchBar } from './components/SearchBar'
import { useSearchQuery } from './searchApi'

const DEBOUNCE_MS = 350
const MIN_QUERY_LENGTH = 2

export function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const trimmedQuery = debouncedQuery.trim()
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')

  // `skip` prevents firing (and RTK Query dropping/ignoring) a request for
  // an empty or too-short query — combined with the debounce above, this is
  // what keeps keystroke-to-keystroke typing from spamming the API and lets
  // stale in-flight requests get superseded by the latest one.
  const { data, isFetching, isError } = useSearchQuery(
    { query: trimmedQuery },
    { skip: trimmedQuery.length < MIN_QUERY_LENGTH },
  )

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 max-w-md">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {trimmedQuery.length < MIN_QUERY_LENGTH && (
        <p className="text-spotify-gray">Start typing to search tracks, artists, albums, and playlists.</p>
      )}

      {isFetching && trimmedQuery.length >= MIN_QUERY_LENGTH && <p className="text-spotify-gray">Searching…</p>}

      {isError && !isAuthenticated && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-spotify-gray">
            Log in to search Spotify — anonymous browsing isn't configured for this deployment yet.
          </p>
          <LoginButton />
        </div>
      )}

      {isError && isAuthenticated && <p className="text-red-400">Something went wrong searching Spotify. Try again.</p>}

      {data && (
        <>
          {data.tracks && data.tracks.items.length > 0 && (
            <ResultSection title="Songs">
              <div className="flex flex-col gap-1">
                {data.tracks.items.map((track) => (
                  <TrackRow key={track.id} track={track} />
                ))}
              </div>
            </ResultSection>
          )}

          {data.artists && data.artists.items.length > 0 && (
            <ResultSection title="Artists">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {data.artists.items.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </ResultSection>
          )}

          {data.albums && data.albums.items.length > 0 && (
            <ResultSection title="Albums">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {data.albums.items.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </ResultSection>
          )}

          {data.playlists && data.playlists.items.length > 0 && (
            <ResultSection title="Playlists">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {data.playlists.items.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </ResultSection>
          )}
        </>
      )}
    </div>
  )
}
