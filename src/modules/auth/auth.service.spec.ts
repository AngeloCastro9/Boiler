import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MailService } from '../../shared/modules/mail/mail.service';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { RedisService } from '../../connections/redis/redis.service';
import { GenerateCodeService } from '../../shared/modules/generate-code/generate-code.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcryptjs');

class MockRedisService {
  get = jest.fn();
  set = jest.fn();
  del = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let prismaService: PrismaService;
  let generateCodeService: GenerateCodeService;
  let mailService: MailService;
  let bcryptCompareSpy;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$SomeRandomSaltedHashValue/ForTest',
    name: 'Test User',
    document: '',
    phone: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: RedisService,
          useValue: new MockRedisService(),
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
        {
          provide: GenerateCodeService,
          useValue: {
            sendCodeToUser: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendRecoverPassword: jest.fn(),
            sendRecoveredPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    prismaService = module.get<PrismaService>(PrismaService);
    generateCodeService = module.get<GenerateCodeService>(GenerateCodeService);
    mailService = module.get<MailService>(MailService);
    bcryptCompareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a code sent message if credentials are correct', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValue(mockUser);
      const sendCodeSpy = jest.spyOn(generateCodeService, 'sendCodeToUser');
      const result = await service.validateUser(
        mockUser.email,
        'correct-password',
      );
      expect(result).toBe('Code sent to email.');
      expect(sendCodeSpy).toBeCalledWith(mockUser.email, mockUser.name);
    });

    it('should throw a BadRequestException if password is incorrect', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValue(mockUser);
      bcryptCompareSpy.mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser(mockUser.email, 'incorrect-password'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('sendRecoverPassword', () => {
    it('should return a recovery email sent message', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValue(mockUser);
      const result = await service.sendRecoverPassword(mockUser.email);
      expect(result).toBe('Recovery email sent.');
    });
  });

  describe('resetPassword', () => {
    it('should return a password changed successfully message', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockResolvedValue(mockUser);
      jest.spyOn(redisService, 'get').mockResolvedValue(mockUser.id);
      const result = await service.resetPassword('valid-token', 'new-password');
      expect(result).toBe('Password changed successfully.');
    });

    it('should throw a BadRequestException if token is invalid', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      await expect(
        service.resetPassword('invalid-token', 'new-password'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('validateCode', () => {
    it('should return a user and a token if code is valid', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(mockUser.email);
      const result = await service.validateCode('valid-code');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw a BadRequestException if code is invalid', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      await expect(service.validateCode('invalid-code')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return a user, a message, and a token', async () => {
      const result = await service.login(mockUser);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message', 'Login successfully.');
      expect(result).toHaveProperty('token');
    });
  });
});
