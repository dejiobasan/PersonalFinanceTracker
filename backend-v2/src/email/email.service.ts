import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { otpEmailTemplate } from './template/otp.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } 

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendOtpEmail(email: string, name: string, otp: string): Promise<void> {
    const html = otpEmailTemplate(name, otp);

    await this.sendEmail(email, 'Your Verification Code', html);
  }
}
