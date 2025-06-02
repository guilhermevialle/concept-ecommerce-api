import { DomainEventProps } from '@/domain/events/domain.event'
import { OrderCreatedEventPayload } from '@/domain/events/order/order-created.event'
import { wait } from '@/shared/utils/wait'

export const orderProcessingFinishedHandler = async (
  event: DomainEventProps<OrderCreatedEventPayload>
): Promise<void> => {
  await wait(2_000)

  console.log('[Order Processing Finished Job]: Your order has been processed!')

  console.log({
    from: `noreply@myapp.com`,
    to: event.payload.customer.email,
    subject: 'Order processed successfully!',
    html: `
      <h1>We have processed your order</h1>
      <p>Hi ${event.payload.customer.username},</p>
      <p>Order ID: ${event.aggregateId}</p>
    `
  })
}
