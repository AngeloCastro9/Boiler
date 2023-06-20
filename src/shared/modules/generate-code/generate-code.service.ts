import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../../../connections/redis/redis.service';

@Injectable()
export class GenerateCodeService {
  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly redis: RedisService,
  ) {}
  public code(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public generateNumberUnique(digit: number): number {
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (digit === 0) {
      numbers = [2, 3, 4, 5, 6, 7, 8, 9];
    } else if (digit === 9) {
      numbers = [0, 1, 2, 3, 4, 5, 6, 7];
    } else {
      numbers = numbers.filter(
        (element) => ![digit - 1, digit, digit + 1].includes(element),
      );
    }
    const index = this.code(numbers.length - 1, 0);
    return numbers[index];
  }

  async generateRangeCode(): Promise<string> {
    let code = this.code(0, 9).toString();
    for (let index = 0; index < 5; index++) {
      code += this.generateNumberUnique(parseInt(code[code.length - 1]));
    }
    return code;
  }

  async sendCodeToUser(email: string, name: string): Promise<void> {
    const code = await this.generateRangeCode();

    await this.redis.set(code, email, 'EX', 120);

    this.mailService.sendCode(email, name, code);
  }
}
