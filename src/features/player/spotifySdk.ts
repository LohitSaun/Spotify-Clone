const SDK_SRC = 'https://sdk.scdn.co/spotify-player.js'

let sdkPromise: Promise<typeof Spotify> | null = null

/**
 * The Web Playback SDK isn't an npm package — Spotify requires loading it
 * from their CDN at runtime, which then calls the global
 * `onSpotifyWebPlaybackSDKReady` callback once `window.Spotify` is usable.
 * This wraps that one-time global callback in a promise, and caches it so
 * multiple callers (e.g. React StrictMode's double-invoke) share one load.
 */
export function loadSpotifyPlaybackSdk(): Promise<typeof Spotify> {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    if (window.Spotify) {
      resolve(window.Spotify)
      return
    }

    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify)

    const script = document.createElement('script')
    script.src = SDK_SRC
    script.async = true
    script.onerror = () => reject(new Error('Failed to load the Spotify Web Playback SDK'))
    document.body.appendChild(script)
  })

  return sdkPromise
}
