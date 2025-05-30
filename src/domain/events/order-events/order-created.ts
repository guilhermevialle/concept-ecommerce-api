import { DomainEvent, DomainEventProps } from '../domain-event'

export interface OrderCreatedPayload {
  customer: {
    id: string
    email: string
  }
  order: {
    id: string
    items: Array<{
      title: string
      quantity: number
      unitPriceInCents: number
    }>
    totalInCents: number
  }
}

export class OrderCreatedEvent extends DomainEvent<OrderCreatedPayload> {
  type(): string {
    return 'order.created.event'
  }

  constructor(props: DomainEventProps<OrderCreatedPayload>) {
    super(props)
  }
}
