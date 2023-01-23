import { IsNotEmpty } from 'class-validator';

export class RecoverDto {
  @IsNotEmpty()
  email: string;
}
