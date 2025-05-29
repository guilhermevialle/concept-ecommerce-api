import { MemoryCustomerRepository } from '@/infra/repositories/memory/memory-customer.repository'
import { MemoryOrderRepository } from '@/infra/repositories/memory/memory-order.repository'
import { MemoryProductRepository } from '@/infra/repositories/memory/memory-product.repository'

export type IDependencies = {
  customerRepo: MemoryCustomerRepository
  orderRepo: MemoryOrderRepository
  productRepo: MemoryProductRepository
}

export const makeDependencies = (): IDependencies => {
  const customerRepo = new MemoryCustomerRepository()
  const orderRepo = new MemoryOrderRepository()
  const productRepo = new MemoryProductRepository()

  return { customerRepo, orderRepo, productRepo }
}
