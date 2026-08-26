// Shared Spotify Web API response shapes, kept intentionally minimal —
// only the fields this app actually reads, not the full API surface.

export interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

export interface SpotifyExternalUrls {
  spotify: string
}

export interface SpotifyArtist {
  id: string
  name: string
  uri: string
  images?: SpotifyImage[]
  genres?: string[]
  followers?: { total: number }
  external_urls: SpotifyExternalUrls
}

export interface SpotifyAlbum {
  id: string
  name: string
  uri: string
  images: SpotifyImage[]
  artists: Pick<SpotifyArtist, 'id' | 'name' | 'uri'>[]
  release_date: string
  total_tracks: number
  album_type: 'album' | 'single' | 'compilation'
  external_urls: SpotifyExternalUrls
}

export interface SpotifyTrack {
  id: string
  name: string
  uri: string
  artists: Pick<SpotifyArtist, 'id' | 'name' | 'uri'>[]
  album: Pick<SpotifyAlbum, 'id' | 'name' | 'images' | 'uri'>
  duration_ms: number
  explicit: boolean
  external_urls: SpotifyExternalUrls
}

export interface SpotifyPlaylist {
  id: string
  name: string
  uri: string
  description: string | null
  images: SpotifyImage[]
  owner: { id: string; display_name: string | null }
  tracks: { total: number }
  public: boolean | null
  collaborative: boolean
  external_urls: SpotifyExternalUrls
}

export interface SpotifyPlaylistTrackItem {
  added_at: string
  track: SpotifyTrack
}

export interface SpotifyPlaylistDetail extends Omit<SpotifyPlaylist, 'tracks'> {
  tracks: SpotifyPaging<SpotifyPlaylistTrackItem>
}

export interface SpotifyPaging<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}

export interface SpotifyCategory {
  id: string
  name: string
  icons: SpotifyImage[]
}

/** A track as it appears inside an album's own track listing — no nested `album` (redundant there). */
export interface SpotifyAlbumTrack {
  id: string
  name: string
  uri: string
  artists: Pick<SpotifyArtist, 'id' | 'name' | 'uri'>[]
  duration_ms: number
  explicit: boolean
  track_number: number
  external_urls: SpotifyExternalUrls
}

export interface SpotifyAlbumDetail extends SpotifyAlbum {
  label?: string
  tracks: SpotifyPaging<SpotifyAlbumTrack>
}

export interface SpotifyDevice {
  id: string | null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: 'Computer' | 'Smartphone' | 'Speaker' | string
  volume_percent: number | null
}

export interface SpotifyRecentlyPlayedItem {
  played_at: string
  track: SpotifyTrack
}
