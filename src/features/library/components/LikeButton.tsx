import { HeartIcon } from '@/components/icons/CommonIcons'
import { useAppSelector } from '@/app/hooks'
import { useLoginPrompt } from '@/features/auth/LoginPromptContext'
import { useIsTrackSavedQuery, useRemoveSavedTrackMutation, useSaveTrackMutation } from '../likedSongsApi'

export function LikeButton({ trackId }: { trackId: string }) {
  const { requireAuth } = useLoginPrompt()
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')
  const { data: isSaved } = useIsTrackSavedQuery(trackId, { skip: !isAuthenticated })
  const [saveTrack] = useSaveTrackMutation()
  const [removeSavedTrack] = useRemoveSavedTrackMutation()

  return (
    <button
      type="button"
      aria-label={isSaved ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
      aria-pressed={Boolean(isSaved)}
      onClick={() => requireAuth(() => (isSaved ? removeSavedTrack(trackId) : saveTrack(trackId)))}
      className={
        isSaved
          ? 'text-spotify-green'
          : 'text-spotify-gray opacity-0 hover:text-white group-hover:opacity-100'
      }
    >
      <HeartIcon filled={isSaved} />
    </button>
  )
}
