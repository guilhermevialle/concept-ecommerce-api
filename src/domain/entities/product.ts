import { z } from 'zod'
import { IDService } from '../services/id.service'

const optionalProductPropsSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'id must be a string.'
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
    .optional()
})

const requiredProductPropsSchema = z.object({
  title: z
    .string({
      required_error: 'name is required.',
      invalid_type_error: 'name must be a string.'
    })
    .min(3, 'name must be at least 3 characters.')
    .max(150, 'name must be at most 150 characters.'),
  summary: z
    .string({
      required_error: 'summary is required.',
      invalid_type_error: 'summary must be a string.'
    })
    .min(8, 'summary must be at least 3 characters.')
    .max(200, 'summary must be at most 1000 characters.'),
  priceInCents: z
    .number({
      required_error: 'priceInCents is required.',
      invalid_type_error: 'priceInCents must be a number.'
    })
    .min(100, 'Price must be at least $1.'),
  currency: z
    .string({
      required_error: 'currency is required.',
      invalid_type_error: 'currency must be ISO code string.'
    })
    .length(3),
  stockQuantity: z.number({
    required_error: 'stockQuantity is required.',
    invalid_type_error: 'stockQuantity must be a number.'
  })
})

type RequiredProductProps = z.infer<typeof requiredProductPropsSchema>

const productPropsSchema = optionalProductPropsSchema.merge(
  requiredProductPropsSchema
)

type ProductProps = z.infer<typeof productPropsSchema>

export class Product {
  private props: ProductProps

  private constructor(props: any) {
    this.props = {
      ...props,
      id: props.id ?? IDService.generate()
    }

    this.validate()
  }

  // private methods
  private validate() {
    productPropsSchema.parse(this.props)
  }

  // static methods
  static create(props: RequiredProductProps) {
    return new Product({ ...props })
  }

  static restore(props: Required<ProductProps>) {
    const parsed = productPropsSchema.required().parse(props)
    return new Product(parsed)
  }

  // public methods
  public toJSON() {
    return this.props
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  public isAvailable() {
    return this.stockQuantity > 0
  }

  public updateStockQuantity(stockQuantity: number) {
    requiredProductPropsSchema.shape.stockQuantity.parse(stockQuantity)

    this.props.stockQuantity = stockQuantity
    this.touch()
  }

  public updatePrice(priceInCents: number) {
    requiredProductPropsSchema.shape.priceInCents.parse(priceInCents)

    this.props.priceInCents = priceInCents
    this.touch()
  }

  // getters
  get id() {
    return this.props.id!
  }

  get title() {
    return this.props.title
  }

  get summary() {
    return this.props.summary
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  get currency() {
    return this.props.currency
  }

  get stockQuantity() {
    return this.props.stockQuantity
  }

  get createdAt() {
    return this.props.createdAt!
  }

  get updatedAt() {
    return this.props.updatedAt!
  }
}
