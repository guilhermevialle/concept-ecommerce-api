export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FINISHED'
  | 'EXPIRED'
  | 'PAID'

export const ORDER_STATUS: OrderStatus[] = [
  'PENDING',
  'PAID',
  'CANCELLED',
  'SHIPPED',
  'DELIVERED'
]
