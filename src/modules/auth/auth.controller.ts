import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateCodeDto } from './dto/generateCode.dto';
import { RecoverDto } from './dto/recover.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsPublic } from '../../decorators/isPublic.decorator';
import { ParsePasswordPipe } from '../../shared/pipes/encryptPassword.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/generate-code')
  @IsPublic()
  async generateCode(@Body() data: GenerateCodeDto) {
    return this.authService.validateUser(data.email, data.password);
  }

  @Post('/recover')
  @IsPublic()
  @ApiResponse({
    status: 200,
    description: 'The email has been sent.',
  })
  async sendUserRecoverPasswordEmail(
    @Body(new ParsePasswordPipe()) recoverData: RecoverDto,
  ) {
    return this.authService.sendRecoverPassword(recoverData.email);
  }

  @Patch('/recover/:token')
  @IsPublic()
  @ApiOkResponse({
    description: 'The password has been reset.',
  })
  @ApiBadRequestResponse({ description: 'Invalid token.' })
  @ApiParam({ name: 'token', type: String })
  async resetAdminPassword(
    @Param('token') token: string,
    @Body(new ParsePasswordPipe()) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @Post('/login/:code')
  @IsPublic()
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in.',
  })
  async login(@Param('code') code: string) {
    return this.authService.validateCode(code);
  }
}
