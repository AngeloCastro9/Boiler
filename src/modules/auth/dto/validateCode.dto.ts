import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  code: string;
}
