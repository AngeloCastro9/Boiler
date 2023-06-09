import { Body, Controller, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IsPublic } from '../../decorators/isPublic.decorator';
import { ParsePasswordPipe } from '../../shared/pipes/encryptPassword.pipe';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
  })
  @ApiConflictResponse({ description: 'User already exists' })
  async createUser(
    @Body(new ParsePasswordPipe()) createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }
}
