import {
  OrderCreatedEvent,
  OrderCreatedPayload
} from '@/domain/events/order-events/order-created'
import { RabbitMQPubSub } from './fodase'

const eventBus = new RabbitMQPubSub()

;(async () => {
  const orderCreatedEvent = new OrderCreatedEvent({
    aggregateId: '1',
    createdAt: new Date(),
    payload: {
      customerEmail: 'r5oP5@example.com',
      orderId: '1',
      totalInCents: 100,
      customerId: '1',
      items: [
        {
          title: 'iPhone X',
          quantity: 1,
          unitPriceInCents: 100
        }
      ]
    }
  })
  await eventBus.publish(orderCreatedEvent, orderCreatedEvent.payload)

  eventBus.subscribe<OrderCreatedPayload>(
    'order.created.event',
    async (event) => {
      console.log('handling order.created.event', event.payload)
    },
    {
      service: 'default'
    }
  )

  try {
  } catch (error: any) {
    console.log({
      message: error.message,
      name: error.name
    })
  }
})()
