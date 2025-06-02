import { rmqPubSub } from '@/infra/events/rabbitmq/rabbitmq-pub-sub'
import { MemoryCustomerRepository } from '@/infra/repositories/memory/memory-customer.repository'
import { MemoryOrderRepository } from '@/infra/repositories/memory/memory-order.repository'
import { MemoryProductRepository } from '@/infra/repositories/memory/memory-product.repository'
import { MailService } from '@/infra/services/mail.service'
import { IPubSub } from '@/interfaces/infra/events/pub-sub.interface'
import { IMailService } from '@/interfaces/services/mail.interface'

export type IDependencies = {
  customerRepo: MemoryCustomerRepository
  orderRepo: MemoryOrderRepository
  productRepo: MemoryProductRepository
  mailService: IMailService
  pubsub: IPubSub
}

export const makeDependencies = (): IDependencies => {
  const customerRepo = new MemoryCustomerRepository()
  const orderRepo = new MemoryOrderRepository()
  const productRepo = new MemoryProductRepository()
  const mailService = new MailService()
  const pubsub = rmqPubSub

  return { customerRepo, orderRepo, productRepo, mailService, pubsub }
}
