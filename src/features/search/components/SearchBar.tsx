interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What do you want to listen to?"
        autoFocus
        className="w-full rounded-full bg-spotify-black-highlight px-5 py-3 text-sm text-white placeholder-spotify-gray outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  )
}
