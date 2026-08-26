import type { SpotifyCategory } from '@/types/spotify'

export function CategoryCard({ category }: { category: SpotifyCategory }) {
  const image = category.icons[0]?.url

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-spotify-black-highlight">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />}
      <span className="absolute top-3 left-3 text-lg font-bold drop-shadow">{category.name}</span>
    </div>
  )
}
