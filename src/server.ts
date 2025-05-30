import { orderCreatedHandler } from './application/handlers/order-handlers/order-created-handler'
import {
  OrderCreatedEvent,
  OrderCreatedPayload
} from './domain/events/order-events/order-created'
import { RabbitMQPubSub } from './infra/events/rabbitmq/rabbitmq-pub-sub'
import { toCents } from './shared/utils/to-cents'

const event = new OrderCreatedEvent({
  aggregateId: '1',
  payload: {
    customerEmail: 'r5oP5@example.com',
    orderId: '1',
    customerId: '1',
    items: [
      {
        title: 'iPhone X',
        quantity: 1,
        unitPriceInCents: toCents(299.9)
      },
      {
        title: 'Samsung S10',
        quantity: 1,
        unitPriceInCents: toCents(499.9)
      }
    ],
    totalInCents: toCents(299.9 + 499.9)
  }
})

;(async () => {
  try {
    const eventBus = new RabbitMQPubSub()

    setInterval(async () => {
      await eventBus.publish<OrderCreatedPayload>(event)
    }, 10_000)

    await eventBus.subscribe('order.created.event', orderCreatedHandler)
  } catch (error) {}
})()
