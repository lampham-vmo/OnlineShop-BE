import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import ConfirmEmailHTML from './html/html.confirmEmail';
import ForgotPasswordEmailHTML from './html/html.forgetpassword';
import VerifyEmailCodeHTML from './html/html.confirmemail2';
import { Order } from '../orders/entities/order.entity';
import OrderSuccessEmailHTML from './html/html.order';
@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //send order detail when purchase success
  async sendConfirmMailSuccess(email: string, order: Order): Promise<void> {
    try {
      const htmlPage = OrderSuccessEmailHTML(email, order);
      await this.transporter.sendMail({
        from: `"NextMerce" <${process.env.GMAIL_EMAIL}> `,
        to: email,
        subject: `Thanks for purchase`,
        html: htmlPage,
      });
    } catch (err) {
      throw new InternalServerErrorException('Confirm Order Email error!');
    }
  }

  //to confirm this email is your email or not?
  async sendConfirmationEmailWithCodeNumber(
    email: string,
    code: number,
  ): Promise<void> {
    try {
      const htmlPage = VerifyEmailCodeHTML(code.toString());
      await this.transporter.sendMail({
        from: `"NextMerce" <${process.env.GMAIL_EMAIL}> `,
        to: email,
        subject: `Your verification code is ${code}`,
        html: htmlPage,
      });
    } catch (err) {
      throw new InternalServerErrorException('Confirm Code Email error!');
    }
  }

  //for sign up
  async sendConfirmationEmail(email: string, token: string): Promise<void> {
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
      throw new InternalServerErrorException('Confirm confirm Email error!');
    }
  }

  async sendResetPasswordEmail(
    email: string,
    resetPasswordToken: string,
  ): Promise<void> {
    try {
      const resetUrl = `${process.env.FE_HOST}/reset-password?token=${resetPasswordToken}`;
      const htmlPage = ForgotPasswordEmailHTML(resetUrl);
      await this.transporter.sendMail({
        from: `"NextMerce" <${process.env.GMAIL_EMAIL}> `,
        to: email,
        subject: 'Verify reset password',
        html: htmlPage,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Confirm reset password Email error!',
      );
    }
  }
}
