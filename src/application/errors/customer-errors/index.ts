import { ApplicationError } from '../application-error'

export class CustomerNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Customer not found.')
  }
}

export class CustomerAlreadyExistsError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Customer already exists.')
  }
}
