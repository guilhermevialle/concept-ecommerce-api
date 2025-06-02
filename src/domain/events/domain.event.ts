export interface DomainEventProps<PayloadType> {
  aggregateId: string
  occurredOn?: Date
  payload: PayloadType
}

export abstract class DomainEvent<PayloadType> {
  private props: DomainEventProps<PayloadType>
  abstract type(): string

  constructor(props: DomainEventProps<PayloadType>) {
    this.props = {
      ...props,
      occurredOn: props.occurredOn ?? new Date()
    }
  }

  public toJSON() {
    return this.props
  }

  get aggregateId() {
    return this.props.aggregateId
  }

  get occurredOn() {
    return this.props.occurredOn
  }

  get payload() {
    return this.props.payload
  }
}
