import { Order } from '@/domain/aggregates/order'
import { IOrderRepository } from '@/interfaces/repositories/order'

export class MemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = []

  async save(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async find(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id)
    return order ?? null
  }

  async update(order: Order): Promise<void> {
    const index = this.orders.findIndex((order) => order.id === order.id)
    this.orders[index] = order
  }
}
