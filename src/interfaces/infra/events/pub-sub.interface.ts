import { DomainEvent } from '@/domain/events/domain.event'

export interface IPubSub {
  publish<Payload>(event: DomainEvent<Payload>): Promise<void>
  subscribe<Payload>(
    event: string,
    handler: (content: { payload: Payload }) => Promise<void>,
    options?: { service?: string }
  ): Promise<void>
  connect(): Promise<void>
  close(): Promise<void>
}
