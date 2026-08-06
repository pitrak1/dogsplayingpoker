import { z } from 'zod'

export const idInputSchema = z.object({
  id: z.coerce.number().int().positive()
})
export type IdInput = z.infer<typeof idInputSchema>


export const paginationInputSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
})

export type PaginationInput = z.infer<typeof paginationInputSchema>

export const paginationWithIdInputSchema = z.intersection(idInputSchema, paginationInputSchema)
export type PaginationWithIdInput = z.infer<typeof paginationWithIdInputSchema>

export type MapboxSearchResult = {
  features: {
    properties: {
      name: string
    }
    geometry: {
      coordinates: number[]
    }
  }[]
}

export type MapPosition = {
  lat: number,
  lng: number,
  zoom: number
}