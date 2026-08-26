import { useAppSelector } from '@/app/hooks'
import { useLoginPrompt } from '@/features/auth/LoginPromptContext'
import { useFollowArtistMutation, useIsFollowingArtistQuery, useUnfollowArtistMutation } from '../followApi'

export function FollowButton({ artistId }: { artistId: string }) {
  const { requireAuth } = useLoginPrompt()
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')
  const { data: isFollowing } = useIsFollowingArtistQuery(artistId, { skip: !isAuthenticated })
  const [followArtist] = useFollowArtistMutation()
  const [unfollowArtist] = useUnfollowArtistMutation()

  return (
    <button
      type="button"
      aria-pressed={Boolean(isFollowing)}
      onClick={() => requireAuth(() => (isFollowing ? unfollowArtist(artistId) : followArtist(artistId)))}
      className={
        isFollowing
          ? 'rounded-full border border-white/40 bg-white/10 px-6 py-2 text-sm font-semibold hover:border-white'
          : 'rounded-full border border-white/40 px-6 py-2 text-sm font-semibold hover:border-white'
      }
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
