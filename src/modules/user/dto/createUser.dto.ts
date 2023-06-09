import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IsCpf } from '../../../decorators/isCpf.decorator';
import { IsPhone } from '../../../decorators/isPhone.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@doe.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCpf({ message: 'Invalid CPF' })
  @ApiProperty({ example: '12345678901' })
  document: string;

  @IsString()
  @IsNotEmpty()
  @IsPhone({ message: 'Invalid phone number' })
  @ApiProperty({ example: '19999999999' })
  phone: string;
}
