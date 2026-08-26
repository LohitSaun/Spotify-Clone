import { useAppSelector } from '@/app/hooks'

const FALLBACK_MARKET = 'US'

/** The ISO market code catalog endpoints (top tracks, album availability) need — the logged-in user's own country, or a reasonable fallback for anonymous browsing. */
export function useMarket(): string {
  return useAppSelector((state) => state.auth.user?.country ?? FALLBACK_MARKET)
}
