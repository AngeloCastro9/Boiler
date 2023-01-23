import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcome(email: string, name: string) {
    try {
      const url = `${process.env.URL}`;

      return this.mailerService.sendMail({
        to: email,
        subject: 'Seja bem vindo ao LookBook!',
        template: './welcome',
        context: {
          name: name,
          url,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async sendRecoverPassword(email: string, name: string, token: string) {
    try {
      const url = `${process.env.URL}/auth/recover/${token}`;

      return this.mailerService.sendMail({
        to: email,
        subject: 'Opa, vamos redefinir sua senha!',
        template: './resetPassword',
        context: {
          name: name,
          url,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async sendRecoveredPassword(email: string, name: string) {
    try {
      const url = `${process.env.URL}/login`;

      return this.mailerService.sendMail({
        to: email,
        subject: 'Sucesso, sua senha foi redefinida!',
        template: './recoveredPassword',
        context: {
          name: name,
          url,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
