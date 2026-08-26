import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { refreshTokenStorage } from './authStorage'
import { exchangeCodeForToken, fetchSpotifyProfile, refreshAccessToken } from './spotifyAuthApi'
import type { AuthState, SpotifyUser } from './types'

const initialState: AuthState = {
  status: 'idle',
  accessToken: null,
  expiresAt: null,
  user: null,
  error: null,
}

function expiryFromNow(expiresInSeconds: number): number {
  return Date.now() + expiresInSeconds * 1000
}

/**
 * Runs once on app startup, before we know whether the user is logged in.
 * If a refresh token survived from a previous visit, trade it for a fresh
 * access token silently (no redirect, no consent screen) so a page reload
 * doesn't force a re-login. Otherwise the user is simply logged out.
 */
export const initializeSession = createAsyncThunk('auth/initializeSession', async (_: void, { rejectWithValue }) => {
  const refreshToken = refreshTokenStorage.get()
  if (!refreshToken) {
    return null
  }

  try {
    const tokens = await refreshAccessToken(refreshToken)
    if (tokens.refresh_token) {
      refreshTokenStorage.set(tokens.refresh_token)
    }
    const user = await fetchSpotifyProfile(tokens.access_token)
    return {
      accessToken: tokens.access_token,
      expiresAt: expiryFromNow(tokens.expires_in),
      user,
    }
  } catch (err) {
    // Stored refresh token is invalid/expired/revoked — clear it so we don't retry forever.
    refreshTokenStorage.clear()
    return rejectWithValue(err instanceof Error ? err.message : 'Session restore failed')
  }
})

/** Completes the login flow after Spotify redirects back to /callback. */
export const completeLogin = createAsyncThunk(
  'auth/completeLogin',
  async ({ code, state }: { code: string; state: string }, { rejectWithValue }) => {
    try {
      const tokens = await exchangeCodeForToken(code, state)
      if (tokens.refresh_token) {
        refreshTokenStorage.set(tokens.refresh_token)
      }
      const user = await fetchSpotifyProfile(tokens.access_token)
      return {
        accessToken: tokens.access_token,
        expiresAt: expiryFromNow(tokens.expires_in),
        user,
      }
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Login failed')
    }
  },
)

/** Proactively renews the access token before it expires, or reactively after a 401. */
export const refreshSession = createAsyncThunk('auth/refreshSession', async (_: void, { rejectWithValue }) => {
  const refreshToken = refreshTokenStorage.get()
  if (!refreshToken) {
    return rejectWithValue('No refresh token available')
  }

  try {
    const tokens = await refreshAccessToken(refreshToken)
    if (tokens.refresh_token) {
      refreshTokenStorage.set(tokens.refresh_token)
    }
    return {
      accessToken: tokens.access_token,
      expiresAt: expiryFromNow(tokens.expires_in),
    }
  } catch (err) {
    refreshTokenStorage.clear()
    return rejectWithValue(err instanceof Error ? err.message : 'Session refresh failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedOut(state) {
      refreshTokenStorage.clear()
      state.status = 'unauthenticated'
      state.accessToken = null
      state.expiresAt = null
      state.user = null
      state.error = null
    },
    userUpdated(state, action: PayloadAction<SpotifyUser>) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSession.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(initializeSession.fulfilled, (state, action) => {
        if (!action.payload) {
          state.status = 'unauthenticated'
          return
        }
        state.status = 'authenticated'
        state.accessToken = action.payload.accessToken
        state.expiresAt = action.payload.expiresAt
        state.user = action.payload.user
      })
      .addCase(initializeSession.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload as string
      })
      .addCase(completeLogin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(completeLogin.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.accessToken = action.payload.accessToken
        state.expiresAt = action.payload.expiresAt
        state.user = action.payload.user
      })
      .addCase(completeLogin.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.accessToken = action.payload.accessToken
        state.expiresAt = action.payload.expiresAt
      })
      .addCase(refreshSession.rejected, (state) => {
        state.status = 'unauthenticated'
        state.accessToken = null
        state.expiresAt = null
        state.user = null
      })
  },
})

export const { loggedOut, userUpdated } = authSlice.actions
export default authSlice.reducer
