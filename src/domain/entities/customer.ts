import { Event } from '@/interfaces/domain/event'
import { z } from 'zod'
import { IDService } from '../services/id.service'

const partialCustomerPropsSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'ID must be a string.'
    })
    .optional(),
  createdAt: z
    .date({
      invalid_type_error: 'Created at must be a date.'
    })
    .optional()
})

const requiredCustomerPropsSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required.',
      invalid_type_error: 'Username must be a string.'
    })
    .min(3, 'Username must be at least 3 characters.')
    .max(64, 'Username must be at most 64 characters.'),
  email: z
    .string({
      required_error: 'Email is required.',
      invalid_type_error: 'Email must be a string.'
    })
    .email('Email must be a valid email.')
    .max(255, 'Email must be at most 255 characters.'),
  balanceInCents: z
    .number({
      required_error: 'Balance is required.',
      invalid_type_error: 'Balance must be a number.'
    })
    .min(0, 'Balance must be at least $0.')
    .max(100_000_000, 'Balance must be at most $100,000,000.')
})

export type RequiredCustomerProps = z.infer<typeof requiredCustomerPropsSchema>

const customerPropsSchema = partialCustomerPropsSchema.merge(
  requiredCustomerPropsSchema
)

type CustomerProps = z.infer<typeof customerPropsSchema>

export class Customer {
  private props: CustomerProps
  private events: Event[] = []

  private constructor(props: CustomerProps) {
    this.props = {
      ...props,
      id: props.id ?? IDService.generate(),
      createdAt: props.createdAt ?? new Date()
    }

    this.validate()
  }

  private validate() {
    customerPropsSchema.parse(this.props)
  }

  static create(props: RequiredCustomerProps) {
    return new Customer({ ...props })
  }

  static restore(props: Required<CustomerProps>) {
    const parsed = customerPropsSchema.required().parse(props)
    return new Customer(parsed)
  }

  public toJSON() {
    return this.props
  }

  // Getters
  get id() {
    return this.props.id!
  }

  get username() {
    return this.props.username
  }

  get email() {
    return this.props.email
  }

  get balanceInCents() {
    return this.props.balanceInCents
  }

  get createdAt() {
    return this.props.createdAt!
  }
}
