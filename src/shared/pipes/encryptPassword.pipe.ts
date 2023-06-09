import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ParsePasswordPipe implements PipeTransform {
  async transform(password: string, metadata: ArgumentMetadata) {
    return (password = await bcrypt.hash(password, 12));
  }
}
