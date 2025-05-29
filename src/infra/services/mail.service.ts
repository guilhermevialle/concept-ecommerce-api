import { IMailService, MailPayload } from '@/interfaces/services/mail'
import nodemailer, { Transporter } from 'nodemailer'

export class MailService implements IMailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'pink55@ethereal.email',
        pass: '6gkasqeU3Es5MEbNTz'
      }
    })
  }

  async send(payload: MailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: 'no-reply@concept-e-commerce-api.com',
      ...payload
    })
  }
}
