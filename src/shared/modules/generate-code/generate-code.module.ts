import { Module } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { RedisModule } from 'src/connections/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GenerateCodeService],
  exports: [GenerateCodeService],
})
export class GenerateCodeModule {}
