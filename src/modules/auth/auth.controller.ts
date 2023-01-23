import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RecoverDto } from './dto/recover.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ParseResetPasswordPipe } from './pipes/parseResetPassword.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async loginUser(@Body() data: LoginDto) {
    return await this.authService.validateUser(data.email, data.password);
  }

  @Post('/recover')
  async sendUserRecoverPasswordEmail(
    @Body(new ParseResetPasswordPipe()) recoverData: RecoverDto,
  ) {
    return this.authService.sendRecoverPassword(recoverData.email);
  }

  @Put('/recover/:token')
  async resetAdminPassword(
    @Param('token') token: string,
    @Body(new ParseResetPasswordPipe()) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto.password);
  }
}
