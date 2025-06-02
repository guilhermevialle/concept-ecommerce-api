import { DomainEventProps } from '@/domain/events/domain.event'
import { OrderCreatedEventPayload } from '@/domain/events/order/order-created.event'
import { OrderProcessingStartedEvent } from '@/domain/events/order/order-processing-started.event'
import { rmqPubSub } from '@/infra/events/rabbitmq/rabbitmq-pub-sub'
import { wait } from '@/shared/utils/wait'

export const orderCreatedHandler = async (
  event: DomainEventProps<OrderCreatedEventPayload>
): Promise<void> => {
  await wait(2_000)

  console.log('[Order Created Job]: Order has been created!')

  console.log({
    from: `noreply@myapp.com`,
    to: event.payload.customer.email,
    subject: 'Order Created',
    html: `
      <h1>Order Created</h1>
      <p>Hi ${event.payload.customer.username},</p>
      <p>Thank you for your order.</p>
      <p>Order ID: ${event.aggregateId}</p>
    `
  })

  const processingOrderEvent = new OrderProcessingStartedEvent({
    aggregateId: event.aggregateId,
    payload: event.payload,
    occurredOn: new Date()
  })

  await rmqPubSub.publish(processingOrderEvent)
}
