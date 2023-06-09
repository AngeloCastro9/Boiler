import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { RedisModule } from '../../connections/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
