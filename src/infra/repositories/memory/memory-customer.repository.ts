import { Customer } from '@/domain/entities/customer'
import { ICustomerRepository } from '@/interfaces/infra/repositories/customer'

export class MemoryCustomerRepository implements ICustomerRepository {
  private storage: Customer[] = []

  async save(customer: Customer): Promise<void> {
    this.storage.push(customer)
  }

  async findByUsername(username: string): Promise<Customer | null> {
    const customer = this.storage.find(
      (customer) => customer.username === username
    )
    return customer ?? null
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.storage.find((customer) => customer.email === email)
    return customer ?? null
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.storage.find((customer) => customer.id === id)
    return customer ?? null
  }

  async update(customer: Customer): Promise<void> {
    const index = this.storage.findIndex(
      (customer) => customer.id === customer.id
    )
    this.storage[index] = customer
  }

  async clear(): Promise<void> {
    this.storage = []
  }
}
