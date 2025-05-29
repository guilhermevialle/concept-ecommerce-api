import { MemoryCustomerRepository } from '@/infra/repositories/memory/memory-customer.repository'
import { MemoryOrderRepository } from '@/infra/repositories/memory/memory-order.repository'
import { MemoryProductRepository } from '@/infra/repositories/memory/memory-product.repository'
import { MailService } from '@/infra/services/mail.service'
import { IMailService } from '@/interfaces/infra/services/mail'

export type IDependencies = {
  customerRepo: MemoryCustomerRepository
  orderRepo: MemoryOrderRepository
  productRepo: MemoryProductRepository
  mailService: IMailService
}

export const makeDependencies = (): IDependencies => {
  const customerRepo = new MemoryCustomerRepository()
  const orderRepo = new MemoryOrderRepository()
  const productRepo = new MemoryProductRepository()
  const mailService = new MailService()

  return { customerRepo, orderRepo, productRepo, mailService }
}
