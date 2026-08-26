import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Local-dev mirror of api/token.ts (the Vercel Edge Function). `vite dev`
 * never runs the api/ directory, so without this, anonymous browsing would
 * only work after deploying. Same request/response shape, same env vars.
 */
function clientCredentialsDevMiddleware(env: Record<string, string>): Plugin {
  return {
    name: 'dev-client-credentials-token',
    configureServer(server) {
      server.middlewares.use('/api/token', async (_req, res) => {
        const clientId = env.VITE_SPOTIFY_CLIENT_ID
        const clientSecret = env.SPOTIFY_CLIENT_SECRET
        res.setHeader('content-type', 'application/json')

        if (!clientId || !clientSecret) {
          res.statusCode = 501
          res.end(JSON.stringify({ error: 'not_configured' }))
          return
        }

        try {
          const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
          const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${basicAuth}`,
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' }),
          })

          if (!tokenResponse.ok) throw new Error('token request failed')

          const data = (await tokenResponse.json()) as { access_token: string; expires_in: number }
          res.statusCode = 200
          res.end(JSON.stringify({ access_token: data.access_token, expires_in: data.expires_in }))
        } catch {
          res.statusCode = 502
          res.end(JSON.stringify({ error: 'token_request_failed' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix so this also picks up server-only vars (e.g. SPOTIFY_CLIENT_SECRET)
  // that intentionally lack the VITE_ prefix, since that prefix is what makes
  // Vite inline a variable into the client bundle — the opposite of what a secret needs.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), clientCredentialsDevMiddleware(env)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      // Pinned to match the redirect URI registered with the Spotify app
      // (http://127.0.0.1:5173/callback) — Spotify matches redirect URIs
      // exactly, so this port/host must never drift.
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
  }
})
