import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../../modules/mail/mail.service';
import { RedisService } from '../../../connections/redis/redis.service';
import { GenerateCodeService } from './generate-code.service';

jest.mock('../../../modules/mail/mail.service');
jest.mock('../../../connections/redis/redis.service');

describe('GenerateCodeService', () => {
  let service: GenerateCodeService;
  let mailService: MailService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCodeService,
        {
          provide: MailService,
          useValue: {
            sendCode: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GenerateCodeService>(GenerateCodeService);
    mailService = module.get<MailService>(MailService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('code', () => {
    it('should return a number within the range of min and max', () => {
      const min = 1;
      const max = 10;
      const result = service.code(min, max);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe('generateNumberUnique', () => {
    it('should return a number not in the range of digit-1 to digit+1', () => {
      const digit = 9;
      const result = service.generateNumberUnique(digit);
      expect(result).not.toBeGreaterThanOrEqual(digit);
    });
  });

  describe('generateRangeCode', () => {
    it('should return a string with length 6', async () => {
      const code = await service.generateRangeCode();

      expect(code.length).toEqual(6);
    });
  });

  describe('sendCodeToUser', () => {
    it('should call mailService.sendCode with correct arguments', async () => {
      const email = 'test@test.com';
      const name = 'Test User';
      const mockCode = '123456';

      jest.spyOn(service, 'generateRangeCode').mockResolvedValue(mockCode);

      await service.sendCodeToUser(email, name);

      expect(mailService.sendCode).toHaveBeenCalledWith(email, name, mockCode);
      expect(redisService.set).toHaveBeenCalledWith(mockCode, email, 'EX', 120);
    });
  });
});
