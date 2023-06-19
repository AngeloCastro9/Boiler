import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email?: string, id?: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            id,
          },
        ],
      },
    });

    if (user) throw new ConflictException('User already exists.');

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    await this.findOne(data.email);

    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }
}
