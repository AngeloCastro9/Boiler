import { Module } from '@nestjs/common';
import { PrismaWriterService } from './prisma-writer.service';

@Module({
  providers: [PrismaWriterService],
  exports: [PrismaWriterService],
})
export class PrismaWriterModule {}
