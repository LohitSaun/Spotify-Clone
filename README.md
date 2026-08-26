# Spotify Clone

A frontend-only Spotify client built as a portfolio project — browse, search, manage playlists, and play music in-browser via Spotify's Web Playback SDK, all from a static React app with no backend of my own (one small serverless exception, explained below).

Original architecture and implementation. Used [francoborrelli/spotify-react-web-client](https://github.com/francoborrelli/spotify-react-web-client) as a reference for feature scope, not as a source to copy from.

## Features

- Spotify OAuth login/logout (Authorization Code + PKCE)
- Live search across tracks, artists, albums, and playlists (debounced, cancels stale requests)
- Home page: recently played, your playlists, new releases, featured playlists, browse categories
- Artist and album detail pages with full track listings
- Playback bar wired to the Web Playback SDK: play/pause, skip, seek, volume, shuffle, repeat
- Spotify Connect device switching
- Playlist management: view, create, add/remove tracks
- Liked Songs: like/unlike any track, dedicated view
- Follow/unfollow artists

## Tech stack

React 19 · TypeScript · Vite · Redux Toolkit + RTK Query · React Router · Tailwind CSS · Spotify Web API · Spotify Web Playback SDK

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your own Spotify app's Client ID
npm run dev
```

The app runs at `http://127.0.0.1:5173` — this exact host and port are hardcoded in `vite.config.ts` (`strictPort: true`) because Spotify matches redirect URIs exactly, and the redirect URI registered in the Spotify dashboard has to point here.

### Spotify app setup

1. Create an app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add `http://127.0.0.1:5173/callback` as a Redirect URI in the app's settings.
3. Copy the Client ID into `.env` as `VITE_SPOTIFY_CLIENT_ID`.
4. (Optional, see below) Copy the Client Secret into `.env` as `SPOTIFY_CLIENT_SECRET` to enable browsing while logged out.

## Architecture

Organized by feature, not by file type:

```
src/
  app/            Redux store setup, typed hooks
  features/
    auth/         OAuth/PKCE flow, session bootstrap, login-required gate
    search/       Debounced live search
    browse/       Home page data (new releases, featured playlists, categories)
    artist/       Artist detail page
    album/        Album detail page
    player/       Web Playback SDK integration, playback bar, device switching
    playlists/    Playlist CRUD, "Your Library" page
    library/      Liked Songs
    follow/       Follow/unfollow artists
  components/
    media/        Shared entity cards (Track/Artist/Album/Playlist) used across features
    icons/        Inline SVG icon set
    layout/       App shell (nav + playback bar)
  lib/            Framework-agnostic helpers (formatting, the shared RTK Query API slice)
  types/          Spotify API response shapes
api/
  token.ts        The one serverless piece — see "Anonymous browsing" below
```

Each feature owns its own Redux slice or RTK Query endpoints (`*Slice.ts` / `*Api.ts`), typed throughout with no `any`. Data-fetching features (search, browse, playlists, library, follow, artist, album) are all RTK Query endpoints injected onto one shared `spotifyApi` instance (`src/lib/spotify/apiSlice.ts`) — one cache, one auth/retry policy, instead of every feature reinventing fetch logic. `auth` and `player` are plain Redux Toolkit slices, since both need custom async orchestration (token refresh scheduling, SDK event handling) that doesn't fit the request/response shape RTK Query is built for.

## The OAuth / PKCE flow, and why it's needed

This is a pure frontend app — there's no server to hold a client secret. Spotify's standard Authorization Code flow needs one, so it's not an option here. **Authorization Code with PKCE** (RFC 7636) is the flow designed for exactly this case: public clients that can't keep a secret.

The mechanism (`src/features/auth/pkce.ts`, `spotifyAuthApi.ts`):

1. Before redirecting to Spotify, the app generates a random `code_verifier` and its SHA-256 hash, the `code_challenge`. The verifier is stashed in `sessionStorage`; only the challenge is sent to Spotify.
2. Spotify redirects back to `/callback` with a single-use authorization `code`.
3. The app exchanges that code for tokens by POSTing to Spotify's token endpoint, including the *raw* `code_verifier`. Spotify re-hashes it and checks it matches the challenge from step 1.

Why this is safe without a secret: an attacker who somehow intercepts the authorization `code` (e.g., a leaked redirect) still can't redeem it, because they don't have the verifier — it never left this browser except as an irreversible hash. A random `state` parameter is also generated and checked on callback, as CSRF protection for the redirect itself.

### Token storage

- **Access token**: kept only in Redux state (in memory). Never written to any storage. A hard reload wipes it completely.
- **Refresh token**: stored in `localStorage`.

This is the one real security tradeoff in the app, and it's deliberate — see [Interview talking points](#interview-talking-points) below for the full reasoning.

### Staying logged in across reloads

`AuthProvider.tsx` runs once on app start: if a refresh token is in `localStorage`, it silently trades it for a new access token (no redirect, no consent screen). It also schedules a proactive refresh 60 seconds before the current access token expires, so an in-flight API call never races against the token dying mid-request. As a second line of defense, `apiSlice.ts`'s base query catches any 401 that slips through, refreshes once, and retries the exact same request.

### Browsing while logged out

Every Spotify Web API call needs a bearer token — there's no truly anonymous request, not even for search. A logged-out visitor has no PKCE token yet, and running the Client Credentials flow (Spotify's app-only auth) directly from the browser isn't possible either, since it needs a client secret that would sit in plain sight in the JS bundle.

