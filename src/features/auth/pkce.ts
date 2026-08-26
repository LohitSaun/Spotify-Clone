/**
 * Authorization Code + PKCE helpers.
 *
 * PKCE (Proof Key for Code Exchange, RFC 7636) exists for public clients —
 * apps that can't keep a secret, like a browser SPA with no backend. Instead
 * of a client secret, the app proves it's the same party that started the
 * flow by generating a random `verifier`, sending its hash (the
 * `challenge`) with the initial authorize request, then sending the raw
 * `verifier` when exchanging the code for a token. Spotify re-hashes it and
 * checks it matches — an attacker who intercepts the authorization `code`
 * (e.g. via a leaked redirect) can't redeem it without the verifier, which
 * never left this browser except as an unreversible hash.
 */

const CODE_VERIFIER_LENGTH = 64

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** A high-entropy random string, unguessable and used only once per login attempt. */
export function generateCodeVerifier(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(CODE_VERIFIER_LENGTH))
  return base64UrlEncode(randomBytes.buffer)
}

/** SHA-256(verifier), base64url-encoded — this is what actually gets sent up front. */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

/** Random value echoed back by Spotify in the redirect — mitigates CSRF on the callback. */
export function generateState(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  return base64UrlEncode(randomBytes.buffer)
}
