import { Order } from './domain/aggregates/order'
import { OrderItem } from './domain/entities/order-item'

async function run() {
  try {
    const order = Order.create({
      customerId: '1',
      items: []
    })

    const item = OrderItem.create({
      orderId: order.id,
      productId: '1',
      quantity: 1,
      unitPriceInCents: 100
    })

    order.addItem(item)

    console.log(order.toJSON())
  } catch (error: any) {
    console.log({
      name: error.name,
      message: error.message
    })
  }
}

run()
