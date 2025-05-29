import { MailPayload } from '@/interfaces/infra/services/mail'

export async function sendMailJob(payload: MailPayload) {
  console.log(`📧 Sending email to ${payload.to}`)
}
