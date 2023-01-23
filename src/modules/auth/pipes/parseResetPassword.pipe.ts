import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
('../dto/resetPassword.dto');
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ParseResetPasswordPipe implements PipeTransform {
  async transform(value: ResetPasswordDto, metadata: ArgumentMetadata) {
    if (value.password) value.password = await bcrypt.hash(value.password, 12);

    return value;
  }
}
