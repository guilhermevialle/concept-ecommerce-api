import { DomainError } from '../domain-error'

export abstract class CustomerError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'CustomerError'
  }
}

export class MissingCustomerProps extends CustomerError {
  constructor(message?: string) {
    super(message ?? 'Missing customer props.')
  }
}

export class InvalidUsernameError extends CustomerError {
  constructor(message?: string) {
    super(message ?? 'Invalid username.')
  }
}
