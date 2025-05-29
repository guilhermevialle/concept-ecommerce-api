import { Order } from '@/domain/aggregates/order'
import { Customer } from '@/domain/entities/customer'
import { OrderItem } from '@/domain/entities/order-item'
import { IDService } from '@/domain/services/id.service'
import {
  IDependencies,
  makeDependencies
} from '@/tests/helpers/make-dependencies'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListCustomerOrders } from './list-customer-orders'

describe('ListCustomerOrders Use Case', () => {
  let useCase: ListCustomerOrders
  let dependencies: IDependencies
  let customer: Customer

  beforeEach(() => {
    customer = Customer.create({
      username: 'test',
      balanceInCents: 0
    })
    dependencies = makeDependencies()
    useCase = new ListCustomerOrders(
      dependencies.customerRepo,
      dependencies.orderRepo
    )
  })

  it("should list customer's orders (not empty)", async () => {
    await dependencies.customerRepo.save(customer)

    const orderId = IDService.generate()

    const order = Order.create({
      id: orderId,
      customerId: customer.id,
      items: [
        OrderItem.create({
          orderId,
          productId: '1',
          quantity: 1,
          unitPriceInCents: 100
        })
      ]
    })

    await dependencies.orderRepo.save(order)

    const orders = await useCase.execute({ customerId: customer.id })

    expect(orders).toHaveLength(1)
  })

  it("should list customer's orders (empty)", async () => {
    await dependencies.customerRepo.save(customer)

    const orders = await useCase.execute({ customerId: customer.id })

    expect(orders).toHaveLength(0)
  })

  it("should throw if customer doesn't exist", async () => {
    await expect(() =>
      useCase.execute({ customerId: 'invalid-customer-id' })
    ).rejects.toThrow()
  })
})
