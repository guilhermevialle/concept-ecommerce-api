import { DomainEvent, DomainEventProps } from '../domain-event'

export interface OrderFailedPayload {
  customer: {
    email: string
    username: string
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

export class OrderFailedEvent extends DomainEvent<OrderFailedPayload> {
  type(): string {
    return 'order.created.event'
  }

  constructor(props: DomainEventProps<OrderFailedPayload>) {
    super(props)
  }
}
