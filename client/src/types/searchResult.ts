export type SearchResult = {
  features: Array<{
    properties: { name: string }
    geometry: { coordinates: number[] }
  }>
}