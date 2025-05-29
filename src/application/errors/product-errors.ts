import { ApplicationError } from './application-error'

export class ProductNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Product not found.')
  }
}

export class ProductNotAvailableError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Product not available.')
  }
}
