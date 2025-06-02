import { DomainEventProps } from '../domain.event'
import { OrderCreatedEventPayload } from './order-created.event'
import { ORDER_EVENTS, OrderEvent } from './order.event'

export class OrderProcessingFinishedEvent extends OrderEvent<OrderCreatedEventPayload> {
  type(): string {
    return ORDER_EVENTS.ROUTING_KEYS.PROCESSING_FINISHED
  }

  constructor(props: DomainEventProps<OrderCreatedEventPayload>) {
    super({ ...props })
  }
}
