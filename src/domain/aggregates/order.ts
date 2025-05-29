import { OrderStatus } from '@/types/order'
import { z } from 'zod'
import { OrderItem } from '../entities/order-item'
import { IDService } from '../services/id.service'

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
  id: z
    .string({
      invalid_type_error: 'ID must be a string.'
    })
    .optional(),
  customerId: z
    .string({
      required_error: 'Customer ID is required.',
      invalid_type_error: 'Customer ID must be a string.'
    })
    .min(1, 'Customer ID cannot be empty.'),

  items: z
    .array(z.instanceof(OrderItem), {
      required_error: 'Order items are required.',
      invalid_type_error: 'Items must be an array of OrderItem.'
    })
    .nonempty('Order items cannot be empty.')
})

export type RequiredOrderProps = z.infer<typeof requiredOrderPropsSchema>

export const orderPropsSchema = partialOrderPropsSchema.merge(
  requiredOrderPropsSchema
)

type OrderProps = z.infer<typeof orderPropsSchema>

export class Order {
  private props: OrderProps
  private itemsSet: Set<OrderItem>

  private constructor(props: OrderProps) {
    this.props = {
      ...props,
      id: props.id ?? IDService.generate(),
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      totalAmountInCents:
        props.totalAmountInCents ??
        props.items.reduce((acc, item) => acc + item.getTotalAmount(), 0)
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
    orderPropsSchema.shape.status.parse(status)

    this.props.status = status
    this.touch()
  }

  // public methods
  public toJSON() {
    return {
      ...this.props,
      items: [...this.itemsSet]
    }
  }

  public async pay() {
    this.updateStatus('PAID')
  }

  public async process() {
    this.updateStatus('PROCESSING')
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
