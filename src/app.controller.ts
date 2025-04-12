import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { BasicAuthGuard } from './auth';
import { AppRequest } from './shared';

@Controller()
export class AppController {
  @Get(['', 'ping'])
  healthCheck() {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req: AppRequest) {
    return {
      user: req.user,
    };
  }
}
