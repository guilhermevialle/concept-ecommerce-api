import { Order } from '@/domain/aggregates/order'

export interface IOrderRepository {
  save: (order: Order) => Promise<void>
  find: (id: string) => Promise<Order | null>
  update: (order: Order) => Promise<void>
}
