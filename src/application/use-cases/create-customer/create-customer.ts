import { Customer, RequiredCustomerProps } from '@/domain/entities/customer'

type CreateCustomerRequest = RequiredCustomerProps & {}

type CreateCustomerResponse = Customer

export class CreateCustomer {
  constructor() {}

  async execute({
    username,
    balanceInCents
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customer = Customer.create({ username, balanceInCents })

    return customer
  }
}
