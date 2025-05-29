import { CustomerAlreadyExistsError } from '@/application/errors/customer-errors'
import { Customer, RequiredCustomerProps } from '@/domain/entities/customer'
import { ICustomerRepository } from '@/interfaces/repositories/customer'

type CreateCustomerRequest = RequiredCustomerProps & {}

type CreateCustomerResponse = Customer

export class CreateCustomer {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute({
    username,
    balanceInCents
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customerExists = await this.customerRepo.findByUsername(username)

    if (customerExists)
      throw new CustomerAlreadyExistsError(
        'Username already used by another customer.'
      )

    const customer = Customer.create({ username, balanceInCents })

    await this.customerRepo.save(customer)

    return customer
  }
}
