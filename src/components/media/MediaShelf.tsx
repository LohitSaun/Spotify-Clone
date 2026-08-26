import type { ReactNode } from 'react'

interface MediaShelfProps {
  title: string
  children: ReactNode
}

/** A titled, horizontally-scrolling row of cards — Spotify's standard browse shelf. */
export function MediaShelf({ title, children }: MediaShelfProps) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  )
}
