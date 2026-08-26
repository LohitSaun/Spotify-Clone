import { redirectToSpotifyAuthorize } from './spotifyAuthApi'

export function LoginButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => redirectToSpotifyAuthorize()}
      className={
        className ??
        'rounded-full bg-spotify-green px-8 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-[#1ed760]'
      }
    >
      Log in with Spotify
    </button>
  )
}
