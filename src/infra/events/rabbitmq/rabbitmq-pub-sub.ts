import { DomainEvent, DomainEventProps } from '@/domain/events/domain.event'
import { IPubSub } from '@/interfaces/infra/events/pub-sub.interface'
import * as amqplib from 'amqplib'

interface RabbitMQPubSubProps {
  url: string
  exchange: string
}

export class RabbitMQPubSub implements IPubSub {
  private connection?: amqplib.ChannelModel
  private channel?: amqplib.Channel
  private exchange: string
  private url: string

  constructor({ exchange, url }: RabbitMQPubSubProps) {
    this.exchange = exchange
    this.url = url
  }

  async connect() {
    if (this.channel) return

    this.connection = await amqplib.connect(this.url)
    this.channel = await this.connection.createChannel()

    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true
    })
  }

  async publish<PayloadType>(event: DomainEvent<PayloadType>) {
    await this.connect()

    const routingKey = event.type()
    const buffer = Buffer.from(JSON.stringify(event.toJSON()))

    this.channel?.publish(this.exchange, routingKey, buffer, {
      contentType: 'application/json',
      persistent: true
    })

    console.log(`[x] Published event: "${routingKey}"`)
  }

  async subscribe<PayloadType>(
    eventType: string,
    handler: (event: DomainEventProps<PayloadType>) => Promise<void>,
    { service = 'default' } = {}
  ) {
    await this.connect()

    const queueId = `${eventType.replace(/\./g, '-')}-queue.${service}`

    await this.channel?.assertQueue(queueId, { durable: true })
    await this.channel?.bindQueue(queueId, this.exchange, eventType)

    this.channel?.consume(
      queueId,
      async (msg) => {
        if (!msg) return

        try {
          const content = JSON.parse(msg.content.toString()) as {
            aggregateId: string
            occurredOn: string
            payload: PayloadType
          }

          await handler({
            ...content,
            occurredOn: new Date(content.occurredOn)
          })

          this.channel!.ack(msg)
        } catch (err) {
          console.error(`❌ Error handling event "${eventType}"`, err)

          this.channel!.nack(msg, false, false)
        }
      },
      { noAck: false }
    )

    console.log(`[✓] Subscribed to "${eventType}" with queue "${queueId}"`)
  }

  async close(): Promise<void> {
    await this.connection?.close()
    await this.channel?.close()

    this.connection = undefined
    this.channel = undefined
  }
}

export const rmqPubSub = new RabbitMQPubSub({
  exchange: 'domain-events',
  url: 'amqp://guest:guest@localhost:5672'
})
