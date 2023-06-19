import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw an exception if a user is found', async () => {
      const email = 'test@test.com';
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue({} as User);

      await expect(service.findOne(email)).rejects.toThrow(ConflictException);
    });

    it('should not throw an exception if no user is found', async () => {
      const email = 'test@test.com';
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(email)).resolves.toBe(null);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const data: Prisma.UserCreateInput = {
        email: 'test@test.com',
        password: '',
        name: '',
        document: '',
        phone: '',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(data as User);

      const user = await service.create(data);

      expect(user).toBe(data);
      expect(prismaService.user.create).toBeCalledWith({ data });
    });
  });
});
