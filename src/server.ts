import { OrderCreatedEvent } from './domain/events/order/order-created.event'
import { rmqPubSub } from './infra/events/rabbitmq/rabbitmq-pub-sub'
import './infra/workers/order/order-workers.bootstrap'

;(async () => {
  try {
    const event = new OrderCreatedEvent({
      aggregateId: '1',
      occurredOn: new Date(),
      payload: {
        customer: {
          id: '1',
          username: 'John Doe',
          email: 'r5oP5@example.com'
        },
        order: {
          id: '1',
          items: [
            {
              id: '1',
              productId: '1',
              quantity: 1,
              unitPriceInCents: 100
            }
          ],
          totalAmountInCents: 100
        }
      }
    })

    console.log(event)

    await rmqPubSub.publish(event)
  } catch (error: any) {
    console.log({
      name: error.name,
      message: error.message
    })
  }
})()
