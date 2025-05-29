import { Event } from '@/interfaces/domain/event'
import { OrderStatus } from '@/types/order'
import { z } from 'zod'
import { OrderItem } from '../entities/order-item'
import { PayingOrderError, ProcessingOrderError } from '../errors/order-errors'
import { IDService } from '../services/id-service.service'

const partialOrderPropsSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'ID must be a string.'
    })
    .optional(),
  status: z
    .string({
      invalid_type_error: 'Status must be a string.'
    })
    .optional(),
  createdAt: z
    .date({
      invalid_type_error: 'Created at must be a date.'
    })
    .optional(),
  updatedAt: z
    .date({
      invalid_type_error: 'Updated at must be a date.'
    })
    .optional(),
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

  // --- static methods ---

  static create(props: RequiredOrderProps) {
    return new Order({ ...props })
  }

  static restore(props: Required<OrderProps>) {
    const parsed = orderPropsSchema.required().parse(props)
    return new Order(parsed)
  }

  // --- private methods ---

  private validate() {
    orderPropsSchema.parse(this.props)
  }

  private touch() {
    this.props.updatedAt = new Date()
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

  // --- public methods ---

  public pullEvents() {
    const events = this.events
    this.events = []
    return events
  }

  public toJSON() {
    return {
      ...this.props,
      items: [...this.itemsSet]
    }
  }

  public isOrderEmpty() {
    return this.itemsSet.size === 0
  }

  public async pay() {
    if (this.isOrderEmpty()) throw new PayingOrderError('Order has no items.')

    this.updateStatus('PAID')

    this.events.push({
      name: 'order.paid',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        action: 'paid'
      }
    })
  }

  public async process() {
    if (this.isOrderEmpty())
      throw new ProcessingOrderError('Order has no items.')

    this.updateStatus('PROCESSING')

    this.events.push({
      name: 'order.processing.started',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        action: 'processing'
      }
    })

    // await wait(3000)

    this.events.push({
      name: 'order.processing.finished',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        action: 'process finished'
      }
    })
  }

  public removeItem(item: OrderItem) {
    if (this.isOrderEmpty()) return
    if (!this.itemsSet.has(item)) return

    this.itemsSet.delete(item)
    this.recalculateTotalAmount()
    this.touch()

    this.events.push({
      name: 'order.item.removed',
      occurredAt: new Date(),
      payload: {
        orderId: this.id,
        item: item.toJSON()
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

  // --- getters ---

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
