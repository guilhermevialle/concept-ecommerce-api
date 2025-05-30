import { DomainEvent } from '@/domain/events/domain-event'
import { IPubSub } from '@/interfaces/infra/events/pub-sub'
import { EventHandler } from '@/types/event-handler'
import amqplib from 'amqplib'

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'

export class RabbitMQPubSub implements IPubSub {
  url: string
  exchange: string
  connection?: amqplib.ChannelModel
  channel?: amqplib.Channel

  constructor() {
    this.url = RABBITMQ_URL
    this.exchange = 'domain-events'
  }

  async connect() {
    if (this.channel) return

    this.connection = await amqplib.connect(this.url)
    this.channel = await this.connection.createChannel()

    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true
    })
  }

  async publish<Payload>(event: DomainEvent<Payload>) {
    await this.connect()
    const routingKey = event.type()

    const eventBuffer = Buffer.from(
      JSON.stringify({
        aggregateId: event.aggregateId,
        occurredOn: event.occurredOn.toISOString(),
        payload: event.payload
      })
    )

    this.channel?.publish(this.exchange, routingKey, eventBuffer, {
      contentType: 'application/json',
      persistent: true
    })

    console.log(`[x] Published event: "${routingKey}"`)
  }

  async subscribe<T>(
    eventName: string,
    handler: EventHandler<T>,
    { service = 'default' } = {}
  ) {
    await this.connect()

    const queue = `${eventName.replace(/\./g, '-')}-queue.${service}`

    await this.channel?.assertQueue(queue, { durable: true })
    await this.channel?.bindQueue(queue, this.exchange, eventName)

    this.channel?.consume(queue, async (msg) => {
      if (!msg) return

      const content = JSON.parse(msg.content.toString())

      try {
        await handler(content)
        this.channel?.ack(msg)
      } catch (err) {
        console.error(`❌ Error handling event "${eventName}"`, err)
        this.channel!.nack(msg, false, false)
      }
    })

    console.log(`[✓] Subscribed to "${eventName}" with queue "${queue}"`)
  }

  async close() {
    await this.channel?.close()
    await this.connection?.close()
  }
}
