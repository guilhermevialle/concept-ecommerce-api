export interface DomainEventProps<Payload> {
  aggregateId: string
  payload: Payload
}

export abstract class DomainEvent<Payload> {
  readonly aggregateId: string
  readonly occurredOn: Date = new Date()
  readonly payload: Payload

  constructor({ aggregateId, payload }: DomainEventProps<Payload>) {
    this.aggregateId = aggregateId
    this.payload = payload
  }

  abstract type(): string
}
