import { DomainEvent, DomainEventProps } from '../domain.event'

export const ORDER_EVENTS = {
  EXCHANGE: 'order-events',
  ROUTING_KEYS: {
    CREATED: 'order.created.event',
    PROCESSING_STARTED: 'order.processing.started.event',
    PROCESSING_FINISHED: 'order.processing.finished.event'
  }
} as const

export abstract class OrderEvent<PayloadType> extends DomainEvent<PayloadType> {
  abstract type(): string

  constructor(props: DomainEventProps<PayloadType>) {
    super(props)
  }
}
