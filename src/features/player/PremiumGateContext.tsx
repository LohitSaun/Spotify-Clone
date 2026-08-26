import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useAppSelector } from '@/app/hooks'

interface PremiumGateContextValue {
  /** Runs `action` if the account is Premium; otherwise shows a "Premium required" prompt instead. */
  requirePremium: (action: () => void) => void
}

const PremiumGateContext = createContext<PremiumGateContextValue | null>(null)

/**
 * Playback specifically needs Premium (a Spotify platform restriction, not
 * an app limitation) — distinct from LoginPromptContext, which only checks
 * "is anyone logged in". A logged-in free account passes the login gate
 * but should still hit this one before any play attempt.
 */
export function PremiumGateProvider({ children }: { children: ReactNode }) {
  const isPremium = useAppSelector((state) => state.auth.user?.product === 'premium')
  const [isPromptOpen, setPromptOpen] = useState(false)

  const requirePremium = useCallback(
    (action: () => void) => {
      if (isPremium) {
        action()
        return
      }
      setPromptOpen(true)
    },
    [isPremium],
  )

  return (
    <PremiumGateContext.Provider value={{ requirePremium }}>
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
            <h2 className="mb-2 text-xl font-bold">Playback requires Premium</h2>
            <p className="mb-6 text-sm text-spotify-gray">
              Spotify's Web Playback SDK only streams audio for Premium accounts — a platform restriction, not a bug
              here. You can still browse, search, and manage playlists on a free account.
            </p>
            <button
              type="button"
              onClick={() => setPromptOpen(false)}
              className="w-full rounded-full bg-spotify-green px-8 py-3 text-sm font-bold text-black hover:bg-[#1ed760]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </PremiumGateContext.Provider>
  )
}

export function usePremiumGate(): PremiumGateContextValue {
  const ctx = useContext(PremiumGateContext)
  if (!ctx) throw new Error('usePremiumGate must be used within a PremiumGateProvider')
  return ctx
}
