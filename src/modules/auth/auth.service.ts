import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { PrismaWriterService } from '../../connections/prisma/writer/prisma-writer.service';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private prisma: PrismaWriterService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
      });

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        throw new HttpException('Incorrect email or passwords.', 400);
      }

      return this.login(user);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async sendRecoverPassword(email: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
      });

      const token = randomBytes(32).toString('hex');

      await this.prisma.user.update({
        where: { email },
        data: { resetPassCode: token },
      });

      await this.mailService.sendRecoverPassword(user.email, user.name, token);

      return 'Recovery email sent.';
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { resetPassCode: token },
      });

      await this.prisma.user.update({
        where: {
          resetPassCode: token,
        },
        data: {
          password,
          resetPassCode: '',
        },
      });

      await this.mailService.sendRecoveredPassword(user.email, user.name);

      return 'Password changed successfully.';
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async login(user: User) {
    const payload = { sub: user.id, ...user };

    return {
      user,
      message: 'Login successfully.',
      token: this.jwtService.sign(payload),
    };
  }
}
