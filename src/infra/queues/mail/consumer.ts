import { createConnection } from '@/infra/providers/rabbitmq/connection'
import { sendMailJob } from './job'

export async function consumer(queue: string) {
  const connection = await createConnection()
  const channel = await connection.createChannel()

  await channel.assertQueue(queue, { durable: true })

  console.log(`[*] Waiting for messages in ${queue}`)

  channel.consume(queue, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString())

      try {
        await sendMailJob(content)
        channel.ack(msg)
      } catch (error) {
        console.error('Job failed:', error)
        channel.nack(msg, false, false)
      }
    }
  })
}
