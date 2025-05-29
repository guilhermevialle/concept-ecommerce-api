import { CustomerAlreadyExistsError } from '@/application/errors/customer-errors'
import { Customer } from '@/domain/entities/customer'
import { ICustomerRepository } from '@/interfaces/infra/repositories/customer'

type CreateCustomerRequest = {
  username: string
  email: string
}

type CreateCustomerResponse = Customer

export class CreateCustomer {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute({
    username,
    email
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customerExists = await this.customerRepo.findByUsername(username)

    if (customerExists)
      throw new CustomerAlreadyExistsError(
        'Username already used by another customer.'
      )

    const emailExists = await this.customerRepo.findByEmail(email)

    if (emailExists)
      throw new CustomerAlreadyExistsError(
        'Email already used by another customer.'
      )

    const customer = Customer.create({
      username,
      email,
      balanceInCents: 0
    })

    await this.customerRepo.save(customer)

    return customer
  }
}
