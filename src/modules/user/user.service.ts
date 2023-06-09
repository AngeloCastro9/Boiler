import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const userExists = await this.checkIfUserExists(data.email);

    if (userExists) throw new ConflictException('User already exists.');

    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }
}
