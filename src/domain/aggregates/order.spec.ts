import { beforeEach, describe, expect, it } from 'vitest'
import { OrderItem } from '../entities/order-item'
import { Order, RequiredOrderProps } from './order'

const orderItem = OrderItem.create({
  orderId: '1',
  productId: '1',
  quantity: 1,
  unitPriceInCents: 100
})

const props: RequiredOrderProps = {
  customerId: '1',
  items: [orderItem]
}

describe('Order Entity', () => {
  let order: Order

  beforeEach(() => {
    order = Order.create({
      ...props
    })
  })

  it('should be able to create an order', () => {
    expect(order).toBeInstanceOf(Order)
    expect(order.toJSON()).toStrictEqual({
      id: expect.any(String),
      customerId: '1',
      status: 'PENDING',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      items: [orderItem],
      totalAmountInCents: 100
    })
  })

  it('should throw if is missing props to create', () => {
    expect(() => Order.create({} as any)).toThrow()
  })

  it('should throw if is missing props to restore', () => {
    expect(() => Order.restore({} as any)).toThrow()
  })

  it('it should simulate order payment', async () => {
    await order.pay()
    expect(order.status).toBe('PAID')
  })

  it('it should simulate order processing', async () => {
    await order.process()
    expect(order.status).toBe('PROCESSING')
  })
})
