import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M6 4.5v15l13-7.5z" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" />
    </svg>
  )
}

export function SkipBackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M6 5v14h2V5zm13.5 0L9 12l10.5 7z" />
    </svg>
  )
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M18 5v14h-2V5zM4.5 5L15 12 4.5 19z" />
    </svg>
  )
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <path d="M3 6h3.5c1.2 0 2.3.6 3 1.6l5 7c.7 1 1.8 1.6 3 1.6H21" />
      <path d="M17.5 4.5 21 6l-3.5 1.5M17.5 19.5 21 18l-3.5-1.5" />
      <path d="M3 18h3.5c1.2 0 2.3-.6 3-1.6l.7-1" />
      <path d="m14.7 8.6.6-1c.7-1 1.8-1.6 3-1.6H21" />
    </svg>
  )
}

export function RepeatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <path d="M4 7h13a3 3 0 0 1 3 3v2" />
      <path d="m6.5 4.5-2.5 2.5 2.5 2.5" />
      <path d="M20 17H7a3 3 0 0 1-3-3v-2" />
      <path d="m17.5 19.5 2.5-2.5-2.5-2.5" />
    </svg>
  )
}

export function RepeatOneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <path d="M4 7h13a3 3 0 0 1 3 3v2" />
      <path d="m6.5 4.5-2.5 2.5 2.5 2.5" />
      <path d="M20 17H7a3 3 0 0 1-3-3v-2" />
      <path d="m17.5 19.5 2.5-2.5-2.5-2.5" />
      <path d="M11 9.5h1v3.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M4 9v6h4l5 5V4L8 9z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function VolumeMuteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M4 9v6h4l5 5V4L8 9z" />
      <path d="M16 9l4 6M20 9l-4 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Trigger button for the Connect device picker — echoes Spotify's own "available devices" glyph. */
export function DevicesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <path d="M8 19h4" />
      <rect x="18" y="9" width="3" height="6" rx="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ComputerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}

export function SmartphoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function SpeakerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="8" r="2.2" />
      <circle cx="12" cy="15" r="3.2" />
    </svg>
  )
}
