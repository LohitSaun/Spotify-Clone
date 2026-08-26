// Vercel Edge Function: exchanges the app's client ID + secret for a
// short-lived Client Credentials token (Spotify's app-only auth flow), so
// logged-out visitors can search and browse without ever seeing the secret.
// SPOTIFY_CLIENT_SECRET must be set as a server-side env var in the Vercel
// project settings — never prefixed with VITE_, or it would be bundled
// into the client JS. Mirrored for local dev by the Vite plugin in
// vite.config.ts, which serves the same shape at the same path.
export const config = { runtime: 'edge' }

export default async function handler(): Promise<Response> {
  const clientId = process.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'not_configured' }, { status: 501 })
  }

  const basicAuth = btoa(`${clientId}:${clientSecret}`)
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!tokenResponse.ok) {
    return Response.json({ error: 'token_request_failed' }, { status: 502 })
  }

  const data = (await tokenResponse.json()) as { access_token: string; expires_in: number }

  return Response.json(
    { access_token: data.access_token, expires_in: data.expires_in },
    { headers: { 'Cache-Control': 'private, max-age=0, no-store' } },
  )
}
