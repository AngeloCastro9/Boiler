import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { MailService } from '../../shared/modules/mail/mail.service';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { RedisService } from '../../connections/redis/redis.service';
import { GenerateCodeService } from '../../shared/modules/generate-code/generate-code.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly generateCodeService: GenerateCodeService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.findOne(email);

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        throw new BadRequestException('Incorrect email or password.');
      }

      await this.generateCodeService.sendCodeToUser(user.email, user.name);

      return 'Code sent to email.';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendRecoverPassword(email: string): Promise<string> {
    const user = await this.userService.findOne(email);

    const token = randomUUID();

    await this.redis.set(token, user.id, 'EX', 120); // 2 minutes

    await this.mailService.sendRecoverPassword(user.email, user.name, token);

    return 'Recovery email sent.';
  }

  async resetPassword(token: string, password: string): Promise<string> {
    const userId = await this.redis.get(token);

    if (!userId) {
      throw new BadRequestException('Invalid token.');
    }

    const user = await this.userService.findOne(null, userId);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });

    this.redis.del(token);
    this.mailService.sendRecoveredPassword(user.email, user.name);

    return 'Password changed successfully.';
  }

  async validateCode(code: string) {
    const userMail = await this.redis.get(code);

    if (!userMail) {
      throw new BadRequestException('Invalid code.');
    }

    const user = await this.userService.findOne(userMail);

    return this.login(user);
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
