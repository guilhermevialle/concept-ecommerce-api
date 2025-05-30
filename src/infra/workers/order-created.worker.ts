import { OrderCreatedPayload } from '@/domain/events/order-events/order-created'
import { fromCents } from '@/shared/utils/from-cents'
import { EventBus } from '../events/rabbitmq/rabbitmq-pub-sub'
import { MailService } from '../services/mail.service'

async function OrderCreatedWorker() {
  await EventBus.getInstance().subscribe(
    'order-created',
    async (event: OrderCreatedPayload) => {
      await new MailService().send({
        to: event.customerEmail,
        subject: 'Order created successfully!',
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Thank you for your order! 🎉
        </h1>
      </div>

      <!-- Content -->
      <div style="padding: 32px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; margin: 0 0 24px 0; color: #555555;">
          We're excited to process your order! Here are the details:
        </p>

        <!-- Order Table -->
        <div style="background-color: #f8fafc; border-radius: 8px; overflow: hidden; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%);">
                <th style="text-align: left; padding: 16px; font-weight: 600; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Product
                </th>
                <th style="text-align: center; padding: 16px; font-weight: 600; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Qty
                </th>
                <th style="text-align: right; padding: 16px; font-weight: 600; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              ${event.items
                .map(
                  (item, index) => `
                <tr style="border-top: 1px solid #e2e8f0; ${index % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #f8fafc;'}">
                  <td style="padding: 16px; font-size: 15px; color: #374151;">
                    ${item.title}
                  </td>
                  <td style="text-align: center; padding: 16px; font-size: 15px; color: #374151; font-weight: 500;">
                    ${item.quantity}
                  </td>
                  <td style="text-align: right; padding: 16px; font-size: 15px; color: #374151; font-weight: 600;">
                    $${fromCents(item.unitPriceInCents).toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <h3 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
            Total: $${fromCents(event.totalInCents).toFixed(2)}
          </h3>
        </div>

        <!-- Footer Message -->
        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 24px;">
          <p style="margin: 0; color: #0369a1; font-size: 15px;">
            📦 We'll notify you as soon as your order is shipped!
          </p>
        </div>

        <!-- Signature -->
        <p style="margin-top: 32px; margin-bottom: 0; color: #6b7280; font-size: 14px; text-align: center;">
          Thank you for choosing us!<br>
          <span style="color: #9ca3af;">The Team</span>
        </p>
      </div>
    </div>
  `
      })
    },
    {
      exchange: 'app_events',
      routingKey: 'order.created.event',
      queue: 'order-created-queue'
    }
  )
}

export { OrderCreatedWorker }
