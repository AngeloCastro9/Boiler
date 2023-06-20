import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../../shared/modules/mail/mail.service';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisModule } from '../../connections/redis/redis.module';
import { GenerateCodeModule } from '../../shared/modules/generate-code/generate-code.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    MailerModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '604800s' },
    }),
    PrismaModule,
    RedisModule,
    GenerateCodeModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
