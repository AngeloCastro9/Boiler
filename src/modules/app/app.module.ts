import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '../../connections/redis/redis.module';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { AppService } from './app.service';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { GenerateCodeModule } from '../../shared/modules/generate-code/generate-code.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    MailModule,
    UserModule,
    GenerateCodeModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
