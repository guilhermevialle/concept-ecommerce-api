export interface MailPayload {
  to: string
  subject: string
  html: string
}

export interface IMailService {
  send(payload: MailPayload): Promise<void>
}
