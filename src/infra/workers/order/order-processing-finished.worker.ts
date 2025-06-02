import { orderProcessingFinishedHandler } from '@/application/handlers/order/order-processing-finished.handler'
import { ORDER_EVENTS } from '@/domain/events/order/order.event'
import { rmqPubSub } from '@/infra/events/rabbitmq/rabbitmq-pub-sub'
;(async () => {
  await rmqPubSub.subscribe(
    ORDER_EVENTS.ROUTING_KEYS.PROCESSING_FINISHED,
    orderProcessingFinishedHandler
  )
})()
