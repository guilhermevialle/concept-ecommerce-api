import { describe, expect, it } from 'vitest'
import { OrderItem } from './order-item'

describe('Order Item Entity', () => {
  it('should create a valid order item (with ID either)', () => {
    expect(() =>
      OrderItem.create({
        orderId: '1',
        productId: '1',
        unitPriceInCents: 1000,
        quantity: 1
      })
    ).not.toThrow()
  })

  it('should throw if orderId is not provided', () => {
    expect(() =>
      OrderItem.create({
        productId: '1',
        unitPriceInCents: 1000,
        quantity: 1
      } as any)
    ).toThrow()
  })

  it('should throw if productId is not provided', () => {
    expect(() =>
      OrderItem.create({
        orderId: '1',
        unitPriceInCents: 1000,
        quantity: 1
      } as any)
    ).toThrow()
  })

  it('should throw if unitPriceInCents is not provided', () => {
    expect(() =>
      OrderItem.create({
        orderId: '1',
        productId: '1',
        quantity: 1
      } as any)
    ).toThrow()
  })

  it('should throw if quantity is not provided', () => {
    expect(() =>
      OrderItem.create({
        orderId: '1',
        productId: '1',
        unitPriceInCents: 1000
      } as any)
    ).toThrow()
  })

  it('should restore a valid order item', () => {
    const orderItem = OrderItem.restore({
      id: '1',
      orderId: '1',
      productId: '1',
      quantity: 1,
      unitPriceInCents: 1000
    })

    expect(orderItem.id).toBeDefined()
  })
})
