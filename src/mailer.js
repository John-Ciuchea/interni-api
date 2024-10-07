import Nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'

const mailer = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
    testInboxId: process.env.MAILTRAP_INBOX_ID
  })
)

const sender = {
  address: 'no-reply@my-awesome-app.com',
  name: 'My Awesome App'
}

export const send = async ({ to, subject, message }) => await mailer
  .sendMail({
    from: sender,
    to: [to],
    subject,
    html: message,
    category: 'Integration Test',
    sandbox: true
  })

