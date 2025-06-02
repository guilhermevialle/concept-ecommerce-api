import { CustomerNotFoundError } from '@/application/errors/customer-errors'
import {
  ProductNotAvailableError,
  ProductNotFoundError
} from '@/application/errors/product-errors'
import { Order, orderPropsSchema } from '@/domain/aggregates/order'
import { OrderItem } from '@/domain/entities/order-item'
import { OrderCreatedEvent } from '@/domain/events/order/order-created.event'
import { IDService } from '@/domain/services/id.service'
import { IPubSub } from '@/interfaces/infra/events/pub-sub.interface'
import { ICustomerRepository } from '@/interfaces/repositories/customer.interface'
import { IOrderRepository } from '@/interfaces/repositories/order.interface'
import { IProductRepository } from '@/interfaces/repositories/product.interface'
import { z } from 'zod'

interface CreateOrderRequest {
  customerId: string
  items: {
    productId: string
    quantity: number
  }[]
}

type OrderItems = z.infer<typeof orderPropsSchema.shape.items>

type CreateOrderResponse = Order

export class CreateOrder {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly productRepo: IProductRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly pubsub: IPubSub
  ) {}

  async execute({
    customerId,
    items
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const customer = await this.customerRepo.findById(customerId)
    const orderItems = []
    const orderId = IDService.generate()

    if (!customer)
      throw new CustomerNotFoundError(`Customer ${customerId} not found.`)

    for (const item of items) {
      const product = await this.productRepo.findById(item.productId)

      if (!product)
        throw new ProductNotFoundError(`Product ${item.productId} not found.`)

      const isProductAvailable = product.isAvailable()

      if (!isProductAvailable)
        throw new ProductNotAvailableError(
          `Product ${product.id} is not available.`
        )

      orderItems.push(
        OrderItem.create({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPriceInCents: product.priceInCents,
          snapshotTitle: product.title
        })
      )
    }

    const order = Order.create({
      id: orderId,
      customerId,
      items: orderItems as OrderItems
    })

    await this.orderRepo.save(order)

    const orderCreatedEvent = new OrderCreatedEvent({
      aggregateId: order.id,
      occurredOn: new Date(),
      payload: {
        order: {
          id: order.id,
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPriceInCents: item.unitPriceInCents
          })),
          totalAmountInCents: order.totalAmountInCents
        },
        customer: {
          id: customer.id,
          username: customer.username,
          email: customer.email
        }
      }
    })

    await this.pubsub.publish(orderCreatedEvent)

    return order
  }
}
