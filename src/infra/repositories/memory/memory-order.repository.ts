import { Order } from '@/domain/aggregates/order'
import { IOrderRepository } from '@/interfaces/repositories/order'

export class MemoryOrderRepository implements IOrderRepository {
  private storage: Order[] = []

  async save(order: Order): Promise<void> {
    this.storage.push(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.storage.find((order) => order.id === id)
    return order ?? null
  }

  async findManyByCustomerId(id: string): Promise<Order[]> {
    const results = this.storage.filter((order) => order.customerId === id)
    return results
  }

  async update(order: Order): Promise<void> {
    const index = this.storage.findIndex((order) => order.id === order.id)
    this.storage[index] = order
  }

  async clear() {
    this.storage = []
  }
}
