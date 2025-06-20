import { IMailService, MailPayload } from '@/interfaces/services/mail.interface'
import nodemailer, { Transporter } from 'nodemailer'

export class MailService implements IMailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'stephany.mclaughlin@ethereal.email',
        pass: '2KrQPqJAG3AQwBgKTP'
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
