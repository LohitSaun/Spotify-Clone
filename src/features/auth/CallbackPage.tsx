import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { completeLogin } from './authSlice'

/**
 * Landing point for Spotify's redirect after the user approves (or denies)
 * access. Spotify puts `code` + `state` (success) or `error` (denial) on
 * the query string — never anything more sensitive, since the actual token
 * exchange happens server-to-server-equivalent via a POST we make from here.
 */
export function CallbackPage() {
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector((state) => state.auth.status)
  const error = useAppSelector((state) => state.auth.error)
  const hasStarted = useRef(false)

  useEffect(() => {
    // Guards against React StrictMode's double-invoke and the code being
    // consumed twice (Spotify's `code` is single-use).
    if (hasStarted.current) return
    hasStarted.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const authorizeError = searchParams.get('error')

    if (authorizeError) {
      navigate('/', { replace: true, state: { authError: authorizeError } })
      return
    }

    if (!code || !state) {
      navigate('/', { replace: true })
      return
    }

    dispatch(completeLogin({ code, state })).then((result) => {
      if (completeLogin.fulfilled.match(result)) {
        navigate('/', { replace: true })
      }
    })
  }, [searchParams, dispatch, navigate])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-spotify-gray">{status === 'error' ? (error ?? 'Login failed') : 'Signing you in…'}</p>
      </div>
    </div>
  )
}
