import { useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { initializeSession, refreshSession } from './authSlice'

// Refresh this many ms before actual expiry, so an in-flight API call never
// races against the token dying mid-request.
const REFRESH_SAFETY_MARGIN_MS = 60_000

/**
 * Mounted once near the app root. Handles the two pieces of token lifecycle
 * that aren't tied to a specific user action:
 *  1. On first mount, try to silently restore a session from the stored
 *     refresh token (see initializeSession).
 *  2. Whenever we hold a token with a known expiry, schedule a proactive
 *     refresh shortly before it lapses, so the user never sees a failed
 *     request just because the access token aged out mid-session.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const expiresAt = useAppSelector((state) => state.auth.expiresAt)
  const status = useAppSelector((state) => state.auth.status)

  useEffect(() => {
    dispatch(initializeSession())
    // Runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status !== 'authenticated' || !expiresAt) return

    const msUntilRefresh = Math.max(expiresAt - Date.now() - REFRESH_SAFETY_MARGIN_MS, 0)
    const timer = window.setTimeout(() => {
      dispatch(refreshSession())
    }, msUntilRefresh)

    return () => window.clearTimeout(timer)
  }, [status, expiresAt, dispatch])

  return children
}
