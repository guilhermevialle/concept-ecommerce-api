import { orderCreatedHandler } from '@/application/handlers/order/order-created.handler'
import { ORDER_EVENTS } from '@/domain/events/order/order.event'
import { rmqPubSub } from '@/infra/events/rabbitmq/rabbitmq-pub-sub'

;(async () => {
  await rmqPubSub.subscribe(
    ORDER_EVENTS.ROUTING_KEYS.CREATED,
    orderCreatedHandler
  )
})()
