import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRootAsync({
          useFactory: async () => ({
            transport: {
              host: process.env.MAIL_HOST,
              secure: false,
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
              },
            },
            defaults: {
              from: `"No Reply" <${process.env.MAIL_FROM}>`,
            },
            template: {
              dir: join(__dirname, 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          imports: [ConfigModule],
          inject: [ConfigService],
        }),
      ],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call sendWelcome', async () => {
    jest
      .spyOn(service, 'sendWelcome')
      .mockImplementation(() => Promise.resolve());

    expect(await service.sendWelcome('john@doe.com', 'john')).toBe(undefined);
  });

  it('should call sendRecoverPassword', async () => {
    jest
      .spyOn(service, 'sendRecoverPassword')
      .mockImplementation(() => Promise.resolve());

    expect(
      await service.sendRecoverPassword('john@doe.com', 'john', '123'),
    ).toBe(undefined);
  });

  it('should call sendRecoveredPassword', async () => {
    jest
      .spyOn(service, 'sendRecoveredPassword')
      .mockImplementation(() => Promise.resolve());

    expect(await service.sendRecoveredPassword('john@doe.com', 'john')).toBe(
      undefined,
    );
  });
});
