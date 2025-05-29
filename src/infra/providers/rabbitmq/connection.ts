import amqp from 'amqplib'
import { RABBIT_URL } from './config'

export async function createConnection() {
  return amqp.connect(RABBIT_URL)
}
