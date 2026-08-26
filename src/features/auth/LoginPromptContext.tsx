import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useAppSelector } from '@/app/hooks'
import { LoginButton } from './LoginButton'

interface LoginPromptContextValue {
  /** Runs `action` if logged in; otherwise shows a login prompt instead of running it. */
  requireAuth: (action: () => void) => void
}

const LoginPromptContext = createContext<LoginPromptContextValue | null>(null)

/**
 * Central gate for "this needs a logged-in user" actions (play a track,
 * like a song, create a playlist, follow an artist…). Rather than each
 * feature rolling its own "please log in" dialog, they call
 * `requireAuth(() => doTheThing())` and this provider decides whether to
 * run it immediately or interrupt with a prompt.
 */
export function LoginPromptProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')
  const [isPromptOpen, setPromptOpen] = useState(false)

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action()
        return
      }
      setPromptOpen(true)
    },
    [isAuthenticated],
  )

  return (
    <LoginPromptContext.Provider value={{ requireAuth }}>
      {children}
      {isPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPromptOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-spotify-black-elevated p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-xl font-bold">Log in to continue</h2>
            <p className="mb-6 text-sm text-spotify-gray">
              You need a Spotify account to play music, save songs, and manage playlists.
            </p>
            <LoginButton className="w-full rounded-full bg-spotify-green px-8 py-3 text-sm font-bold text-black transition hover:bg-[#1ed760]" />
            <button
              type="button"
              onClick={() => setPromptOpen(false)}
              className="mt-4 block w-full text-sm text-spotify-gray hover:underline"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </LoginPromptContext.Provider>
  )
}

export function useLoginPrompt(): LoginPromptContextValue {
  const ctx = useContext(LoginPromptContext)
  if (!ctx) throw new Error('useLoginPrompt must be used within a LoginPromptProvider')
  return ctx
}
