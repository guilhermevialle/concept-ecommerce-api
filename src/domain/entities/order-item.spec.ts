import { beforeEach, describe, expect, it } from 'vitest'
import { OrderItem } from './order-item'

const props = {
  orderId: '1',
  productId: '1',
  quantity: 1,
  unitPriceInCents: 100,
  snapshotTitle: 'Product 1'
}

describe('OrderItem Entity', () => {
  let orderItem: OrderItem

  beforeEach(() => {
    orderItem = OrderItem.create({
      ...props
    })
  })

  it('should be able to create an order item', () => {
    expect(orderItem).toBeInstanceOf(OrderItem)
    expect(orderItem.toJSON()).toStrictEqual({
      id: expect.any(String),
      ...props
    })
  })

  it('should throw if is missing props to create', () => {
    expect(() => OrderItem.create({} as any)).toThrow()
  })

  it('should throw if is missing props to restore', () => {
    expect(() => OrderItem.restore({} as any)).toThrow()
  })

  it('should increment quantity', () => {
    orderItem.incrementQuantity(1)
    expect(orderItem.quantity).toBe(2)
  })

  it('should get total amount', () => {
    expect(orderItem.getTotalAmount()).toBe(100)
  })
})
