import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from '../../decorators/isPublic.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  healthCheck() {
    return this.appService.healthCheck();
  }
}
