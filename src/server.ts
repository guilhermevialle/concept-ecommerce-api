import { Order } from './domain/aggregates/order'
import { Customer } from './domain/entities/customer'
import { OrderItem } from './domain/entities/order-item'
import { Product } from './domain/entities/product'
import { fromCents } from './utils/from-cents'
import { toCents } from './utils/to-cents'

async function run() {
  app()
  try {
  } catch (error: any) {
    console.log({
      name: error.name,
      message: error.message
    })
  }
}

run()

async function app() {
  console.log('🚀 Starting app...\n')

  const customer = Customer.create({ username: 'John Doe' })
  console.log('👤 Customer created:')
  console.log(JSON.stringify(customer, null, 2), '\n')

  const iphoneX = Product.create({
    title: 'iPhone X',
    summary:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    priceInCents: toCents(999.9),
    currency: 'USD',
    stockQuantity: 99
  })

  const samsungS8 = Product.create({
    title: 'Samsung S8',
    summary:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    priceInCents: toCents(1099.9),
    currency: 'USD',
    stockQuantity: 99
  })

  console.log('📦 Products created:')
  console.log(JSON.stringify([iphoneX, samsungS8], null, 2), '\n')

  const order = Order.create({
    customerId: customer.id,
    items: []
  })

  console.log('🛒 Order created:')
  ;[iphoneX, samsungS8].forEach((product) => {
    order.addItem(
      OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        unitPriceInCents: product.priceInCents
      })
    )
  })

  console.log('➕ Added item to order:')
  console.log(JSON.stringify(order.items, null, 2), '\n')
  console.log(
    JSON.stringify(fromCents(order.totalAmountInCents), null, 2),
    '\n'
  )

  samsungS8.updatePrice(toCents(1))
  console.log('📦 Product updated:')
  console.log(JSON.stringify(samsungS8, null, 2), '\n')
  console.log(JSON.stringify(fromCents(samsungS8.priceInCents), null, 2), '\n')

  console.log('✅ App finished.')
}
