export class OrderNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Order not found.')
  }
}
