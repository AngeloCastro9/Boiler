import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RecoverDto } from './dto/recover.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ParseResetPasswordPipe } from './pipes/parseResetPassword.pipe';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { User } from '@prisma/client';

jest.mock('./auth.service');
jest.mock('./pipes/parseResetPassword.pipe');
jest.mock('../../shared/guards/jwt-auth.guard');
jest.mock('../../shared/guards/jwt-auth.guard');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ParseResetPasswordPipe, JwtAuthGuard],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service validateUser', async () => {
    const data: LoginDto = {
      email: '',
      password: '',
    };

    const result = {
      message: 'Login successfully.',
      token: '',
      user: {
        name: 'john',
        email: 'john@doe.com',
      } as User,
    };

    jest
      .spyOn(service, 'validateUser')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.loginUser(data)).toBe(result);
  });

  it('should call service sendRecoverPassword', async () => {
    const recoverData: RecoverDto = {
      email: 'john@doe.com',
    };

    const result = 'Recovery email sent.';

    jest
      .spyOn(service, 'sendRecoverPassword')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.sendUserRecoverPasswordEmail(recoverData)).toEqual(
      result,
    );
  });

  it('should call service resetPassword', async () => {
    const token = '';
    const resetPasswordDto: ResetPasswordDto = {
      email: '',
      password: '',
    };

    const result = 'Password reset successfully.';
    jest
      .spyOn(service, 'resetPassword')
      .mockImplementation(() => Promise.resolve(result));

    expect(
      await controller.resetAdminPassword(token, resetPasswordDto),
    ).toEqual(result);
  });
});
