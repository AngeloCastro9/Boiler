import { Module } from '@nestjs/common';
import { PrismaReaderService } from './prisma-reader.service';

@Module({
  providers: [PrismaReaderService],
  exports: [PrismaReaderService],
})
export class PrismaReaderModule {}
