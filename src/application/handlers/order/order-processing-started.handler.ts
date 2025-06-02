import { DomainEventProps } from '@/domain/events/domain.event'
import { OrderCreatedEventPayload } from '@/domain/events/order/order-created.event'
import { OrderProcessingFinishedEvent } from '@/domain/events/order/order-processing-finished.event'
import { rmqPubSub } from '@/infra/events/rabbitmq/rabbitmq-pub-sub'
import { wait } from '@/shared/utils/wait'

export const orderProcessingStartedHandler = async (
  event: DomainEventProps<OrderCreatedEventPayload>
): Promise<void> => {
  await wait(2_000)

  console.log('[Order Processing Started Job]: Order started processing!')

  console.log({
    from: `noreply@myapp.com`,
    to: event.payload.customer.email,
    subject: 'Order processing',
    html: `
      <h1>Your order is being processed</h1>
      <p>Hi ${event.payload.customer.username},</p>
      <p>Order ID: ${event.aggregateId}</p>
    `
  })

  const orderProcessingFinishedEvent = new OrderProcessingFinishedEvent({
    aggregateId: event.aggregateId,
    payload: event.payload,
    occurredOn: new Date()
  })

  await rmqPubSub.publish(orderProcessingFinishedEvent)
}
