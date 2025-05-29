import { createConnection } from '@/infra/providers/rabbitmq/connection'

export async function sendToQueue(queue: string, data: unknown) {
  const connection = await createConnection()
  const channel = await connection.createChannel()
  await channel.assertQueue(queue, {
    durable: true
  })

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
    persistent: true
  })

  console.log(`[x] Sent to ${queue}:`, data)

  await channel.close()
  await connection.close()
}
