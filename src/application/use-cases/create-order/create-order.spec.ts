import { Customer } from '@/domain/entities/customer'
import { Product } from '@/domain/entities/product'
import { toCents } from '@/shared/utils/to-cents'
import {
  IDependencies,
  makeDependencies
} from '@/tests/helpers/make-dependencies'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateOrder } from './create-order'

describe('CreateOrder Use Case', () => {
  let useCase: CreateOrder
  let customer: Customer
  let product: Product
  let dependencies: IDependencies
  let spy: any

  beforeEach(() => {
    dependencies = makeDependencies()
    spy = vi.spyOn(dependencies.pubsub, 'publish')
    customer = Customer.create({
      username: 'test',
      email: 'm5oCt@example.com',
      balanceInCents: 0
    })
    product = Product.create({
      title: 'iPhone X',
      summary:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      priceInCents: toCents(999.9),
      currency: 'USD',
      stockQuantity: 20
    })
    useCase = new CreateOrder(
      dependencies.customerRepo,
      dependencies.productRepo,
      dependencies.orderRepo,
      dependencies.pubsub
    )
  })

  it('should create an valid order', async () => {
    await dependencies.customerRepo.save(customer)
    await dependencies.productRepo.save(product)

    const order = await useCase.execute({
      customerId: customer.id,
      items: [
        {
          productId: product.id,
          quantity: 1
        }
      ]
    })

    expect(spy).toHaveBeenCalled()
    expect(order).toBeTruthy()
  })

  it("should throw if customer doesn't exist", async () => {
    await expect(() =>
      useCase.execute({
        customerId: 'invalid-customer-id',
        items: [
          {
            productId: product.id,
            quantity: 1
          }
        ]
      })
    ).rejects.toThrow()
  })

  it("should throw if product doesn't exist", async () => {
    await dependencies.customerRepo.save(customer)

    await expect(() =>
      useCase.execute({
        customerId: customer.id,
        items: [
          {
            productId: 'invalid-product-id',
            quantity: 1
          }
        ]
      })
    ).rejects.toThrow()
  })

  it('should throw if product is not available', async () => {
    await dependencies.customerRepo.save(customer)

    const product2 = Product.create({
      title: 'iPhone X',
      summary:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      priceInCents: toCents(9999),
      currency: 'USD',
      stockQuantity: 0
    })

    await dependencies.productRepo.save(product2)

    await expect(() =>
      useCase.execute({
        customerId: customer.id,
        items: [
          {
            productId: product2.id,
            quantity: 1
          }
        ]
      })
    ).rejects.toThrow()
  })
})
