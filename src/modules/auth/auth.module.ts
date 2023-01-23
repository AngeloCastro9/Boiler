import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../mail/mail.service';
import { jwtConstants } from './constants';
import { PrismaWriterModule } from 'src/connections/prisma/writer/prisma-writer.module';

@Module({
  imports: [
    PassportModule,
    MailerModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '604800s' },
    }),
    PrismaWriterModule,
  ],
  providers: [JwtStrategy, MailService],
  exports: [],
})
export class AuthModule {}
