import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AlbumPage } from '@/features/album/AlbumPage'
import { ArtistPage } from '@/features/artist/ArtistPage'
import { CallbackPage } from '@/features/auth/CallbackPage'
import { LikedSongsPage } from '@/features/library/LikedSongsPage'
import { LibraryPage } from '@/features/playlists/LibraryPage'
import { PlaylistPage } from '@/features/playlists/PlaylistPage'
import { SearchPage } from '@/features/search/SearchPage'
import { HomePage } from '@/pages/HomePage'

export const router = createBrowserRouter([
  {
    // Must exactly match VITE_SPOTIFY_REDIRECT_URI's path. Kept outside
    // AppShell — it's a transient redirect target, not a page to navigate to.
    path: '/callback',
    element: <CallbackPage />,
  },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/library', element: <LibraryPage /> },
      { path: '/liked-songs', element: <LikedSongsPage /> },
      { path: '/artist/:artistId', element: <ArtistPage /> },
      { path: '/album/:albumId', element: <AlbumPage /> },
      { path: '/playlist/:playlistId', element: <PlaylistPage /> },
    ],
  },
])
