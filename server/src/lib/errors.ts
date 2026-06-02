export const PG_UNIQUE_VIOLATION = '23505'

export class AuthError extends Error {
  constructor(message: string, public status = 401) { 
    super(message)
  }
}

export class ConflictError extends Error {
  constructor(message: string, public field: string) { 
    super(message) 
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
  }
}