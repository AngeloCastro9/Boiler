import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/shared/guards/jwt-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  healthCheck() {
    return this.appService.healthCheck();
  }
}
