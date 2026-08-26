/** "spotify:artist:4tZwfgrHOc3mvqYlEYSvVi" -> "4tZwfgrHOc3mvqYlEYSvVi" */
export function idFromUri(uri: string): string {
  return uri.split(':').at(-1) ?? uri
}
