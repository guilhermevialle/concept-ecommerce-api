import { z } from 'zod'
import { IDService } from '../services/id.service'

const partialOrderItemPropsSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'id must be a string.'
    })
    .optional()
})

const requiredOrderPropsSchema = z.object({
  orderId: z
    .string({
      invalid_type_error: 'orderId must be a string.',
      required_error: 'orderId is required.'
    })
    .min(1),
  productId: z.string({
    invalid_type_error: 'productId must be a string.',
    required_error: 'productId is required.'
  }),
  quantity: z
    .number({
      invalid_type_error: 'quantity must be a number.',
      required_error: 'quantity is required.'
    })
    .min(1, 'Quantity must be at least 1.')
    .max(20, 'Quantity must be at most 20.'),
  unitPriceInCents: z
    .number({
      invalid_type_error: 'unitPriceInCents must be a number.',
      required_error: 'unitPriceInCents is required.'
    })
    .min(100, 'Unit price must be at least $1.'),
  snapshotTitle: z
    .string({
      required_error: 'name is required.',
      invalid_type_error: 'name must be a string.'
    })
    .min(3, 'name must be at least 3 characters.')
    .max(150, 'name must be at most 150 characters.')
})

export type RequiredOrderItemProps = z.infer<typeof requiredOrderPropsSchema>

export const orderItemPropsSchema = partialOrderItemPropsSchema.merge(
  requiredOrderPropsSchema
)

type OrderItemProps = z.infer<typeof orderItemPropsSchema>

export class OrderItem {
  private props: OrderItemProps

  constructor(props: OrderItemProps) {
    this.props = {
      ...props,
      id: props.id ?? IDService.generate()
    }

    this.validate()
  }

  // private methods
  private validate() {
    orderItemPropsSchema.parse(this.props)
  }

  // static methods
  static create(props: RequiredOrderItemProps) {
    return new OrderItem({ ...props })
  }

  static restore(props: Required<OrderItemProps>) {
    const parsed = orderItemPropsSchema.required().parse(props)
    return new OrderItem(parsed)
  }

  // public methods
  public incrementQuantity(amount: number) {
    this.props.quantity += amount
  }

  public getTotalAmount() {
    return this.props.quantity * this.props.unitPriceInCents
  }

  public toJSON() {
    return this.props
  }

  // getters
  get id() {
    return this.props.id!
  }

  get orderId() {
    return this.props.orderId!
  }

  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  get unitPriceInCents() {
    return this.props.unitPriceInCents
  }

  get snapshotTitle() {
    return this.props.snapshotTitle
  }
}
