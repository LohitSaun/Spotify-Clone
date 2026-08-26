import { NavLink, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedOut } from '@/features/auth/authSlice'
import { LoginButton } from '@/features/auth/LoginButton'
import { PlaybackBar } from '@/features/player/components/PlaybackBar'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold ${isActive ? 'text-white' : 'text-spotify-gray hover:text-white'}`

export function AppShell() {
  const status = useAppSelector((state) => state.auth.status)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            Search
          </NavLink>
          <NavLink to="/library" className={navLinkClass}>
            Your Library
          </NavLink>
        </nav>

        {status === 'authenticated' && user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-spotify-gray">{user.display_name ?? user.id}</span>
            <button type="button" onClick={() => dispatch(loggedOut())} className="text-sm text-spotify-gray hover:underline">
              Log out
            </button>
          </div>
        ) : (
          <LoginButton className="rounded-full bg-spotify-green px-5 py-2 text-xs font-bold text-black hover:bg-[#1ed760]" />
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <PlaybackBar />
    </div>
  )
}
