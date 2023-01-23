import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaReaderModule } from 'src/connections/prisma/reader/prisma-reader.module';
import { PrismaWriterModule } from 'src/connections/prisma/writer/prisma-writer.module';
import { RedisModule } from 'src/connections/redis/redis.module';
import { WebSocketModule } from 'src/connections/websocket/websocket.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaReaderModule,
    PrismaWriterModule,
    RedisModule,
    WebSocketModule,
    AuthModule,
    MailModule,
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
