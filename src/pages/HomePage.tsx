import { useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AlbumCard } from '@/components/media/AlbumCard'
import { CategoryCard } from '@/components/media/CategoryCard'
import { MediaShelf } from '@/components/media/MediaShelf'
import { PlaylistCard } from '@/components/media/PlaylistCard'
import { TrackRow } from '@/components/media/TrackRow'
import { useGetCategoriesQuery, useGetFeaturedPlaylistsQuery, useGetNewReleasesQuery, useGetRecentlyPlayedQuery } from '@/features/browse/browseApi'
import { LoginButton } from '@/features/auth/LoginButton'
import { useGetCurrentUserPlaylistsQuery } from '@/features/playlists/playlistsApi'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function HomePage() {
  const status = useAppSelector((state) => state.auth.status)
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = status === 'authenticated'
  const location = useLocation() as { state?: { authError?: string } }

  const newReleases = useGetNewReleasesQuery()
  const featuredPlaylists = useGetFeaturedPlaylistsQuery()
  const categories = useGetCategoriesQuery()
  const recentlyPlayed = useGetRecentlyPlayedQuery(undefined, { skip: !isAuthenticated })
  const yourPlaylists = useGetCurrentUserPlaylistsQuery(undefined, { skip: !isAuthenticated })

  // If even the always-on, no-login-required query fails while logged out,
  // the anonymous token almost certainly isn't configured (see api/token.ts) —
  // nudge toward login instead of rendering an empty, broken-looking page.
  const catalogUnavailable = newReleases.isError && !isAuthenticated

  return (
    <div className="px-6 py-8">
      {location.state?.authError && <p className="mb-6 text-sm text-red-400">Spotify login was cancelled or denied.</p>}

      <h1 className="mb-6 text-2xl font-bold">
        {greeting()}
        {isAuthenticated && user ? `, ${user.display_name ?? user.id}` : ''}
      </h1>

      {catalogUnavailable && (
        <div className="mb-10 flex flex-col items-start gap-3 rounded-lg bg-spotify-black-elevated p-6">
          <p className="text-spotify-gray">
            Log in to explore Spotify's catalog — anonymous browsing isn't configured for this deployment yet.
          </p>
          <LoginButton />
        </div>
      )}

      {isAuthenticated && recentlyPlayed.data && recentlyPlayed.data.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold">Recently played</h2>
          <div className="flex flex-col gap-1">
            {recentlyPlayed.data.slice(0, 6).map((item, i) => (
              <TrackRow key={`${item.track.id}-${i}`} track={item.track} />
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && yourPlaylists.data && yourPlaylists.data.items.length > 0 && (
        <MediaShelf title="Your playlists">
          {yourPlaylists.data.items.map((playlist) => (
            <div key={playlist.id} className="w-40 shrink-0">
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </MediaShelf>
      )}

      {newReleases.data && newReleases.data.items.length > 0 && (
        <MediaShelf title="New releases">
          {newReleases.data.items.map((album) => (
            <div key={album.id} className="w-40 shrink-0">
              <AlbumCard album={album} />
            </div>
          ))}
        </MediaShelf>
      )}

      {featuredPlaylists.data && featuredPlaylists.data.items.length > 0 && (
        <MediaShelf title="Featured playlists">
          {featuredPlaylists.data.items.map((playlist) => (
            <div key={playlist.id} className="w-40 shrink-0">
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </MediaShelf>
      )}

      {categories.data && categories.data.items.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold">Browse all</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.data.items.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
