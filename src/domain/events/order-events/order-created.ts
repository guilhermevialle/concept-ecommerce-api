import { DomainEvent, DomainEventProps } from '../domain-event'

export interface OrderCreatedPayload {
  customerId: string
  customerEmail: string
  orderId: string
  items: {
    title: string
    quantity: number
    unitPriceInCents: number
  }[]
  totalInCents: number
}

export class OrderCreatedEvent extends DomainEvent<OrderCreatedPayload> {
  type(): string {
    return 'order.created.event'
  }

  constructor(props: DomainEventProps<OrderCreatedPayload>) {
    super(props)
  }
}
