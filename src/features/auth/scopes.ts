// Every scope the app needs across all features, requested up front at login
// so we never have to re-prompt the user mid-session for a narrower action.
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-follow-read',
  'user-follow-modify',
] as const

export const SPOTIFY_SCOPE_STRING = SPOTIFY_SCOPES.join(' ')
