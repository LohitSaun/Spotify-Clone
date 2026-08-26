import { loadSpotifyPlaybackSdk } from './spotifySdk'

const PLAYER_NAME = 'Spotify Clone (Web)'

let player: Spotify.Player | null = null

/**
 * Creates and connects the SDK player for this browser tab. Kept as a
 * module-level singleton (not Redux state — a live SDK instance isn't
 * serializable) so the rest of the app can grab it via `getPlayer()`
 * without threading it through props. PlayerProvider owns the lifecycle;
 * everything else just reads `getPlayer()` to issue commands.
 */
export async function createPlayer(getOAuthToken: (callback: (token: string) => void) => void): Promise<Spotify.Player> {
  const Spotify = await loadSpotifyPlaybackSdk()

  player = new Spotify.Player({
    name: PLAYER_NAME,
    getOAuthToken,
    volume: 0.5,
  })

  return player
}

export function getPlayer(): Spotify.Player | null {
  return player
}

export function destroyPlayer() {
  player?.disconnect()
  player = null
}

// Track/context playback (PUT /me/player/play) and shuffle/repeat toggles
// have no equivalent on the Player class — those go through playerApi.ts's
// REST mutations instead. Everything below controls *this* device directly
// once it's the active Connect device, with no REST round-trip needed.
export const playerControls = {
  togglePlay: () => player?.togglePlay(),
  seek: (positionMs: number) => player?.seek(positionMs),
  setVolume: (volume: number) => player?.setVolume(volume),
  nextTrack: () => player?.nextTrack(),
  previousTrack: () => player?.previousTrack(),
}
