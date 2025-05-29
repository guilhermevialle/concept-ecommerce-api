import { CustomerNotFoundError } from '@/application/errors/customer-errors'
import { Order } from '@/domain/aggregates/order'
import { ICustomerRepository } from '@/interfaces/infra/repositories/customer'
import { IOrderRepository } from '@/interfaces/infra/repositories/order'

interface ListCustomerOrdersRequest {
  customerId: string
}

type ListCustomerOrdersResponse = Order[]

export class ListCustomerOrders {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly orderRepo: IOrderRepository
  ) {}

  async execute({
    customerId
  }: ListCustomerOrdersRequest): Promise<ListCustomerOrdersResponse> {
    const customer = await this.customerRepo.findById(customerId)

    if (!customer)
      throw new CustomerNotFoundError(`Customer ${customerId} found.`)

    const orders = await this.orderRepo.findManyByCustomerId(customerId)

    return orders
  }
}
