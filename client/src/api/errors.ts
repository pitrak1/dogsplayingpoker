export class ApiError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
  }
}