import { Customer } from '@/domain/entities/customer'

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>
  findById(id: string): Promise<Customer | null>
  findByUsername(username: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  update(customer: Customer): Promise<void>
  clear(): Promise<void>
}
