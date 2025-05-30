import { DomainEvent } from '@/domain/events/domain-event'
import { OrderFailedPayload } from '@/domain/events/order-events/order-processing-failed'
import { MailService } from '@/infra/services/mail.service'

const mailService = new MailService()

export const orderCreatedHandler = async (
  event: DomainEvent<OrderFailedPayload>
) => {
  await mailService.send({
    to: event.payload.customer.email,
    subject: 'We detect a problem with your order',
    html: ` We detect a problem with your order. Please contact our support team.


    `
  })
}
