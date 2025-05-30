import { DomainEvent } from '@/domain/events/domain-event'
import { OrderCreatedPayload } from '@/domain/events/order-events/order-created'
import { MailService } from '@/infra/services/mail.service'
import { fromCents } from '@/shared/utils/from-cents'

const mailService = new MailService()

export const orderCreatedHandler = async (
  event: DomainEvent<OrderCreatedPayload>
) => {
  console.log(`[x] order.created.event received: ${event.payload.order.id}`)

  console.log(JSON.stringify(event.payload, null, 2))

  await mailService.send({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h1 style="color: #4CAF50;">✅ Order Confirmed</h1>
        <p style="font-size: 16px;">Thank you for your purchase! Your order has been successfully created.</p>
        <hr style="margin: 20px 0;" />
        <h2 style="color: #333;">📦 Order Details</h2>
        <p><strong>Order ID:</strong> ${event.payload.order.id}</p>
        <hr style="margin: 20px 0;" />
        <h2 style="color: #333;">🧾 Items</h2>
        ${event.payload.order.items
          .map(
            (item) => `
              <div style="margin-bottom: 12px; padding: 10px; background-color: #f9f9f9; border-radius: 6px;">
                <p><strong>Product:</strong> ${item.title}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Unit Price:</strong> ${fromCents(item.unitPriceInCents).toFixed(2)} USD</p>
              </div>
            `
          )
          .join('')}

        <p><strong>Total:</strong> ${fromCents(
          event.payload.order.totalInCents
        ).toFixed(2)} USD</p>

        <p style="margin-top: 30px; font-size: 14px; color: #888;">If you have any questions, reply to this email.</p>
      </div>
    `,
    subject: '✅ Order Confirmation',
    to: event.payload.customer.email
  })
}