The fix is `api/token.ts` — one Vercel Edge Function that holds `SPOTIFY_CLIENT_SECRET` server-side and hands the frontend a short-lived, app-only token for anonymous browsing (mirrored for local dev by a Vite middleware in `vite.config.ts`, since `vite dev` doesn't run the `api/` directory). This is the one piece of server-side code in an otherwise pure-frontend app, and it exists for exactly one narrow reason: to keep a secret out of the client. It's optional — the app works fully once logged in without it; without the secret configured, logged-out visitors just see a login prompt on search/browse instead of live results.

## Playback SDK integration

The Web Playback SDK (`src/features/player/`) turns this browser tab into a Spotify Connect device. Two important architectural points:

- **The SDK and the REST API split responsibilities.** Once this device is the active one, transport controls — play/pause, seek, skip, volume — go straight through the SDK's own `Spotify.Player` methods (`spotifyPlayerService.ts`), no network round-trip beyond what the SDK does internally. But *starting* playback of a specific track or album, and toggling shuffle/repeat, have no SDK equivalent — those are REST calls (`playerApi.ts`) that target this device by its `device_id`.
- **State flows one way, from the SDK into Redux.** `PlayerProvider.tsx` owns the SDK's lifecycle and listens for its events (`ready`, `player_state_changed`, and the various error types), dispatching each into `playerSlice`. The UI never guesses at playback state — it only reflects what the SDK last reported. Because `player_state_changed` only fires on real transitions (not continuously), the seek bar's smooth motion between events is a local `requestAnimationFrame` tick (`usePlaybackProgress.ts`) that corrects itself the instant a real update lands.
- **SDK initialization is gated on `product === 'premium'`.** Free accounts get a clear "Playback requires Premium" prompt (`PremiumGateContext.tsx`) instead of the SDK's own, less friendly `account_error`.

## Known limitations

- **Playback requires Spotify Premium.** This is a platform restriction from Spotify, not a limitation of this app — the Web Playback SDK simply doesn't stream audio for free accounts. Every other feature (browsing, search, playlists, liked songs, following) works on a free account.
- **Anonymous browsing needs `SPOTIFY_CLIENT_SECRET` configured** (see above). Without it, logged-out visitors see a login prompt instead of live catalog data.
- **Some browse endpoints may be unavailable** depending on the Spotify app's access level — `Featured Playlists`, `Browse Categories`, and `Related Artists` were restricted by Spotify to apps with "extended quota mode" a while back. The app handles this gracefully (the section just doesn't render) rather than erroring.
- **"Add to playlist" and "Liked Songs" heart state check one track at a time** (`isTrackSaved`, `isFollowingArtist` in the API layer) rather than batching visible tracks into one request. Simpler, and fine at this scale; a production app would batch these.

## Deployment (Vercel)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Import the project in [Vercel](https://vercel.com/new). Vite projects are auto-detected — no build config needed.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `VITE_SPOTIFY_CLIENT_ID` — your Spotify app's Client ID
   - `VITE_SPOTIFY_REDIRECT_URI` — `https://<your-vercel-domain>/callback`
   - `SPOTIFY_CLIENT_SECRET` — (optional) your Spotify app's Client Secret, to enable anonymous browsing in production
4. Deploy. Vercel automatically picks up `api/token.ts` as an Edge Function — no extra configuration needed.
5. Back in the **Spotify Developer Dashboard**, add `https://<your-vercel-domain>/callback` as a second Redirect URI on the app (alongside the local one) — Spotify matches redirect URIs exactly, so the production URL needs its own explicit entry.

That's it — no database, no separate backend to host. The only server-side code (`api/token.ts`) deploys automatically as part of the same Vercel project.

## Interview talking points

The trickiest engineering decisions in this project, and the reasoning behind them:

**Storing the refresh token in `localStorage` at all.** The access token is memory-only by design, but "stay logged in across reloads" requires the refresh token to persist *somewhere*, and a static SPA has no server-controlled, httpOnly cookie to put it in. `localStorage` is readable by any script on the page, so an XSS bug anywhere in the app (or a compromised dependency) could exfiltrate it. The honest fix is a backend-for-frontend that holds the refresh token server-side and only ever gives the SPA short-lived access tokens — deliberately out of scope for a pure-frontend portfolio project, but the right answer to know and be able to explain.

**Why a "pure frontend" app still has one serverless function.** `api/token.ts` exists solely to run Spotify's Client Credentials flow (which needs a secret) without putting that secret in the browser. It's a deliberate, minimal exception to "no backend" — one endpoint, one narrow job — not a sign the architecture gave up on the constraint.

**Splitting playback control between the SDK and the REST API.** It would be simpler to route every playback action through one API, but Spotify's own SDK doesn't expose "start this URI" or shuffle/repeat toggles — REST-only for those — while play/pause/seek/skip *do* have direct SDK methods that skip a network round-trip entirely. The player feature reflects that split rather than papering over it with an unnecessary abstraction layer.

**Redux slices vs. RTK Query, and why not everything is RTK Query.** Most data-fetching features are RTK Query endpoints on one shared API instance — that gets caching, tag-based invalidation, and auth/retry handling for free across search, browse, playlists, and more. `auth` and `player` are hand-written slices instead, because both have async logic RTK Query isn't shaped for: scheduling a proactive token refresh timer, and reducing a stream of SDK events (not HTTP responses) into state.

**One-way state flow from the SDK.** The playback UI never optimistically guesses what should happen next — it dispatches a command (via the SDK or REST) and waits for the SDK's own `player_state_changed` event to confirm what actually happened. That event only fires on real transitions, though, so the seek bar's continuous motion is a local animation-frame tick that free-runs between events and snaps to the real position the instant one arrives — a small but deliberate piece of state reconciliation.
