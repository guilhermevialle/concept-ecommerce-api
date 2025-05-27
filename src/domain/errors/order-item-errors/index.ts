import { DomainError } from '../domain-error'

export abstract class OrderItemError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'OrderItemError'
  }
}

export class MissingOrderItemProps extends OrderItemError {
  constructor(message?: string) {
    super(message ?? 'Missing order item props.')
  }
}

export class InvalidOrderItemQuantity extends OrderItemError {
  constructor(message?: string) {
    super(message ?? 'Invalid order item quantity.')
  }
}

export class InvalidOrderItemPrice extends OrderItemError {
  constructor(message?: string) {
    super(message ?? 'Invalid order item price.')
  }
}
