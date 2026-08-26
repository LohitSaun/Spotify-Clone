import type { ReactNode } from 'react'

export function ResultSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
