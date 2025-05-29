import { Order } from '@/domain/aggregates/order'

export interface IOrderRepository {
  save: (order: Order) => Promise<void>
  findById: (id: string) => Promise<Order | null>
  findManyByCustomerId: (id: string) => Promise<Order[]>
  update: (order: Order) => Promise<void>
  clear: () => void
}
