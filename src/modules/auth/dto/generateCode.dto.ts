import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@doe.com' })
  email: string;
}
