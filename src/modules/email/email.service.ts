import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import ConfirmEmailHTML from './html/html.confirmEmail';
@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  async sendConfirmationEmail(email: string, token: string) {
    try {
      const confirmUrl = `${process.env.FE_HOST}/verify?token=${token}`;
      const htmlPage = ConfirmEmailHTML(confirmUrl);
      await this.transporter.sendMail({
        from: `"NextMerce" <${process.env.GMAIL_EMAIL}> `,
        to: email,
        subject: 'Confirm your email',
        html: htmlPage,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
