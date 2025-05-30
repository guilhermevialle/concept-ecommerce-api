import { IMailService, MailPayload } from '@/interfaces/services/mail'
import nodemailer, { Transporter } from 'nodemailer'

export class MailService implements IMailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'urban75@ethereal.email',
        pass: 'kYaMkmvN4Yn5ujqkKj'
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
