import { DomainError } from '../domain-error'

export abstract class OrderError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'OrderError'
  }
}

export class MissingOrderProps extends OrderError {
  constructor(message?: string) {
    super(message ?? 'Missing order props.')
  }
}

export class InvalidOrderStatusError extends OrderError {
  constructor(message?: string) {
    super(message ?? 'Invalid order status.')
  }
}
