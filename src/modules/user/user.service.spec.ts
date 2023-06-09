import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { User } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$SomeRandomSaltedHashValue/ForTest',
    name: 'Test User',
    document: '',
    phone: '',
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: '$2a$10$SomeRandomSaltedHashValue/ForTest',
    name: 'Test User',
    document: '',
    phone: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockResolvedValue(mockUser),
              findUnique: jest.fn().mockImplementation((args) => {
                if (args.where.email === mockUser.email) {
                  return mockUser;
                } else {
                  return null;
                }
              }),
              create: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if it exists', async () => {
      const result = await service.findOne(mockUser.id);
      expect(result).toBe(mockUser);
    });

    it('should throw an error if user does not exist', async () => {
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockRejectedValue(new Error());
      await expect(service.findOne('2')).rejects.toThrow(Error);
    });
  });

  describe('checkIfUserExists', () => {
    it('should return true if user exists', async () => {
      const result = await service.checkIfUserExists(mockUser.email);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const result = await service.checkIfUserExists(
        'non-existing-email@test.com',
      );
      expect(result).toBe(false);
    });
  });

  describe('create', () => {
    it('should return a user if user is created', async () => {
      jest.spyOn(service, 'checkIfUserExists').mockResolvedValue(false);
      const result = await service.create(mockCreateUserDto);
      expect(result).toBe(mockUser);
    });

    it('should throw a ConflictException if user already exists', async () => {
      jest.spyOn(service, 'checkIfUserExists').mockResolvedValue(true);
      await expect(service.create(mockCreateUserDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});
