import { Event } from '@/interfaces/domain/event'
import { OrderStatus } from '@/types/order'
import { wait } from '@/utils/wait'
import { z } from 'zod'
import { OrderItem } from '../entities/order-item'
import { IDService } from '../services/id-service.service'

const partialOrderPropsSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  totalAmountInCents: z
    .number({
      invalid_type_error: 'Total amount must be a number.',
      required_error: 'Total amount is required.'
    })
    .nonnegative('Total amount cannot be negative.')
    .optional()
})

const requiredOrderPropsSchema = z.object({
  customerId: z
    .string({
      required_error: 'Customer ID is required.',
      invalid_type_error: 'Customer ID must be a string.'
    })
    .min(1, 'Customer ID cannot be empty.'),

  items: z.array(z.instanceof(OrderItem), {
    required_error: 'Order items are required.',
    invalid_type_error: 'Items must be an array of OrderItem.'
  })
})

type RequiredOrderProps = z.infer<typeof requiredOrderPropsSchema>

const orderPropsSchema = partialOrderPropsSchema.merge(requiredOrderPropsSchema)

type OrderProps = z.infer<typeof orderPropsSchema>

export class Order {
  private props: OrderProps
  private itemsSet: Set<OrderItem>
  private events: Event[] = []

  private constructor(props: OrderProps) {
    this.props = {
      ...props,
      id: props.id ?? IDService.generate(),
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      totalAmountInCents:
        props.totalAmountInCents ??
        (props.items.length > 0
          ? props.items.reduce((acc, item) => acc + item.getTotalAmount(), 0)
          : 0)
    }

    this.itemsSet = new Set(this.props.items)
    this.validate()
  }

  private validate() {
    orderPropsSchema.parse(this.props)
  }

  static create(props: RequiredOrderProps) {
    return new Order({ ...props })
  }

  static restore(props: Required<OrderProps>) {
    const parsed = orderPropsSchema.required().parse(props)
    return new Order(parsed)
  }

  // domain methods
  public touch() {
    this.props.updatedAt = new Date()
  }

  public pullEvents() {
    const events = this.events
    this.events = []
    return events
  }

  public async process() {
    this.updateStatus('PROCESSING')

    this.events.push({
      name: 'order.processing.started',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        action: 'processing'
      }
    })

    await wait(3000)

    this.events.push({
      name: 'order.processing.finished',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        action: 'process finished'
      }
    })
  }

  public addItem(item: OrderItem) {
    const existingItem = [...this.itemsSet].find(
      (existing) =>
        existing.productId === item.productId &&
        existing.orderId === item.orderId
    )

    if (existingItem) {
      existingItem.incrementQuantity(item.quantity)
      this.recalculateTotalAmount()
      this.touch()

      this.events.push({
        name: 'order.item.incremented',
        occurredAt: new Date(),
        payload: {
          orderId: this.id,
          item: item.toJSON()
        }
      })

      return
    }

    this.itemsSet.add(item)
    this.recalculateTotalAmount()
    this.touch()

    this.events.push({
      name: 'order.item.added',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        item: item.toJSON()
      }
    })
  }

  private recalculateTotalAmount() {
    this.props.totalAmountInCents = [...this.itemsSet].reduce(
      (acc, item) => acc + item.getTotalAmount(),
      0
    )
  }

  private updateStatus(status: OrderStatus) {
    if (!status || typeof status !== 'string' || status.trim().length === 0)
      throw new Error('Invalid order status.')

    this.props.status = status
    this.touch()

    this.events.push({
      name: 'order.status.updated',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        status
      }
    })
  }

  public toJSON() {
    return {
      ...this.props,
      items: [...this.itemsSet]
    }
  }

  // Getters
  get id() {
    return this.props.id!
  }

  get customerId() {
    return this.props.customerId
  }

  get items() {
    return [...this.itemsSet]
  }

  get totalAmountInCents() {
    return this.props.totalAmountInCents!
  }

  get status() {
    return this.props.status!
  }

  get createdAt() {
    return this.props.createdAt!
  }

  get updatedAt() {
    return this.props.updatedAt!
  }
}
