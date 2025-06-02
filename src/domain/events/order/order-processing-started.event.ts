import { DomainEventProps } from '../domain.event'
import { OrderCreatedEventPayload } from './order-created.event'
import { ORDER_EVENTS, OrderEvent } from './order.event'

export class OrderProcessingStartedEvent extends OrderEvent<OrderCreatedEventPayload> {
  type(): string {
    return ORDER_EVENTS.ROUTING_KEYS.PROCESSING_STARTED
  }

  constructor(props: DomainEventProps<OrderCreatedEventPayload>) {
    super({ ...props })
  }
}
