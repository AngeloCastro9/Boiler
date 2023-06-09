import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john@doe.com' })
  email: string;
}
