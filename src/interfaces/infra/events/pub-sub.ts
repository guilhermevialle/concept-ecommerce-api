import { DomainEvent } from '@/domain/events/domain-event'
import { EventHandler } from '@/types/event-handler'

export interface IPubSub {
  publish<Payload>(event: DomainEvent<Payload>): Promise<void>
  subscribe<Payload>(
    eventName: string,
    handler: EventHandler<Payload>,
    options?: {
      service?: string
    }
  ): Promise<void>
  close(): Promise<void>
}
