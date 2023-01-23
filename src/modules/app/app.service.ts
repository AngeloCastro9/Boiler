import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'up',
      message: 'This server is up and running.',
    };
  }
}
