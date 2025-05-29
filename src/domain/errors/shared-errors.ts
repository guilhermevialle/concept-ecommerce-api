import { DomainError } from './domain-error'

export class InvalidIdError extends DomainError {
  constructor(message?: string) {
    super(message ?? 'Invalid id.')
    this.name = 'GenericError'
  }
}
