import { DomainEventProps } from '../domain.event'
import { ORDER_EVENTS, OrderEvent } from './order.event'

export interface OrderCreatedEventPayload {
  order: {
    id: string
    items: Array<{
      id: string
      productId: string
      quantity: number
      unitPriceInCents: number
    }>
    totalAmountInCents: number
  }
  customer: {
    id: string
    username: string
    email: string
  }
}

export class OrderCreatedEvent extends OrderEvent<OrderCreatedEventPayload> {
  type(): string {
    return ORDER_EVENTS.ROUTING_KEYS.CREATED
  }

  constructor(props: DomainEventProps<OrderCreatedEventPayload>) {
    super({ ...props })
  }
}
